import type { ResumeData } from "@/schema/resume/data";

/**
 * Issue structure returned from the review system
 */
export type ReviewIssue = {
	id: string;
	section: "summary" | "experience" | "education" | "projects" | "skills" | "custom";
	type: "grammar" | "formatting" | "weak_content" | "missing_section";
	fieldId?: string; // ID of the specific item (e.g., experience item ID)
	fieldPath?: string; // Path to the field (e.g., "summary.content", "experience.0.description")
	message: string;
	severity: "low" | "medium" | "high";
	currentValue?: string; // Current text that needs fixing
};

type AIFixRequest = {
	[key: string]: string; // key: fieldPath, value: current text
};

type AIFixResponse = {
	[key: string]: string; // key: fieldPath, value: improved text
};

/**
 * Rule-based text improvements (80% of fixes)
 */
class RuleBasedFixer {
	/**
	 * Strip HTML tags from text
	 */
	static stripHtml(html: string): string {
		return html
			.replace(/<[^>]*>/g, "") // Remove all HTML tags
			.replace(/&nbsp;/g, " ") // Replace &nbsp; with space
			.replace(/&amp;/g, "&") // Replace &amp; with &
			.replace(/&lt;/g, "<") // Replace &lt; with <
			.replace(/&gt;/g, ">") // Replace &gt; with >
			.replace(/&quot;/g, '"') // Replace &quot; with "
			.trim();
	}

	/**
	 * Wrap text in basic HTML paragraph tag
	 */
	static wrapInHtml(text: string): string {
		// Only wrap if not already wrapped
		if (text.startsWith("<p>") && text.endsWith("</p>")) {
			return text;
		}
		return `<p>${text}</p>`;
	}

	/**
	 * Remove extra spaces and normalize whitespace
	 */
	static normalizeWhitespace(text: string): string {
		return text
			.replace(/\s+/g, " ") // Multiple spaces → single space
			.replace(/\s+([.,!?;:])/g, "$1") // Space before punctuation
			.replace(/([.,!?;:])\s*([.,!?;:])/g, "$1 $2") // Normalize punctuation spacing
			.trim();
	}

