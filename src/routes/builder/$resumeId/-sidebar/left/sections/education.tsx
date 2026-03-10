import { Trans } from "@lingui/react/macro";
import { useResumeStore } from "@/components/resume/store/resume";
import { SortableList } from "@/components/ui/sortable-list";
import { cn } from "@/utils/style";
import { SectionBase } from "../shared/section-base";
import { SectionAddItemButton } from "../shared/section-item";
import { SortableSectionItem } from "../shared/sortable-section-item";

export function EducationSectionBuilder() {
	const section = useResumeStore((state) => state.resume.data.sections.education);
	const updateResumeData = useResumeStore((state) => state.updateResumeData);
	return (
		<SectionBase type="education" className={cn("rounded-md border", section.items.length === 0 && "border-dashed")}>
			{/* Education List */}
			<div className="space-y-4">
				<SortableList
					items={section.items}
					onReorder={(newItems) => {
						updateResumeData((draft) => {
							draft.sections.education.items = newItems;
						});
					}}
					keyExtractor={(item) => item.id}
					renderItem={(item) => (
						<SortableSectionItem
							key={item.id}
							type="education"
							item={item}
							title={item.school || "New Education"}
							subtitle={[item.degree, item.period].filter(Boolean).join(" • ")}
						/>
					)}
				/>
			</div>

			<SectionAddItemButton type="education">
				<Trans>Add a new education</Trans>
			</SectionAddItemButton>
		</SectionBase>
	);
}
