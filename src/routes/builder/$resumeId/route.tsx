import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getCookie, setCookie } from "@tanstack/react-start/server";
import type React from "react";
import { useEffect } from "react";
import { type Layout, usePanelRef } from "react-resizable-panels";
import { useDebounceCallback, useWindowSize } from "usehooks-ts";
import z from "zod";
import { LoadingScreen } from "@/components/layout/loading-screen";
import { useCSSVariables } from "@/components/resume/hooks/use-css-variables";
import { useResumeStore } from "@/components/resume/store/resume";
import { ResizableGroup, ResizablePanel, ResizableSeparator } from "@/components/ui/resizable";
import { useIsMobile } from "@/hooks/use-mobile";
import { orpc } from "@/integrations/orpc/client";
import { BuilderHeader } from "./-components/header";
import { BuilderSidebarLeft } from "./-sidebar/left";
import { useBuilderSidebar, useBuilderSidebarStore } from "./-store/sidebar";

export const Route = createFileRoute("/builder/$resumeId")({
	component: RouteComponent,
	beforeLoad: async ({ context }) => {
		// Check guest mode only on client side (localStorage is not available on server)
		if (typeof window !== "undefined") {
			const isGuestMode = localStorage.getItem("guestMode") === "true";
			// If not in guest mode and no session, set guest mode and allow access
			if (!context.session && !isGuestMode) {
				localStorage.setItem("guestMode", "true");
			}
		}
		// Always allow access - guest mode is enabled by default
		return { session: context.session };
	},
	loader: async ({ params, context }) => {
		const [layout, resume] = await Promise.all([
			getBuilderLayoutServerFn(),
			context.queryClient.ensureQueryData(orpc.resume.getById.queryOptions({ input: { id: params.resumeId } })),
		]);

		return { layout, name: resume.name };
	},
	head: ({ loaderData }) => ({
		meta: loaderData ? [{ title: `${loaderData.name} - Zoe Resume Builder` }] : undefined,
	}),
});

function RouteComponent() {
	const { layout: initialLayout } = Route.useLoaderData();

	const { resumeId } = Route.useParams();
	const { data: resume } = useSuspenseQuery(orpc.resume.getById.queryOptions({ input: { id: resumeId } }));

	const style = useCSSVariables(resume.data);
	const isReady = useResumeStore((state) => state.isReady);
	const initialize = useResumeStore((state) => state.initialize);

	useEffect(() => {
		initialize(resume);
		return () => initialize(null);
	}, [resume, initialize]);

	if (!isReady) return <LoadingScreen />;

	return <BuilderLayout style={style} initialLayout={initialLayout} />;
}

type BuilderLayoutProps = React.ComponentProps<"div"> & {
	initialLayout: Layout;
};

