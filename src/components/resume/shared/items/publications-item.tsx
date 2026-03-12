import { useEffect, useRef } from "react";
import type { SectionItem } from "@/schema/resume/data";
import { handleContentEditableLinkClick } from "@/utils/resume/event";
import { stripHtml } from "@/utils/string";
import { cn } from "@/utils/style";
import { useResumeStore } from "../../store/resume";
import { InlineEditableText } from "../inline-editable-text";
import { PageLink } from "../page-link";

type PublicationsItemProps = SectionItem<"publications"> & {
	className?: string;
};

export function PublicationsItem({ className, ...item }: PublicationsItemProps) {
	const updateResumeData = useResumeStore((state) => state.updateResumeData);
	const descriptionRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (descriptionRef.current && descriptionRef.current.innerHTML !== item.description) {
			descriptionRef.current.innerHTML = item.description;
		}
	}, [item.description]);

	const handleTitleChange = (value: string) => {
		updateResumeData((draft) => {
			const sectionItem = draft.sections.publications.items.find((i) => i.id === item.id);
			if (sectionItem) sectionItem.title = value;
		});
	};

	const handleDateChange = (value: string) => {
		updateResumeData((draft) => {
			const sectionItem = draft.sections.publications.items.find((i) => i.id === item.id);
			if (sectionItem) sectionItem.date = value;
		});
	};

	const handlePublisherChange = (value: string) => {
		updateResumeData((draft) => {
			const sectionItem = draft.sections.publications.items.find((i) => i.id === item.id);
			if (sectionItem) sectionItem.publisher = value;
		});
	};

	const handleDescriptionChange = (e: React.FocusEvent<HTMLDivElement>) => {
		const newValue = e.currentTarget.innerHTML || "";
		if (newValue !== item.description) {
			updateResumeData((draft) => {
				const sectionItem = draft.sections.publications.items.find((i) => i.id === item.id);
				if (sectionItem) sectionItem.description = newValue;
			});
		}
	};

	return (
		<div className={cn("publications-item", className)}>
			{/* Header */}
			<div className="section-item-header publications-item-header">
				{/* Row 1 */}
				<div className="flex items-start justify-between gap-x-2">
					<strong className="section-item-title publications-item-title">
						<InlineEditableText value={item.title} placeholder="Publication Title" onChange={handleTitleChange} />
					</strong>
					<span className="section-item-metadata publications-item-date shrink-0 text-end">
						<InlineEditableText value={item.date} placeholder="Date" onChange={handleDateChange} />
					</span>
				</div>

				{/* Row 2 */}
				<div className="flex items-start justify-between gap-x-2">
					<span className="section-item-metadata publications-item-publisher">
						<InlineEditableText value={item.publisher} placeholder="Publisher" onChange={handlePublisherChange} />
					</span>
				</div>
			</div>

			{/* Description */}
			<div
				ref={descriptionRef}
				contentEditable
				suppressContentEditableWarning
				onBlur={handleDescriptionChange}
				onClick={handleContentEditableLinkClick}
				className={cn(
					"section-item-description publications-item-description cursor-text outline-none hover:ring-1 hover:ring-blue-300 focus:ring-2 focus:ring-blue-500",
					!stripHtml(item.description) && "hidden",
				)}
			/>

			{/* Website */}
			{!item.options?.showLinkInTitle && (
				<div className="section-item-website publications-item-website">
					<PageLink {...item.website} label={item.website.label} />
				</div>
			)}
		</div>
	);
}
