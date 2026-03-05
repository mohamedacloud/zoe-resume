import { t } from "@lingui/core/macro";
import { FloppyDiskIcon } from "@phosphor-icons/react";
import { createFileRoute } from "@tanstack/react-router";
import { useHotkeys } from "react-hotkeys-hook";
import { toast } from "sonner";
import { ResumePreview } from "@/components/resume/preview";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/utils/style";
import { BuilderDock } from "./-components/dock";
import { useBuilderSidebarStore } from "./-store/sidebar";

export const Route = createFileRoute("/builder/$resumeId/")({
	component: RouteComponent,
});

function RouteComponent() {
	const isLeftSidebarCollapsed = useBuilderSidebarStore((state) => state.isLeftSidebarCollapsed);
	const isMobile = useIsMobile();

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
		<div className="relative h-full w-full overflow-y-auto bg-gray-100" style={{ backgroundColor: "#f0f0f0" }}>
			{/* Fixed Resume Preview with Scroll */}
			<div
				className={cn(
					"flex min-h-full items-start justify-start p-2 transition-[padding] duration-300 ease-in-out md:p-6 lg:p-8 xl:justify-center",
					isLeftSidebarCollapsed ? "pt-4 pb-[60vh] sm:pt-8 md:pt-12" : "pb-8",
				)}
			>
				<ResumePreview
					showPageNumbers
					className={cn(
						"flex origin-top-left flex-col items-start gap-3 transition-transform duration-300 ease-in-out sm:gap-4 md:gap-6 xl:origin-top xl:items-center",
						// Mobile (< 768px): always scale to 0.65
						// Desktop (>= 768px): scale based on sidebar state
						"scale-[0.65]",
						!isMobile && isLeftSidebarCollapsed && "md:scale-150",
						!isMobile && !isLeftSidebarCollapsed && "md:scale-100",
					)}
					pageClassName="overflow-hidden rounded-sm shadow-lg sm:rounded-md sm:shadow-xl"
				/>
			</div>

			<BuilderDock />
		</div>
	);
}
