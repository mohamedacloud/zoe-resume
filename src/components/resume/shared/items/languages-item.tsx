import type { SectionItem } from "@/schema/resume/data";
import { cn } from "@/utils/style";
import { useResumeStore } from "../../store/resume";
import { InlineEditableText } from "../inline-editable-text";
import { PageLevel } from "../page-level";

type LanguagesItemProps = SectionItem<"languages"> & {
	className?: string;
};

export function LanguagesItem({ className, ...item }: LanguagesItemProps) {
	const updateResumeData = useResumeStore((state) => state.updateResumeData);

	const handleLanguageChange = (value: string) => {
		updateResumeData((draft) => {
			const sectionItem = draft.sections.languages.items.find((i) => i.id === item.id);
			if (sectionItem) sectionItem.language = value;
		});
	};

	const handleFluencyChange = (value: string) => {
		updateResumeData((draft) => {
			const sectionItem = draft.sections.languages.items.find((i) => i.id === item.id);
			if (sectionItem) sectionItem.fluency = value;
		});
	};

	return (
		<div className={cn("languages-item", className)}>
			{/* Header */}
			<div className="section-item-header languages-item-header flex flex-col">
				{/* Row 1 */}
				<strong className="section-item-title languages-item-name">
					<InlineEditableText value={item.language} placeholder="Language" onChange={handleLanguageChange} />
				</strong>

				{/* Row 2 */}
				<span className="section-item-metadata languages-item-fluency opacity-80">
					<InlineEditableText value={item.fluency} placeholder="Fluency" onChange={handleFluencyChange} />
				</span>
			</div>

			{/* Level */}
			<PageLevel level={item.level} className="section-item-level languages-item-level" />
		</div>
	);
}
