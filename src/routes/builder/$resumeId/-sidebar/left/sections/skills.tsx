import { Trans } from "@lingui/react/macro";
import type z from "zod";
import { useResumeStore } from "@/components/resume/store/resume";
import { SortableList } from "@/components/ui/sortable-list";
import type { skillItemSchema } from "@/schema/resume/data";
import { cn } from "@/utils/style";
import { SectionBase } from "../shared/section-base";
import { SectionAddItemButton } from "../shared/section-item";
import { SortableSectionItem } from "../shared/sortable-section-item";

export function SkillsSectionBuilder() {
	const section = useResumeStore((state) => state.resume.data.sections.skills);
	const updateResumeData = useResumeStore((state) => state.updateResumeData);

	const handleReorder = (items: z.infer<typeof skillItemSchema>[]) => {
		updateResumeData((draft) => {
			draft.sections.skills.items = items;
		});
	};

	return (
		<SectionBase type="skills" className={cn("rounded-md border", section.items.length === 0 && "border-dashed")}>
			<SortableList
				items={section.items}
				onReorder={handleReorder}
				keyExtractor={(item) => item.id}
				renderItem={(item) => (
					<SortableSectionItem key={item.id} type="skills" item={item} title={item.name} subtitle={item.proficiency} />
				)}
			/>

			<SectionAddItemButton type="skills">
				<Trans>Add a new skill</Trans>
			</SectionAddItemButton>
		</SectionBase>
	);
}
