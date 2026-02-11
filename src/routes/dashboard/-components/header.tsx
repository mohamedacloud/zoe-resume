import type { Icon as IconType } from "@phosphor-icons/react";
import { cn } from "@/utils/style";

type Props = {
	title: string;
	icon: IconType;
	className?: string;
};

export function DashboardHeader({ title, icon: IconComponent, className }: Props) {
	return (
		<div className={cn("flex items-center gap-x-2.5", className)}>
			<IconComponent weight="light" className="size-5" />
			<h1 className="font-medium text-xl tracking-tight">{title}</h1>
		</div>
	);
}
