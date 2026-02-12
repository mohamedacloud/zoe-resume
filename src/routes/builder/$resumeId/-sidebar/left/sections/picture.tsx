import { zodResolver } from "@hookform/resolvers/zod";
import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { CameraIcon, PencilSimpleIcon, PlusIcon, TrashIcon } from "@phosphor-icons/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type z from "zod";
import { ColorPicker } from "@/components/input/color-picker";
import { useResumeStore } from "@/components/resume/store/resume";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { pictureSchema } from "@/schema/resume/data";
import { SectionBase } from "../shared/section-base";

export function PictureSectionBuilder() {
	return (
		<SectionBase type="picture">
			<PictureSectionForm />
		</SectionBase>
	);
}

function PictureSectionForm() {
	const picture = useResumeStore((state) => state.resume.data.picture);
	const updateResumeData = useResumeStore((state) => state.updateResumeData);

	const form = useForm({
		resolver: zodResolver(pictureSchema),
		defaultValues: picture,
		mode: "onChange",
	});

	const onSubmit = (data: z.infer<typeof pictureSchema>) => {
		updateResumeData((draft) => {
			draft.picture = data;
		});
	};

	const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			// Validate file type
			if (!file.type.startsWith("image/")) {
				toast.error(t`Please select a valid image file (PNG, JPG, WEBP, etc.)`);
				return;
			}

			// Validate file size (max 10MB)
			if (file.size > 10 * 1024 * 1024) {
				toast.error(t`Image size should be less than 10MB`);
				return;
			}

			// Create preview URL
			const reader = new FileReader();
			reader.onloadend = () => {
				const url = reader.result as string;
				form.setValue("url", url, { shouldDirty: true });
				form.setValue("hidden", false, { shouldDirty: true });
				form.handleSubmit(onSubmit)();
				toast.success(t`Picture uploaded successfully!`);
			};
			reader.readAsDataURL(file);
		}
		// Reset input value to allow selecting the same file again
		event.target.value = "";
	};

	const handleRemovePhoto = () => {
		form.setValue("url", "", { shouldDirty: true });
		form.setValue("hidden", true, { shouldDirty: true });
		form.handleSubmit(onSubmit)();
		toast.success(t`Picture removed`);
	};

	const pictureUrl = form.watch("url");
	const borderRadius = form.watch("borderRadius");
	const borderWidth = form.watch("borderWidth");
	const borderColor = form.watch("borderColor");
	const shadowWidth = form.watch("shadowWidth");
	const shadowColor = form.watch("shadowColor");
	const rotation = form.watch("rotation");
	const aspectRatio = form.watch("aspectRatio");

	return (
		<Form {...form}>
			<form onChange={form.handleSubmit(onSubmit)} className="space-y-6">
				{/* Profile Photo Upload Section */}
				<div className="rounded-xl border border-gray-200 bg-gray-50 p-5 shadow-sm">
					{/* Section Header */}
					<div className="mb-4 flex items-center gap-2 border-gray-200 border-b pb-3">
						<CameraIcon className="h-5 w-5 text-emerald-600" weight="bold" />
						<h3 className="font-semibold text-gray-900 text-sm">
							<Trans>Profile Picture</Trans>
						</h3>
					</div>

					<div className="flex items-center gap-6">
						{/* Photo Preview with Live Customization */}
						<div className="relative shrink-0">
							<div
								className="flex items-center justify-center overflow-hidden bg-white shadow-md"
								style={{
									width: "112px",
									height: "112px",
									borderRadius: borderRadius === 100 ? "50%" : `${borderRadius}%`,
									border: borderWidth > 0 ? `${borderWidth}px solid ${borderColor}` : "none",
									boxShadow: shadowWidth > 0 ? `0 0 ${shadowWidth * 4}px ${shadowColor}40` : "none",
									transform: `rotate(${rotation}deg)`,
									aspectRatio: aspectRatio.toString(),
								}}
							>
								{pictureUrl ? (
									<img src={pictureUrl} alt="Profile" className="h-full w-full object-cover" />
								) : (
									<div className="flex flex-col items-center gap-2">
										<CameraIcon className="h-10 w-10 text-gray-300" />
										<span className="text-gray-400 text-xs">No Photo</span>
									</div>
								)}
							</div>
							<input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" id="picture-upload" />

							{/* Action Buttons */}
							{pictureUrl ? (
								<>
									{/* Edit Button */}
									<label
										htmlFor="picture-upload"
										className="absolute -top-1 -right-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-emerald-600 shadow-lg transition-all hover:scale-110 hover:bg-emerald-700"
										title="Change photo"
									>
										<PencilSimpleIcon className="h-4 w-4 text-white" weight="bold" />
									</label>
									{/* Delete Button */}
									<button
										type="button"
										onClick={handleRemovePhoto}
										className="absolute -right-1 -bottom-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-red-600 shadow-lg transition-all hover:scale-110 hover:bg-red-700"
										title="Remove photo"
									>
										<TrashIcon className="h-4 w-4 text-white" weight="bold" />
									</button>
								</>
							) : (
								/* Upload Button */
								<label
									htmlFor="picture-upload"
									className="absolute -right-1 -bottom-1 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-emerald-600 shadow-lg transition-all hover:scale-110 hover:bg-emerald-700"
									title="Upload photo"
								>
									<PlusIcon className="h-5 w-5 text-white" weight="bold" />
								</label>
							)}
						</div>

						{/* URL Input */}
						<div className="flex-1">
							<FormField
								control={form.control}
								name="url"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="font-medium text-gray-700 text-xs">
											<Trans>Picture URL</Trans>
										</FormLabel>
										<FormControl>
											<Input
												{...field}
												placeholder="Paste image URL here..."
												className="h-auto border-gray-300 px-3 py-2 text-sm transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500"
												onChange={(e) => {
													field.onChange(e);
													if (e.target.value.trim() !== "") {
														form.setValue("hidden", false, { shouldDirty: true });
													}
												}}
											/>
										</FormControl>
										<FormMessage />
										<p className="mt-1.5 text-gray-500 text-xs">Upload a photo or paste an image URL</p>
									</FormItem>
								)}
							/>
						</div>
					</div>
				</div>

				{/* Customization Options */}
				<div className="space-y-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
					<h3 className="mb-4 font-semibold text-gray-900 text-sm">
						<Trans>Picture Customization</Trans>
					</h3>

					{/* Size */}
					<FormField
						control={form.control}
						name="size"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="font-medium text-gray-700 text-xs">
									<Trans>Size</Trans>
								</FormLabel>
								<div className="flex items-center gap-2">
									<FormControl>
										<Input
											{...field}
											type="number"
											min={32}
											max={512}
											step={1}
											className="flex-1 border-gray-300 px-3 py-2 text-sm transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500"
											onChange={(e) => {
												const value = e.target.value;
												if (value === "") field.onChange("");
												else field.onChange(Number(value));
											}}
										/>
									</FormControl>
									<span className="font-medium text-gray-500 text-sm">pt</span>
								</div>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Rotation */}
					<FormField
						control={form.control}
						name="rotation"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="font-medium text-gray-700 text-xs">
									<Trans>Rotation</Trans>
								</FormLabel>
								<div className="flex items-center gap-2">
									<FormControl>
										<Input
											{...field}
											type="number"
											min={0}
											max={360}
											step={5}
											className="flex-1 border-gray-300 px-3 py-2 text-sm transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500"
											onChange={(e) => {
												const value = e.target.value;
												if (value === "") field.onChange("");
												else field.onChange(Number(value));
											}}
										/>
									</FormControl>
									<span className="font-medium text-gray-500 text-sm">°</span>
								</div>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Aspect Ratio */}
					<FormField
						control={form.control}
						name="aspectRatio"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="font-medium text-gray-700 text-xs">
									<Trans>Aspect Ratio</Trans>
								</FormLabel>
								<div className="flex items-center gap-2">
									<FormControl>
										<Input
											{...field}
											type="number"
											min={0.5}
											max={2.5}
											step={0.1}
											className="flex-1 border-gray-300 px-3 py-2 text-sm transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500"
											onChange={(e) => {
												const value = e.target.value;
												if (value === "") field.onChange("");
												else field.onChange(Number(value));
											}}
										/>
									</FormControl>
									<div className="flex gap-1">
										<Button
											type="button"
											size="icon"
											variant="outline"
											title={t`Square`}
											className="h-10 w-10 border-gray-300 p-2 transition-all hover:bg-gray-50"
											onClick={() => {
												field.onChange(1);
												form.handleSubmit(onSubmit)();
											}}
										>
											<div className="h-4 w-4 border-2 border-emerald-600" />
										</Button>
										<Button
											type="button"
											size="icon"
											variant="outline"
											title={t`Landscape`}
											className="h-10 w-10 border-gray-300 p-2 transition-all hover:bg-gray-50"
											onClick={() => {
												field.onChange(1.5);
												form.handleSubmit(onSubmit)();
											}}
										>
											<div className="h-3 w-5 border-2 border-emerald-600" />
										</Button>
										<Button
											type="button"
											size="icon"
											variant="outline"
											title={t`Portrait`}
											className="h-10 w-10 border-gray-300 p-2 transition-all hover:bg-gray-50"
											onClick={() => {
												field.onChange(0.5);
												form.handleSubmit(onSubmit)();
											}}
										>
											<div className="h-5 w-3 border-2 border-emerald-600" />
										</Button>
									</div>
								</div>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Border Radius */}
					<FormField
						control={form.control}
						name="borderRadius"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="font-medium text-gray-700 text-xs">
									<Trans>Border Radius</Trans>
								</FormLabel>
								<div className="flex items-center gap-2">
									<FormControl>
										<Input
											{...field}
											type="number"
											min={0}
											max={100}
											step={1}
											className="flex-1 border-gray-300 px-3 py-2 text-sm transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500"
											onChange={(e) => {
												const value = Number(e.target.value);
												field.onChange(value);
											}}
										/>
									</FormControl>
									<span className="mr-1 font-medium text-gray-500 text-sm">pt</span>
									<div className="flex gap-1">
										<Button
											type="button"
											size="icon"
											variant="outline"
											title={t`Square (0pt)`}
											className="h-10 w-10 border-gray-300 p-2 transition-all hover:bg-gray-50"
											onClick={() => {
												field.onChange(0);
												form.handleSubmit(onSubmit)();
											}}
										>
											<div className="h-4 w-4 rounded-none border-2 border-emerald-600" />
										</Button>
										<Button
											type="button"
											size="icon"
											variant="outline"
											title={t`Rounded (10pt)`}
											className="h-10 w-10 border-gray-300 p-2 transition-all hover:bg-gray-50"
											onClick={() => {
												field.onChange(10);
												form.handleSubmit(onSubmit)();
											}}
										>
											<div className="h-4 w-4 rounded-sm border-2 border-emerald-600" />
										</Button>
										<Button
											type="button"
											size="icon"
											variant="outline"
											title={t`Circle (100pt)`}
											className="h-10 w-10 border-gray-300 p-2 transition-all hover:bg-gray-50"
											onClick={() => {
												field.onChange(100);
												form.handleSubmit(onSubmit)();
											}}
										>
											<div className="h-4 w-4 rounded-full border-2 border-emerald-600" />
										</Button>
									</div>
								</div>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Border Color & Width */}
					<div className="grid grid-cols-2 gap-3">
						<FormField
							control={form.control}
							name="borderColor"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="font-medium text-gray-700 text-xs">
										<Trans>Border Color</Trans>
									</FormLabel>
									<div className="flex items-center gap-2">
										<FormControl>
											<ColorPicker
												{...field}
												className="h-10 w-12 cursor-pointer rounded-lg border border-gray-300"
												defaultValue={field.value}
												onValueChange={(color) => {
													field.onChange(color);
													form.handleSubmit(onSubmit)();
												}}
											/>
										</FormControl>
										<Input
											{...field}
											placeholder="#10b981"
											className="flex-1 border-gray-300 px-3 py-2 text-sm transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500"
										/>
									</div>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="borderWidth"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="font-medium text-gray-700 text-xs">
										<Trans>Border Width</Trans>
									</FormLabel>
									<div className="flex items-center gap-2">
										<FormControl>
											<Input
												{...field}
												type="number"
												min={0}
												step={1}
												className="flex-1 border-gray-300 px-3 py-2 text-sm transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500"
												onChange={(e) => {
													const value = e.target.value;
													if (value === "") field.onChange("");
													else field.onChange(Number(e.target.value));
												}}
											/>
										</FormControl>
										<span className="font-medium text-gray-500 text-sm">pt</span>
									</div>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					{/* Shadow Color & Width */}
					<div className="grid grid-cols-2 gap-3">
						<FormField
							control={form.control}
							name="shadowColor"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="font-medium text-gray-700 text-xs">
										<Trans>Shadow Color</Trans>
									</FormLabel>
									<div className="flex items-center gap-2">
										<FormControl>
											<ColorPicker
												{...field}
												className="h-10 w-12 cursor-pointer rounded-lg border border-gray-300"
												defaultValue={field.value}
												onValueChange={(color) => {
													field.onChange(color);
													form.handleSubmit(onSubmit)();
												}}
											/>
										</FormControl>
										<Input
											{...field}
											placeholder="#000000"
											className="flex-1 border-gray-300 px-3 py-2 text-sm transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500"
										/>
									</div>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="shadowWidth"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="font-medium text-gray-700 text-xs">
										<Trans>Shadow Width</Trans>
									</FormLabel>
									<div className="flex items-center gap-2">
										<FormControl>
											<Input
												{...field}
												type="number"
												min={0}
												step={0.5}
												className="flex-1 border-gray-300 px-3 py-2 text-sm transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500"
												onChange={(e) => {
													const value = e.target.value;
													if (value === "") field.onChange("");
													else field.onChange(Number(value));
												}}
											/>
										</FormControl>
										<span className="font-medium text-gray-500 text-sm">pt</span>
									</div>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
				</div>
			</form>
		</Form>
	);
}
