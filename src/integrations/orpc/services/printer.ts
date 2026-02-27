import { ORPCError } from "@orpc/server";
import type { InferSelectModel } from "drizzle-orm";
import type { schema } from "@/integrations/drizzle";

export const printerService = {
	healthcheck: async (): Promise<object> => {
		return { status: "staled", message: "Download feature is now handled by the backend." };
	},

	/**
	 * Stubbed version of printResumeAsPDF.
	 * The actual generation is now handled externally.
	 */
	printResumeAsPDF: async (
		input: Pick<InferSelectModel<typeof schema.resume>, "id" | "data" | "userId">,
	): Promise<string> => {
		console.log(`[printer] printResumeAsPDF: Stub called for resumeId=${input.id}`);

		throw new ORPCError("NOT_IMPLEMENTED", {
			message: "PDF generation is now handled by the backend external services.",
		});
	},

	/**
	 * Stubbed version of getResumeScreenshot.
	 */
	getResumeScreenshot: async (
		_input: Pick<InferSelectModel<typeof schema.resume>, "userId" | "id" | "data" | "updatedAt">,
	): Promise<string | null> => {
		console.log(`[printer] getResumeScreenshot: Stub called`);
		return null;
	},
};
