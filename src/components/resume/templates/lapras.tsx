import { EnvelopeIcon, GlobeIcon, MapPinIcon, PhoneIcon } from "@phosphor-icons/react";
import { useMemo } from "react";
import { cn } from "@/utils/style";
import { Section } from "../shared/get-section-component";
import { InlineEditableText } from "../shared/inline-editable-text";
import { PageIcon } from "../shared/page-icon";
import { PageLink } from "../shared/page-link";
import { PagePicture } from "../shared/page-picture";
import { useResumeStore } from "../store/resume";
import type { TemplateProps } from "./types";

const sectionClassName = cn(
	// Container
	"rounded-(--container-border-radius) border border-(--page-text-color)/10 bg-(--page-background-color) p-4",

	// Section Heading
	"[&>h6]:-mt-(--heading-negative-margin) [&>h6]:max-w-fit [&>h6]:bg-(--page-background-color) [&>h6]:px-4",
);

/**
 * Template: Lapras
 */
export function LaprasTemplate({ pageIndex, pageLayout }: TemplateProps) {
	const isFirstPage = pageIndex === 0;
	const { main, sidebar, fullWidth } = pageLayout;

	const containerBorderRadius = useResumeStore((state) => Math.min(state.resume.data.picture.borderRadius, 30));
	const headingNegativeMargin = useResumeStore((state) => state.resume.data.metadata.typography.heading.fontSize + 6);

	const style = useMemo(() => {
		return {
			"--container-border-radius": `${containerBorderRadius}pt`,
			"--heading-negative-margin": `${headingNegativeMargin}pt`,
		} as React.CSSProperties;
	}, [containerBorderRadius, headingNegativeMargin]);

	return (
		<div
			style={style}
			className="template-lapras page-content space-y-6 px-(--page-margin-x) pt-(--page-margin-y) print:p-0"
		>
			{isFirstPage && <Header />}

			<main data-layout="main" className="group page-main space-y-6">
				{main.map((section) => (
					<Section key={section} type={section} id={section} sectionClassName={sectionClassName} />
				))}
			</main>

			{!fullWidth && (
				<aside data-layout="sidebar" className="group page-sidebar space-y-6">
					{sidebar.map((section) => (
						<Section key={section} type={section} id={section} sectionClassName={sectionClassName} />
					))}
				</aside>
			)}
		</div>
	);
}

function Header() {
	const basics = useResumeStore((state) => state.resume.data.basics);
	const updateResumeData = useResumeStore((state) => state.updateResumeData);

	const handleEmailChange = (value: string) => {
		updateResumeData((draft) => {
			draft.basics.email = value;
		});
	};

	const handlePhoneChange = (value: string) => {
		updateResumeData((draft) => {
			draft.basics.phone = value;
		});
	};

	const handleLocationChange = (value: string) => {
		updateResumeData((draft) => {
			draft.basics.location = value;
		});
	};

	const handleNameChange = (value: string) => {
		updateResumeData((draft) => {
			draft.basics.name = value;
		});
	};

	const handleHeadlineChange = (value: string) => {
		updateResumeData((draft) => {
			draft.basics.headline = value;
		});
	};

	return (
		<div
			data-section-id="header"
			className={cn(
				"page-header flex items-center gap-x-(--page-gap-x)",
				"rounded-(--picture-border-radius) border border-(--page-text-color)/10 bg-(--page-background-color) p-4",
			)}
		>
			<PagePicture />

			<div className="page-basics space-y-(--page-gap-y)">
				<div>
					<h2 className="basics-name">
						<InlineEditableText value={basics.name} placeholder="Your Name" onChange={handleNameChange} />
					</h2>
					<p className="basics-headline">
						<InlineEditableText
							value={basics.headline}
							placeholder="Your Professional Title"
							onChange={handleHeadlineChange}
						/>
					</p>
				</div>

				<div className="basics-items flex flex-wrap gap-x-2 gap-y-0.5 *:flex *:items-center *:gap-x-1.5 *:border-(--page-primary-color) *:border-e *:py-0.5 *:pe-2 *:last:border-e-0">
					<div className="basics-item-email">
						<EnvelopeIcon />
						<InlineEditableText
							as="a"
							href={basics.email ? `mailto:${basics.email}` : undefined}
							value={basics.email}
							placeholder="email@domain.com"
							onChange={handleEmailChange}
						/>
					</div>

					<div className="basics-item-phone">
						<PhoneIcon />
						<InlineEditableText
							as="a"
							href={basics.phone ? `tel:${basics.phone}` : undefined}
							value={basics.phone}
							placeholder="+91 98765 43210"
							onChange={handlePhoneChange}
						/>
					</div>

					<div className="basics-item-location">
						<MapPinIcon />
						<InlineEditableText value={basics.location} placeholder="City, Country" onChange={handleLocationChange} />
					</div>

					{basics.website.url && (
						<div className="basics-item-website">
							<GlobeIcon />
							<PageLink {...basics.website} />
						</div>
					)}

					{basics.customFields.map((field) => (
						<div key={field.id} className="basics-item-custom">
							<PageIcon icon={field.icon} />
							{field.link ? <PageLink url={field.link} label={field.text} /> : <span>{field.text}</span>}
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