function BuilderLayout({ initialLayout, ...props }: BuilderLayoutProps) {
	const isMobile = useIsMobile();

	const leftSidebarRef = usePanelRef();

	const setLeftSidebar = useBuilderSidebarStore((state) => state.setLeftSidebar);
	const isLeftSidebarCollapsed = useBuilderSidebarStore((state) => state.isLeftSidebarCollapsed);
	const setLeftSidebarCollapsed = useBuilderSidebarStore((state) => state.setLeftSidebarCollapsed);

	// ✅ Get review drawer state to hide left sidebar when drawer is open
	const showReviewDrawer = useResumeStore((state) => state.showReviewDrawer);

	const { maxSidebarSize } = useBuilderSidebar((state) => ({
		maxSidebarSize: state.maxSidebarSize,
	}));

	const onLayoutChange = useDebounceCallback((layout: Layout) => {
		setBuilderLayoutServerFn({ data: layout });
	}, 200);

	useEffect(() => {
		if (!leftSidebarRef?.current) return;

		setLeftSidebar(leftSidebarRef);
		setLeftSidebarCollapsed(leftSidebarRef.current.isCollapsed());
	}, [leftSidebarRef, setLeftSidebar, setLeftSidebarCollapsed]);

	const { width: windowWidth } = useWindowSize();
	const isTablet = !!(!isMobile && windowWidth && windowWidth >= 768 && windowWidth < 1024);

	// Force sidebar expansion to at least 42% on tablet detection
	useEffect(() => {
		if (isTablet && leftSidebarRef.current && leftSidebarRef.current.getSize() < 42) {
			leftSidebarRef.current.resize(42);
		}
	}, [isTablet, leftSidebarRef]);

	const leftSidebarSize = isTablet ? Math.max(initialLayout.left || 0, 42) : initialLayout.left || 30;
	const artboardSize = initialLayout.artboard || 100 - leftSidebarSize;

	// On mobile, ensure sidebar is collapsed by default on initial load
	useEffect(() => {
		if (isMobile) {
			setLeftSidebarCollapsed(true);
		}
	}, [isMobile, setLeftSidebarCollapsed]);

	if (isMobile) {
		return (
			<div className="flex h-svh flex-col" {...props}>
				<BuilderHeader />

				{/* Mobile Layout - Main content always visible */}
				<div className="relative flex-1 overflow-hidden">
					<div className="h-full overflow-auto">
						<Outlet />
					</div>

					{/* Left Sidebar Drawer - only visible when toggled AND review drawer is closed */}
					{!isLeftSidebarCollapsed && !showReviewDrawer && (
						<>
							{/* Backdrop */}
							<div
								className="fixed inset-0 top-14 z-40 bg-black/50 transition-opacity"
								onClick={() => setLeftSidebarCollapsed(true)}
								onKeyDown={(e) => e.key === "Escape" && setLeftSidebarCollapsed(true)}
								role="button"
								tabIndex={0}
								aria-label="Close sidebar"
							/>
							{/* Drawer with slide animation */}
							<div className="fixed inset-y-0 top-14 left-0 z-50 w-[85vw] max-w-sm transform bg-white shadow-xl transition-transform duration-300 ease-in-out">
								<BuilderSidebarLeft />
							</div>
						</>
					)}
				</div>
			</div>
		);
	}

	return (
		<div className="flex h-svh flex-col" {...props}>
			<BuilderHeader />

			<ResizableGroup orientation="horizontal" className="flex-1" onLayoutChange={onLayoutChange}>
				{/* ✅ Only show left sidebar panel if review drawer is NOT open */}
				{!showReviewDrawer && (
					<>
						<ResizablePanel
							collapsible
							id="left"
							panelRef={leftSidebarRef}
							maxSize={maxSidebarSize}
							minSize={0}
							collapsedSize={0}
							defaultSize={leftSidebarSize}
							onCollapse={() => setLeftSidebarCollapsed(true)}
							onExpand={() => setLeftSidebarCollapsed(false)}
							className="z-20 h-[calc(100svh-3.5rem)]"
						>
							<BuilderSidebarLeft />
						</ResizablePanel>
						<ResizableSeparator withHandle className="z-20 border-s" />
					</>
				)}
				<ResizablePanel id="artboard" defaultSize={artboardSize} className="h-[calc(100svh-3.5rem)]">
					<Outlet />
				</ResizablePanel>
			</ResizableGroup>
		</div>
	);
}

const defaultLayout = { left: 30, artboard: 70 };
const BUILDER_LAYOUT_COOKIE_NAME = "builder_layout";

const layoutSchema = z.record(z.string(), z.number()).catch(defaultLayout);

const setBuilderLayoutServerFn = createServerFn({ method: "POST" })
	.inputValidator(layoutSchema)
	.handler(async ({ data }) => {
		setCookie(BUILDER_LAYOUT_COOKIE_NAME, JSON.stringify(data));
	});

const getBuilderLayoutServerFn = createServerFn({ method: "GET" }).handler(async () => {
	const layout = getCookie(BUILDER_LAYOUT_COOKIE_NAME);
	if (!layout) return defaultLayout;
	return layoutSchema.parse(JSON.parse(layout));
});
