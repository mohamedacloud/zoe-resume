import { debounce } from "es-toolkit";
import { useEffect, useMemo, useRef } from "react";
import { handleContentEditableLinkClick } from "@/utils/resume/event";
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
			// Avoid updating innerHTML if the user is currently typing to prevent cursor reset
			if (document.activeElement !== contentRef.current) {
				contentRef.current.innerHTML = section.content;
			}
		}
	}, [section.content]);

	const debouncedUpdate = useMemo(
		() =>
			debounce((newValue: string) => {
				updateResumeData((draft) => {
					draft.summary.content = newValue;
				});
			}, 100),
		[updateResumeData],
	);

	const handleContentChange = (e: React.FormEvent<HTMLDivElement>) => {
		const newValue = e.currentTarget.innerHTML || "";
		if (newValue !== section.content) {
			debouncedUpdate(newValue);
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
					onInput={handleContentChange}
					onClick={handleContentEditableLinkClick}
					className="cursor-text outline-none hover:ring-1 hover:ring-blue-300 focus:ring-2 focus:ring-blue-500"
					style={{ columnCount: section.columns }}
				/>
			</div>
		</section>
	);
}
