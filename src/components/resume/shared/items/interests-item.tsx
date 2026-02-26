import type { SectionItem } from "@/schema/resume/data";
import { cn } from "@/utils/style";
import { useResumeStore } from "../../store/resume";
import { InlineEditableText } from "../inline-editable-text";
import { PageIcon } from "../page-icon";

type InterestsItemProps = SectionItem<"interests"> & {
	className?: string;
};

export function InterestsItem({ className, ...item }: InterestsItemProps) {
	const updateResumeData = useResumeStore((state) => state.updateResumeData);

	const handleNameChange = (value: string) => {
		updateResumeData((draft) => {
			const sectionItem = draft.sections.interests.items.find((i) => i.id === item.id);
			if (sectionItem) sectionItem.name = value;
		});
	};

	return (
		<div className={cn("interests-item", className)}>
			{/* Header */}
			<div className="section-item-header interests-item-header flex items-center gap-x-1.5">
				<PageIcon icon={item.icon} className="section-item-icon interests-item-icon" />
				<strong className="section-item-title interests-item-name">
					<InlineEditableText value={item.name} placeholder="Interest" onChange={handleNameChange} />
				</strong>
			</div>

			{/* Keywords */}
			{item.keywords.length > 0 && (
				<span className="section-item-keywords interests-item-keywords inline-block opacity-80">
					{item.keywords.join(", ")}
				</span>
			)}
		</div>
	);
}
