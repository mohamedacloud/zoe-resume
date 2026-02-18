import { Trans } from "@lingui/react/macro";
import type z from "zod";
import { useResumeStore } from "@/components/resume/store/resume";
import { SortableList } from "@/components/ui/sortable-list";
import type { referenceItemSchema } from "@/schema/resume/data";
import { cn } from "@/utils/style";
import { SectionBase } from "../shared/section-base";
import { SectionAddItemButton } from "../shared/section-item";
import { SortableSectionItem } from "../shared/sortable-section-item";

export function ReferencesSectionBuilder() {
	const section = useResumeStore((state) => state.resume.data.sections.references);
	const updateResumeData = useResumeStore((state) => state.updateResumeData);

	const onReorder = (items: z.infer<typeof referenceItemSchema>[]) => {
		updateResumeData((draft) => {
			draft.sections.references.items = items;
		});
	};

	return (
		<SectionBase type="references" className={cn("rounded-md border", section.items.length === 0 && "border-dashed")}>
			<SortableList
				items={section.items}
				onReorder={onReorder}
				keyExtractor={(item) => item.id}
				renderItem={(item) => <SortableSectionItem key={item.id} type="references" item={item} title={item.name} />}
			/>

			<SectionAddItemButton type="references">
				<Trans>Add a new reference</Trans>
			</SectionAddItemButton>
		</SectionBase>
	);
}
