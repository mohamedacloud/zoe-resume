import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { useResumeStore } from "@/components/resume/store/resume";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { SortableItem } from "@/components/ui/sortable-item";
import { SortableList } from "@/components/ui/sortable-list";
import { type LeftSidebarSection, leftSidebarSections } from "@/utils/resume/section";
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
	switch (type) {
		case "picture":
			return <PictureSectionBuilder />;
		case "basics":
			return <BasicsSectionBuilder />;
		case "profiles":
			return <ProfilesSectionBuilder />;
		case "summary":
			return <SummarySectionBuilder />;
		case "experience":
			return <ExperienceSectionBuilder />;
		case "education":
			return <EducationSectionBuilder />;
		case "projects":
			return <ProjectsSectionBuilder />;
		case "skills":
			return <SkillsSectionBuilder />;
		case "languages":
			return <LanguagesSectionBuilder />;
		case "interests":
			return <InterestsSectionBuilder />;
		case "awards":
			return <AwardsSectionBuilder />;
		case "certifications":
			return <CertificationsSectionBuilder />;
		case "publications":
			return <PublicationsSectionBuilder />;
		case "volunteer":
			return <VolunteerSectionBuilder />;
		case "references":
			return <ReferencesSectionBuilder />;
		case "custom":
			return <CustomSectionBuilder />;
		default: {
			// Ensure compile-time exhaustiveness; if a new case is added to LeftSidebarSection,
			// TypeScript will report an error here.
			return null;
		}
	}
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
				const sidebarUnknown = page.sidebar.filter(
					(section) => !nextOrder.includes(section as any),
				) as LeftSidebarSection[];
				page.sidebar = [...sidebarKnown, ...sidebarUnknown];
			});
		});
	};

	return (
		<ScrollArea ref={scrollAreaRef} className="@container h-[calc(100svh-3.5rem)] bg-gray-50">
			<div className="space-y-3 p-3 sm:space-y-4 sm:p-4">
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
					className="space-y-3 sm:space-y-4"
					renderItem={(section) => (
						<SortableItem key={section} id={section} className="space-y-3 sm:space-y-4">
							{getSectionComponent(section)}
							<Separator />
						</SortableItem>
					)}
				/>
			</div>
		</ScrollArea>
	);
}
