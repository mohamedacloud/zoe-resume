import { Trans } from "@lingui/react/macro";
import type z from "zod";
import { useResumeStore } from "@/components/resume/store/resume";
import { SortableList } from "@/components/ui/sortable-list";
import type { publicationItemSchema } from "@/schema/resume/data";
import { cn } from "@/utils/style";
import { SectionBase } from "../shared/section-base";
import { SectionAddItemButton } from "../shared/section-item";
import { SortableSectionItem } from "../shared/sortable-section-item";

export function PublicationsSectionBuilder() {
	const section = useResumeStore((state) => state.resume.data.sections.publications);
	const updateResumeData = useResumeStore((state) => state.updateResumeData);

	const handleReorder = (items: z.infer<typeof publicationItemSchema>[]) => {
		updateResumeData((draft) => {
			draft.sections.publications.items = items;
		});
	};

	return (
		<SectionBase type="publications" className={cn("rounded-md border", section.items.length === 0 && "border-dashed")}>
			<SortableList
				items={section.items}
				onReorder={handleReorder}
				keyExtractor={(item) => item.id}
				renderItem={(item) => (
					<SortableSectionItem key={item.id} type="publications" item={item} title={item.title} subtitle={item.publisher} />
				)}
			/>

			<SectionAddItemButton type="publications">
				<Trans>Add a new publication</Trans>
			</SectionAddItemButton>
		</SectionBase>
	);
}
