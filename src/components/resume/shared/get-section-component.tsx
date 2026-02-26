import { useContext } from "react";
import { match } from "ts-pattern";
import type {
	CoverLetterItem as CoverLetterItemType,
	CustomSectionItem,
	CustomSectionType,
	SectionItem,
	SectionType,
	SummaryItem as SummaryItemType,
} from "@/schema/resume/data";
import { cn } from "@/utils/style";
import { ResumePageContext } from "../preview/context";
import { useResumeStore } from "../store/resume";
import { InlineEditableText } from "./inline-editable-text";
import { AwardsItem } from "./items/awards-item";
import { CertificationsItem } from "./items/certifications-item";
import { CoverLetterItem } from "./items/cover-letter-item";
import { EducationItem } from "./items/education-item";
import { ExperienceItem } from "./items/experience-item";
import { InterestsItem } from "./items/interests-item";
import { LanguagesItem } from "./items/languages-item";
import { ProfilesItem } from "./items/profiles-item";
import { ProjectsItem } from "./items/projects-item";
import { PublicationsItem } from "./items/publications-item";
import { ReferencesItem } from "./items/references-item";
import { SkillsItem } from "./items/skills-item";
import { SummaryItem } from "./items/summary-item";
import { VolunteerItem } from "./items/volunteer-item";
import { PageSection } from "./page-section";
import { PageSummary } from "./page-summary";

export type SectionComponentProps = {
	id: string;
	sectionClassName?: string;
	itemClassName?: string;
	visibleItemIds?: string[];
};

// Helper to render item component based on type
function renderItemByType(type: CustomSectionType, item: CustomSectionItem, itemClassName?: string) {
	return match(type)
		.with("summary", () => <SummaryItem {...(item as SummaryItemType)} className={itemClassName} />)
		.with("profiles", () => <ProfilesItem {...(item as SectionItem<"profiles">)} className={itemClassName} />)
		.with("experience", () => <ExperienceItem {...(item as SectionItem<"experience">)} className={itemClassName} />)
		.with("education", () => <EducationItem {...(item as SectionItem<"education">)} className={itemClassName} />)
		.with("projects", () => <ProjectsItem {...(item as SectionItem<"projects">)} className={itemClassName} />)
		.with("skills", () => <SkillsItem {...(item as SectionItem<"skills">)} className={itemClassName} />)
		.with("languages", () => <LanguagesItem {...(item as SectionItem<"languages">)} className={itemClassName} />)
		.with("interests", () => <InterestsItem {...(item as SectionItem<"interests">)} className={itemClassName} />)
		.with("awards", () => <AwardsItem {...(item as SectionItem<"awards">)} className={itemClassName} />)
		.with("certifications", () => (
			<CertificationsItem {...(item as SectionItem<"certifications">)} className={itemClassName} />
		))
		.with("publications", () => (
			<PublicationsItem {...(item as SectionItem<"publications">)} className={itemClassName} />
		))
		.with("volunteer", () => <VolunteerItem {...(item as SectionItem<"volunteer">)} className={itemClassName} />)
		.with("references", () => <ReferencesItem {...(item as SectionItem<"references">)} className={itemClassName} />)
		.with("cover-letter", () => <CoverLetterItem {...(item as CoverLetterItemType)} className={itemClassName} />)
		.exhaustive();
}

// --- Stable Section Components ---

export const SummarySection = ({ sectionClassName }: SectionComponentProps) => (
	<PageSummary className={sectionClassName} />
);

export const ProfilesSection = ({ id, sectionClassName, itemClassName, visibleItemIds }: SectionComponentProps) => (
	<PageSection type="profiles" className={sectionClassName} visibleItemIds={visibleItemIds}>
		{(item) => <ProfilesItem {...item} className={itemClassName} />}
	</PageSection>
);

export const ExperienceSection = ({ id, sectionClassName, itemClassName, visibleItemIds }: SectionComponentProps) => (
	<PageSection type="experience" className={sectionClassName} visibleItemIds={visibleItemIds}>
		{(item) => <ExperienceItem {...item} className={itemClassName} />}
	</PageSection>
);

export const EducationSection = ({ id, sectionClassName, itemClassName, visibleItemIds }: SectionComponentProps) => (
	<PageSection type="education" className={sectionClassName} visibleItemIds={visibleItemIds}>
		{(item) => <EducationItem {...item} className={itemClassName} />}
	</PageSection>
);

export const ProjectsSection = ({ id, sectionClassName, itemClassName, visibleItemIds }: SectionComponentProps) => (
	<PageSection type="projects" className={sectionClassName} visibleItemIds={visibleItemIds}>
		{(item) => <ProjectsItem {...item} className={itemClassName} />}
	</PageSection>
);

export const SkillsSection = ({ id, sectionClassName, itemClassName, visibleItemIds }: SectionComponentProps) => (
	<PageSection type="skills" className={sectionClassName} visibleItemIds={visibleItemIds}>
		{(item) => <SkillsItem {...item} className={itemClassName} />}
	</PageSection>
);

