import {
	DotsSixVerticalIcon,
} from "@phosphor-icons/react";
import { SortableItem } from "@/components/ui/sortable-item";
import { useDialogStore } from "@/dialogs/store";
import type {
	CustomSectionItem,
	CustomSectionType,
	SectionItem as SectionItemType,
} from "@/schema/resume/data";
import { cn } from "@/utils/style";

type Props<T extends CustomSectionItem | SectionItemType> = {
	type: CustomSectionType;
	item: T;
	title: string;
	subtitle?: string;
	customSectionId?: string;
};

export function SortableSectionItem<T extends CustomSectionItem | SectionItemType>({
	type,
	item,
	title,
	subtitle,
	customSectionId,
}: Props<T>) {
	const { openDialog } = useDialogStore();

	const onUpdate = () => {
		openDialog(`resume.sections.${type}.update`, { item, customSectionId } as never);
	};

	return (
		<SortableItem id={item.id} asHandle className="group relative border-b last:border-b-0">
			<div className="flex h-18 items-center bg-white">
				<div className="flex shrink-0 items-center px-3 text-gray-400 opacity-40 transition-opacity group-hover:opacity-100">
					<DotsSixVerticalIcon size={20} />
				</div>

				<button
					onClick={onUpdate}
					className={cn(
						"flex flex-1 flex-col items-start justify-center space-y-0.5 ps-1 text-start opacity-100 transition-opacity hover:bg-secondary/40 focus:outline-none focus-visible:ring-1",
						item.hidden && "opacity-50",
					)}
					type="button"
				>
					<div className="line-clamp-1 font-medium">{title}</div>
					{subtitle && <div className="line-clamp-1 text-muted-foreground text-xs">{subtitle}</div>}
				</button>
			</div>
		</SortableItem>
	);
}
