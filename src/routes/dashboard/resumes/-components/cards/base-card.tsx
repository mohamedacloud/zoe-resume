import { CometCard } from "@/components/animation/comet-card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/utils/style";

type BaseCardProps = React.ComponentProps<"div"> & {
	title: string;
	description: string;
	tags?: string[];
	className?: string;
	children?: React.ReactNode;
};

export function BaseCard({ title, description, tags, className, children, ...props }: BaseCardProps) {
	return (
		<CometCard translateDepth={3} rotateDepth={6}>
			<div
				{...props}
				className={cn(
					"group relative flex aspect-page size-full cursor-pointer overflow-hidden rounded-xl border-2 border-gray-200 bg-white shadow-sm transition-all hover:border-emerald-300 hover:shadow-xl",
					className,
				)}
			>
				{children}

				<div className="absolute inset-x-0 bottom-0 w-full border-gray-200 border-t bg-linear-to-t from-white via-white to-transparent p-4">
					<h3 className="mb-1.5 truncate font-semibold text-gray-900 text-lg">{title}</h3>
					<p className="truncate text-gray-600 text-sm">{description}</p>

					<div className={cn("mt-3 hidden flex-wrap items-center gap-1.5", tags && tags.length > 0 && "flex")}>
						{tags?.map((tag) => (
							<Badge
								key={tag}
								variant="secondary"
								className="rounded-md bg-emerald-50 px-2 py-0.5 text-emerald-700 text-xs"
							>
								{tag}
							</Badge>
						))}
					</div>
				</div>
			</div>
		</CometCard>
	);
}
