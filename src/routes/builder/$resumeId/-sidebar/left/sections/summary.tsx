import { Trans } from "@lingui/react/macro";
import { useState } from "react";
import { RichInput } from "@/components/input/rich-input";
import { useResumeStore } from "@/components/resume/store/resume";
import { AIGenerateButton } from "@/components/ui/ai-generate-button";
import { SectionBase } from "../shared/section-base";

export function SummarySectionBuilder() {
	const section = useResumeStore((state) => state.resume.data.summary);
	const resumeData = useResumeStore((state) => state.resume.data);
	const updateResumeData = useResumeStore((state) => state.updateResumeData);
	const [isAIGenerating, setIsAIGenerating] = useState(false);

	const onChange = (value: string) => {
		updateResumeData((draft) => {
			draft.summary.content = value;
		});
	};

	const handleAIGenerated = (content: string) => {
		setIsAIGenerating(true);
		updateResumeData((draft) => {
			draft.summary.content = content;
		});
		setTimeout(() => setIsAIGenerating(false), 500);
	};

	const handleAskZoe = () => {
		setIsAIGenerating(true);
		// This will trigger the AI generation
		// The actual AI logic is handled by AIGenerateButton component
	};

	// Prepare data for AI generation
	const userData = {
		name: resumeData.basics.name,
		headline: resumeData.basics.headline,
		email: resumeData.basics.email,
		location: resumeData.basics.location,
		experience: resumeData.sections.experience.items.slice(0, 2).map((exp) => ({
			company: exp.company,
			position: exp.position,
		})),
		skills: resumeData.sections.skills.items.slice(0, 5).map((skill) => skill.name),
		currentSummary: section.content,
	};

	return (
		<SectionBase type="summary">
			<div className="space-y-4">
				{/* Section Card */}
				<div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
					{/* Header with AI Button */}
					<div className="mb-4 flex items-center justify-between">
						<label className="font-semibold text-gray-900 text-sm">
							<Trans>Professional Summary</Trans>
						</label>

						<div className="hidden">
							<AIGenerateButton type="summary" data={userData} onGenerated={handleAIGenerated} />
						</div>

						<button
							onClick={handleAskZoe}
							disabled={isAIGenerating}
							className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 font-medium text-gray-700 text-sm shadow-sm transition-all hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
							type="button"
						>
							{isAIGenerating ? (
								<>
									<svg className="h-4 w-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
										/>
									</svg>
									Generating...
								</>
							) : (
								<>
									<img src="/src/dialogs/resume/zoe-talking.png" alt="Zoe AI" className="h-5 w-5" />
									Ask Zoe
								</>
							)}
						</button>
					</div>{" "}
					{/* Rich Text Editor */}
					<RichInput value={section.content} onChange={onChange} />
					{/* Character Counter */}
					<div className="mt-2 flex items-center justify-between text-gray-500 text-xs">
						<span>{section.content.length} characters</span>
						<span className="text-gray-400">Tip: Keep it between 50-200 words</span>
					</div>
				</div>

				{/* AI Suggestion Box */}
				{isAIGenerating && (
					<div
						className="animate-pulse rounded-xl border border-emerald-200 p-4"
						style={{
							backgroundImage: "linear-gradient(to bottom right, rgb(236 253 245), rgb(209 250 229))",
						}}
					>
						<div className="flex items-start gap-3">
							<img
								src="https://api.dicebear.com/7.x/bottts/svg?seed=Zoe&backgroundColor=10b981"
								alt="Zoe AI"
								className="h-10 w-10 animate-bounce rounded-full"
							/>
							<div>
								<h4 className="mb-1 font-semibold text-gray-900 text-sm">Zoe is writing...</h4>
								<p className="text-gray-700 text-sm">
									Crafting a professional summary based on your profile information.
								</p>
							</div>
						</div>
					</div>
				)}

				{/* Help/Tips Section */}
				<div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
					<div className="flex gap-3">
						<svg
							className="mt-0.5 h-5 w-5 shrink-0 text-blue-600"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						<div>
							<h4 className="mb-2 font-semibold text-blue-900 text-sm">Summary Writing Tips</h4>
							<ul className="space-y-1 text-blue-800 text-xs">
								<li>• Start with your job title and years of experience</li>
								<li>• Highlight 2-3 key skills or achievements</li>
								<li>• Mention what makes you unique or passionate</li>
								<li>• Keep it concise and relevant to your target role</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</SectionBase>
	);
}
