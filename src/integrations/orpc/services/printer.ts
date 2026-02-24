import { ORPCError } from "@orpc/server";
import type { InferSelectModel } from "drizzle-orm";
import puppeteer, { type Browser, type ConnectOptions } from "puppeteer-core";
import type { schema } from "@/integrations/drizzle";
import { pageDimensionsAsPixels } from "@/schema/page";
import { printMarginTemplates } from "@/schema/templates";
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
		const template = data.metadata.template;

		// Step 3: Calculate PDF margins
		// Some templates require margins to be applied via PDF (they use print:p-0 to remove CSS padding)
		// Convert from CSS pixels to PDF points (divide by 0.75 since 1pt = 0.75px at 72dpi)
		let marginX = 0;
		let marginY = 0;

		if (printMarginTemplates.includes(template)) {
			marginX = Math.round(data.metadata.page.marginX / 0.75);
			marginY = Math.round(data.metadata.page.marginY / 0.75);
		}

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


			// Step 5: Adjust the DOM for proper PDF pagination
			// This runs in the browser context to modify CSS before PDF generation
			// For free-form: measure actual content height, don't add page breaks
			// For A4/Letter: adjust page height for margins, add page breaks
			const isFreeForm = format === "free-form";

			const pageCountOrHeight = await page.evaluate(
				(marginY: number, isFreeForm: boolean, minPageHeight: number) => {
					const root = document.documentElement;
					const pageElements = document.querySelectorAll("[data-page-index]");
					const container = document.querySelector(".resume-preview-container") as HTMLElement | null;

					if (isFreeForm) {
						// For free-form: add visual gaps between pages, then measure total height
						// Convert marginY from PDF points to CSS pixels (1pt = 0.75px)
						const marginYAsPixels = marginY * 0.75;
						const numberOfPages = pageElements.length;

						// Add margin between pages (except the last one)
						for (let i = 0; i < numberOfPages - 1; i++) {
							const pageEl = pageElements[i] as HTMLElement;
							pageEl.style.marginBottom = `${marginYAsPixels}px`;
						}

						// Now measure the total height (margins are now part of the DOM)
						let totalHeight = 0;
						for (const el of pageElements) {
							const pageEl = el as HTMLElement;
							// offsetHeight includes padding and border, but not margin
							const style = getComputedStyle(pageEl);
							const marginBottom = Number.parseFloat(style.marginBottom) || 0;
							totalHeight += pageEl.offsetHeight + marginBottom;
						}

						return Math.max(totalHeight, minPageHeight);
					}

					// For A4/Letter: existing behavior
					// The --page-height CSS variable controls the height of each resume page.
					// We reduce it slightly to ensure content breathing room.
					const rootHeight = getComputedStyle(root).getPropertyValue("--page-height").trim();
					const containerHeight = container
						? getComputedStyle(container).getPropertyValue("--page-height").trim()
						: null;
					const currentHeight = containerHeight || rootHeight;
					const heightValue = Math.max(Number.parseFloat(currentHeight), minPageHeight);

					if (!Number.isNaN(heightValue)) {
						// Subtract extra offset for margins and browser rounding safely
						// Subtracting marginY + 10px buffer to prevent extra page triggers
						const newHeight = `${heightValue - marginY - 10}px`;
						if (container) container.style.setProperty("--page-height", newHeight);
						root.style.setProperty("--page-height", newHeight);
					}

					// Add page break CSS to each resume page element (identified by data-page-index attribute)
					// This ensures each visual resume page starts a new PDF page
					for (const el of pageElements) {
						const element = el as HTMLElement;
						const index = Number.parseInt(element.getAttribute("data-page-index") ?? "0", 10);

						// Force a page break before each page except the first
						if (index > 0) element.style.breakBefore = "page";

						// Allow content within a page to break naturally if it overflows
						// (e.g., if a single page has more content than fits on one PDF page)
						element.style.breakInside = "auto";
					}

					return pageElements.length || 1; // Return the actual number of pages
				},
				marginY,
				isFreeForm,
				pageDimensionsAsPixels[format].height,
			);

			// Step 6: Generate the PDF with the specified dimensions and margins
			// For free-form: use measured content height (with minimum constraint)
			// For A4/Letter: use fixed dimensions from pageDimensionsAsPixels
			const pdfHeight = isFreeForm && typeof pageCountOrHeight === "number" ? pageCountOrHeight : pageDimensionsAsPixels[format].height;
			const pageRanges = isFreeForm ? "1" : `1-${typeof pageCountOrHeight === "number" ? pageCountOrHeight : 1}`;

			const pdfBuffer = await page.pdf({
				width: `${pageDimensionsAsPixels[format].width}px`,
				height: `${pdfHeight}px`,
				pageRanges, // Explicitly set page ranges to avoid trailing empty pages
				tagged: true, // Adds accessibility tags to the PDF
				waitForFonts: true, // Ensures all fonts are loaded before rendering
				printBackground: true, // Includes background colors and images
				margin: {
					bottom: 0,
					top: marginY,
					right: marginX,
					left: marginX,
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
