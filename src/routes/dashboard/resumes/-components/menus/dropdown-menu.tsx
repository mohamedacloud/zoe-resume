import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import {
	CopySimpleIcon,
	PencilSimpleLineIcon,
	TrashSimpleIcon,
} from "@phosphor-icons/react";
import { useMutation } from "@tanstack/react-query";

import { toast } from "sonner";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDialogStore } from "@/dialogs/store";
import { useConfirm } from "@/hooks/use-confirm";
import { orpc, type RouterOutput } from "@/integrations/orpc/client";

type Props = Omit<React.ComponentProps<typeof DropdownMenuContent>, "children"> & {
	resume: RouterOutput["resume"]["list"][number];
	children: React.ReactNode;
};

export function ResumeDropdownMenu({ resume, children, ...props }: Props) {
	const confirm = useConfirm();
	const { openDialog } = useDialogStore();

	const { mutate: deleteResume } = useMutation(orpc.resume.delete.mutationOptions());

	const handleUpdate = () => {
		openDialog("resume.update", resume);
	};

	const handleDuplicate = () => {
		openDialog("resume.duplicate", resume);
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
		<DropdownMenu>
			<DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>

			<DropdownMenuContent {...props}>

				   <DropdownMenuSeparator />

				<DropdownMenuItem disabled={resume.isLocked} onSelect={handleUpdate}>
					<PencilSimpleLineIcon />
					<Trans>Update</Trans>
				</DropdownMenuItem>

				<DropdownMenuItem onSelect={handleDuplicate}>
					<CopySimpleIcon />
					<Trans>Duplicate</Trans>
				</DropdownMenuItem>


				   <DropdownMenuSeparator />

				<DropdownMenuItem variant="destructive" disabled={resume.isLocked} onSelect={handleDelete}>
					<TrashSimpleIcon />
					<Trans>Delete</Trans>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
