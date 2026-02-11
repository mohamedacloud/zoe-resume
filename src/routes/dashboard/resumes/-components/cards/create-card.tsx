import { t } from "@lingui/core/macro";
import { PlusIcon } from "@phosphor-icons/react";
import { useDialogStore } from "@/dialogs/store";
import { BaseCard } from "./base-card";

export function CreateResumeCard() {
	const { openDialog } = useDialogStore();

	return (
		<BaseCard
			title={t`Create a new resume`}
			description={t`Start building your resume from scratch`}
			onClick={() => openDialog("resume.create", undefined)}
		>
			<div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-emerald-50 to-emerald-100">
				<div className="flex size-16 items-center justify-center rounded-full bg-emerald-600 shadow-lg">
					<PlusIcon weight="bold" className="size-8 text-white" />
				</div>
			</div>
		</BaseCard>
	);
}
