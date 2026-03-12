import { useEffect, useRef } from "react";
import type { SectionItem } from "@/schema/resume/data";
import { handleContentEditableLinkClick } from "@/utils/resume/event";
import { stripHtml } from "@/utils/string";
import { cn } from "@/utils/style";
import { useResumeStore } from "../../store/resume";
import { InlineEditableText } from "../inline-editable-text";
import { PageLink } from "../page-link";

type ReferencesItemProps = SectionItem<"references"> & {
	className?: string;
};

export function ReferencesItem({ className, ...item }: ReferencesItemProps) {
	const updateResumeData = useResumeStore((state) => state.updateResumeData);
	const descriptionRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (descriptionRef.current && descriptionRef.current.innerHTML !== item.description) {
			descriptionRef.current.innerHTML = item.description;
		}
	}, [item.description]);

	const handleNameChange = (value: string) => {
		updateResumeData((draft) => {
			const sectionItem = draft.sections.references.items.find((i) => i.id === item.id);
			if (sectionItem) sectionItem.name = value;
		});
	};

	const handlePositionChange = (value: string) => {
		updateResumeData((draft) => {
			const sectionItem = draft.sections.references.items.find((i) => i.id === item.id);
			if (sectionItem) sectionItem.position = value;
		});
	};

	const handleDescriptionChange = (e: React.FocusEvent<HTMLDivElement>) => {
		const newValue = e.currentTarget.innerHTML || "";
		if (newValue !== item.description) {
			updateResumeData((draft) => {
				const sectionItem = draft.sections.references.items.find((i) => i.id === item.id);
				if (sectionItem) sectionItem.description = newValue;
			});
		}
	};

	return (
		<div className={cn("references-item", className)}>
			{/* Header */}
			<div className="section-item-header references-item-header">
				{/* Row 1 */}
				<div className="flex items-start justify-between gap-x-2">
					<strong className="section-item-title references-item-name">
						<InlineEditableText value={item.name} placeholder="Name" onChange={handleNameChange} />
					</strong>
				</div>

				{/* Row 2 */}
				<div className="flex items-start justify-between gap-x-2">
					<span className="section-item-metadata references-item-position">
						<InlineEditableText value={item.position} placeholder="Position" onChange={handlePositionChange} />
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
					"section-item-description references-item-description cursor-text outline-none hover:ring-1 hover:ring-blue-300 focus:ring-2 focus:ring-blue-500",
					!stripHtml(item.description) && "hidden",
				)}
			/>

			{/* Footer */}
			<div className="section-item-footer references-item-footer flex flex-col">
				{/* Row 1 */}
				<span className="section-item-metadata references-item-phone inline-block">{item.phone}</span>

				{/* Row 2 */}
				{!item.options?.showLinkInTitle && (
					<PageLink
						{...item.website}
						label={item.website.label}
						className="section-item-website references-item-website"
					/>
				)}
			</div>
		</div>
	);
}
