import { Trans } from "@lingui/react/macro";
import { useState } from "react";
import { toast } from "sonner";
import { useResumeStore } from "@/components/resume/store/resume";
import { SortableList } from "@/components/ui/sortable-list";
import { generateExperienceDescription } from "@/utils/ai-service";
import { SectionBase } from "../shared/section-base";
import { SectionAddItemButton } from "../shared/section-item";
import { SortableSectionItem } from "../shared/sortable-section-item";

export function ExperienceSectionBuilder() {
	const section = useResumeStore((state) => state.resume.data.sections.experience);
	const updateResumeData = useResumeStore((state) => state.updateResumeData);

	const [generatingIds, setGeneratingIds] = useState<Set<string>>(new Set());

	const handleAskZoe = async (id: string) => {
		setGeneratingIds((prev) => new Set([...prev, id]));

		try {
			// Get the experience item data
			const item = section.items.find((exp) => exp.id === id);
			if (!item) {
				throw new Error("Experience item not found");
			}

			// Call real AI with the experience data
			const aiDescription = await generateExperienceDescription({
				position: item.position,
				company: item.company,
				location: item.location,
				period: `${item.startDate || ""} - ${item.endDate || (item.currentlyWorkingHere ? "Present" : "")}`.trim(),
			});

			// Update the description with AI-generated content
			updateResumeData((draft) => {
				const draftItem = draft.sections.experience.items.find((exp) => exp.id === id);
				if (draftItem) {
					draftItem.description = aiDescription;
				}
			});

			toast.success("AI description generated successfully!");
		} catch (error) {
			console.error("AI generation error:", error);
			toast.error(error instanceof Error ? error.message : "Failed to generate description");
		} finally {
			// Always remove from generating set
			setGeneratingIds((prev) => {
				const newSet = new Set(prev);
				newSet.delete(id);
				return newSet;
			});
		}
	};

	return (
		<SectionBase type="experience">
			<div className="space-y-4">
				{/* Add Button */}
				<div className="flex items-start justify-between">
					<SectionAddItemButton type="experience">
						<Trans>Add a new experience</Trans>
					</SectionAddItemButton>
				</div>

				{/* Experiences List */}
				<SortableList
					items={section.items}
					onReorder={(newItems) => {
						updateResumeData((draft) => {
							draft.sections.experience.items = newItems;
						});
					}}
					keyExtractor={(item) => item.id}
					renderItem={(item) => (
						<SortableSectionItem
							key={item.id}
							type="experience"
							item={item}
							title={item.position || "New Position"}
							subtitle={[item.company, `${item.startDate || ""} - ${item.endDate || (item.currentlyWorkingHere ? "Present" : "")}`.trim()].filter(Boolean).join(" • ")}
						/>
					)}
				/>

				{/* Empty State */}
				{section.items.length === 0 && (
					<div className="py-12 text-center">
						<div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
							<svg className="h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
								/>
							</svg>
						</div>
						<h3 className="mb-2 font-semibold text-gray-900 text-lg">No work experience added yet</h3>
						<p className="mb-6 text-gray-600">Click the "Add" button to add your first work experience</p>
					</div>
				)}

				{/* AI Generation Indicator */}
				{generatingIds.size > 0 && (
					<div className="fixed right-8 bottom-8 max-w-sm animate-pulse rounded-2xl border-2 border-emerald-500 bg-white p-5 shadow-2xl">
						<div className="flex items-start gap-4">
							<div className="flex h-12 w-12 shrink-0 animate-bounce items-center justify-center rounded-full bg-emerald-100">
								<img src="/zoe-icon.png" alt="Zoe" className="h-8 w-8" />
							</div>
							<div>
								<h4 className="mb-1 font-bold text-gray-900">Zoe is working...</h4>
								<p className="text-gray-600 text-sm">Generating professional descriptions for your experience</p>
							</div>
						</div>
					</div>
				)}
			</div>
		</SectionBase>
	);
}
