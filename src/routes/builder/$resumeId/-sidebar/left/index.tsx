import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { match } from "ts-pattern";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { UserDropdownMenu } from "@/components/user/dropdown-menu";
import { getSectionIcon, getSectionTitle, type LeftSidebarSection, leftSidebarSections } from "@/utils/resume/section";
import { getInitials } from "@/utils/string";
import { BuilderSidebarEdge } from "../../-components/edge";
import { useBuilderSidebar } from "../../-store/sidebar";
import { useResumeStore } from "@/components/resume/store/resume";
import { SortableList } from "@/components/ui/sortable-list";
import { SortableItem } from "@/components/ui/sortable-item";
import { AwardsSectionBuilder } from "./sections/awards";
import { BasicsSectionBuilder } from "./sections/basics";
import { CertificationsSectionBuilder } from "./sections/certifications";
import { CustomSectionBuilder } from "./sections/custom";
import { EducationSectionBuilder } from "./sections/education";
import { ExperienceSectionBuilder } from "./sections/experience";
import { InterestsSectionBuilder } from "./sections/interests";
import { LanguagesSectionBuilder } from "./sections/languages";
import { PictureSectionBuilder } from "./sections/picture";
import { ProfilesSectionBuilder } from "./sections/profiles";
import { ProjectsSectionBuilder } from "./sections/projects";
import { PublicationsSectionBuilder } from "./sections/publications";
import { ReferencesSectionBuilder } from "./sections/references";
import { SkillsSectionBuilder } from "./sections/skills";
import { SummarySectionBuilder } from "./sections/summary";
import { VolunteerSectionBuilder } from "./sections/volunteer";

function getSectionComponent(type: LeftSidebarSection) {
	return match(type)
		.with("picture", () => <PictureSectionBuilder />)
		.with("basics", () => <BasicsSectionBuilder />)
		.with("summary", () => <SummarySectionBuilder />)
		.with("profiles", () => <ProfilesSectionBuilder />)
		.with("experience", () => <ExperienceSectionBuilder />)
		.with("education", () => <EducationSectionBuilder />)
		.with("projects", () => <ProjectsSectionBuilder />)
		.with("skills", () => <SkillsSectionBuilder />)
		.with("languages", () => <LanguagesSectionBuilder />)
		.with("interests", () => <InterestsSectionBuilder />)
		.with("awards", () => <AwardsSectionBuilder />)
		.with("certifications", () => <CertificationsSectionBuilder />)
		.with("publications", () => <PublicationsSectionBuilder />)
		.with("volunteer", () => <VolunteerSectionBuilder />)
		.with("references", () => <ReferencesSectionBuilder />)
		.with("custom", () => <CustomSectionBuilder />)
		.exhaustive();
}

export function BuilderSidebarLeft() {
	const scrollAreaRef = useRef<HTMLDivElement | null>(null);
	const layout = useResumeStore((state) => state.resume.data.metadata.layout);
	const updateResumeData = useResumeStore((state) => state.updateResumeData);

	const orderedSections = useMemo(() => {
		const layoutSections = layout.pages.flatMap((page) => [...page.main, ...page.sidebar]);
		const ordered: LeftSidebarSection[] = [];
		const seen = new Set<string>();

		for (const section of layoutSections) {
			if (!leftSidebarSections.includes(section as LeftSidebarSection)) continue;
			if (seen.has(section)) continue;
			ordered.push(section as LeftSidebarSection);
			seen.add(section);
		}

		for (const section of leftSidebarSections) {
			if (seen.has(section)) continue;
			ordered.push(section);
			seen.add(section);
		}

		return ordered;
	}, [layout.pages]);

	// Separate sections that can be reordered (content sections)
	// from those that cannot (picture and basics are metadata, always in header)
	const reorderableSections = useMemo(
		() => orderedSections.filter((section) => section !== "picture" && section !== "basics"),
		[orderedSections],
	);
	const fixedSections = useMemo(
		() => orderedSections.filter((section) => section === "picture" || section === "basics"),
		[orderedSections],
	);

	const [sectionOrder, setSectionOrder] = useState<LeftSidebarSection[]>(reorderableSections);

	useEffect(() => {
		setSectionOrder(reorderableSections);
	}, [reorderableSections]);

	const handleSectionReorder = (nextOrder: LeftSidebarSection[]) => {
		setSectionOrder(nextOrder);
		updateResumeData((draft) => {
			draft.metadata.layout.pages.forEach((page) => {
				const mainKnown = nextOrder.filter((section) => page.main.includes(section as any));
				const mainUnknown = page.main.filter((section) => !nextOrder.includes(section as any)) as LeftSidebarSection[];
				page.main = [...mainKnown, ...mainUnknown];

				const sidebarKnown = nextOrder.filter((section) => page.sidebar.includes(section as any));
				const sidebarUnknown = page.sidebar.filter((section) => !nextOrder.includes(section as any)) as LeftSidebarSection[];
				page.sidebar = [...sidebarKnown, ...sidebarUnknown];
			});
		});
	};

	return (
		<>
			<SidebarEdge scrollAreaRef={scrollAreaRef} />

			<ScrollArea ref={scrollAreaRef} className="@container h-[calc(100svh-3.5rem)] bg-gray-50 sm:ms-12">
				<div className="space-y-4 p-4">
					{/* Fixed sections (picture and basics) - not draggable, always at top */}
					{fixedSections.map((section) => (
						<Fragment key={section}>
							{getSectionComponent(section)}
							<Separator />
						</Fragment>
					))}

					{/* Reorderable content sections */}
					<SortableList
						items={sectionOrder}
						onReorder={handleSectionReorder}
						keyExtractor={(section) => section}
						className="space-y-4"
						renderItem={(section) => (
							<SortableItem key={section} id={section} asHandle className="space-y-4">
								<Fragment>
									{getSectionComponent(section)}
									<Separator />
								</Fragment>
							</SortableItem>
						)}
					/>
				</div>
			</ScrollArea>
		</>
	);
}

type SidebarEdgeProps = {
	scrollAreaRef: React.RefObject<HTMLDivElement | null>;
};

function SidebarEdge({ scrollAreaRef }: SidebarEdgeProps) {
	const toggleSidebar = useBuilderSidebar((state) => state.toggleSidebar);

	const scrollToSection = useCallback(
		(section: LeftSidebarSection) => {
			if (!scrollAreaRef.current) return;
			toggleSidebar("left", true);

			const sectionElement = scrollAreaRef.current.querySelector(`#sidebar-${section}`);
			sectionElement?.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
		},
		[toggleSidebar, scrollAreaRef],
	);

	return (
		<BuilderSidebarEdge side="left">
			<div />

			<div className="flex flex-col justify-center gap-y-2">
				{leftSidebarSections.map((section) => (
					<Button
						key={section}
						size="icon"
						variant="ghost"
						title={getSectionTitle(section)}
						onClick={() => scrollToSection(section)}
					>
						{getSectionIcon(section)}
					</Button>
				))}
			</div>

			<UserDropdownMenu>
				{({ session }) => (
					<Button size="icon" variant="ghost">
						<Avatar className="size-6">
							<AvatarImage src={session.user.image ?? undefined} />
							<AvatarFallback className="text-[0.5rem]">{getInitials(session.user.name)}</AvatarFallback>
						</Avatar>
					</Button>
				)}
			</UserDropdownMenu>
		</BuilderSidebarEdge>
	);
}
