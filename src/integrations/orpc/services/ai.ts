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

// Final Review Types and Functions
export type FinalReviewInput = z.infer<typeof aiCredentialsSchema> & {
	resume: Record<string, unknown>;
	photo?: {
		url?: string;
		visible?: boolean;
	};
};

export type FinalReviewResponse = {
	overall_score: number;
	critical: string[];
	important: string[];
	suggestions: string[];
	strengths: string[];
	detailed_checks: {
		photo_verdict: string;
		link_status: string;
		grammar_tense: string;
	};
	final_verdict: "READY" | "NEEDS_MINOR_FIXES" | "NEEDS_MAJOR_WORK";
};

const FINAL_REVIEW_PROMPT = `You are a Senior ATS Specialist & Recruiter.
Audit the provided Resume JSON and Photo Metadata.
Return ONLY structured JSON, no other text.

VALIDATION RULES:
- Name must have at least 2 words
- Phone must be 10 digits
- Email must be valid format
- Links must start with http://, https://, or www.
- Sections must have at least 10 characters
- Photo should be professional (if present)

QUALITY CHECKS:
- Education section complete with dates and details
- Dates are consistent and logical
- Skills match experience descriptions
- Bullet points are action-based (start with strong verbs)
- Summary is 50-100 words
- 8-25 skills listed
- Grammar is correct
- Format is ATS-parsable

SCORING BREAKDOWN (Total: 100 points):
- Completeness (20): All required sections filled
- Quality (20): Content is well-written and professional
- ATS Compatibility (15): Format is machine-readable
- Content Relevance (25): Information is relevant and impactful
- Grammar & Spelling (10): No errors
- Coherence (10): Logical flow and consistency

OUTPUT FORMAT (JSON only):
{
  "overall_score": number (0-100),
  "critical": ["issue1", "issue2"],
  "important": ["issue1", "issue2"],
  "suggestions": ["suggestion1", "suggestion2"],
  "strengths": ["strength1", "strength2"],
  "detailed_checks": {
    "photo_verdict": "Professional | Needs Improvement | Missing",
    "link_status": "All Valid | Some Invalid | None",
    "grammar_tense": "Consistent | Inconsistent"
  },
  "final_verdict": "READY" | "NEEDS_MINOR_FIXES" | "NEEDS_MAJOR_WORK"
}

CRITICAL ISSUES = Must fix before export
IMPORTANT ISSUES = Should fix for better results
SUGGESTIONS = Nice to have improvements
STRENGTHS = What's working well (always include at least 2)

Analyze the resume and return ONLY the JSON response.`;

const finalReviewResponseSchema = z.object({
	overall_score: z.number().min(0).max(100),
	critical: z.array(z.string()),
	important: z.array(z.string()),
	suggestions: z.array(z.string()),
	strengths: z.array(z.string()),
	detailed_checks: z.object({
		photo_verdict: z.string(),
		link_status: z.string(),
		grammar_tense: z.string(),
	}),
	final_verdict: z.enum(["READY", "NEEDS_MINOR_FIXES", "NEEDS_MAJOR_WORK"]),
});

export async function finalReview(input: FinalReviewInput): Promise<FinalReviewResponse> {
	const model = getModel(input);

	const resumeText = JSON.stringify(input.resume, null, 2);
	const photoText = input.photo
		? `Photo: ${input.photo.visible ? "Visible" : "Hidden"}, URL: ${input.photo.url || "None"}`
		: "Photo: None";

	const userPrompt = `Resume Data:\n${resumeText}\n\n${photoText}\n\nProvide your analysis in the specified JSON format.`;

	const result = await generateText({
		model,
		output: Output.object({ schema: finalReviewResponseSchema }),
		messages: [
			{ role: "system", content: FINAL_REVIEW_PROMPT },
			{ role: "user", content: userPrompt },
		],
	});

	return finalReviewResponseSchema.parse(result.output);
}

export const aiService = {
	testConnection,
	parsePdf,
	parseDocx,
	generateContent,
	finalReview,
};
