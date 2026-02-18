import { Trans } from "@lingui/react/macro";
import { DotsSixVerticalIcon, TrashSimpleIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { useResumeStore } from "@/components/resume/store/resume";
import { cn } from "@/utils/style";
import { SectionBase } from "../shared/section-base";
import { SectionAddItemButton } from "../shared/section-item";
import { SortableItem } from "@/components/ui/sortable-item";
import { SortableList } from "@/components/ui/sortable-list";


export function EducationSectionBuilder() {
	const section = useResumeStore((state) => state.resume.data.sections.education);
	const updateResumeData = useResumeStore((state) => state.updateResumeData);

	const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

	const handleAddEducation = () => {
		const newEducation = {
			id: crypto.randomUUID(),
			hidden: false,
			school: "",
			degree: "",
			area: "",
			grade: "",
			location: "",
			period: "",
			website: { url: "", label: "" },
			description: "",
		};

		updateResumeData((draft) => {
			draft.sections.education.items.unshift(newEducation);
		});

		setExpandedIds(new Set([newEducation.id, ...expandedIds]));
	};

	const handleDeleteEducation = (id: string) => {
		updateResumeData((draft) => {
			draft.sections.education.items = draft.sections.education.items.filter((item) => item.id !== id);
		});

		const newExpanded = new Set(expandedIds);
		newExpanded.delete(id);
		setExpandedIds(newExpanded);
	};

	const handleUpdateEducation = (id: string, field: string, value: string) => {
		updateResumeData((draft) => {
			const item = draft.sections.education.items.find((edu) => edu.id === id);
			if (item) {
                // simple assignment for string fields as they are explicitly typed in the store
                (item as any)[field] = value;
			}
		});
	};

	const handleDateChange = (id: string, dateType: "start" | "end", value: string) => {
		updateResumeData((draft) => {
			const item = draft.sections.education.items.find((edu) => edu.id === id);
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
			const item = draft.sections.education.items.find((edu) => edu.id === id);
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
		<SectionBase type="education" className={cn("rounded-md border", section.items.length === 0 && "border-dashed")}>
			{/* Education List */}
			<div className="space-y-4">
				<SortableList
					items={section.items}
					onReorder={(newItems) => {
						updateResumeData((draft) => {
							draft.sections.education.items = newItems;
						});
					}}
					keyExtractor={(item) => item.id}
					renderItem={(edu) => (
						<SortableItem key={edu.id} id={edu.id} asHandle className="group/item relative">
							<div className="overflow-hidden rounded-2xl border-2 border-emerald-500 bg-white shadow-sm transition-all hover:shadow-md">
								{/* Card Header */}
								<div className="flex items-center justify-between border-gray-200 border-b p-5">
									<div className="flex items-center gap-1 overflow-hidden">
										<div className="flex shrink-0 items-center p-2 text-gray-400 opacity-40 transition-opacity group-hover/item:opacity-100">
											<DotsSixVerticalIcon size={20} />
										</div>
										<h3 className="truncate font-bold text-gray-900 text-xl">{edu.school || "New Education"}</h3>
									</div>
									<div className="flex items-center gap-3">
										<button
											onClick={() => handleDeleteEducation(edu.id)}
											className="rounded-lg p-2 text-red-600 transition-all hover:bg-red-50"
											title="Delete"
											type="button"
										>
											<TrashSimpleIcon size={20} />
										</button>
										<button
											onClick={() => toggleExpanded(edu.id)}
											className="rounded-lg p-2 text-gray-600 transition-all hover:bg-gray-100"
											title={expandedIds.has(edu.id) ? "Collapse" : "Expand"}
											type="button"
										>
											<svg
												className={cn("h-5 w-5 transition-transform", expandedIds.has(edu.id) && "rotate-180")}
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
								{expandedIds.has(edu.id) && (
									<div className="p-6">
										{/* Institution & Degree Row */}
										<div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
											<div>
												<label className="mb-3 block font-semibold text-base text-gray-900">School/University</label>
												<input
													type="text"
													value={edu.school}
													onChange={(e) => handleUpdateEducation(edu.id, "school", e.target.value)}
													placeholder="University of Technology"
													className="w-full rounded-xl border-0 bg-gray-50 px-4 py-3 text-base text-gray-900 placeholder-gray-400 transition-all focus:bg-white focus:ring-2 focus:ring-emerald-500"
												/>
											</div>

											<div>
												<label className="mb-3 block font-semibold text-base text-gray-900">Degree</label>
												<input
													type="text"
													value={edu.degree}
													onChange={(e) => handleUpdateEducation(edu.id, "degree", e.target.value)}
													placeholder="Bachelor of Science"
													className="w-full rounded-xl border-0 bg-gray-50 px-4 py-3 text-base text-gray-900 placeholder-gray-400 transition-all focus:bg-white focus:ring-2 focus:ring-emerald-500"
												/>
											</div>
										</div>

										{/* Area & Score */}
										<div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
											<div>
												<label className="mb-3 block font-semibold text-base text-gray-900">Field of Study</label>
												<input
													type="text"
													value={edu.area}
													onChange={(e) => handleUpdateEducation(edu.id, "area", e.target.value)}
													placeholder="Computer Science"
													className="w-full rounded-xl border-0 bg-gray-50 px-4 py-3 text-base text-gray-900 placeholder-gray-400 transition-all focus:bg-white focus:ring-2 focus:ring-emerald-500"
												/>
											</div>

											<div>
												<label className="mb-3 block font-semibold text-base text-gray-900">Grade / GPA</label>
												<input
													type="text"
													value={edu.grade}
													onChange={(e) => handleUpdateEducation(edu.id, "grade", e.target.value)}
													placeholder="3.8/4.0"
													className="w-full rounded-xl border-0 bg-gray-50 px-4 py-3 text-base text-gray-900 placeholder-gray-400 transition-all focus:bg-white focus:ring-2 focus:ring-emerald-500"
												/>
											</div>
										</div>

										{/* Dates Row */}
										<div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
											<div>
												<label className="mb-3 block font-semibold text-base text-gray-900">Start Date</label>
												<input
													type="month"
													value={parseDate(edu.period, "start")}
													onChange={(e) => handleDateChange(edu.id, "start", e.target.value)}
													className="w-full rounded-xl border-0 bg-gray-50 px-4 py-3 text-base text-gray-900 placeholder-gray-400 transition-all focus:bg-white focus:ring-2 focus:ring-emerald-500"
												/>
											</div>

											<div>
												<label className="mb-3 block font-semibold text-base text-gray-900">End Date</label>
												<input
													type="month"
													value={parseDate(edu.period, "end")}
													onChange={(e) => handleDateChange(edu.id, "end", e.target.value)}
													disabled={isCurrent(edu.period)}
													placeholder="Present"
													className="w-full rounded-xl border-0 bg-gray-50 px-4 py-3 text-base text-gray-900 placeholder-gray-400 transition-all focus:bg-white focus:ring-2 focus:ring-emerald-500 disabled:cursor-not-allowed disabled:bg-gray-100"
												/>
											</div>
										</div>

										{/* Current Education Checkbox */}
										<div className="mb-6 flex items-center gap-3">
											<input
												type="checkbox"
												id={`current-${edu.id}`}
												checked={isCurrent(edu.period)}
												onChange={(e) => handleCurrentToggle(edu.id, e.target.checked)}
												className="h-5 w-5 cursor-pointer rounded border-2 border-gray-300 text-emerald-600 focus:ring-2 focus:ring-emerald-500"
											/>
											<label htmlFor={`current-${edu.id}`} className="cursor-pointer select-none text-base text-gray-900">
												I currently study here
											</label>
										</div>
									</div>
								)}
							</div>
						</SortableItem>
					)}
				/>
			</div>

			<SectionAddItemButton type="education" onClick={handleAddEducation}>
				<Trans>Add a new education</Trans>
			</SectionAddItemButton>
		</SectionBase>
	);
}
