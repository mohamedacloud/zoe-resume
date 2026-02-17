import { Trans } from "@lingui/react/macro";
import { SidebarSimpleIcon } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import { useResumeStore } from "@/components/resume/store/resume";
import { Button } from "@/components/ui/button";
import { useBuilderSidebar } from "../-store/sidebar";
import { BuilderTopTray } from "./top-tray.tsx";

export function BuilderHeader() {
	const name = useResumeStore((state) => state.resume.name);
	const isLocked = useResumeStore((state) => state.resume.isLocked);
	const toggleSidebar = useBuilderSidebar((state) => state.toggleSidebar);

	return (
		<header className="absolute inset-x-0 top-0 z-10 flex h-14 items-center justify-between border-b bg-gray-100 px-3">
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
						<span className="font-semibold text-sm">Zoe</span>
						<span className="text-muted-foreground text-xs">
							<Trans>Powered by Zoe AI</Trans>
						</span>
					</div>
				</div>
				
			</div>
			<BuilderTopTray />
		</header>
	);
}
