import { Trans } from "@lingui/react/macro";
import {
	DotsSixVerticalIcon,
	GithubLogoIcon,
	LinkedinLogoIcon,
	PencilSimpleLineIcon,
	PlusIcon,
	TrashSimpleIcon,
} from "@phosphor-icons/react";
import { AnimatePresence, Reorder, useDragControls } from "motion/react";
import type React from "react";
import { useState } from "react";
import type z from "zod";
import { useResumeStore } from "@/components/resume/store/resume";
import { useDialogStore } from "@/dialogs/store";
import type { profileItemSchema } from "@/schema/resume/data";
import { cn } from "@/utils/style";
import { SectionBase } from "../shared/section-base";

type ProfileItemProps = {
	item: z.infer<typeof profileItemSchema>;
	index: number;
	draggedItem: number | null;
	onDragStart: () => void;
	onDragEnd: () => void;
	onEdit: (item: z.infer<typeof profileItemSchema>) => void;
	onDelete: (id: string) => void;
	getNetworkIcon: (network: string) => React.JSX.Element;
	getNetworkColor: (network: string) => string;
};

function ProfileItem({
	item,
	index,
	draggedItem,
	onDragStart,
	onDragEnd,
	onEdit,
	onDelete,
	getNetworkIcon,
	getNetworkColor,
}: ProfileItemProps) {
	const dragControls = useDragControls();

	return (
		<Reorder.Item
			key={item.id}
			value={item}
			dragListener={false}
			dragControls={dragControls}
			onDragStart={onDragStart}
			onDragEnd={onDragEnd}
			className={cn("cursor-move p-4 transition-all hover:bg-gray-50", draggedItem === index && "opacity-50")}
		>
			<div className="flex items-center gap-4">
				{/* Drag Handle */}
				<div className="shrink-0 cursor-move" onPointerDown={(e) => dragControls.start(e)}>
					<DotsSixVerticalIcon className="h-5 w-5 text-gray-400" />
				</div>

				{/* Network Icon */}
				<div
					className={cn(
						"flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-white",
						getNetworkColor(item.network),
					)}
				>
					{getNetworkIcon(item.network)}
				</div>

				{/* Profile Info */}
				<div className="min-w-0 flex-1">
					<h4 className="font-semibold text-gray-900 text-sm">{item.network}</h4>
					<p className="truncate text-gray-600 text-sm">{item.username}</p>
				</div>

				{/* Action Buttons */}
				<div className="flex shrink-0 items-center gap-2">
					<button
						onClick={() => onEdit(item)}
						className="rounded-lg p-2 text-gray-600 transition-all hover:bg-emerald-50 hover:text-emerald-600"
						title="Edit"
						type="button"
					>
						<PencilSimpleLineIcon className="h-4 w-4" />
					</button>
					<button
						onClick={() => onDelete(item.id)}
						className="rounded-lg p-2 text-gray-600 transition-all hover:bg-red-50 hover:text-red-600"
						title="Delete"
						type="button"
					>
						<TrashSimpleIcon className="h-4 w-4" />
					</button>
				</div>
			</div>
		</Reorder.Item>
	);
}

