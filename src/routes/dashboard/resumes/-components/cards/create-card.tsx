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
			className="border-2 border-gray-400 border-dashed bg-transparent shadow-none hover:border-gray-600"
		>
			<div className="absolute inset-0 flex flex-col items-center justify-center">
				<PlusIcon weight="bold" className="mb-2 size-10 text-gray-500" />
				<span className="font-medium text-base text-gray-500">Create Resume</span>
			</div>
		</BaseCard>
	);
}
