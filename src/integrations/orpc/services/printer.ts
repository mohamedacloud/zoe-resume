import { ORPCError } from "@orpc/server";
import type { InferSelectModel } from "drizzle-orm";
import puppeteer, { type Browser, type ConnectOptions } from "puppeteer-core";
import type { schema } from "@/integrations/drizzle";
import { pageDimensionsAsPixels } from "@/schema/page";
import { env } from "@/utils/env";
import { generatePrinterToken } from "@/utils/printer-token";
import { getStorageService, uploadFile } from "./storage";

const SCREENSHOT_TTL = 1000 * 60 * 60 * 6; // 6 hours

// Singleton browser instance for connection reuse
let browserInstance: Browser | null = null;

async function getBrowser(): Promise<Browser> {
	// Reuse existing connected browser if available
	if (browserInstance?.connected) return browserInstance;

	const args = ["--disable-dev-shm-usage", "--disable-features=LocalNetworkAccessChecks,site-per-process,FedCm"];

	const endpoint = new URL(env.PRINTER_ENDPOINT);
	const isWebSocket = endpoint.protocol.startsWith("ws");
	const connectOptions: ConnectOptions = { acceptInsecureCerts: true };

	endpoint.searchParams.append("launch", JSON.stringify({ args }));

	if (isWebSocket) connectOptions.browserWSEndpoint = endpoint.toString();
	else connectOptions.browserURL = endpoint.toString();

	browserInstance = await puppeteer.connect(connectOptions);
	return browserInstance;
}

async function closeBrowser(): Promise<void> {
	if (browserInstance?.connected) {
		await browserInstance.close();
		browserInstance = null;
	}
}

// Close browser on process termination
process.on("SIGINT", async () => {
	await closeBrowser();
	process.exit(0);
});

process.on("SIGTERM", async () => {
	await closeBrowser();
	process.exit(0);
});

