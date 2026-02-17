import { useResumeStore } from "@/components/resume/store/resume";
import { useBuilderSidebar } from "../-store/sidebar";
import { BuilderTopTray } from "./top-tray.tsx";

export function BuilderHeader() {
	const name = useResumeStore((state) => state.resume.name);
	const isLocked = useResumeStore((state) => state.resume.isLocked);
	const toggleSidebar = useBuilderSidebar((state) => state.toggleSidebar);

	return (
		<header className="z-10 flex shrink-0 items-center justify-between border-gray-200 border-b bg-white px-6 py-3">
			<div className="flex items-center gap-4">
				<div className="flex items-center gap-3">
					<img src="/src/dialogs/resume/zoe-talking.png" alt="Zoe AI" className="h-10 w-8 rounded-full" />
					<div>
						<h1 className="font-bold text-gray-900 text-lg">Zoe Resume Builder</h1>
						<p className="text-gray-500 text-xs">{name || "Untitled Resume"}</p>
					</div>
				</div>
			</div>
			<BuilderTopTray />
		</header>
	);
}
