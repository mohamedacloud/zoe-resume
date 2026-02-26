import { useResumeStore } from "@/components/resume/store/resume";
import { SectionBase } from "../shared/section-base";
import { SortableSectionItem } from "../shared/sortable-section-item";

export function SummarySectionBuilder() {
	const summary = useResumeStore((state) => state.resume.data.summary);

	return (
		<SectionBase type="summary">
			<SortableSectionItem
				type="summary"
				item={{ id: "summary", ...summary }}
				title="Edit Summary"
				subtitle={
					summary.content
						? summary.content.replace(/<[^>]*>?/gm, "").slice(0, 120)
						: "Click to add your professional summary"
				}
			/>
		</SectionBase>
	);
}