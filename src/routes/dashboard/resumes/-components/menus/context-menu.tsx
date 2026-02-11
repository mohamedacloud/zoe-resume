import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import {
	CopySimpleIcon,
	FolderOpenIcon,
	LockSimpleIcon,
	LockSimpleOpenIcon,
	PencilSimpleLineIcon,
	TrashSimpleIcon,
} from "@phosphor-icons/react";
import { useMutation } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuSeparator,
	ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useDialogStore } from "@/dialogs/store";
import { useConfirm } from "@/hooks/use-confirm";
import { orpc, type RouterOutput } from "@/integrations/orpc/client";

type Props = {
	resume: RouterOutput["resume"]["list"][number];
	children: React.ReactNode;
};

export function ResumeContextMenu({ resume, children }: Props) {
	const confirm = useConfirm();
	const { openDialog } = useDialogStore();

	const { mutate: deleteResume } = useMutation(orpc.resume.delete.mutationOptions());
	const { mutate: setLockedResume } = useMutation(orpc.resume.setLocked.mutationOptions());

	const handleUpdate = () => {
		openDialog("resume.update", resume);
	};

	const handleDuplicate = () => {
		openDialog("resume.duplicate", resume);
	};

	const handleToggleLock = async () => {
		if (!resume.isLocked) {
			const confirmation = await confirm(t`Are you sure you want to lock this resume?`, {
				description: t`When locked, the resume cannot be updated or deleted.`,
			});

			if (!confirmation) return;
		}

		setLockedResume(
			{ id: resume.id, isLocked: !resume.isLocked },
			{
				onError: (error) => {
					toast.error(error.message);
				},
			},
		);
	};

	const handleDelete = async () => {
		const confirmation = await confirm(t`Are you sure you want to delete this resume?`, {
			description: t`This action cannot be undone.`,
		});

		if (!confirmation) return;

		const toastId = toast.loading(t`Deleting your resume...`);

		deleteResume(
			{ id: resume.id },
			{
				onSuccess: () => {
					toast.success(t`Your resume has been deleted successfully.`, { id: toastId });
				},
				onError: (error) => {
					toast.error(error.message, { id: toastId });
				},
			},
		);
	};

	return (
		<ContextMenu>
			<ContextMenuTrigger asChild>{children}</ContextMenuTrigger>

			<ContextMenuContent className="min-w-50 rounded-lg border-gray-200 bg-white p-1.5 shadow-lg">
				<ContextMenuItem
					asChild
					className="rounded-md px-3 py-2.5 text-gray-900 hover:bg-emerald-50 hover:text-emerald-700 focus:bg-emerald-50 focus:text-emerald-700"
				>
					<Link to="/builder/$resumeId" params={{ resumeId: resume.id }} className="flex items-center gap-3">
						<FolderOpenIcon className="size-4" />
						<span className="font-medium">
							<Trans>Open</Trans>
						</span>
					</Link>
				</ContextMenuItem>

				<ContextMenuSeparator className="my-1.5 bg-gray-100" />

				<ContextMenuItem
					disabled={resume.isLocked}
					onSelect={handleUpdate}
					className="flex items-center gap-3 rounded-md px-3 py-2.5 text-gray-900 hover:bg-emerald-50 hover:text-emerald-700 focus:bg-emerald-50 focus:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
				>
					<PencilSimpleLineIcon className="size-4" />
					<span className="font-medium">
						<Trans>Update</Trans>
					</span>
				</ContextMenuItem>

				<ContextMenuItem
					onSelect={handleDuplicate}
					className="flex items-center gap-3 rounded-md px-3 py-2.5 text-gray-900 hover:bg-emerald-50 hover:text-emerald-700 focus:bg-emerald-50 focus:text-emerald-700"
				>
					<CopySimpleIcon className="size-4" />
					<span className="font-medium">
						<Trans>Duplicate</Trans>
					</span>
				</ContextMenuItem>

				<ContextMenuItem
					onSelect={handleToggleLock}
					className="flex items-center gap-3 rounded-md px-3 py-2.5 text-gray-900 hover:bg-amber-50 hover:text-amber-700 focus:bg-amber-50 focus:text-amber-700"
				>
					{resume.isLocked ? <LockSimpleOpenIcon className="size-4" /> : <LockSimpleIcon className="size-4" />}
					<span className="font-medium">{resume.isLocked ? <Trans>Unlock</Trans> : <Trans>Lock</Trans>}</span>
				</ContextMenuItem>

				<ContextMenuSeparator className="my-1.5 bg-gray-100" />

				<ContextMenuItem
					variant="destructive"
					disabled={resume.isLocked}
					onSelect={handleDelete}
					className="flex items-center gap-3 rounded-md px-3 py-2.5 text-red-600 hover:bg-red-50 hover:text-red-700 focus:bg-red-50 focus:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
				>
					<TrashSimpleIcon className="size-4" />
					<span className="font-medium">
						<Trans>Delete</Trans>
					</span>
				</ContextMenuItem>
			</ContextMenuContent>
		</ContextMenu>
	);
}
