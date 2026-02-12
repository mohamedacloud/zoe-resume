import { t } from "@lingui/core/macro";
import { FloppyDiskIcon } from "@phosphor-icons/react";
import { createFileRoute } from "@tanstack/react-router";
import { useHotkeys } from "react-hotkeys-hook";
import { toast } from "sonner";
import { ResumePreview } from "@/components/resume/preview";
import { BuilderDock } from "./-components/dock";

export const Route = createFileRoute("/builder/$resumeId/")({
	component: RouteComponent,
});

function RouteComponent() {
	useHotkeys(
		["ctrl+s", "meta+s"],
		() => {
			toast.info(t`Your changes are saved automatically.`, {
				id: "auto-save",
				icon: <FloppyDiskIcon />,
			});
		},
		{ preventDefault: true, enableOnFormTags: true },
	);

	return (
		<div className="relative h-full w-full overflow-y-auto bg-gray-100" style={{backgroundColor: "#f0f0f0"}}>
			{/* Fixed Resume Preview with Scroll */}
			<div className="flex min-h-full items-start justify-center p-8">
				<ResumePreview
					showPageNumbers
					className="flex flex-col items-center gap-6"
					pageClassName="shadow-xl rounded-md overflow-hidden"
				/>
			</div>

			<BuilderDock />
		</div>
	);
}