export const LanguagesSection = ({ id, sectionClassName, itemClassName, visibleItemIds }: SectionComponentProps) => (
	<PageSection type="languages" className={sectionClassName} visibleItemIds={visibleItemIds}>
		{(item) => <LanguagesItem {...item} className={itemClassName} />}
	</PageSection>
);

export const InterestsSection = ({ id, sectionClassName, itemClassName, visibleItemIds }: SectionComponentProps) => (
	<PageSection type="interests" className={sectionClassName} visibleItemIds={visibleItemIds}>
		{(item) => <InterestsItem {...item} className={itemClassName} />}
	</PageSection>
);

export const AwardsSection = ({ id, sectionClassName, itemClassName, visibleItemIds }: SectionComponentProps) => (
	<PageSection type="awards" className={sectionClassName} visibleItemIds={visibleItemIds}>
		{(item) => <AwardsItem {...item} className={itemClassName} />}
	</PageSection>
);

export const CertificationsSection = ({
	id,
	sectionClassName,
	itemClassName,
	visibleItemIds,
}: SectionComponentProps) => (
	<PageSection type="certifications" className={sectionClassName} visibleItemIds={visibleItemIds}>
		{(item) => <CertificationsItem {...item} className={itemClassName} />}
	</PageSection>
);

export const PublicationsSection = ({ id, sectionClassName, itemClassName, visibleItemIds }: SectionComponentProps) => (
	<PageSection type="publications" className={sectionClassName} visibleItemIds={visibleItemIds}>
		{(item) => <PublicationsItem {...item} className={itemClassName} />}
	</PageSection>
);

export const VolunteerSection = ({ id, sectionClassName, itemClassName, visibleItemIds }: SectionComponentProps) => (
	<PageSection type="volunteer" className={sectionClassName} visibleItemIds={visibleItemIds}>
		{(item) => <VolunteerItem {...item} className={itemClassName} />}
	</PageSection>
);

export const ReferencesSection = ({ id, sectionClassName, itemClassName, visibleItemIds }: SectionComponentProps) => (
	<PageSection type="references" className={sectionClassName} visibleItemIds={visibleItemIds}>
		{(item) => <ReferencesItem {...item} className={itemClassName} />}
	</PageSection>
);

export const CustomSectionComponent = ({
	id,
	sectionClassName,
	itemClassName,
	visibleItemIds,
}: SectionComponentProps) => {
	const updateResumeData = useResumeStore((state) => state.updateResumeData);
	const customSection = useResumeStore((state) => state.resume.data.customSections.find((s) => s.id === id));

	if (!customSection) return null;
	if (customSection.hidden) return null;
	if (customSection.items.length === 0) return null;

	const visibleItems = customSection.items.filter((item) => {
		if (item.hidden) return false;
		if (visibleItemIds && !visibleItemIds.includes(item.id)) return false;
		return true;
	});

	if (visibleItems.length === 0) return null;

	return (
		<section className={cn(`page-section page-section-custom page-section-${id}`, sectionClassName)}>
			{customSection.type !== "summary" && customSection.type !== "cover-letter" && (
				<h6 className="mb-1.5 text-(--page-primary-color)">
					<InlineEditableText
						value={customSection.title}
						placeholder="Section Title"
						onChange={(value) => {
							updateResumeData((draft) => {
								const section = draft.customSections.find((s) => s.id === id);
								if (section) section.title = value;
							});
						}}
					/>
				</h6>
			)}

			<div
				className="section-content grid gap-x-(--page-gap-x) gap-y-(--page-gap-y)"
				style={{ gridTemplateColumns: `repeat(${customSection.columns}, 1fr)` }}
			>
				{visibleItems.map((item) => (
					<div key={item.id} className={cn(`section-item section-item-${customSection.type} print:break-inside-avoid`)}>
						{renderItemByType(customSection.type, item, itemClassName)}
					</div>
				))}
			</div>
		</section>
	);
};

export const Section = ({
	type,
	id,
	sectionClassName,
	itemClassName,
	visibleItemIds: explicitVisibleItemIds,
}: SectionComponentProps & { type: "summary" | SectionType | (string & {}) }) => {
	const Component = getSectionComponent(type);
	const { pageIndex, itemDistribution } = useContext(ResumePageContext);
	const visibleItemIds = explicitVisibleItemIds || (itemDistribution ? itemDistribution[id]?.[pageIndex] : undefined);

	return (
		<Component
			id={id}
			sectionClassName={sectionClassName}
			itemClassName={itemClassName}
			visibleItemIds={visibleItemIds}
		/>
	);
};

export function getSectionComponent(section: "summary" | SectionType | (string & {})) {
	return match(section)
		.with("summary", () => SummarySection)
		.with("profiles", () => ProfilesSection)
		.with("experience", () => ExperienceSection)
		.with("education", () => EducationSection)
		.with("projects", () => ProjectsSection)
		.with("skills", () => SkillsSection)
		.with("languages", () => LanguagesSection)
		.with("interests", () => InterestsSection)
		.with("awards", () => AwardsSection)
		.with("certifications", () => CertificationsSection)
		.with("publications", () => PublicationsSection)
		.with("volunteer", () => VolunteerSection)
		.with("references", () => ReferencesSection)
		.otherwise(() => CustomSectionComponent);
}
