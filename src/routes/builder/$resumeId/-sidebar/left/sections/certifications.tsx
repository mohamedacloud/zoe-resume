import { Trans } from "@lingui/react/macro";
import type z from "zod";
import { useResumeStore } from "@/components/resume/store/resume";
import { SortableList } from "@/components/ui/sortable-list";
import type { certificationItemSchema } from "@/schema/resume/data";
import { cn } from "@/utils/style";
import { SectionBase } from "../shared/section-base";
import { SectionAddItemButton } from "../shared/section-item";
import { SortableSectionItem } from "../shared/sortable-section-item";

export function CertificationsSectionBuilder() {
	const section = useResumeStore((state) => state.resume.data.sections.certifications);
	const updateResumeData = useResumeStore((state) => state.updateResumeData);

	const handleReorder = (items: z.infer<typeof certificationItemSchema>[]) => {
		updateResumeData((draft) => {
			draft.sections.certifications.items = items;
		});
	};

	return (
		<SectionBase
			type="certifications"
			className={cn("rounded-md border", section.items.length === 0 && "border-dashed")}
		>
			<SortableList
				items={section.items}
				onReorder={handleReorder}
				keyExtractor={(item) => item.id}
				renderItem={(item) => (
					<SortableSectionItem
						key={item.id}
						type="certifications"
						item={item}
						title={item.title}
						subtitle={[item.issuer, item.date].filter(Boolean).join(" • ") || undefined}
					/>
				)}
			/>

			<SectionAddItemButton type="certifications">
				<Trans>Add a new certification</Trans>
			</SectionAddItemButton>
		</SectionBase>
	);
}
