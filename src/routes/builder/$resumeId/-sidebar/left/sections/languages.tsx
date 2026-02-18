import { Trans } from "@lingui/react/macro";
import type z from "zod";
import { useResumeStore } from "@/components/resume/store/resume";
import { SortableList } from "@/components/ui/sortable-list";
import type { languageItemSchema } from "@/schema/resume/data";
import { cn } from "@/utils/style";
import { SectionBase } from "../shared/section-base";
import { SectionAddItemButton } from "../shared/section-item";
import { SortableSectionItem } from "../shared/sortable-section-item";

export function LanguagesSectionBuilder() {
	const section = useResumeStore((state) => state.resume.data.sections.languages);
	const updateResumeData = useResumeStore((state) => state.updateResumeData);

	const handleReorder = (items: z.infer<typeof languageItemSchema>[]) => {
		updateResumeData((draft) => {
			draft.sections.languages.items = items;
		});
	};

	return (
		<SectionBase type="languages" className={cn("rounded-md border", section.items.length === 0 && "border-dashed")}>
			<SortableList
				items={section.items}
				onReorder={handleReorder}
				keyExtractor={(item) => item.id}
				renderItem={(item) => (
					<SortableSectionItem key={item.id} type="languages" item={item} title={item.language} subtitle={item.fluency} />
				)}
			/>

			<SectionAddItemButton type="languages">
				<Trans>Add a new language</Trans>
			</SectionAddItemButton>
		</SectionBase>
	);
}