	/**
	 * Capitalize standalone "i" to "I"
	 */
	static fixCapitalization(text: string): string {
		return text
			.replace(/\bi\b/g, "I") // Standalone i → I
			.replace(/\bi'm\b/gi, "I'm")
			.replace(/\bi've\b/gi, "I've")
			.replace(/\bi'll\b/gi, "I'll")
			.replace(/\bi'd\b/gi, "I'd");
	}

	/**
	 * Ensure bullet points are properly formatted
	 */
	static normalizeBulletPoints(text: string): string {
		// Replace common bullet variations with standard •
		return text.replace(/^[-*+]\s+/gm, "• ").replace(/^([^•\n])/gm, "• $1"); // Add bullet if missing at line start
	}

	/**
	 * Enhance weak verbs with stronger alternatives
	 */
	static enhanceWeakVerbs(text: string): string {
		const replacements: Record<string, string> = {
			"worked on": "Developed and delivered",
			"worked with": "Collaborated with",
			"responsible for": "Led and executed",
			"helped with": "Collaborated to improve",
			"helped to": "Contributed to",
			did: "Executed",
			made: "Created",
			got: "Achieved",
			used: "Utilized",
			"was part of": "Contributed to",
		};

		let enhanced = text;
		for (const [weak, strong] of Object.entries(replacements)) {
			const regex = new RegExp(`\\b${weak}\\b`, "gi");
			enhanced = enhanced.replace(regex, strong);
		}

		return enhanced;
	}

	/**
	 * Ensure minimum word count for summary
	 */
	static ensureMinimumSummaryLength(text: string, minWords = 50): string {
		// Strip HTML to count actual words
		const plainText = RuleBasedFixer.stripHtml(text);
		const words = plainText.trim().split(/\s+/);
		
		if (words.length >= minWords) return text;

		// Check if original has HTML
		const hasHtml = /<[^>]*>/.test(text);
		
		// Append a professional fallback sentence
		const fallback =
			" I bring a proven track record of delivering high-quality results, strong problem-solving abilities, and a commitment to continuous learning and professional growth in every project I undertake.";
		
		const result = plainText.trim() + fallback;
		
		// Wrap back in HTML if needed
		return hasHtml ? RuleBasedFixer.wrapInHtml(result) : result;
	}

	/**
	 * Fix common grammar issues
	 */
	static fixCommonGrammar(text: string): string {
		return text
			.replace(/\bteh\b/gi, "the")
			.replace(/\brecieve\b/gi, "receive")
			.replace(/\boccured\b/gi, "occurred")
			.replace(/\baccomodate\b/gi, "accommodate")
			.replace(/\bseperate\b/gi, "separate");
	}

	/**
	 * Apply all rule-based fixes to a text
	 */
	static applyAllRules(text: string, isListFormat = false): string {
		// Check if text contains HTML
		const hasHtml = /<[^>]*>/.test(text);
		
		// Strip HTML if present, but remember we need to wrap it back
		let fixed = hasHtml ? RuleBasedFixer.stripHtml(text) : text;

		// Core fixes
		fixed = RuleBasedFixer.normalizeWhitespace(fixed);
		fixed = RuleBasedFixer.fixCapitalization(fixed);
		fixed = RuleBasedFixer.fixCommonGrammar(fixed);
		fixed = RuleBasedFixer.enhanceWeakVerbs(fixed);

		// Bullet point formatting for list content
		if (isListFormat) {
			fixed = RuleBasedFixer.normalizeBulletPoints(fixed);
		}

		// Wrap back in HTML if original had HTML
		if (hasHtml) {
			fixed = RuleBasedFixer.wrapInHtml(fixed);
		}

		return fixed;
	}
}

/**
 * AI-based improvements (20% of fixes - only for weak content)
 */
class AIFixer {
	/**
	 * Build a single batched prompt for all weak content issues
	 */
	static buildBatchedPrompt(fields: AIFixRequest): string {
		return `You are a professional resume writer. Improve the following resume content to be more achievement-oriented, clear, and impactful.

RULES:
- Keep the core meaning unchanged
- Make it achievement-oriented (focus on results, metrics, impact)
- Use strong action verbs
- Be concise and professional
- Return ONLY valid JSON with the same keys

INPUT (JSON):
${JSON.stringify(fields, null, 2)}

OUTPUT (JSON only, no markdown, no explanation):`;
	}

	/**
	 * Parse AI response safely
	 */
	static parseAIResponse(response: string): AIFixResponse | null {
		try {
			// Remove markdown code blocks if present
			const cleaned = response
				.replace(/```json\n?/g, "")
				.replace(/```\n?/g, "")
				.trim();
			const parsed = JSON.parse(cleaned);
			return parsed;
		} catch (error) {
			console.error("Failed to parse AI response:", error);
			return null;
		}
	}

	/**
	 * Call AI with batched fields
	 */
	static async improveContent(
		fields: AIFixRequest,
		callAI: (prompt: string) => Promise<string>,
	): Promise<AIFixResponse> {
		if (Object.keys(fields).length === 0) return {};

		try {
			const prompt = AIFixer.buildBatchedPrompt(fields);
			const response = await callAI(prompt);
			const parsed = AIFixer.parseAIResponse(response);

			return parsed || {};
		} catch (error) {
			console.error("AI improvement failed:", error);
			return {}; // Return empty object on failure
		}
	}
}

/**
 * Main Auto Fix Engine
 */
export class AutoFixEngine {
	/**
	 * Apply rule-based fixes to resume data
	 */
	private static applyRuleBasedFixes(resumeData: ResumeData, issues: ReviewIssue[]): ResumeData {
		// Deep clone to avoid mutating read-only properties
		const fixed = structuredClone(resumeData);

		console.log("🔧 Applying rule-based fixes...");

		// Fix summary
		if (fixed.summary?.content) {
			const originalSummary = fixed.summary.content;
			fixed.summary.content = RuleBasedFixer.applyAllRules(fixed.summary.content);
			fixed.summary.content = RuleBasedFixer.ensureMinimumSummaryLength(fixed.summary.content);
			
			if (originalSummary !== fixed.summary.content) {
				console.log("✏️ Summary fixed:");
				console.log("  Before:", originalSummary);
				console.log("  After:", fixed.summary.content);
			}
		} else if (issues.some((i) => i.section === "summary" && i.type === "missing_section")) {
			// Add default summary if missing
			console.log("➕ Adding default summary");
			fixed.summary = {
				...fixed.summary,
				content:
					"I am a dedicated professional with strong problem-solving skills and a passion for continuous learning. I bring a proven track record of delivering high-quality results and collaborating effectively with teams.",
			};
		}

		// Fix experience descriptions
		if (fixed.sections?.experience?.items) {
			let expFixCount = 0;
			fixed.sections.experience.items = fixed.sections.experience.items.map((item, index) => {
				if (item.description) {
					const originalDesc = item.description;
					const fixedDesc = RuleBasedFixer.applyAllRules(item.description, true);
					if (originalDesc !== fixedDesc) {
						expFixCount++;
						console.log(`✏️ Experience ${index + 1} description fixed`);
					}
					return { ...item, description: fixedDesc };
				}
				return item;
			});
			if (expFixCount > 0) {
				console.log(`✅ Fixed ${expFixCount} experience descriptions`);
			}
		}

		// Fix project descriptions
		if (fixed.sections?.projects?.items) {
			let projFixCount = 0;
			fixed.sections.projects.items = fixed.sections.projects.items.map((item, index) => {
				if (item.description) {
					const originalDesc = item.description;
					const fixedDesc = RuleBasedFixer.applyAllRules(item.description, true);
					if (originalDesc !== fixedDesc) {
						projFixCount++;
						console.log(`✏️ Project ${index + 1} description fixed`);
					}
					return { ...item, description: fixedDesc };
				}
				return item;
			});
			if (projFixCount > 0) {
				console.log(`✅ Fixed ${projFixCount} project descriptions`);
			}
		}

		// Fix education descriptions
		if (fixed.sections?.education?.items) {
			let eduFixCount = 0;
			fixed.sections.education.items = fixed.sections.education.items.map((item, index) => {
				if (item.description) {
					const originalDesc = item.description;
					const fixedDesc = RuleBasedFixer.applyAllRules(item.description);
					if (originalDesc !== fixedDesc) {
						eduFixCount++;
						console.log(`✏️ Education ${index + 1} description fixed`);
					}
					return { ...item, description: fixedDesc };
				}
				return item;
			});
			if (eduFixCount > 0) {
				console.log(`✅ Fixed ${eduFixCount} education descriptions`);
			}
		}

		return fixed;
	}

	/**
	 * Collect weak content issues for AI improvement
	 */
	private static collectWeakContentIssues(issues: ReviewIssue[]): AIFixRequest {
		const weakContentFields: AIFixRequest = {};

		for (const issue of issues) {
			if (issue.type === "weak_content" && issue.fieldPath && issue.currentValue) {
				weakContentFields[issue.fieldPath] = issue.currentValue;
			}
		}

		return weakContentFields;
	}

	/**
	 * Apply AI improvements to resume data
	 */
	private static applyAIFixes(resumeData: ResumeData, improvements: AIFixResponse): ResumeData {
		const fixed = { ...resumeData };

		for (const [fieldPath, improvedValue] of Object.entries(improvements)) {
			const parts = fieldPath.split(".");

			// Handle summary.content
			if (parts[0] === "summary" && parts[1] === "content") {
				if (fixed.summary) {
					fixed.summary.content = improvedValue;
				}
			}

			// Handle experience[index].description
			if (parts[0] === "experience" && parts[2] === "description") {
				const index = Number.parseInt(parts[1], 10);
				if (fixed.sections?.experience?.items?.[index]) {
					fixed.sections.experience.items[index].description = improvedValue;
				}
			}

			// Handle projects[index].description
			if (parts[0] === "projects" && parts[2] === "description") {
				const index = Number.parseInt(parts[1], 10);
				if (fixed.sections?.projects?.items?.[index]) {
					fixed.sections.projects.items[index].description = improvedValue;
				}
			}

			// Handle education[index].description
			if (parts[0] === "education" && parts[2] === "description") {
				const index = Number.parseInt(parts[1], 10);
				if (fixed.sections?.education?.items?.[index]) {
					fixed.sections.education.items[index].description = improvedValue;
				}
			}
		}

		return fixed;
	}

	/**
	 * Main function to auto-fix resume issues
	 * @param resumeData - Current resume data
	 * @param issues - Detected issues from review
	 * @param callAI - AI integration function
	 * @returns Fixed resume data
	 */
	static async autoFixResume(
		resumeData: ResumeData,
		issues: ReviewIssue[],
		callAI?: (prompt: string) => Promise<string>,
	): Promise<ResumeData> {
		// Step 1: Apply rule-based fixes (80% of work)
		let fixed = AutoFixEngine.applyRuleBasedFixes(resumeData, issues);

		// Step 2: Collect weak content issues for AI improvement (20% of work)
		if (callAI) {
			const weakContentFields = AutoFixEngine.collectWeakContentIssues(issues);

			if (Object.keys(weakContentFields).length > 0) {
				// Step 3: Batch AI call (single request for all weak content)
				const improvements = await AIFixer.improveContent(weakContentFields, callAI);

				// Step 4: Apply AI improvements
				fixed = AutoFixEngine.applyAIFixes(fixed, improvements);
			}
		}

		return fixed;
	}
}

/**
 * Helper function to generate issues from review result
 * This adapts your FinalReviewResult to ReviewIssue[]
 */
export function convertReviewResultToIssues(
	reviewResult: {
		critical: string[];
		important: string[];
		suggestions: string[];
		detailed_checks: {
			photo_verdict: string;
			link_status: string;
			grammar_tense: string;
		};
	},
	resumeData: ResumeData,
): ReviewIssue[] {
	const issues: ReviewIssue[] = [];
	let issueId = 0;

	// Convert critical issues
	for (const msg of reviewResult.critical) {
		issues.push({
			id: `critical-${issueId++}`,
			section: "summary", // Default, can be improved with better detection
			type: msg.toLowerCase().includes("grammar") ? "grammar" : "formatting",
			message: msg,
			severity: "high",
		});
	}

	// Convert important issues
	for (const msg of reviewResult.important) {
		issues.push({
			id: `important-${issueId++}`,
			section: "summary",
			type: msg.toLowerCase().includes("weak") ? "weak_content" : "formatting",
			message: msg,
			severity: "medium",
		});
	}

	// Convert suggestions
	for (const msg of reviewResult.suggestions) {
		issues.push({
			id: `suggestion-${issueId++}`,
			section: "summary",
			type: "weak_content",
			message: msg,
			severity: "low",
		});
	}

	// Add grammar/tense issues from detailed checks
	if (reviewResult.detailed_checks.grammar_tense.toLowerCase().includes("issue")) {
		issues.push({
			id: `grammar-${issueId++}`,
			section: "summary",
			type: "grammar",
			message: reviewResult.detailed_checks.grammar_tense,
			severity: "medium",
			fieldPath: "summary.content",
			currentValue: resumeData.summary?.content || "",
		});
	}

	// Check for weak content in summary
	if (resumeData.summary?.content && resumeData.summary.content.split(/\s+/).length < 30) {
		issues.push({
			id: `weak-summary-${issueId++}`,
			section: "summary",
			type: "weak_content",
			message: "Summary is too short",
			severity: "medium",
			fieldPath: "summary.content",
			currentValue: resumeData.summary.content,
		});
	}

	// Check for weak content in experience
	resumeData.sections?.experience?.items?.forEach((item, index) => {
		if (item.description && (item.description.includes("worked on") || item.description.includes("responsible for"))) {
			issues.push({
				id: `weak-exp-${issueId++}`,
				section: "experience",
				type: "weak_content",
				message: "Experience description uses weak verbs",
				severity: "low",
				fieldPath: `experience.${index}.description`,
				fieldId: item.id,
				currentValue: item.description,
			});
		}
	});

	return issues;
}
