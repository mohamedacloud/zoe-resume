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
		>
			<div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-blue-50 to-blue-100">
				<div className="flex size-16 items-center justify-center rounded-full bg-blue-600 shadow-lg">
					<DownloadSimpleIcon weight="bold" className="size-8 text-white" />
				</div>
			</div>
		</BaseCard>
	);
}
