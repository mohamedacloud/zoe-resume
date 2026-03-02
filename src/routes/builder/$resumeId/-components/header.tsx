import { SidebarSimpleIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { useBuilderSidebar } from "../-store/sidebar";
import { BuilderTopTray } from "./top-tray.tsx";

export function BuilderHeader() {
	const toggleSidebar = useBuilderSidebar((state) => state.toggleSidebar);

	return (
		<header className="z-10 flex shrink-0 flex-wrap items-center justify-between gap-3 border-gray-200 border-b bg-white px-4 py-3 sm:px-6">
			<div className="flex items-center gap-2 sm:gap-4">
				<Button size="icon" variant="ghost" onClick={() => toggleSidebar("left")}>
					<SidebarSimpleIcon />
				</Button>
			</div>
			<div className="w-full sm:w-auto">
				<BuilderTopTray />
			</div>
		</header>
	);
}
