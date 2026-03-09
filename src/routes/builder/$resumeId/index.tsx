import { t } from "@lingui/core/macro";
import { FloppyDiskIcon } from "@phosphor-icons/react";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useRef } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { toast } from "sonner";
import { useResizeObserver, useWindowSize } from "usehooks-ts";
import { ResumePreview } from "@/components/resume/preview";
import { useIsMobile } from "@/hooks/use-mobile";
import { BuilderDock } from "./-components/dock";
import { useBuilderSidebarStore } from "./-store/sidebar";

export const Route = createFileRoute("/builder/$resumeId/")({
	component: RouteComponent,
});

// A4 page width at 96dpi
const RESUME_WIDTH = 794;

function RouteComponent() {
	const isLeftSidebarCollapsed = useBuilderSidebarStore((state) => state.isLeftSidebarCollapsed);
	const isMobile = useIsMobile();
	const { width: windowWidth = 0 } = useWindowSize();

	// Compute the active scale factor in JS so we can set the correct wrapper dimensions
	const scale = useMemo(() => {
		if (windowWidth < 1024) return 0.65; // mobile & tablet
		if (isLeftSidebarCollapsed) return 1.5; // large desktop, sidebar hidden
		return 1.0; // large desktop, sidebar visible
	}, [windowWidth, isLeftSidebarCollapsed]);

	const previewRef = useRef<HTMLDivElement>(null);
	const { height: unscaledHeight = 0 } = useResizeObserver({
		ref: previewRef as React.RefObject<HTMLElement>,
	});

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

	// Visual (scaled) dimensions of the resume
	const scaledWidth = RESUME_WIDTH * scale;
	const scaledHeight = unscaledHeight * scale;

	return (
		<div className="relative h-full w-full overflow-y-auto bg-gray-100" style={{ backgroundColor: "#f0f0f0" }}>
			{/* Outer flex container: centres the wrapper horizontally */}
			<div
				className="flex min-h-full flex-col items-start p-2 transition-[padding] duration-300 ease-in-out md:p-6 lg:p-8"
				style={{
					// Only add extra bottom padding when the scale is small and we need dock clearance
					paddingBottom: !isMobile && windowWidth >= 1024 ? "5rem" : "6rem",
				}}
			>
				{/*
				 * Fixed-size wrapper whose width = resume visual width (794 × scale).
				 * Using margin: auto centres it within the available artboard width.
				 * Height is clamped to the visual height to prevent extra scroll from
				 * the unscaled layout height left behind by CSS transforms.
				 */}
				<div
					style={{
						width: scaledWidth,
						height: scaledHeight || undefined,
						margin: isMobile ? undefined : "0 auto",
						overflow: "visible",
					}}
				>
					<ResumePreview
						ref={previewRef}
						showPageNumbers
						className="flex flex-col items-start gap-3 transition-transform duration-300 ease-in-out sm:gap-4 md:gap-6"
						style={{
							transform: `scale(${scale})`,
							transformOrigin: "top left",
							width: RESUME_WIDTH,
						}}
						pageClassName="overflow-hidden rounded-sm shadow-lg sm:rounded-md sm:shadow-xl"
					/>
				</div>
			</div>

			<BuilderDock />
		</div>
	);
}
