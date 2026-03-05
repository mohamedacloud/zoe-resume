import { t } from "@lingui/core/macro";
import {
	ArrowUUpLeftIcon,
	ArrowUUpRightIcon,
	type Icon,
} from "@phosphor-icons/react";
import { motion } from "motion/react";
import { useHotkeys } from "react-hotkeys-hook";
import { useTemporalStore } from "@/components/resume/store/resume";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/utils/style";

export function BuilderDock() {
	const { undo, redo, pastStates, futureStates } = useTemporalStore((state) => ({
		undo: state.undo,
		redo: state.redo,
		pastStates: state.pastStates,
		futureStates: state.futureStates,
	}));

	const canUndo = pastStates.length > 1;
	const canRedo = futureStates.length > 0;

	useHotkeys("mod+z", () => undo(), { enabled: canUndo, preventDefault: true });
	useHotkeys(["mod+y", "mod+shift+z"], () => redo(), { enabled: canRedo, preventDefault: true });

	return (
		<div className="fixed inset-x-0 bottom-2 flex items-center justify-center px-2 sm:bottom-4">
			<motion.div
				initial={{ opacity: 0, y: -50 }}
				animate={{ opacity: 0.5, y: 0 }}
				whileHover={{ opacity: 1 }}
				transition={{ duration: 0.2 }}
				className="flex items-center gap-0.5 rounded-full bg-popover px-1.5 shadow-lg sm:gap-1 sm:px-2 sm:shadow-xl"
			>
				<DockIcon disabled={!canUndo} onClick={() => undo()} icon={ArrowUUpLeftIcon} title={t`Undo (Ctrl+Z)`} />
				<DockIcon disabled={!canRedo} onClick={() => redo()} icon={ArrowUUpRightIcon} title={t`Redo (Ctrl+Y)`} />
			</motion.div>
		</div>
	);
}

type DockIconProps = {
	title: string;
	icon: Icon;
	disabled?: boolean;
	onClick: () => void;
	iconClassName?: string;
};

function DockIcon({ icon: Icon, title, disabled, onClick, iconClassName }: DockIconProps) {
	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<Button size="icon" variant="ghost" disabled={disabled} onClick={onClick} className="h-8 w-8 sm:h-10 sm:w-10">
					<Icon className={cn("size-3.5 sm:size-4", iconClassName)} />
				</Button>
			</TooltipTrigger>
			<TooltipContent side="top" align="center" className="font-medium text-xs sm:text-sm">
				{title}
			</TooltipContent>
		</Tooltip>
	);
}
