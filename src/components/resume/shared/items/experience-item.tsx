import { useEffect, useRef } from "react";
import type z from "zod";
import { useResumeStore } from "@/components/resume/store/resume";
import type { experienceItemSchema } from "@/schema/resume/data";
import { stripHtml } from "@/utils/string";
import { cn } from "@/utils/style";
import { PageLink } from "../page-link";

type ExperienceItemProps = z.infer<typeof experienceItemSchema> & {
	className?: string;
};

export function ExperienceItem({ className, ...item }: ExperienceItemProps) {
	const updateResumeData = useResumeStore((state) => state.updateResumeData);
	const descriptionRef = useRef<HTMLDivElement>(null);

	// Update description content when item.description changes
	useEffect(() => {
		if (descriptionRef.current && descriptionRef.current.innerHTML !== item.description) {
			descriptionRef.current.innerHTML = item.description;
		}
	}, [item.description]);

	const handleCompanyChange = (e: React.FocusEvent<HTMLSpanElement>) => {
		const newValue = e.currentTarget.textContent || "";
		if (newValue !== item.company) {
			updateResumeData((draft) => {
				const exp = draft.sections.experience.items.find((exp) => exp.id === item.id);
				if (exp) exp.company = newValue;
			});
		}
	};

	const handlePositionChange = (e: React.FocusEvent<HTMLSpanElement>) => {
		const newValue = e.currentTarget.textContent || "";
		if (newValue !== item.position) {
			updateResumeData((draft) => {
				const exp = draft.sections.experience.items.find((exp) => exp.id === item.id);
				if (exp) exp.position = newValue;
			});
		}
	};

	const handleLocationChange = (e: React.FocusEvent<HTMLSpanElement>) => {
		const newValue = e.currentTarget.textContent || "";
		if (newValue !== item.location) {
			updateResumeData((draft) => {
				const exp = draft.sections.experience.items.find((exp) => exp.id === item.id);
				if (exp) exp.location = newValue;
			});
		}
	};

	return (
		<div className={cn("experience-item group/item", className)}>
			{/* Header */}
			<div className="section-item-header experience-item-header">
				{/* Row 1 */}
				<div className="flex items-start justify-between gap-x-2">
					<span
						contentEditable
						suppressContentEditableWarning
						onBlur={handleCompanyChange}
						className="section-item-title experience-item-title cursor-text outline-none hover:ring-1 hover:ring-blue-300 focus:ring-2 focus:ring-blue-500"
					>
						{item.company}
					</span>
					<span
						contentEditable
						suppressContentEditableWarning
						onBlur={handleLocationChange}
						className="section-item-metadata experience-item-location shrink-0 cursor-text text-end outline-none hover:ring-1 hover:ring-blue-300 focus:ring-2 focus:ring-blue-500"
					>
						{item.location}
					</span>
				</div>

				{/* Row 2 */}
				<div className="flex items-start justify-between gap-x-2">
					<span
						contentEditable
						suppressContentEditableWarning
						onBlur={handlePositionChange}
						className="section-item-metadata experience-item-position cursor-text outline-none hover:ring-1 hover:ring-blue-300 focus:ring-2 focus:ring-blue-500"
					>
						{item.position}
					</span>
					<span className="section-item-metadata experience-item-period shrink-0 text-end">
						{item.startDate}
						{item.startDate && " - "}
						{item.currentlyWorkingHere ? "Present" : item.endDate}
					</span>
				</div>
			</div>

			{/* Description */}
			<div className={cn("section-item-description", !stripHtml(item.description) && "hidden")}>
				{item.description
					.split(/<ul>|<\/ul>/)
					.filter((line) => line.trim() !== "")
					.map((line, index) => (
						<ul key={index} className="list-disc pl-5">
							{line
								.split(/<li>|<\/li>/)
								.filter((item) => item.trim() !== "")
								.map((item, idx) => (
									<li key={idx}>{item}</li>
								))}
						</ul>
					))}
			</div>
			{/* Website */}
			{item.website?.label && (
				<div className="section-item-website experience-item-website">
					<PageLink {...item.website} label={item.website.label} />
				</div>
			)}
		</div>
	);
}
