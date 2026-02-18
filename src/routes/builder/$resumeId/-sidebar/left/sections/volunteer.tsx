import { Trans } from "@lingui/react/macro";
import type z from "zod";
import { useResumeStore } from "@/components/resume/store/resume";
import { SortableList } from "@/components/ui/sortable-list";
import type { volunteerItemSchema } from "@/schema/resume/data";
import { cn } from "@/utils/style";
import { SectionBase } from "../shared/section-base";
import { SectionAddItemButton } from "../shared/section-item";
import { SortableSectionItem } from "../shared/sortable-section-item";

export function VolunteerSectionBuilder() {
	const section = useResumeStore((state) => state.resume.data.sections.volunteer);
	const updateResumeData = useResumeStore((state) => state.updateResumeData);

	const onReorder = (items: z.infer<typeof volunteerItemSchema>[]) => {
		updateResumeData((draft) => {
			draft.sections.volunteer.items = items;
		});
	};

	return (
		<SectionBase type="volunteer" className={cn("rounded-md border", section.items.length === 0 && "border-dashed")}>
			<SortableList
				items={section.items}
				onReorder={onReorder}
				keyExtractor={(item) => item.id}
				renderItem={(item) => (
					<SortableSectionItem
						key={item.id}
						type="volunteer"
						item={item}
						title={item.organization}
						subtitle={item.location}
					/>
				)}
			/>

			<SectionAddItemButton type="volunteer">
				<Trans>Add a new volunteer experience</Trans>
			</SectionAddItemButton>
		</SectionBase>
	);
}
