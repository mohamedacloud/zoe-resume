import { useEffect, useRef } from "react";
import { useResumeStore } from "@/components/resume/store/resume";
import type { SummaryItem as SummaryItemType } from "@/schema/resume/data";
import { stripHtml } from "@/utils/string";
import { cn } from "@/utils/style";

type SummaryItemProps = SummaryItemType & {
	className?: string;
};

export function SummaryItem({ className, ...item }: SummaryItemProps) {
	const updateResumeData = useResumeStore((state) => state.updateResumeData);
	const contentRef = useRef<HTMLDivElement>(null);

	// Update content when item.content changes
	useEffect(() => {
		if (contentRef.current && contentRef.current.innerHTML !== item.content) {
			contentRef.current.innerHTML = item.content;
		}
	}, [item.content]);

	const handleContentChange = (e: React.FocusEvent<HTMLDivElement>) => {
		const newValue = e.currentTarget.innerHTML || "";
		if (newValue !== item.content) {
			updateResumeData((draft) => {
				draft.summary.content = newValue;
			});
		}
	};

	if (!stripHtml(item.content)) return null;

	return (
		<div
			ref={contentRef}
			className={cn(
				"summary-item cursor-text outline-none hover:ring-1 hover:ring-blue-300 focus:ring-2 focus:ring-blue-500",
				className,
			)}
			contentEditable
			suppressContentEditableWarning
			onBlur={handleContentChange}
		/>
	);
}
