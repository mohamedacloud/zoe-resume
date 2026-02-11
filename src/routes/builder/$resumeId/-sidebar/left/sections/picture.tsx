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
import { ButtonGroup } from "@/components/ui/button-group";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";
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

	return (
		<Form {...form}>
			<form onChange={form.handleSubmit(onSubmit)} className="space-y-6">
				{/* Profile Photo Upload Section */}
				<div className="rounded-lg border border-gray-300 bg-gray-50/50 p-4 shadow-sm">
					<div className="flex items-center gap-4">
						{/* Photo Preview Circle */}
						<div className="relative shrink-0">
							<div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-2 border-gray-300 bg-white shadow-sm">
								{picture.url ? (
									<img src={picture.url} alt="Profile" className="h-full w-full object-cover" />
								) : (
									<div className="flex flex-col items-center gap-1">
										<CameraIcon className="h-8 w-8 text-gray-400" />
										<span className="text-gray-400 text-xs">No Photo</span>
									</div>
								)}
							</div>
							<input
								type="file"
								accept="image/*"
								onChange={handlePhotoChange}
								className="hidden"
								id="picture-upload-input"
							/>

							{/* Action Buttons */}
							{picture.url ? (
								<>
									{/* Edit Button - Top Right */}
									<label
										htmlFor="picture-upload-input"
										className="absolute -top-1 -right-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-blue-600 shadow-md transition-all hover:scale-110 hover:bg-blue-700"
										title="Change photo"
									>
										<PencilSimpleIcon className="h-4 w-4 text-white" weight="bold" />
									</label>
									{/* Delete Button - Bottom Right */}
									<button
										type="button"
										onClick={handleRemovePhoto}
										className="absolute -right-1 -bottom-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-red-600 shadow-md transition-all hover:scale-110 hover:bg-red-700"
										title="Remove photo"
									>
										<TrashIcon className="h-4 w-4 text-white" weight="bold" />
									</button>
								</>
							) : (
								/* Upload Button - Center Bottom */
								<label
									htmlFor="picture-upload-input"
									className="absolute -right-1 -bottom-1 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-emerald-600 shadow-md transition-all hover:scale-110 hover:bg-emerald-700"
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
										<FormLabel className="font-medium text-gray-900 text-xs">
											<Trans>Picture URL</Trans>
										</FormLabel>
										<FormControl>
											<Input {...field} placeholder="Paste image URL here..." className="h-9 border-gray-300 bg-white text-sm" />
										</FormControl>
										<FormMessage />
										<p className="mt-1 text-gray-500 text-xs">Upload a photo or paste an image URL</p>
									</FormItem>
								)}
							/>
						</div>
					</div>
				</div>

				{/* Picture Customization Options */}
				<div className="space-y-4 rounded-lg border border-gray-300 bg-white p-4 shadow-sm">
					<FormField
						control={form.control}
						name="size"
						render={({ field }) => (
							<FormItem>
								<FormLabel>
									<Trans>Size</Trans>
								</FormLabel>
								<InputGroup>
									<InputGroupInput
										{...field}
										type="number"
										min={32}
										max={512}
										step={1}
										onChange={(e) => {
											const value = e.target.value;
											if (value === "") field.onChange("");
											else field.onChange(Number(value));
										}}
									/>

									<InputGroupAddon align="inline-end">
										<InputGroupText>pt</InputGroupText>
									</InputGroupAddon>
								</InputGroup>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="rotation"
						render={({ field }) => (
							<FormItem>
								<FormLabel>
									<Trans>Rotation</Trans>
								</FormLabel>
								<InputGroup>
									<FormControl>
										<InputGroupInput
											{...field}
											type="number"
											min={0}
											max={360}
											step={5}
											onChange={(e) => {
												const value = e.target.value;
												if (value === "") field.onChange("");
												else field.onChange(Number(value));
											}}
										/>
									</FormControl>
									<InputGroupAddon align="inline-end">
										<InputGroupText>°</InputGroupText>
									</InputGroupAddon>
								</InputGroup>
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="aspectRatio"
						render={({ field }) => (
							<FormItem>
								<FormLabel>
									<Trans>Aspect Ratio</Trans>
								</FormLabel>
								<div className="flex items-center gap-x-2">
									<FormControl>
										<Input
											{...field}
											type="number"
											min={0.5}
											max={2.5}
											step={0.1}
											onChange={(e) => {
												const value = e.target.value;
												if (value === "") field.onChange("");
												else field.onChange(Number(value));
											}}
										/>
									</FormControl>

									<ButtonGroup className="shrink-0">
										<Button
											size="icon"
											variant="outline"
											title={t`Square`}
											onClick={() => {
												field.onChange(1);
												form.handleSubmit(onSubmit)();
											}}
										>
											<div className="aspect-square min-h-3 min-w-3 border border-primary" />
										</Button>
										<Button
											size="icon"
											variant="outline"
											title={t`Landscape`}
											onClick={() => {
												field.onChange(1.5);
												form.handleSubmit(onSubmit)();
											}}
										>
											<div className="aspect-[1.5/1] min-h-3 min-w-3 border border-primary" />
										</Button>
										<Button
											size="icon"
											variant="outline"
											title={t`Portrait`}
											onClick={() => {
												field.onChange(0.5);
												form.handleSubmit(onSubmit)();
											}}
										>
											<div className="aspect-[1/1.5] min-h-3 min-w-3 border border-primary" />
										</Button>
									</ButtonGroup>
								</div>
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="borderRadius"
						render={({ field }) => (
							<FormItem>
								<FormLabel>
									<Trans>Border Radius</Trans>
								</FormLabel>
								<div className="flex items-center gap-x-2">
									<InputGroup>
										<FormControl>
											<InputGroupInput
												{...field}
												type="number"
												min={0}
												max={100}
												step={1}
												onChange={(e) => {
													const value = Number(e.target.value);
													field.onChange(value);
												}}
											/>
										</FormControl>
										<InputGroupAddon align="inline-end">pt</InputGroupAddon>
									</InputGroup>

									<ButtonGroup className="shrink-0">
										<Button
											size="icon"
											variant="outline"
											title="0pt"
											onClick={() => {
												field.onChange(0);
												form.handleSubmit(onSubmit)();
											}}
										>
											<div className="size-3 rounded-none border border-primary" />
										</Button>
										<Button
											size="icon"
											variant="outline"
											title="10pt"
											onClick={() => {
												field.onChange(10);
												form.handleSubmit(onSubmit)();
											}}
										>
											<div className="size-3 rounded-[10%] border border-primary" />
										</Button>
										<Button
											size="icon"
											variant="outline"
											title="100pt"
											onClick={() => {
												field.onChange(100);
												form.handleSubmit(onSubmit)();
											}}
										>
											<div className="size-3 rounded-full border border-primary" />
										</Button>
									</ButtonGroup>
								</div>
							</FormItem>
						)}
					/>

					<div className="flex items-center gap-x-2">
						<FormField
							control={form.control}
							name="borderColor"
							render={({ field }) => (
								<FormItem className="shrink-0 self-end">
									<FormControl>
										<ColorPicker
											defaultValue={field.value}
											onValueChange={(color) => {
												field.onChange(color);
												form.handleSubmit(onSubmit)();
											}}
										/>
									</FormControl>
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="borderWidth"
							render={({ field }) => (
								<FormItem className="flex-1">
									<FormLabel>
										<Trans>Border Width</Trans>
									</FormLabel>
									<InputGroup>
										<FormControl>
											<InputGroupInput
												{...field}
												type="number"
												min={0}
												step={1}
												onChange={(e) => {
													const value = e.target.value;
													if (value === "") field.onChange("");
													else field.onChange(Number(value));
												}}
											/>
										</FormControl>
										<InputGroupAddon align="inline-end">
											<InputGroupText>pt</InputGroupText>
										</InputGroupAddon>
									</InputGroup>
								</FormItem>
							)}
						/>
					</div>

					<div className="flex items-center gap-x-2">
						<FormField
							control={form.control}
							name="shadowColor"
							render={({ field }) => (
								<FormItem className="shrink-0 self-end">
									<FormControl>
										<ColorPicker
											defaultValue={field.value}
											onValueChange={(color) => {
												field.onChange(color);
												form.handleSubmit(onSubmit)();
											}}
										/>
									</FormControl>
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="shadowWidth"
							render={({ field }) => (
								<FormItem className="flex-1">
									<FormLabel>
										<Trans>Shadow Width</Trans>
									</FormLabel>
									<InputGroup>
										<FormControl>
											<InputGroupInput
												{...field}
												type="number"
												min={0}
												step={0.5}
												onChange={(e) => {
													const value = e.target.value;
													if (value === "") field.onChange("");
													else field.onChange(Number(value));
												}}
											/>
										</FormControl>
										<InputGroupAddon align="inline-end">
											<InputGroupText>pt</InputGroupText>
										</InputGroupAddon>
									</InputGroup>
								</FormItem>
							)}
						/>
					</div>
				</div>
			</form>
		</Form>
	);
}
