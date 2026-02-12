import { EnvelopeIcon, GlobeIcon, MapPinIcon, PhoneIcon } from "@phosphor-icons/react";
import { cn } from "@/utils/style";
import { getSectionComponent } from "../shared/get-section-component";
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
						{sidebar.map((section) => {
							const Component = getSectionComponent(section, { sectionClassName });
							return <Component key={section} id={section} />;
						})}
					</aside>
				)}

				<main data-layout="main" className="group page-main space-y-4 px-(--page-margin-x)">
					{main.map((section) => {
						const Component = getSectionComponent(section, { sectionClassName });
						return <Component key={section} id={section} />;
					})}
				</main>
			</div>
		</div>
	);
}

function Header() {
	const basics = useResumeStore((state) => state.resume.data.basics);
	const updateResumeData = useResumeStore((state) => state.updateResumeData);

	const handleNameChange = (e: React.FocusEvent<HTMLHeadingElement>) => {
		const newValue = e.currentTarget.textContent || "";
		if (newValue !== basics.name) {
			updateResumeData((draft) => {
				draft.basics.name = newValue;
			});
		}
	};

	const handleHeadlineChange = (e: React.FocusEvent<HTMLParagraphElement>) => {
		const newValue = e.currentTarget.textContent || "";
		if (newValue !== basics.headline) {
			updateResumeData((draft) => {
				draft.basics.headline = newValue;
			});
		}
	};

	const handleEmailChange = (e: React.FocusEvent<HTMLSpanElement>) => {
		const newValue = e.currentTarget.textContent || "";
		if (newValue !== basics.email) {
			updateResumeData((draft) => {
				draft.basics.email = newValue;
			});
		}
	};

	const handlePhoneChange = (e: React.FocusEvent<HTMLSpanElement>) => {
		const newValue = e.currentTarget.textContent || "";
		if (newValue !== basics.phone) {
			updateResumeData((draft) => {
				draft.basics.phone = newValue;
			});
		}
	};

	const handleLocationChange = (e: React.FocusEvent<HTMLSpanElement>) => {
		const newValue = e.currentTarget.textContent || "";
		if (newValue !== basics.location) {
			updateResumeData((draft) => {
				draft.basics.location = newValue;
			});
		}
	};

	return (
		<div className="page-header relative">
			<div className="page-basics bg-(--page-primary-color) text-(--page-background-color)">
				<div className="basics-header flex items-center">
					<div className="flex w-(--page-sidebar-width) shrink-0 justify-center ps-(--page-margin-x)">
						<PagePicture className="absolute top-8" />
					</div>

					<div className="px-(--page-margin-x) py-(--page-margin-y)">
						<h2 
							className="basics-name cursor-text outline-none hover:ring-1 hover:ring-blue-300 focus:ring-2 focus:ring-blue-500"
							contentEditable
							suppressContentEditableWarning
							onBlur={handleNameChange}
						>
							{basics.name}
						</h2>
						<p 
							className="basics-headline cursor-text outline-none hover:ring-1 hover:ring-blue-300 focus:ring-2 focus:ring-blue-500"
							contentEditable
							suppressContentEditableWarning
							onBlur={handleHeadlineChange}
						>
							{basics.headline}
						</p>
					</div>
				</div>
			</div>

			<div className="flex items-center">
				<div className="w-(--page-sidebar-width) shrink-0" />

				<div className="basics-items flex flex-wrap gap-x-3 gap-y-1 px-(--page-margin-x) pt-3 *:flex *:items-center *:gap-x-1.5">
					{basics.email && (
						<div className="basics-item-email">
							<EnvelopeIcon />
							<span
								contentEditable
								suppressContentEditableWarning
								onBlur={handleEmailChange}
								className="cursor-text outline-none hover:ring-1 hover:ring-blue-300 focus:ring-2 focus:ring-blue-500"
							>
								{basics.email}
							</span>
						</div>
					)}

					{basics.phone && (
						<div className="basics-item-phone">
							<PhoneIcon />
							<span
								contentEditable
								suppressContentEditableWarning
								onBlur={handlePhoneChange}
								className="cursor-text outline-none hover:ring-1 hover:ring-blue-300 focus:ring-2 focus:ring-blue-500"
							>
								{basics.phone}
							</span>
						</div>
					)}

					{basics.location && (
						<div className="basics-item-location">
							<MapPinIcon />
							<span
								contentEditable
								suppressContentEditableWarning
								onBlur={handleLocationChange}
								className="cursor-text outline-none hover:ring-1 hover:ring-blue-300 focus:ring-2 focus:ring-blue-500"
							>
								{basics.location}
							</span>
						</div>
					)}

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
