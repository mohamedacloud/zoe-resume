import { debounce } from "es-toolkit";
import { useEffect, useMemo, useRef } from "react";
import { useResumeStore } from "@/components/resume/store/resume";
import type { SummaryItem as SummaryItemType } from "@/schema/resume/data";
import { handleContentEditableLinkClick } from "@/utils/resume/event";
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
			if (document.activeElement !== contentRef.current) {
				contentRef.current.innerHTML = item.content;
			}
		}
	}, [item.content]);

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
		if (newValue !== item.content) {
			debouncedUpdate(newValue);
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
			onInput={handleContentChange}
			onClick={handleContentEditableLinkClick}
		/>
	);
}
