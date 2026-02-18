import { Trans } from "@lingui/react/macro";
import type z from "zod";
import { useResumeStore } from "@/components/resume/store/resume";
import { SortableList } from "@/components/ui/sortable-list";
import type { interestItemSchema } from "@/schema/resume/data";
import { cn } from "@/utils/style";
import { SectionBase } from "../shared/section-base";
import { SectionAddItemButton } from "../shared/section-item";
import { SortableSectionItem } from "../shared/sortable-section-item";

export function InterestsSectionBuilder() {
	const section = useResumeStore((state) => state.resume.data.sections.interests);
	const updateResumeData = useResumeStore((state) => state.updateResumeData);

	const handleReorder = (items: z.infer<typeof interestItemSchema>[]) => {
		updateResumeData((draft) => {
			draft.sections.interests.items = items;
		});
	};

	return (
		<SectionBase type="interests" className={cn("rounded-md border", section.items.length === 0 && "border-dashed")}>
			<SortableList
				items={section.items}
				onReorder={handleReorder}
				keyExtractor={(item) => item.id}
				renderItem={(item) => (
					<SortableSectionItem key={item.id} type="interests" item={item} title={item.name} />
				)}
			/>

			<SectionAddItemButton type="interests">
				<Trans>Add a new interest</Trans>
			</SectionAddItemButton>
		</SectionBase>
	);
}