export function ProfilesSectionBuilder() {
	const section = useResumeStore((state) => state.resume.data.sections.profiles);
	const updateResumeData = useResumeStore((state) => state.updateResumeData);
	const [draggedItem, setDraggedItem] = useState<number | null>(null);
	const openDialog = useDialogStore((state) => state.openDialog);

	const handleReorder = (items: z.infer<typeof profileItemSchema>[]) => {
		updateResumeData((draft) => {
			draft.sections.profiles.items = items;
		});
	};

	const handleDeleteProfile = (id: string) => {
		updateResumeData((draft) => {
			draft.sections.profiles.items = draft.sections.profiles.items.filter((item) => item.id !== id);
		});
	};

	const handleAddProfile = () => {
		openDialog("resume.sections.profiles.create", {});
	};

	const handleEditProfile = (item: z.infer<typeof profileItemSchema>) => {
		openDialog("resume.sections.profiles.update", { item });
	};

	const getNetworkIcon = (network: string) => {
		const networkLower = network.toLowerCase();
		if (networkLower.includes("linkedin")) return <LinkedinLogoIcon className="h-5 w-5" />;
		if (networkLower.includes("github")) return <GithubLogoIcon className="h-5 w-5" />;
		// Default icons for other networks
		return (
			<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={2}
					d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
				/>
			</svg>
		);
	};

	const getNetworkColor = (network: string) => {
		const networkLower = network.toLowerCase();
		if (networkLower.includes("linkedin")) return "bg-blue-600";
		if (networkLower.includes("github")) return "bg-gray-800";
		if (networkLower.includes("twitter")) return "bg-sky-500";
		if (networkLower.includes("portfolio") || networkLower.includes("website")) return "bg-purple-600";
		if (networkLower.includes("instagram")) return "bg-pink-600";
		if (networkLower.includes("dribbble")) return "bg-pink-500";
		if (networkLower.includes("behance")) return "bg-blue-500";
		if (networkLower.includes("medium")) return "bg-gray-900";
		if (networkLower.includes("youtube")) return "bg-red-600";
		if (networkLower.includes("facebook")) return "bg-blue-700";
		return "bg-gray-600";
	};

	return (
		<SectionBase type="profiles">
			<div className="space-y-4">
				{/* Section Card */}
				<div
					className={cn(
						"overflow-hidden rounded-xl border-2 bg-white shadow-sm",
						section.items.length === 0 ? "border-gray-300 border-dashed" : "border-gray-200",
					)}
				>
					{/* Profiles List */}
					{section.items.length > 0 && (
						<Reorder.Group axis="y" values={section.items} onReorder={handleReorder}>
							<AnimatePresence>
								<div className="divide-y divide-gray-200">
									{section.items.map((item, index) => (
										<ProfileItem
											key={item.id}
											item={item}
											index={index}
											draggedItem={draggedItem}
											onDragStart={() => setDraggedItem(index)}
											onDragEnd={() => setDraggedItem(null)}
											onEdit={handleEditProfile}
											onDelete={handleDeleteProfile}
											getNetworkIcon={getNetworkIcon}
											getNetworkColor={getNetworkColor}
										/>
									))}
								</div>
							</AnimatePresence>
						</Reorder.Group>
					)}

					{/* Add Button */}
					<div className="p-4">
						<button
							onClick={handleAddProfile}
							className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-gray-300 border-dashed py-3 font-medium text-gray-600 text-sm transition-all hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700"
							type="button"
						>
							<PlusIcon className="h-5 w-5" />
							<Trans>Add a new profile</Trans>
						</button>
					</div>

					{/* Empty State */}
					{section.items.length === 0 && (
						<div className="p-8 text-center">
							<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
								<svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
									/>
								</svg>
							</div>
							<h4 className="mb-1 font-semibold text-gray-900 text-sm">
								<Trans>No profiles added yet</Trans>
							</h4>
							<p className="mb-4 text-gray-600 text-xs">
								<Trans>Add your social media profiles and professional links</Trans>
							</p>
						</div>
					)}
				</div>

				{/* Profile Tips */}
				{section.items.length > 0 && (
					<div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
						<div className="flex gap-3">
							<svg
								className="mt-0.5 h-5 w-5 shrink-0 text-blue-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
							<div>
								<h4 className="mb-2 font-semibold text-blue-900 text-sm">
									<Trans>Profile Tips</Trans>
								</h4>
								<ul className="space-y-1 text-blue-800 text-xs">
									<li>
										<Trans>• Add your most professional networks first (LinkedIn, GitHub)</Trans>
									</li>
									<li>
										<Trans>• Use consistent usernames across platforms when possible</Trans>
									</li>
									<li>
										<Trans>• Only include profiles that are relevant to your job search</Trans>
									</li>
									<li>
										<Trans>• Drag and drop to reorder profiles</Trans>
									</li>
								</ul>
							</div>
						</div>
					</div>
				)}

				{/* Popular Networks Quick Add */}
				{section.items.length === 0 && (
					<div className="rounded-xl border border-emerald-200 bg-linear-to-br from-emerald-50 to-emerald-100 p-4">
						<h4 className="mb-3 font-semibold text-gray-900 text-sm">
							<Trans>Popular Networks</Trans>
						</h4>
						<div className="grid grid-cols-2 gap-2">
							<button
								onClick={handleAddProfile}
								className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-white px-3 py-2 font-medium text-gray-700 text-sm transition-all hover:bg-emerald-50 hover:text-emerald-700"
								type="button"
							>
								<LinkedinLogoIcon className="h-5 w-5 text-blue-600" />
								LinkedIn
							</button>
							<button
								onClick={handleAddProfile}
								className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-white px-3 py-2 font-medium text-gray-700 text-sm transition-all hover:bg-emerald-50 hover:text-emerald-700"
								type="button"
							>
								<GithubLogoIcon className="h-5 w-5 text-gray-800" />
								GitHub
							</button>
						</div>
					</div>
				)}
			</div>
		</SectionBase>
	);
}