export const printerService = {
	healthcheck: async (): Promise<object> => {
		const headers = new Headers({ Accept: "application/json" });
		const endpoint = new URL(env.PRINTER_ENDPOINT);

		endpoint.protocol = endpoint.protocol.replace("ws", "http");
		endpoint.pathname = "/json/version";

		const response = await fetch(endpoint, { headers });
		const data = await response.json();

		return data;
	},

	/**
	 * Generates a PDF from a resume and uploads it to storage.
	 *
	 * The process:
	 * 1. Clean up any existing PDF for this resume
	 * 2. Navigate to the printer route which renders the resume
	 * 3. Calculate PDF margins (some templates require margins to be applied via PDF)
	 * 4. Adjust CSS variables so content fits within printable area (accounting for margins)
	 * 5. Add page break CSS to ensure each visual resume page becomes a PDF page
	 * 6. Generate the PDF with proper dimensions and margins
	 * 7. Upload to storage and return the URL
	 */
	printResumeAsPDF: async (
		input: Pick<InferSelectModel<typeof schema.resume>, "id" | "data" | "userId">,
	): Promise<string> => {
		const { id, data, userId } = input;

		// Step 1: Delete any existing PDF for this resume to ensure fresh generation
		const storageService = getStorageService();
		const pdfPrefix = `uploads/${userId}/pdfs/${id}`;
		await storageService.delete(pdfPrefix);

		// Step 2: Prepare the URL and authentication for the printer route
		// The printer route renders the resume in a format optimized for PDF generation
		const baseUrl = env.PRINTER_APP_URL ?? env.APP_URL;
		console.log(`[printer] printResumeAsPDF: baseUrl=${baseUrl}, resumeId=${id}, userId=${userId}`);

		const domain = new URL(baseUrl).hostname;

		const format = data.metadata.page.format;
		const locale = data.metadata.page.locale;

		// Generate a secure token to authenticate the printer request
		const token = generatePrinterToken(id);
		const url = `${baseUrl}/printer/${id}?token=${token}`;
		console.log(`[printer] printResumeAsPDF: url=${url}`);

		let browser: Browser | null = null;

		try {
			// Step 4: Connect to the browser and navigate to the printer route
			console.log("[printer] printResumeAsPDF: connecting to browser...");
			browser = await getBrowser();
			console.log("[printer] printResumeAsPDF: browser connected.");

			// Set locale cookie so the resume renders in the correct language
			await browser.setCookie({ name: "locale", value: locale, domain });

			const page = await browser.newPage();

			// Pipe page console logs to terminal for easier debugging (conditional if needed, but keeping for now for production observability)
			page.on("console", (message) => {
				if (message.type() === "error") {
					console.error(`[printer] browser console [error]: ${message.text()}`);
				}
			});

			page.on("pageerror", (error: any) => {
				console.error(`[printer] browser pageerror: ${error.message}`);
			});

			// Wait for the page to fully load (network idle + custom loaded attribute)
			await page.setViewport(pageDimensionsAsPixels[format]);
			console.log(`[printer] printResumeAsPDF: navigating to ${url}...`);

			const navigationResponse = await page.goto(url, { waitUntil: "networkidle2", timeout: 30_000 });
			console.log(`[printer] printResumeAsPDF: navigation status: ${navigationResponse?.status()}`);

			console.log("[printer] printResumeAsPDF: navigation complete, waiting for data-wf-loaded...");
			await page.waitForFunction(() => document.body.getAttribute("data-wf-loaded") === "true", { timeout: 30_000 });
			console.log("[printer] printResumeAsPDF: page is ready.");

			// Inject CSS to ensure consistent rendering between preview and PDF
			await page.addStyleTag({
				content: `
					* {
						-webkit-font-smoothing: antialiased;
						-moz-osx-font-smoothing: grayscale;
						text-rendering: geometricPrecision;
					}
					body, html {
						-webkit-print-color-adjust: exact !important;
						print-color-adjust: exact !important;
					}
				`,
			});

			// Wait for fonts to be fully rendered
			await page.evaluate(() => document.fonts.ready);
			
			// Small delay to ensure complete layout stabilization
			await new Promise((resolve) => setTimeout(resolve, 500));

			// Step 5: Adjust the DOM for proper PDF pagination
			// This runs in the browser context to modify CSS before PDF generation
			// For free-form: measure actual content height, don't add page breaks
			// For A4/Letter: add page-break CSS between pages only — do NOT modify --page-height,
			//   as that would cause the PDF to show different content than the browser preview.
			const isFreeForm = format === "free-form";

			const pageCountOrHeight = await page.evaluate(
				(isFreeForm: boolean, minPageHeight: number) => {
					const pageElements = document.querySelectorAll("[data-page-index]");

					if (isFreeForm) {
						// For free-form: measure total content height across all pages
						let totalHeight = 0;
						for (const el of pageElements) {
							const pageEl = el as HTMLElement;
							const style = getComputedStyle(pageEl);
							const marginBottom = Number.parseFloat(style.marginBottom) || 0;
							totalHeight += pageEl.offsetHeight + marginBottom;
						}
						return Math.max(totalHeight, minPageHeight);
					}

					// For A4/Letter: add page-break CSS so each visual page → a PDF page.
					// We intentionally do NOT modify --page-height here.
					// The CSS variables are identical to the preview, ensuring line-for-line match.
					for (const el of pageElements) {
						const element = el as HTMLElement;
						const index = Number.parseInt(element.getAttribute("data-page-index") ?? "0", 10);
						if (index > 0) element.style.breakBefore = "page";
						element.style.breakInside = "auto";
					}

					return pageElements.length || 1; // actual rendered page count
				},
				isFreeForm,
				pageDimensionsAsPixels[format].height,
			);

			// Step 6: Generate the PDF with the specified dimensions
			// For free-form: use measured content height (with minimum constraint)
			// For A4/Letter: use fixed A4/Letter dimensions and the actual page count from the DOM
			const pdfHeight =
				isFreeForm && typeof pageCountOrHeight === "number" ? pageCountOrHeight : pageDimensionsAsPixels[format].height;
			// Use the real page count so 1-page resumes produce 1-page PDFs, 2-page → 2-page, etc.
			const pageRanges = isFreeForm ? "1" : `1-${typeof pageCountOrHeight === "number" ? pageCountOrHeight : 1}`;

			const pdfBuffer = await page.pdf({
				width: `${pageDimensionsAsPixels[format].width}px`,
				height: `${pdfHeight}px`,
				pageRanges, // Explicitly set page ranges to avoid trailing empty pages
				scale: 1, // Explicitly set scale to 1 to match browser rendering
				tagged: true, // Adds accessibility tags to the PDF
				waitForFonts: true, // Ensures all fonts are loaded before rendering
				printBackground: true, // Includes background colors and images
				preferCSSPageSize: true, // Use CSS page size instead of default
				margin: {
					bottom: 0,
					top: 0,
					right: 0,
					left: 0,
				},
			});

			await page.close();

			// Step 7: Upload the generated PDF to storage
			console.log("[printer] printResumeAsPDF: uploading to storage...");
			const result = await uploadFile({
				userId,
				resumeId: id,
				data: new Uint8Array(pdfBuffer),
				contentType: "application/pdf",
				type: "pdf",
			});
			console.log(`[printer] printResumeAsPDF: upload successful, url=${result.url}`);

			return result.url;
		} catch (error) {
			console.error("[printer] printResumeAsPDF: error:", error);
			throw new ORPCError("INTERNAL_SERVER_ERROR", error as Error);
		}
	},

	getResumeScreenshot: async (
		input: Pick<InferSelectModel<typeof schema.resume>, "userId" | "id" | "data" | "updatedAt">,
	): Promise<string> => {
		const { id, userId, data, updatedAt } = input;

		const storageService = getStorageService();
		const screenshotPrefix = `uploads/${userId}/screenshots/${id}`;

		const existingScreenshots = await storageService.list(screenshotPrefix);
		const now = Date.now();
		const resumeUpdatedAt = updatedAt.getTime();

		if (existingScreenshots.length > 0) {
			const sortedFiles = existingScreenshots
				.map((path) => {
					const filename = path.split("/").pop();
					const match = filename?.match(/^(\d+)\.webp$/);
					return match ? { path, timestamp: Number(match[1]) } : null;
				})
				.filter((item): item is { path: string; timestamp: number } => item !== null)
				.sort((a, b) => b.timestamp - a.timestamp);

			if (sortedFiles.length > 0) {
				const latest = sortedFiles[0];
				const age = now - latest.timestamp;

				// Return existing screenshot if it's still fresh (within TTL)
				if (age < SCREENSHOT_TTL) return new URL(latest.path, env.APP_URL).toString();

				// Screenshot is stale (past TTL), but only regenerate if the resume
				// was updated after the screenshot was taken. If the resume hasn't
				// changed, keep using the existing screenshot to avoid unnecessary work.
				if (resumeUpdatedAt <= latest.timestamp) {
					return new URL(latest.path, env.APP_URL).toString();
				}

				// Resume was updated after the screenshot - delete old ones and regenerate
				await Promise.all(sortedFiles.map((file) => storageService.delete(file.path)));
			}
		}

		const baseUrl = env.PRINTER_APP_URL ?? env.APP_URL;
		const domain = new URL(baseUrl).hostname;

		const locale = data.metadata.page.locale;

		const token = generatePrinterToken(id);
		const url = `${baseUrl}/printer/${id}?token=${token}`;

		let browser: Browser | null = null;

		try {
			browser = await getBrowser();

			await browser.setCookie({ name: "locale", value: locale, domain });

			const page = await browser.newPage();

			await page.setViewport(pageDimensionsAsPixels.a4);
			await page.goto(url, { waitUntil: "networkidle0" });
			await page.waitForFunction(() => document.body.getAttribute("data-wf-loaded") === "true", { timeout: 5_000 });

			const screenshotBuffer = await page.screenshot({ type: "webp", quality: 80 });

			await page.close();

			const result = await uploadFile({
				userId,
				resumeId: id,
				data: new Uint8Array(screenshotBuffer),
				contentType: "image/webp",
				type: "screenshot",
			});

			return result.url;
		} catch (error) {
			throw new ORPCError("INTERNAL_SERVER_ERROR", error as Error);
		}
	},
};
