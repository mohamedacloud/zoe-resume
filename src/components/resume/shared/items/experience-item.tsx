import { useEffect, useRef } from "react";
import type z from "zod";
import { useResumeStore } from "@/components/resume/store/resume";
import type { experienceItemSchema } from "@/schema/resume/data";
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

	// Function to check if text contains HTML list markup
	const containsListMarkup = (text: string) => {
		return text.includes("<ul>") || text.includes("<li>") || text.includes("</ul>") || text.includes("</li>");
	};

	// Function to render description based on content
	// Function to render description based on content
	const renderDescription = () => {
		if (!item.description) return null;

		const text = item.description;

		// Case 1: Check if it contains HTML list markup
		if (text.includes("<ul>") || text.includes("<ol>") || text.includes("<li>")) {
			// Render as HTML lists
			const listContent = text
				.replace(/\n\s*<ul>/g, "<ul>")
				.replace(/<\/ul>\s*\n/g, "</ul>")
				.split(/<ul>|<\/ul>/)
				.filter((line) => line.trim() !== "")
				.map((line, index) => (
					<ul key={index} className="list-disc pl-5">
						{line
							.split(/<li>|<\/li>/)
							.filter((item) => item.trim() !== "")
							.map((item, idx) => (
								<li key={idx}>{item.replace(/<[^>]*>/g, "")}</li>
							))}
					</ul>
				));

			return <div className="section-item-description">{listContent}</div>;
		}

		// Case 2: Check if it contains paragraph tags (with possible inline formatting)
		if (text.includes("<p>")) {
			// Extract paragraphs and preserve inline formatting
			const paragraphs = text.split(/<p>|<\/p>/).filter((p) => p.trim() !== "");

			return (
				<div className="section-item-description">
					{paragraphs.map((paragraph, index) => {
						// Handle inline formatting like <strong>, <em>, etc.
						const formattedText = paragraph
							.replace(/<strong>(.*?)<\/strong>/g, "<strong>$1</strong>")
							.replace(/<em>(.*?)<\/em>/g, "<em>$1</em>")
							.replace(/<b>(.*?)<\/b>/g, "<b>$1</b>")
							.replace(/<i>(.*?)<\/i>/g, "<i>$1</i>");

						// biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
						return <p key={index} className="mb-2 last:mb-0" dangerouslySetInnerHTML={{ __html: formattedText }} />;
					})}
				</div>
			);
		}

		// Case 3: Check for bullet point markers in plain text
		const lines = text.split("\n").filter((line) => line.trim() !== "");
		const hasBulletMarkers = lines.some((line) => line.trim().match(/^[*\-•]\s+/));

		if (hasBulletMarkers) {
			// Convert markdown-style bullet points to HTML lists
			const listItems = lines.map((line) => line.replace(/^[*\-•]\s+/, "").trim());

			return (
				<ul className="list-disc pl-5">
					{listItems.map((item, index) => (
						<li key={index}>{item}</li>
					))}
				</ul>
			);
		}

		// Case 4: Plain text with line breaks
		return (
			<div className="section-item-description whitespace-pre-wrap">
				{lines.map((paragraph, index) => (
					<p key={index} className="mb-2 last:mb-0">
						{paragraph}
					</p>
				))}
			</div>
		);
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

			{/* Description - Smart rendering based on content */}
			{renderDescription()}

			{/* Website */}
			{item.website?.label && (
				<div className="section-item-website experience-item-website">
					<PageLink {...item.website} label={item.website.label} />
				</div>
			)}
		</div>
	);
}
