import { createFileRoute, getRouteApi, redirect } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { useEffect } from "react";
import { z } from "zod";
import { LoadingScreen } from "@/components/layout/loading-screen";
import { ResumePreview } from "@/components/resume/preview";
import { useResumeStore } from "@/components/resume/store/resume";
import { getORPCClient } from "@/integrations/orpc/client";
import { env } from "@/utils/env";
import { verifyPrinterToken } from "@/utils/printer-token";

const searchSchema = z.object({
	token: z.string().catch(""),
});

export const Route = createFileRoute("/printer/$resumeId")({
	component: RouteComponent,
	validateSearch: zodValidator(searchSchema),
	head: ({ loaderData }) => {
		if (loaderData?.token === "preview") {
			return {
				styles: [
					{
						children:
							"html, body { background-color: white !important; color-scheme: light !important; } .dark { background-color: white !important; }",
					},
				],
			};
		}
	},
	beforeLoad: async ({ params, search }) => {
		if (env.VITE_FLAG_DEBUG_PRINTER) return;

		// Allow preview token for dashboard cards
		if (search?.token === "preview") return;

		try {
			// Verify the token and ensure it matches the resume ID
			const tokenResumeId = verifyPrinterToken(search?.token || "");
			if (tokenResumeId !== params.resumeId) throw new Error();
		} catch {
			// Invalid or missing token - throw error to be caught by error handler
			throw redirect({ to: "/", search: {}, throw: true });
		}
	},
	loader: async ({ params, search }) => {
		const client = getORPCClient();
		const resume = await client.resume.getByIdForPrinter({ id: params.resumeId });

		return { resume, token: search?.token };
	},
});

const routeApi = getRouteApi("/printer/$resumeId");

function RouteComponent() {
	const { resume, token } = routeApi.useLoaderData();
	const { token: searchToken } = routeApi.useSearch();

	const isReady = useResumeStore((state) => state.isReady);
	const initialize = useResumeStore((state) => state.initialize);

	useEffect(() => {
		if (!resume) return;
		initialize(resume);
		// Note: We don't clear on unmount (initialize(null)) to avoid interference
		// between multiple preview iframes sharing the same persisted store.
	}, [resume, initialize]);

	// Signal to Puppeteer that the page is fully loaded and ready for PDF generation
	useEffect(() => {
		if (isReady) {
			document.body.setAttribute("data-wf-loaded", "true");
		} else {
			document.body.removeAttribute("data-wf-loaded");
		}
	}, [isReady]);

	// Signal to parent window (dashboard card) that the resume is ready
	useEffect(() => {
		if (isReady && (token === "preview" || searchToken === "preview")) {
			window.parent.postMessage({ type: "RESUME_READY", resumeId: resume?.id }, "*");
		}
	}, [isReady, token, searchToken, resume?.id]);

	if (!isReady) {
		if (token === "preview" || searchToken === "preview") {
			return <div className="fixed inset-0 bg-white" />;
		}
		return <LoadingScreen />;
	}

	return <ResumePreview pageClassName="print:w-full!" />;
}
