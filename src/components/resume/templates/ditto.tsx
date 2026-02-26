import { EnvelopeIcon, GlobeIcon, MapPinIcon, PhoneIcon } from "@phosphor-icons/react";
import { cn } from "@/utils/style";
import { Section } from "../shared/get-section-component";
import { InlineEditableText } from "../shared/inline-editable-text";
import { PageIcon } from "../shared/page-icon";
import { PageLink } from "../shared/page-link";
import { PagePicture } from "../shared/page-picture";
import { useResumeStore } from "../store/resume";
import type { TemplateProps } from "./types";

const sectionClassName = cn(
	// Section Item Header in Sidebar Layout
	"group-data-[layout=sidebar]:[&_.section-item-header>div]:flex-col",
	"group-data-[layout=sidebar]:[&_.section-item-header>div]:items-start",
);

/**
 * Template: Ditto
 */
export function DittoTemplate({ pageIndex, pageLayout }: TemplateProps) {
	const isFirstPage = pageIndex === 0;
	const { main, sidebar, fullWidth } = pageLayout;

	return (
		<div className="template-ditto page-content">
			{isFirstPage && <Header />}

			<div className="flex pt-(--page-margin-y)">
				{!fullWidth && (
					<aside
						data-layout="sidebar"
						className="group page-sidebar w-(--page-sidebar-width) shrink-0 space-y-4 overflow-x-hidden ps-(--page-margin-x)"
					>
						{sidebar.map((section) => (
							<Section key={section} type={section} id={section} sectionClassName={sectionClassName} />
						))}
					</aside>
				)}

				<main data-layout="main" className="group page-main space-y-4 px-(--page-margin-x)">
					{main.map((section) => (
						<Section key={section} type={section} id={section} sectionClassName={sectionClassName} />
					))}
				</main>
			</div>
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
		<div className="page-header relative">
			<div className="page-basics bg-(--page-primary-color) text-(--page-background-color)">
				<div data-section-id="header" className="basics-header flex items-center">
					<div className="flex w-(--page-sidebar-width) shrink-0 justify-center ps-(--page-margin-x)">
						<PagePicture className="absolute top-8" />
					</div>

					<div className="px-(--page-margin-x) py-(--page-margin-y)">
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
				</div>
			</div>

			<div className="flex items-center">
				<div className="w-(--page-sidebar-width) shrink-0" />

				<div className="basics-items flex flex-wrap gap-x-3 gap-y-1 px-(--page-margin-x) pt-3 *:flex *:items-center *:gap-x-1.5">
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
