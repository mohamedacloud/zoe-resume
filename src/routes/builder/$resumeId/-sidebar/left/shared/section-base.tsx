import { CaretRightIcon } from "@phosphor-icons/react";
import { useResumeStore } from "@/components/resume/store/resume";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { DragHandle } from "@/components/ui/sortable-item";
import type { SectionType } from "@/schema/resume/data";
import { getSectionIcon, getSectionTitle, type LeftSidebarSection } from "@/utils/resume/section";
import { cn } from "@/utils/style";
import { useSectionStore } from "../../../-store/section";
import { SectionDropdownMenu } from "./section-menu";

type Props = React.ComponentProps<typeof AccordionContent> & {
	type: LeftSidebarSection;
};

export function SectionBase({ type, className, ...props }: Props) {
	const section = useResumeStore((state) => {
		if (type === "basics") return state.resume.data.basics;
		if (type === "summary") return state.resume.data.summary;
		if (type === "picture") return state.resume.data.picture;
		if (type === "custom") return state.resume.data.customSections;
		return state.resume.data.sections[type];
	});

	const isHidden = "hidden" in section && section.hidden;
	const collapsed = useSectionStore((state) => state.sections[type]?.collapsed ?? false);
	const toggleCollapsed = useSectionStore((state) => state.toggleCollapsed);

	return (
		<Accordion
			collapsible
			type="single"
			id={`sidebar-${type}`}
			value={collapsed ? "" : type}
			onValueChange={() => toggleCollapsed(type)}
			className={cn("space-y-3 sm:space-y-4", isHidden && "opacity-50")}
		>
			<AccordionItem value={type} className="group/accordion space-y-3 sm:space-y-4">
				<div className="flex items-center gap-1 lg:gap-2">
					<DragHandle className="mr-1 lg:mr-2" />

					<AccordionTrigger asChild className="me-1 items-center justify-center lg:me-2">
						<Button size="icon" variant="ghost" className="h-8 w-8 lg:h-10 lg:w-10">
							<CaretRightIcon className="h-4 w-4 transition-transform group-data-[state=open]/accordion:rotate-90 lg:h-5 lg:w-5" />
						</Button>
					</AccordionTrigger>

					<div className="flex flex-1 items-center gap-x-1.5 lg:gap-x-4">
						{getSectionIcon(type)}
						<h2 className="line-clamp-1 font-bold text-base tracking-tight lg:text-xl xl:text-2xl">
							{("title" in section && section.title) || getSectionTitle(type)}
						</h2>
					</div>

					{!["picture", "basics", "custom"].includes(type) && (
						<SectionDropdownMenu type={type as "summary" | SectionType} />
					)}
				</div>

				<AccordionContent
					className={cn(
						"overflow-hidden pb-0 data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
						className,
					)}
					{...props}
				/>
			</AccordionItem>
		</Accordion>
	);
}
