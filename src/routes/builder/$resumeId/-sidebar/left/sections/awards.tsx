import { Trans } from "@lingui/react/macro";
import type z from "zod";
import { useResumeStore } from "@/components/resume/store/resume";
import { SortableList } from "@/components/ui/sortable-list";
import type { awardItemSchema } from "@/schema/resume/data";
import { cn } from "@/utils/style";
import { SectionBase } from "../shared/section-base";
import { SectionAddItemButton } from "../shared/section-item";
import { SortableSectionItem } from "../shared/sortable-section-item";

export function AwardsSectionBuilder() {
	const section = useResumeStore((state) => state.resume.data.sections.awards);
	const updateResumeData = useResumeStore((state) => state.updateResumeData);

	const handleReorder = (items: z.infer<typeof awardItemSchema>[]) => {
		updateResumeData((draft) => {
			draft.sections.awards.items = items;
		});
	};

	return (
		<SectionBase type="awards" className={cn("rounded-md border", section.items.length === 0 && "border-dashed")}>
			<SortableList
				items={section.items}
				onReorder={handleReorder}
				keyExtractor={(item) => item.id}
				renderItem={(item) => (
					<SortableSectionItem key={item.id} type="awards" item={item} title={item.title} subtitle={item.awarder} />
				)}
			/>

			<SectionAddItemButton type="awards">
				<Trans>Add a new award</Trans>
			</SectionAddItemButton>
		</SectionBase>
	);
}
