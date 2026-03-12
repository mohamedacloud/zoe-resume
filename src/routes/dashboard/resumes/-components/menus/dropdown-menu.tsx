import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { CopySimpleIcon, PencilSimpleLineIcon, TrashSimpleIcon } from "@phosphor-icons/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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
import type { RouterOutput } from "@/integrations/orpc/client";
import { api } from "@/utils/api";

type Props = Omit<React.ComponentProps<typeof DropdownMenuContent>, "children"> & {
	resume: RouterOutput["resume"]["list"][number];
	children: React.ReactNode;
};

export function ResumeDropdownMenu({ resume, children, ...props }: Props) {
	const confirm = useConfirm();
	const { openDialog } = useDialogStore();

	const queryClient = useQueryClient();
	const { mutate: deleteResume } = useMutation({
		mutationFn: (id: string) => api.deleteResume(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["resumes"] });
		},
	});

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

		deleteResume(resume.id, {
			onSuccess: () => {
				toast.success(t`Your resume has been deleted successfully.`, { id: toastId });
			},
			onError: (error) => {
				toast.error(error.message, { id: toastId });
			},
		});
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
