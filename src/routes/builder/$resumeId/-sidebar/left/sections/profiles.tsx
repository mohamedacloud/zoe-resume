import type React from "react";
import { useState } from "react";
import { useResumeStore } from "@/components/resume/store/resume";
import { SectionBase } from "../shared/section-base";

type ProfileFormData = {
	network: string;
	username: string;
	url: string;
};

type SocialNetwork = {
	name: string;
	icon: string;
	placeholder: string;
	color: string;
};

const socialNetworks: SocialNetwork[] = [
	{ name: "LinkedIn", icon: "💼", placeholder: "linkedin.com/in/username", color: "bg-blue-600" },
	{ name: "GitHub", icon: "💻", placeholder: "github.com/username", color: "bg-gray-800" },
	{ name: "Twitter", icon: "🐦", placeholder: "twitter.com/username", color: "bg-sky-500" },
	{ name: "Portfolio", icon: "🌐", placeholder: "yourwebsite.com", color: "bg-purple-600" },
];

export function ProfilesSectionBuilder() {
	const section = useResumeStore((state) => state.resume.data.sections.profiles);
	const updateResumeData = useResumeStore((state) => state.updateResumeData);

	const [isAddingProfile, setIsAddingProfile] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [draggedItem, setDraggedItem] = useState<number | null>(null);
	const [formData, setFormData] = useState<ProfileFormData>({
		network: "LinkedIn",
		username: "",
		url: "",
	});

	const handleAddProfile = () => {
		if (formData.username.trim()) {
			const networkData = socialNetworks.find((n) => n.name === formData.network);
			const newProfile = {
				id: crypto.randomUUID(),
				hidden: false,
				icon: "",
				network: formData.network,
				username: formData.username,
				website: {
					url: formData.url || `https://${networkData?.placeholder}`,
					label: "",
				},
			};

			updateResumeData((draft) => {
				draft.sections.profiles.items.push(newProfile);
			});

			setFormData({ network: "LinkedIn", username: "", url: "" });
			setIsAddingProfile(false);
		}
	};

	const handleUpdateProfile = () => {
		updateResumeData((draft) => {
			const item = draft.sections.profiles.items.find((p) => p.id === editingId);
			if (item) {
				item.network = formData.network;
				item.username = formData.username;
				item.website.url = formData.url;
			}
		});
		setEditingId(null);
		setFormData({ network: "LinkedIn", username: "", url: "" });
	};

	const handleDeleteProfile = (id: string) => {
		updateResumeData((draft) => {
			draft.sections.profiles.items = draft.sections.profiles.items.filter((item) => item.id !== id);
		});
	};

	const handleDragStart = (index: number) => {
		setDraggedItem(index);
	};

	const handleDragOver = (e: React.DragEvent, index: number) => {
		e.preventDefault();
		if (draggedItem === null || draggedItem === index) return;

		updateResumeData((draft) => {
			const items = [...draft.sections.profiles.items];
			const draggedProfile = items[draggedItem];
			items.splice(draggedItem, 1);
			items.splice(index, 0, draggedProfile);
			draft.sections.profiles.items = items;
		});

		setDraggedItem(index);
	};

	const handleDragEnd = () => {
		setDraggedItem(null);
	};

	const startEditing = (profile: {
		id: string;
		network: string;
		username: string;
		website: { url: string; label: string };
	}) => {
		setEditingId(profile.id);
		setFormData({
			network: profile.network,
			username: profile.username,
			url: profile.website.url,
		});
		setIsAddingProfile(false);
	};

	const cancelForm = () => {
		setIsAddingProfile(false);
		setEditingId(null);
		setFormData({ network: "LinkedIn", username: "", url: "" });
	};

	const getNetworkIcon = (network: string) => {
		const networkData = socialNetworks.find((n) => n.name === network);
		return networkData?.icon || "🔗";
	};

	const getNetworkColor = (network: string) => {
		const networkData = socialNetworks.find((n) => n.name === network);
		return networkData?.color || "bg-gray-600";
	};

	return (
		<SectionBase type="profiles">
			<div className="space-y-4">
				{/* Section Card */}
				<div
					className={`overflow-hidden rounded-xl border-2 bg-white shadow-sm ${
						section.items.length === 0 && !isAddingProfile ? "border-gray-300 border-dashed" : "border-gray-200"
					}`}
				>
					{/* Profiles List */}
					{section.items.length > 0 && (
						<div className="divide-y divide-gray-200">
							{section.items.map((profile, index) => (
								<div
									key={profile.id}
									draggable
									onDragStart={() => handleDragStart(index)}
									onDragOver={(e) => handleDragOver(e, index)}
									onDragEnd={handleDragEnd}
									className={`cursor-move p-4 transition-all hover:bg-gray-50 ${
										draggedItem === index ? "opacity-50" : ""
									}`}
								>
									<div className="flex items-center gap-4">
										{/* Drag Handle */}
										<div className="shrink-0 cursor-move">
											<svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
											</svg>
										</div>

										{/* Network Icon */}
										<div
											className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-white text-xl ${getNetworkColor(
												profile.network,
											)}`}
										>
											{getNetworkIcon(profile.network)}
										</div>

										{/* Profile Info */}
										<div className="min-w-0 flex-1">
											<h4 className="font-semibold text-gray-900 text-sm">{profile.network}</h4>
											<p className="truncate text-gray-600 text-sm">{profile.username}</p>
										</div>

										{/* Action Buttons */}
										<div className="flex shrink-0 items-center gap-2">
											<button
												onClick={() => startEditing(profile)}
												className="rounded-lg p-2 text-gray-600 transition-all hover:bg-emerald-50 hover:text-emerald-600"
												title="Edit"
												type="button"
											>
												<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
													/>
												</svg>
											</button>
											<button
												onClick={() => handleDeleteProfile(profile.id)}
												className="rounded-lg p-2 text-gray-600 transition-all hover:bg-red-50 hover:text-red-600"
												title="Delete"
												type="button"
											>
												<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
													/>
												</svg>
											</button>
										</div>
									</div>
								</div>
							))}
						</div>
					)}

					{/* Add/Edit Form */}
					{(isAddingProfile || editingId) && (
						<div className="border-gray-200 border-t bg-gray-50 p-4">
							<h4 className="mb-4 font-semibold text-gray-900 text-sm">
								{editingId ? "Edit Profile" : "Add New Profile"}
							</h4>

							<div className="space-y-3">
								{/* Network Selection */}
								<div>
									<label className="mb-2 block font-medium text-gray-700 text-xs">Social Network</label>
									<select
										value={formData.network}
										onChange={(e) => setFormData({ ...formData, network: e.target.value })}
										className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500"
									>
										{socialNetworks.map((network) => (
											<option key={network.name} value={network.name}>
												{network.icon} {network.name}
											</option>
										))}
									</select>
								</div>

								{/* Username */}
								<div>
									<label className="mb-2 block font-medium text-gray-700 text-xs">Username</label>
									<input
										type="text"
										value={formData.username}
										onChange={(e) => setFormData({ ...formData, username: e.target.value })}
										placeholder="johndoe"
										className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500"
									/>
								</div>

								{/* URL */}
								<div>
									<label className="mb-2 block font-medium text-gray-700 text-xs">Profile URL</label>
									<input
										type="url"
										value={formData.url}
										onChange={(e) => setFormData({ ...formData, url: e.target.value })}
										placeholder={socialNetworks.find((n) => n.name === formData.network)?.placeholder}
										className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500"
									/>
								</div>

								{/* Form Actions */}
								<div className="flex items-center gap-2 pt-2">
									<button
										onClick={editingId ? handleUpdateProfile : handleAddProfile}
										className="flex-1 rounded-lg bg-emerald-600 px-4 py-2 font-medium text-sm text-white transition-all hover:bg-emerald-700"
										type="button"
									>
										{editingId ? "Update Profile" : "Add Profile"}
									</button>
									<button
										onClick={cancelForm}
										className="rounded-lg bg-gray-200 px-4 py-2 font-medium text-gray-700 text-sm transition-all hover:bg-gray-300"
										type="button"
									>
										Cancel
									</button>
								</div>
							</div>
						</div>
					)}

					{/* Add Button */}
					{!isAddingProfile && !editingId && (
						<div className="p-4">
							<button
								onClick={() => setIsAddingProfile(true)}
								className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-gray-300 border-dashed py-3 font-medium text-gray-600 text-sm transition-all hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700"
								type="button"
							>
								<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
								</svg>
								Add a new profile
							</button>
						</div>
					)}

					{/* Empty State */}
					{section.items.length === 0 && !isAddingProfile && (
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
							<h4 className="mb-1 font-semibold text-gray-900 text-sm">No profiles added yet</h4>
							<p className="mb-4 text-gray-600 text-xs">Add your social media profiles and professional links</p>
						</div>
					)}
				</div>

				{/* Profile Tips */}
				{section.items.length > 0 && !isAddingProfile && !editingId && (
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
								<h4 className="mb-2 font-semibold text-blue-900 text-sm">Profile Tips</h4>
								<ul className="space-y-1 text-blue-800 text-xs">
									<li>• Add your most professional networks first (LinkedIn, GitHub)</li>
									<li>• Use consistent usernames across platforms when possible</li>
									<li>• Only include profiles that are relevant to your job search</li>
									<li>• Drag and drop to reorder profiles</li>
								</ul>
							</div>
						</div>
					</div>
				)}

				{/* Quick Add Popular Networks */}
				{section.items.length === 0 && !isAddingProfile && (
					<div className="rounded-xl border border-emerald-200 bg-linear-to-br from-emerald-50 p-4" >
						<h4 className="mb-3 font-semibold text-gray-900 text-sm">Popular Networks</h4>
						<div className="grid grid-cols-2 gap-2">
							{socialNetworks.map((network) => (
								<button
									key={network.name}
									onClick={() => {
										setFormData({ ...formData, network: network.name });
										setIsAddingProfile(true);
									}}
									className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-white px-3 py-2 font-medium text-gray-700 text-sm transition-all hover:bg-emerald-50 hover:text-emerald-700"
									type="button"
								>
									<span className="text-lg">{network.icon}</span>
									{network.name}
								</button>
							))}
						</div>
					</div>
				)}
			</div>
		</SectionBase>
	);
}
