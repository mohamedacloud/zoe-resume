import { useState } from "react";
import { toast } from "sonner";
import { RichInput } from "@/components/input/rich-input";
import { useResumeStore } from "@/components/resume/store/resume";
import { SortableItem } from "@/components/ui/sortable-item";
import { SortableList } from "@/components/ui/sortable-list";
import { generateExperienceDescription } from "@/utils/ai-service";
import { SectionBase } from "../shared/section-base";
import { DotsSixVerticalIcon, TrashSimpleIcon } from "@phosphor-icons/react";
import { cn } from "@/utils/style";

export function ExperienceSectionBuilder() {
	const section = useResumeStore((state) => state.resume.data.sections.experience);
	const updateResumeData = useResumeStore((state) => state.updateResumeData);

	const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
	const [generatingIds, setGeneratingIds] = useState<Set<string>>(new Set());

	const handleAddExperience = () => {
		const newExperience = {
			id: crypto.randomUUID(),
			hidden: false,
			position: "",
			company: "",
			location: "",
			period: "",
			website: { url: "", label: "" },
			description: "",
		};

		updateResumeData((draft) => {
			draft.sections.experience.items.unshift(newExperience);
		});

		// Auto-expand the new item
		setExpandedIds(new Set([newExperience.id, ...expandedIds]));
	};

	const handleDeleteExperience = (id: string) => {
		updateResumeData((draft) => {
			draft.sections.experience.items = draft.sections.experience.items.filter((item) => item.id !== id);
		});

		const newExpanded = new Set(expandedIds);
		newExpanded.delete(id);
		setExpandedIds(newExpanded);
	};

	const handleUpdateExperience = (id: string, field: string, value: string | boolean) => {
		updateResumeData((draft) => {
			const item = draft.sections.experience.items.find((exp) => exp.id === id);
			if (item) {
				if (field === "startDate" || field === "endDate" || field === "current") {
					// Handle date-related fields for period calculation
					return;
				}
				// Type-safe field updates
				if (field === "position" || field === "company" || field === "location" || field === "description") {
					item[field] = value as string;
				}
			}
		});
	};

	const handleDateChange = (id: string, dateType: "start" | "end", value: string) => {
		updateResumeData((draft) => {
			const item = draft.sections.experience.items.find((exp) => exp.id === id);
			if (item) {
				const [startDate, endDate] = item.period.split(" - ");
				if (dateType === "start") {
					item.period = value ? `${formatDate(value)} - ${endDate || "Present"}` : "";
				} else {
					item.period = `${startDate || ""} - ${value ? formatDate(value) : "Present"}`;
				}
			}
		});
	};

	const handleCurrentToggle = (id: string, checked: boolean) => {
		updateResumeData((draft) => {
			const item = draft.sections.experience.items.find((exp) => exp.id === id);
			if (item) {
				const startDate = item.period.split(" - ")[0] || "";
				item.period = checked ? `${startDate} - Present` : startDate;
			}
		});
	};

	const toggleExpanded = (id: string) => {
		const newExpanded = new Set(expandedIds);
		if (newExpanded.has(id)) {
			newExpanded.delete(id);
		} else {
			newExpanded.add(id);
		}
		setExpandedIds(newExpanded);
	};

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
				period: item.period,
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

	const formatDate = (dateString: string) => {
		if (!dateString) return "";
		const [year, month] = dateString.split("-");
		const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
		return `${months[Number.parseInt(month) - 1]} ${year}`;
	};

	const parseDate = (periodString: string, type: "start" | "end") => {
		if (!periodString) return "";
		const parts = periodString.split(" - ");
		const dateStr = type === "start" ? parts[0] : parts[1];
		if (!dateStr || dateStr === "Present") return "";

		const months: Record<string, string> = {
			Jan: "01",
			Feb: "02",
			Mar: "03",
			Apr: "04",
			May: "05",
			Jun: "06",
			Jul: "07",
			Aug: "08",
			Sep: "09",
			Oct: "10",
			Nov: "11",
			Dec: "12",
		};

		const [monthName, year] = dateStr.split(" ");
		return `${year}-${months[monthName]}`;
	};

	const isCurrent = (period: string) => {
		return period.includes("Present");
	};

	return (
		<SectionBase type="experience">
			<div className="space-y-4">
				{/* Add Button */}
				<div className="flex items-start justify-between">
					<div>
						<p className="text-gray-600 text-sm">Add your professional experience, starting with the most recent</p>
					</div>
					<button
						onClick={handleAddExperience}
						className="flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-3 font-semibold text-white shadow-sm transition-all hover:bg-emerald-700"
						type="button"
					>
						<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
						</svg>
						Add
					</button>
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
					renderItem={(exp) => (
						<SortableItem key={exp.id} id={exp.id} asHandle className="group/item relative">
							<div className="overflow-hidden rounded-2xl border-2 border-emerald-500 bg-white shadow-sm transition-all hover:shadow-md">
								{/* Card Header */}
								<div className="flex items-center justify-between border-gray-200 border-b p-5">
									<div className="flex items-center gap-1 overflow-hidden">
										<div className="flex shrink-0 items-center p-2 text-gray-400 opacity-40 transition-opacity group-hover/item:opacity-100">
											<DotsSixVerticalIcon size={20} />
										</div>
										<h3 className="truncate font-bold text-gray-900 text-xl">{exp.position || "New Position"}</h3>
									</div>
									<div className="flex items-center gap-3">
										<button
											onClick={() => handleDeleteExperience(exp.id)}
											className="rounded-lg p-2 text-red-600 transition-all hover:bg-red-50"
											title="Delete"
											type="button"
										>
											<TrashSimpleIcon size={20} />
										</button>
										<button
											onClick={() => toggleExpanded(exp.id)}
											className="rounded-lg p-2 text-gray-600 transition-all hover:bg-gray-100"
											title={expandedIds.has(exp.id) ? "Collapse" : "Expand"}
											type="button"
										>
											<svg
												className={cn("h-5 w-5 transition-transform", expandedIds.has(exp.id) && "rotate-180")}
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
											</svg>
										</button>
									</div>
								</div>

								{/* Card Content */}
								{expandedIds.has(exp.id) && (
									<div className="p-6">
										{/* Position & Company Row */}
										<div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
											<div>
												<label className="mb-3 block font-semibold text-base text-gray-900">Position</label>
												<input
													type="text"
													value={exp.position}
													onChange={(e) => handleUpdateExperience(exp.id, "position", e.target.value)}
													placeholder="Software Engineer"
													className="w-full rounded-xl border-0 bg-gray-50 px-4 py-3 text-base text-gray-900 placeholder-gray-400 transition-all focus:bg-white focus:ring-2 focus:ring-emerald-500"
												/>
											</div>

											<div>
												<label className="mb-3 block font-semibold text-base text-gray-900">Company</label>
												<input
													type="text"
													value={exp.company}
													onChange={(e) => handleUpdateExperience(exp.id, "company", e.target.value)}
													placeholder="Acme Inc."
													className="w-full rounded-xl border-0 bg-gray-50 px-4 py-3 text-base text-gray-900 placeholder-gray-400 transition-all focus:bg-white focus:ring-2 focus:ring-emerald-500"
												/>
											</div>
										</div>

										{/* Location */}
										<div className="mb-6">
											<label className="mb-3 block font-semibold text-base text-gray-900">Location</label>
											<input
												type="text"
												value={exp.location}
												onChange={(e) => handleUpdateExperience(exp.id, "location", e.target.value)}
												placeholder="San Francisco, CA"
												className="w-full rounded-xl border-0 bg-gray-50 px-4 py-3 text-base text-gray-900 placeholder-gray-400 transition-all focus:bg-white focus:ring-2 focus:ring-emerald-500"
											/>
										</div>

										{/* Dates Row */}
										<div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
											<div>
												<label className="mb-3 block font-semibold text-base text-gray-900">Start Date</label>
												<input
													type="month"
													value={parseDate(exp.period, "start")}
													onChange={(e) => handleDateChange(exp.id, "start", e.target.value)}
													className="w-full rounded-xl border-0 bg-gray-50 px-4 py-3 text-base text-gray-900 placeholder-gray-400 transition-all focus:bg-white focus:ring-2 focus:ring-emerald-500"
												/>
											</div>

											<div>
												<label className="mb-3 block font-semibold text-base text-gray-900">End Date</label>
												<input
													type="month"
													value={parseDate(exp.period, "end")}
													onChange={(e) => handleDateChange(exp.id, "end", e.target.value)}
													disabled={isCurrent(exp.period)}
													placeholder="Present"
													className="w-full rounded-xl border-0 bg-gray-50 px-4 py-3 text-base text-gray-900 placeholder-gray-400 transition-all focus:bg-white focus:ring-2 focus:ring-emerald-500 disabled:cursor-not-allowed disabled:bg-gray-100"
												/>
											</div>
										</div>

										{/* Current Work Checkbox */}
										<div className="mb-6 flex items-center gap-3">
											<input
												type="checkbox"
												id={`current-${exp.id}`}
												checked={isCurrent(exp.period)}
												onChange={(e) => handleCurrentToggle(exp.id, e.target.checked)}
												className="h-5 w-5 cursor-pointer rounded border-2 border-gray-300 text-emerald-600 focus:ring-2 focus:ring-emerald-500"
											/>
											<label htmlFor={`current-${exp.id}`} className="cursor-pointer select-none text-base text-gray-900">
												I currently work here
											</label>
										</div>

										{/* Description */}
										<div>
											<div className="mb-3 flex items-center justify-between">
												<label className="block font-semibold text-base text-gray-900">Description & Achievements</label>
												<button
													onClick={() => handleAskZoe(exp.id)}
													disabled={generatingIds.has(exp.id)}
													className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 font-medium text-gray-700 text-sm shadow-sm transition-all hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
													type="button"
												>
													{generatingIds.has(exp.id) ? (
														<>
															<svg
																className="h-4 w-4 animate-spin text-emerald-600"
																fill="none"
																stroke="currentColor"
																viewBox="0 0 24 24"
															>
																<path
																	strokeLinecap="round"
																	strokeLinejoin="round"
																	strokeWidth={2}
																	d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
																/>
															</svg>
															Generating...
														</>
													) : (
														<>
															<img src="/zoe-icon.png" alt="Zoe" className="h-5 w-5" />
															Ask Zoe
														</>
													)}
												</button>
											</div>
											<div className="relative">
												<RichInput
													value={exp.description}
													onChange={(val: string) => handleUpdateExperience(exp.id, "description", val)}
													className="w-full rounded-xl border-0 bg-gray-50 px-4 py-3 text-base text-gray-900 placeholder-gray-400 transition-all focus:bg-white focus:ring-2 focus:ring-emerald-500"
												/>
											</div>
										</div>
									</div>
								)}
							</div>
						</SortableItem>
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
