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
	const handleAddEducation = () => {
		const newEducation = {
			id: crypto.randomUUID(),
			hidden: false,
			school: "",
			degree: "",
			area: "",
			grade: "",
			location: "",
			period: "", // Ensure period is a string
			website: { url: "", label: "" }, // Ensure website matches schema
			description: "", // Ensure description is a string
			currentlyStudyingHere: false, // Added missing property
		};

		updateResumeData((draft) => {
			draft.sections.education.items.unshift(newEducation);
		});
	};

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

			<SectionAddItemButton type="education" onClick={handleAddEducation}>
				<Trans>Add a new education</Trans>
			</SectionAddItemButton>
		</SectionBase>
	);
}
