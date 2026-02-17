import { t } from "@lingui/core/macro";
import { DownloadSimpleIcon } from "@phosphor-icons/react";
import { useDialogStore } from "@/dialogs/store";
import { BaseCard } from "./base-card";

export function ImportResumeCard() {
	const { openDialog } = useDialogStore();

	return (
		<BaseCard
			title={t`Import an existing resume`}
			description={t`Continue where you left off`}
			onClick={() => openDialog("resume.import", undefined)}
			className="border-2 border-gray-400 border-dashed bg-transparent shadow-none hover:border-gray-600"
		>
			<div className="absolute inset-0 flex flex-col items-center justify-center">
				<DownloadSimpleIcon weight="bold" className="mb-2 size-10 text-gray-500" />
				<span className="font-medium text-base text-gray-500">Import Resume</span>
			</div>
		</BaseCard>
	);
}
