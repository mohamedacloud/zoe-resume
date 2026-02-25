import { useResumeStore } from "@/components/resume/store/resume";
import { SectionBase } from "../shared/section-base";
import { SortableSectionItem } from "../shared/sortable-section-item";

export function SummarySectionBuilder() {
	const section = useResumeStore((state) => state.resume.data.summary);

	console.log("📘 Summary Section Builder Rendered:", section);

	return (
		<SectionBase type="summary">
			<SortableSectionItem
				type="summary"
				item={{ id: "summary", ...section }}
				title="Edit Summary"
				subtitle={
					section.content
						? section.content.replace(/<[^>]*>?/gm, "").slice(0, 120)
						: "Click to add your professional summary"
				}
			/>
		</SectionBase>
	);
}