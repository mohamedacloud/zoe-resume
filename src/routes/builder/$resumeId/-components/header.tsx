import { useResumeStore } from "@/components/resume/store/resume";
import { useBuilderSidebar } from "../-store/sidebar";
import { BuilderTopTray } from "./top-tray.tsx";

export function BuilderHeader() {
	const name = useResumeStore((state) => state.resume.name);
	const isLocked = useResumeStore((state) => state.resume.isLocked);
	const toggleSidebar = useBuilderSidebar((state) => state.toggleSidebar);

	return (
		<div className="absolute inset-x-0 top-0 z-10 flex h-14 items-center justify-between border-b bg-gray-100 px-3">
			<div className="flex items-center gap-3">
				<Button size="icon" variant="ghost" onClick={() => toggleSidebar("left")}>
					<SidebarSimpleIcon />
				</Button>

				<Button asChild size="sm" variant="ghost" className="font-medium">
					<Link to="/dashboard/resumes" search={{ sort: "lastUpdatedAt", tags: [] }}>
						<Trans>Dashboard</Trans>
					</Link>
				</Button>

				<div className="flex items-center gap-2">
					<img src="/logo/zoe-logo.png" alt="Zoe" className="size-7" />
					<div className="flex flex-col leading-tight">
						<span className="text-sm font-semibold">Zoe</span>
						<span className="text-muted-foreground text-xs">
							<Trans>Powered by Zoe AI</Trans>
						</span>
					</div>
				</div>
				{/* Sidebar toggle button */}
				<button
					onClick={() => toggleSidebar("left")}
					className="ml-4 rounded-lg bg-gray-100 px-3 py-2 font-medium text-gray-700 text-sm shadow-sm transition-all hover:bg-gray-200"
					title="Toggle Sidebar"
					type="button"
				>
					{/* You can use an icon here if desired */}
					{"☰"}
				</button>
			</div>
			<BuilderTopTray />
		</header>
	);
}
