import { Trans } from "@lingui/react/macro";
import { LockSimpleIcon, SidebarSimpleIcon } from "@phosphor-icons/react";
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
		<div className="absolute inset-x-0 top-0 z-10 flex h-14 items-center justify-between border-b bg-gray-100 dark:bg-gray-900 px-3">
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
			</div>

			<div className="flex items-center gap-x-1">
				<Button asChild size="icon" variant="ghost">
					<Link to="/dashboard/resumes" search={{ sort: "lastUpdatedAt", tags: [] }}>
						<img src="/logo/zoe-logo.png" alt="Zoe" className="size-4" />
					</Link>
				</Button>
				<span className="me-2.5 text-muted-foreground">/</span>
				<h2 className="flex-1 truncate font-medium">{name}</h2>
				{isLocked && <LockSimpleIcon className="ms-2 text-muted-foreground" />}
			</div>

			<BuilderTopTray />
		</div>
	);
}
