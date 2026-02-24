import { EnvelopeIcon, GlobeIcon, MapPinIcon, PhoneIcon } from "@phosphor-icons/react";
import { useEffect, useRef } from "react";
import { stripHtml } from "@/utils/string";
import { cn } from "@/utils/style";
import { getSectionComponent } from "../shared/get-section-component";
import { InlineEditableText } from "../shared/inline-editable-text";
import { PageIcon } from "../shared/page-icon";
import { PageLink } from "../shared/page-link";
import { PagePicture } from "../shared/page-picture";

import { useResumeStore } from "../store/resume";
import type { TemplateProps } from "./types";

const sectionClassName = cn(
	// Section Heading
	"[&>h6]:border-(--page-primary-color) [&>h6]:border-b",
);

/**
 * Template: Leafish
 */
export function LeafishTemplate({ pageIndex, pageLayout }: TemplateProps) {
	const isFirstPage = pageIndex === 0;
	const { main, sidebar, fullWidth } = pageLayout;

	return (
		<div className="template-leafish page-content">
			{isFirstPage && <Header />}

			<div className="flex gap-x-(--page-margin-x) px-(--page-margin-x) pt-(--page-margin-y)">
				<main data-layout="main" className="group page-main space-y-(--page-gap-y)">
					{main
						.filter((section) => section !== "summary")
						.map((section) => {
							const Component = getSectionComponent(section, { sectionClassName });
							return <Component key={section} id={section} />;
						})}
				</main>

				{!fullWidth && (
					<aside
						data-layout="sidebar"
						className="group page-sidebar w-(--page-sidebar-width) shrink-0 space-y-(--page-gap-y)"
					>
						{sidebar
							.filter((section) => section !== "summary")
							.map((section) => {
								const Component = getSectionComponent(section, { sectionClassName });
								return <Component key={section} id={section} />;
							})}
					</aside>
				)}
			</div>
		</div>
	);
}

function Header() {
	const basics = useResumeStore((state) => state.resume.data.basics);
	const summary = useResumeStore((state) => state.resume.data.summary);
	const updateResumeData = useResumeStore((state) => state.updateResumeData);

	const contentRef = useRef<HTMLDivElement>(null);

	// Update content when summary.content changes
	useEffect(() => {
		if (contentRef.current && contentRef.current.innerHTML !== summary.content) {
			contentRef.current.innerHTML = summary.content;
		}
	}, [summary.content]);

	const handleContentChange = (e: React.FocusEvent<HTMLDivElement>) => {
		const newValue = e.currentTarget.innerHTML || "";
		if (newValue !== summary.content) {
			updateResumeData((draft) => {
				draft.summary.content = newValue;
			});
		}
	};

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
		<div data-section-id="header" className="page-header bg-(--page-primary-color)/10">
			<div className="flex items-center gap-x-(--page-margin-x) px-(--page-margin-x) py-(--page-margin-y)">
				<PagePicture />

				<div className="space-y-(--page-gap-y)">
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

					{!summary.hidden && !!stripHtml(summary.content) && (
						<div
							ref={contentRef}
							contentEditable
							suppressContentEditableWarning
							onBlur={handleContentChange}
							className="basics-summary cursor-text text-sm outline-none hover:ring-1 hover:ring-blue-300 focus:ring-2 focus:ring-blue-500"
						/>
					)}
				</div>
			</div>

			<div className="page-basics bg-(--page-primary-color)/10 px-(--page-margin-x) py-(--page-margin-y)">
				<div className="basics-items flex flex-wrap gap-x-4 gap-y-1 *:flex *:items-center *:gap-x-1.5">
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
