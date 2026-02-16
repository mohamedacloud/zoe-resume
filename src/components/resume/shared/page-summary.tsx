import { useEffect, useRef } from "react";
import { getSectionTitle } from "@/utils/resume/section";
import { stripHtml } from "@/utils/string";
import { cn } from "@/utils/style";
import { useResumeStore } from "../store/resume";

type PageSummaryProps = {
	className?: string;
};

export function PageSummary({ className }: PageSummaryProps) {
	const section = useResumeStore((state) => state.resume.data.summary);
	const updateResumeData = useResumeStore((state) => state.updateResumeData);
	const contentRef = useRef<HTMLDivElement>(null);

	// Update content when section.content changes
	useEffect(() => {
		if (contentRef.current && contentRef.current.innerHTML !== section.content) {
			contentRef.current.innerHTML = section.content;
		}
	}, [section.content]);

	const handleContentChange = (e: React.FocusEvent<HTMLDivElement>) => {
		const newValue = e.currentTarget.innerHTML || "";
		if (newValue !== section.content) {
			updateResumeData((draft) => {
				draft.summary.content = newValue;
			});
		}
	};

	return (
		<section
			className={cn(
				"page-section page-section-summary",
				section.hidden && "hidden",
				!stripHtml(section.content) && "hidden",
				className,
			)}
		>
			<h6 className="mb-1.5 text-(--page-primary-color)">{section.title || getSectionTitle("summary")}</h6>

			<div className="section-content">
				<div
					ref={contentRef}
					contentEditable
					suppressContentEditableWarning
					onBlur={handleContentChange}
					className="cursor-text outline-none hover:ring-1 hover:ring-blue-300 focus:ring-2 focus:ring-blue-500"
					style={{ columnCount: section.columns }}
				/>
			</div>
		</section>
	);
}
