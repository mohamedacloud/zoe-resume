import { Trans } from "@lingui/react/macro";
import { RichInput } from "@/components/input/rich-input";
import { useResumeStore } from "@/components/resume/store/resume";
import { AIGenerateButton } from "@/components/ui/ai-generate-button";
import { SectionBase } from "../shared/section-base";

export function SummarySectionBuilder() {
	const section = useResumeStore((state) => state.resume.data.summary);
	const resumeData = useResumeStore((state) => state.resume.data);
	const updateResumeData = useResumeStore((state) => state.updateResumeData);

	const onChange = (value: string) => {
		updateResumeData((draft) => {
			draft.summary.content = value;
		});
	};

	const handleAIGenerated = (content: string) => {
		updateResumeData((draft) => {
			draft.summary.content = content;
		});
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
			<div className="space-y-2">
				<div className="flex items-center justify-between">
					<label className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
						<Trans>Professional Summary</Trans>
					</label>
					<AIGenerateButton type="summary" data={userData} onGenerated={handleAIGenerated} />
				</div>
				<RichInput value={section.content} onChange={onChange} />
			</div>
		</SectionBase>
	);
}

