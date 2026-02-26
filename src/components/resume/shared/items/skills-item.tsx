import type { SectionItem } from "@/schema/resume/data";
import { cn } from "@/utils/style";
import { useResumeStore } from "../../store/resume";
import { InlineEditableText } from "../inline-editable-text";
import { PageIcon } from "../page-icon";
import { PageLevel } from "../page-level";

type SkillsItemProps = SectionItem<"skills"> & {
	className?: string;
};

export function SkillsItem({ className, ...item }: SkillsItemProps) {
	const updateResumeData = useResumeStore((state) => state.updateResumeData);

	const handleNameChange = (value: string) => {
		updateResumeData((draft) => {
			const sectionItem = draft.sections.skills.items.find((i) => i.id === item.id);
			if (sectionItem) sectionItem.name = value;
		});
	};

	const handleProficiencyChange = (value: string) => {
		updateResumeData((draft) => {
			const sectionItem = draft.sections.skills.items.find((i) => i.id === item.id);
			if (sectionItem) sectionItem.proficiency = value;
		});
	};

	return (
		<div className={cn("skills-item", className)}>
			{/* Header */}
			<div className="section-item-header flex items-center gap-x-1.5">
				<PageIcon icon={item.icon} className="section-item-icon skills-item-icon" />
				<strong className="section-item-title skills-item-name">
					<InlineEditableText value={item.name} placeholder="Skill Name" onChange={handleNameChange} />
				</strong>
			</div>

			{/* Proficiency */}
			{item.proficiency && (
				<span className="section-item-metadata skills-item-proficiency inline-block">
					<InlineEditableText value={item.proficiency} placeholder="Proficiency" onChange={handleProficiencyChange} />
				</span>
			)}

			{/* Keywords */}
			{item.keywords.length > 0 && (
				<span className="section-item-keywords skills-item-keywords inline-block opacity-80">
					{item.keywords.join(", ")}
				</span>
			)}

			{/* Level */}
			<PageLevel level={item.level} className="section-item-level skills-item-level" />
		</div>
	);
}
