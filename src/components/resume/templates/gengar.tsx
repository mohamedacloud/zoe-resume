import { cn } from "@/utils/style";
import { Section } from "../shared/get-section-component";
import { InlineEditableText } from "../shared/inline-editable-text";
import { PageIcon } from "../shared/page-icon";
import { PageLink } from "../shared/page-link";
import { PagePicture } from "../shared/page-picture";

import { useResumeStore } from "../store/resume";
import type { TemplateProps } from "./types";

const sectionClassName = cn(
	// Section Heading
	"[&>h6]:border-(--page-primary-color) [&>h6]:border-b",

	// Section Item Header in Sidebar Layout
	"group-data-[layout=sidebar]:[&_.section-item-header>div]:flex-col",
	"group-data-[layout=sidebar]:[&_.section-item-header>div]:items-start",
);

/**
 * Template: Gengar
 */
export function GengarTemplate({ pageIndex, pageLayout }: TemplateProps) {
	const isFirstPage = pageIndex === 0;
	const { main, sidebar, fullWidth } = pageLayout;

	return (
		<div className="template-gengar page-content">
			{/* Sidebar Background */}
			{(!fullWidth || isFirstPage) && (
				<div className="page-sidebar-background pointer-events-none absolute inset-y-0 z-0 w-(--page-sidebar-width) shrink-0 bg-(--page-primary-color)/20 ltr:start-0 rtl:end-0" />
			)}

			<div className="flex">
				{(!fullWidth || isFirstPage) && (
					<aside
						data-layout="sidebar"
						className="group page-sidebar z-10 flex w-(--page-sidebar-width) shrink-0 flex-col"
					>
						{isFirstPage && <Header />}

						{!fullWidth && (
							<div className="shrink-0 space-y-4 overflow-x-hidden px-(--page-margin-x) pt-(--page-margin-y)">
								{sidebar.map((section) => (
									<Section key={section} type={section} id={section} sectionClassName={sectionClassName} />
								))}
							</div>
						)}
					</aside>
				)}

				<main data-layout="main" className="group page-main z-10">
					<div className="space-y-4 px-(--page-margin-x) pt-(--page-margin-y)">
						{main.map((section) => (
							<Section key={section} type={section} id={section} sectionClassName={sectionClassName} />
						))}
					</div>
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
		<div className="page-header relative flex">
			<div
				data-section-id="header"
				className="flex w-full shrink-0 flex-col justify-center gap-y-2 bg-(--page-primary-color) px-(--page-margin-x) py-(--page-margin-y) text-(--page-background-color)"
			>
				<PagePicture />

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

				<div
					className="basics-items flex flex-col gap-y-1 *:flex *:items-center *:gap-x-1.5"
					style={{ "--page-primary-color": "var(--page-background-color)" } as React.CSSProperties}
				>
					<div className="basics-item-email">
						<PageIcon icon="envelope" />
						<InlineEditableText
							as="a"
							href={basics.email ? `mailto:${basics.email}` : undefined}
							value={basics.email}
							placeholder="email@domain.com"
							onChange={handleEmailChange}
						/>
					</div>

					<div className="basics-item-phone">
						<PageIcon icon="phone" />
						<InlineEditableText
							as="a"
							href={basics.phone ? `tel:${basics.phone}` : undefined}
							value={basics.phone}
							placeholder="+91 98765 43210"
							onChange={handlePhoneChange}
						/>
					</div>

					<div className="basics-item-location">
						<PageIcon icon="map-pin" />
						<InlineEditableText value={basics.location} placeholder="City, Country" onChange={handleLocationChange} />
					</div>

					{basics.website.url && (
						<div className="basics-item-website">
							<PageIcon icon="globe" />
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
