import { Trans } from "@lingui/react/macro";
import {
	CopySimpleIcon,
	DotsSixVerticalIcon,
	DotsThreeVerticalIcon,
	EyeClosedIcon,
	EyeIcon,
	PencilSimpleLineIcon,
	TrashSimpleIcon,
} from "@phosphor-icons/react";
import { useResumeStore } from "@/components/resume/store/resume";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SortableItem } from "@/components/ui/sortable-item";
import { useDialogStore } from "@/dialogs/store";
import { useConfirm } from "@/hooks/use-confirm";
import type {
	CustomSectionItem,
	CustomSectionType,
	SectionItem as SectionItemType,
	SectionType,
} from "@/schema/resume/data";
import { cn } from "@/utils/style";
import { MoveItemSubmenu } from "./section-item";

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
	const confirm = useConfirm();
	const { openDialog } = useDialogStore();
	const updateResumeData = useResumeStore((state) => state.updateResumeData);

	const onToggleVisibility = () => {
		updateResumeData((draft) => {
			if (customSectionId) {
				const section = draft.customSections.find((s) => s.id === customSectionId);
				if (!section) return;
				const index = section.items.findIndex((_item) => _item.id === item.id);
				if (index === -1) return;
				section.items[index].hidden = !section.items[index].hidden;
			} else {
				// Type assertion: when customSectionId is not provided, type is always a built-in SectionType
				const section = draft.sections[type as SectionType];
				if (!("items" in section)) return;
				const index = section.items.findIndex((_item) => _item.id === item.id);
				if (index === -1) return;
				section.items[index].hidden = !section.items[index].hidden;
			}
		});
	};

	const onUpdate = () => {
		openDialog(`resume.sections.${type}.update`, { item, customSectionId } as never);
	};

	const onDuplicate = () => {
		openDialog(`resume.sections.${type}.create`, { item, customSectionId } as never);
	};

	const onDelete = async () => {
		const confirmed = await confirm("Are you sure you want to delete this item?", {
			confirmText: "Delete",
			cancelText: "Cancel",
		});

		if (!confirmed) return;

		updateResumeData((draft) => {
			if (customSectionId) {
				const section = draft.customSections.find((s) => s.id === customSectionId);
				if (!section) return;
				const index = section.items.findIndex((_item) => _item.id === item.id);
				if (index === -1) return;
				section.items.splice(index, 1);
			} else {
				// Type assertion: when customSectionId is not provided, type is always a built-in SectionType
				const section = draft.sections[type as SectionType];
				if (!("items" in section)) return;
				const index = section.items.findIndex((_item) => _item.id === item.id);
				if (index === -1) return;
				section.items.splice(index, 1);
			}
		});
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

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<button className="flex h-full cursor-context-menu items-center px-3 opacity-40 transition-opacity hover:bg-secondary/40 focus:outline-none focus-visible:ring-1 group-hover:opacity-100">
							<DotsThreeVerticalIcon size={20} />
						</button>
					</DropdownMenuTrigger>

					<DropdownMenuContent align="end">
						<DropdownMenuGroup>
							<DropdownMenuItem onSelect={onToggleVisibility}>
								{item.hidden ? <EyeIcon /> : <EyeClosedIcon />}
								{item.hidden ? <Trans>Show</Trans> : <Trans>Hide</Trans>}
							</DropdownMenuItem>
						</DropdownMenuGroup>

						<DropdownMenuSeparator />

						<DropdownMenuGroup>
							<DropdownMenuItem onSelect={onUpdate}>
								<PencilSimpleLineIcon />
								<Trans>Update</Trans>
							</DropdownMenuItem>

							<DropdownMenuItem onSelect={onDuplicate}>
								<CopySimpleIcon />
								<Trans>Duplicate</Trans>
							</DropdownMenuItem>

							<MoveItemSubmenu type={type} item={item} customSectionId={customSectionId} />
						</DropdownMenuGroup>

						<DropdownMenuSeparator />

						<DropdownMenuGroup>
							<DropdownMenuItem variant="destructive" onSelect={onDelete}>
								<TrashSimpleIcon />
								<Trans>Delete</Trans>
							</DropdownMenuItem>
						</DropdownMenuGroup>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</SortableItem>
	);
}
