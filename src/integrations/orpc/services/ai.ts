import { createAnthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import { createGateway, generateText, Output } from "ai";
import { createOllama } from "ai-sdk-ollama";
import { match } from "ts-pattern";
import type { ZodError } from "zod";
import z, { flattenError } from "zod";
import { AI_PROMPTS } from "@/integrations/ai/prompts/content-generation";
import docxParserSystemPrompt from "@/integrations/ai/prompts/docx-parser-system.md?raw";
import docxParserUserPrompt from "@/integrations/ai/prompts/docx-parser-user.md?raw";
import pdfParserSystemPrompt from "@/integrations/ai/prompts/pdf-parser-system.md?raw";
import pdfParserUserPrompt from "@/integrations/ai/prompts/pdf-parser-user.md?raw";
import type { ResumeData } from "@/schema/resume/data";
import { defaultResumeData, resumeDataSchema } from "@/schema/resume/data";

export const aiProviderSchema = z.enum(["ollama", "openai", "gemini", "anthropic", "vercel-ai-gateway"]);

export type AIProvider = z.infer<typeof aiProviderSchema>;

export type GetModelInput = {
	provider: AIProvider;
	model: string;
	apiKey: string;
	baseURL: string;
};

function getModel(input: GetModelInput) {
	const { provider, model, apiKey } = input;
	const baseURL = input.baseURL || undefined;

	return match(provider)
		.with("openai", () => createOpenAI({ apiKey, baseURL }).languageModel(model))
		.with("ollama", () => createOllama({ apiKey, baseURL }).languageModel(model))
		.with("anthropic", () => createAnthropic({ apiKey, baseURL }).languageModel(model))
		.with("vercel-ai-gateway", () => createGateway({ apiKey, baseURL }).languageModel(model))
		.with("gemini", () => createGoogleGenerativeAI({ apiKey, baseURL }).languageModel(model))
		.exhaustive();
}

export const aiCredentialsSchema = z.object({
	provider: aiProviderSchema,
	model: z.string(),
	apiKey: z.string(),
	baseURL: z.string(),
});

export const fileInputSchema = z.object({
	name: z.string(),
	data: z.string(), // base64 encoded
});

export type TestConnectionInput = z.infer<typeof aiCredentialsSchema>;

export async function testConnection(input: TestConnectionInput): Promise<boolean> {
	const RESPONSE_OK = "1";

	const result = await generateText({
		model: getModel(input),
		output: Output.choice({ options: [RESPONSE_OK] }),
		messages: [{ role: "user", content: `Respond with "${RESPONSE_OK}"` }],
	});

	return result.output === RESPONSE_OK;
}

export type ParsePdfInput = z.infer<typeof aiCredentialsSchema> & {
	file: z.infer<typeof fileInputSchema>;
};

export async function parsePdf(input: ParsePdfInput): Promise<ResumeData> {
	const model = getModel(input);

	const result = await generateText({
		model,
		output: Output.object({ schema: resumeDataSchema }),
		messages: [
			{
				role: "system",
				content: pdfParserSystemPrompt,
			},
			{
				role: "user",
				content: [
					{ type: "text", text: pdfParserUserPrompt },
					{
						type: "file",
						filename: input.file.name,
						mediaType: "application/pdf",
						data: input.file.data,
					},
				],
			},
		],
	});

	return resumeDataSchema.parse({
		...result.output,
		customSections: [],
		picture: defaultResumeData.picture,
		metadata: defaultResumeData.metadata,
	});
}

export type ParseDocxInput = z.infer<typeof aiCredentialsSchema> & {
	file: z.infer<typeof fileInputSchema>;
	mediaType: "application/msword" | "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
};

export async function parseDocx(input: ParseDocxInput): Promise<ResumeData> {
	const model = getModel(input);

	const result = await generateText({
		model,
		output: Output.object({ schema: resumeDataSchema }),
		messages: [
			{ role: "system", content: docxParserSystemPrompt },
			{
				role: "user",
				content: [
					{ type: "text", text: docxParserUserPrompt },
					{
						type: "file",
						filename: input.file.name,
						mediaType: input.mediaType,
						data: input.file.data,
					},
				],
			},
		],
	});

	return resumeDataSchema.parse({
		...result.output,
		customSections: [],
		picture: defaultResumeData.picture,
		metadata: defaultResumeData.metadata,
	});
}

export function formatZodError(error: ZodError): string {
	return JSON.stringify(flattenError(error));
}

// Content Generation Types and Functions
export type GenerateContentInput = z.infer<typeof aiCredentialsSchema> & {
	type: "experience" | "projects" | "summary" | "custom";
	data: Record<string, unknown>;
};

export async function generateContent(input: GenerateContentInput): Promise<string> {
	const model = getModel(input);

	let prompt: string;

	switch (input.type) {
		case "experience":
			prompt = AI_PROMPTS.experience(input.data as Parameters<typeof AI_PROMPTS.experience>[0]);
			break;
		case "projects":
			prompt = AI_PROMPTS.projects(input.data as Parameters<typeof AI_PROMPTS.projects>[0]);
			break;
		case "summary":
			prompt = AI_PROMPTS.summary(input.data as Parameters<typeof AI_PROMPTS.summary>[0]);
			break;
		case "custom":
			prompt = AI_PROMPTS.custom(input.data as Parameters<typeof AI_PROMPTS.custom>[0]);
			break;
		default:
			throw new Error(`Unknown content type: ${input.type}`);
	}

	const result = await generateText({
		model,
		messages: [{ role: "user", content: prompt }],
	});

	// Convert plain text bullet points to HTML format
	let content = result.text.trim();

	// For experience and projects, convert bullet points to HTML list
	if (input.type === "experience" || input.type === "projects" || input.type === "custom") {
		// Split by newlines and filter out empty lines
		const lines = content.split("\n").filter((line) => line.trim());

		// Convert bullet points to HTML list items
		const listItems = lines
			.map((line) => {
				// Remove bullet point characters (•, -, *, etc.) from the start
				const cleaned = line.trim().replace(/^[•\-*]\s*/, "");
				return cleaned ? `<li>${cleaned}</li>` : "";
			})
			.filter((item) => item);

		if (listItems.length > 0) {
			content = `<ul>${listItems.join("")}</ul>`;
		}
	}

	return content;
}

export const aiService = {
	testConnection,
	parsePdf,
	parseDocx,
	generateContent,
};
