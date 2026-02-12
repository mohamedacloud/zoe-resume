import { Fragment, useRef } from "react";
import { match } from "ts-pattern";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
// import { UserDropdownMenu } from "@/components/user/dropdown-menu";
import { type LeftSidebarSection, leftSidebarSections } from "@/utils/resume/section";
// import { getInitials } from "@/utils/string";
// import { BuilderSidebarEdge } from "../../-components/edge";
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

	return (
		<div className="h-full w-full bg-white">
			<ScrollArea ref={scrollAreaRef} className="@container h-full w-full">
				<div className="space-y-4 p-4 text-black **:text-black [&_h2]:text-black [&_h3]:text-black [&_input]:text-black [&_label]:text-black [&_p]:text-black [&_span]:text-black [&_textarea]:text-black">
					{leftSidebarSections.map((section) => (
						<Fragment key={section}>
							{getSectionComponent(section)}
							<Separator />
						</Fragment>
					))}
				</div>
			</ScrollArea>
		</div>
	);
}

// function SidebarEdge() {
// 	return (
// 		<BuilderSidebarEdge side="left">
// 			<div />

// 			<div />

// 			<UserDropdownMenu>
// 				{({ session }) => (
// 					<Button size="icon" variant="ghost">
// 						<Avatar className="size-6">
// 							<AvatarImage src={session.user.image ?? undefined} />
// 							<AvatarFallback className="text-[0.5rem]">{getInitials(session.user.name)}</AvatarFallback>
// 						</Avatar>
// 					</Button>
// 				)}
// 			</UserDropdownMenu>
// 		</BuilderSidebarEdge>
// 	);
// }
