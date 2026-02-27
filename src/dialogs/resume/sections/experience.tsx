import { zodResolver } from "@hookform/resolvers/zod";
import { Trans } from "@lingui/react/macro";
import { PencilSimpleLineIcon, PlusIcon } from "@phosphor-icons/react";
import { useEffect, useRef } from "react";
import { useForm, useFormContext, useWatch } from "react-hook-form";
import type z from "zod";
import { RichInput } from "@/components/input/rich-input";
import { useResumeStore } from "@/components/resume/store/resume";
import { AIGenerateButton } from "@/components/ui/ai-generate-button";
import { Button } from "@/components/ui/button";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import type { DialogProps } from "@/dialogs/store";
import { useDialogStore } from "@/dialogs/store";
import { experienceItemSchema } from "@/schema/resume/data";
import { generateId } from "@/utils/string";

const formSchema = experienceItemSchema;

type FormValues = z.infer<typeof formSchema>;

export function CreateExperienceDialog({ data }: DialogProps<"resume.sections.experience.create">) {
	const closeDialog = useDialogStore((state) => state.closeDialog);
	const updateResumeData = useResumeStore((state) => state.updateResumeData);

	const maxRounds = 2;

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			id: generateId(),
			hidden: data?.item?.hidden ?? false,
			options: data?.item?.options ?? { showLinkInTitle: false },
			company: data?.item?.company ?? "",
			position: data?.item?.position ?? "",
			location: data?.item?.location ?? "",
			startDate: data?.item?.startDate ?? "",
			endDate: data?.item?.endDate ?? "",
			currentlyWorkingHere: data?.item?.currentlyWorkingHere ?? false,
			description: data?.item?.description ?? "",
			website: data?.item?.website ?? { url: "", label: "" },
			period: data?.item?.period ?? "", // Ensure 'period' has a default value
		},
	});

	const onSubmit = (formData: FormValues) => {
		updateResumeData((draft) => {
			if (data?.customSectionId) {
				const section = draft.customSections.find((s) => s.id === data.customSectionId);
				if (section) {
					section.items.push(formData);
				} else {
					console.error("Custom section not found for ID:", data.customSectionId);
				}
			} else {
				draft.sections.experience.items.push(formData);
			}
		});
		closeDialog();
	};

	return (
		<DialogContent>
			<DialogHeader>
				<DialogTitle className="flex items-center gap-x-2">
					<PlusIcon />
					<Trans>Create a new experience</Trans>
				</DialogTitle>
				<DialogDescription />
			</DialogHeader>

			<Form {...form}>
				<form className="grid gap-4 sm:grid-cols-2" onSubmit={form.handleSubmit(onSubmit)}>
					<ExperienceForm />

					<DialogFooter className="sm:col-span-full">
						<Button variant="ghost" onClick={closeDialog}>
							<Trans>Cancel</Trans>
						</Button>

						<Button type="submit" disabled={form.formState.isSubmitting}>
							<Trans>Create</Trans>
						</Button>
					</DialogFooter>
				</form>
			</Form>
		</DialogContent>
	);
}

export function UpdateExperienceDialog({ data }: DialogProps<"resume.sections.experience.update">) {
	const closeDialog = useDialogStore((state) => state.closeDialog);
	const updateResumeData = useResumeStore((state) => state.updateResumeData);

	const maxRounds = 2;

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			id: data.item.id,
			hidden: data.item.hidden,
			options: data.item.options ?? { showLinkInTitle: false },
			company: data.item.company,
			position: data.item.position,
			location: data.item.location,
			startDate: data.item.startDate ?? "",
			endDate: data.item.endDate ?? "",
			currentlyWorkingHere: data.item.currentlyWorkingHere ?? false,
			description: data.item.description,
			website: data.item.website ?? { url: "", label: "" },
			period: data?.item?.period ?? "", // Ensure 'period' has a default value
		},
	});

	const onSubmit = (formData: FormValues) => {
		updateResumeData((draft) => {
			if (data?.customSectionId) {
				const section = draft.customSections.find((s) => s.id === data.customSectionId);
				if (!section) return;
				const index = section.items.findIndex((item) => item.id === formData.id);
				if (index !== -1) section.items[index] = formData;
			} else {
				const index = draft.sections.experience.items.findIndex((item) => item.id === formData.id);
				if (index !== -1) draft.sections.experience.items[index] = formData;
			}
		});
		closeDialog();
	};

	return (
		<DialogContent>
			<DialogHeader>
				<DialogTitle className="flex items-center gap-x-2">
					<PencilSimpleLineIcon />
					<Trans>Update an existing experience</Trans>
				</DialogTitle>
				<DialogDescription />
			</DialogHeader>

			<Form {...form}>
				<form className="grid gap-4 sm:grid-cols-2" onSubmit={form.handleSubmit(onSubmit)}>
					<ExperienceForm />

					<DialogFooter className="sm:col-span-full">
						<Button variant="ghost" onClick={closeDialog}>
							<Trans>Cancel</Trans>
						</Button>

						<Button type="submit" disabled={form.formState.isSubmitting}>
							<Trans>Save Changes</Trans>
						</Button>
					</DialogFooter>
				</form>
			</Form>
		</DialogContent>
	);
}

function ExperienceForm() {
	const form = useFormContext<FormValues>();
	const resumeData = useResumeStore((state) => state.resume.data);
	const experienceId = form.getValues("id");
	// Watch the "description" field (was incorrectly watching "content")
	const description = useWatch({ control: form.control, name: "description" });
	const previousDescriptionRef = useRef(description); // Track previous description

	const isAIUpdatingRef = useRef(false);
	const roundsUsed = useResumeStore((state) => state.experienceAIRoundsUsed?.[experienceId] ?? 0);
	const incrementRoundsUsed = useResumeStore((state) => state.incrementExperienceRounds);

	const resetRounds = useResumeStore((state) => state.resetExperienceRounds);
	const maxRounds = 2;

	useEffect(() => {
		if (isAIUpdatingRef.current) {
			// Skip reset when AI updates description
			isAIUpdatingRef.current = false;
			previousDescriptionRef.current = description;
			return;
		}

		if (description !== previousDescriptionRef.current) {
			resetRounds(experienceId);
		}

		previousDescriptionRef.current = description;
	}, [description, resetRounds, experienceId]);

	const isWordCountValid = (() => {
		if (typeof description !== "string") return false;
		return description.trim().split(/\s+/).filter(Boolean).length >= 5;
	})();

	const { control } = form;

	const handleAIGenerated = (aiExperience: string) => {
		if (aiExperience && aiExperience.length > 10) {
			isAIUpdatingRef.current = true;

			form.setValue("description", aiExperience, {
				shouldDirty: true,
				shouldValidate: true,
			});

			incrementRoundsUsed(experienceId);
		}
	};

	return (
		<>
			<FormField
				control={control}
				name="company"
				render={({ field }) => (
					<FormItem>
						<FormLabel>
							<Trans>Company</Trans>
						</FormLabel>
						<FormControl>
							<Input {...field} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={control}
				name="position"
				render={({ field }) => (
					<FormItem>
						<FormLabel>
							<Trans>Position</Trans>
						</FormLabel>
						<FormControl>
							<Input {...field} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={control}
				name="location"
				render={({ field }) => (
					<FormItem>
						<FormLabel>
							<Trans>Location</Trans>
						</FormLabel>
						<FormControl>
							<Input {...field} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={control}
				name="startDate"
				render={({ field }) => (
					<FormItem>
						<FormLabel>
							<Trans>Start Date</Trans>
						</FormLabel>
						<FormControl>
							<Input type="date" {...field} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={control}
				name="endDate"
				render={({ field }) => (
					<FormItem>
						<FormLabel>
							<Trans>End Date</Trans>
						</FormLabel>
						<FormControl>
							<Input type="date" {...field} disabled={form.watch("currentlyWorkingHere")} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={control}
				name="currentlyWorkingHere"
				render={({ field }) => (
					<FormItem className="flex items-center gap-x-2">
						<FormControl>
							<Switch checked={field.value} onCheckedChange={field.onChange} />
						</FormControl>
						<FormLabel className="mt-0!">
							<Trans>Currently working here</Trans>
						</FormLabel>
					</FormItem>
				)}
			/>
			<FormField
				control={control}
				name="description"
				render={({ field }) => (
					<FormItem className="sm:col-span-full">
						<div className="flex items-center justify-between">
							<FormLabel>Description</FormLabel>

							<AIGenerateButton
								type="experience"
								data={{
									company: form.getValues("company"),
									position: form.getValues("position"),
									description: description,
								}}
								onGenerated={handleAIGenerated}
								roundsUsed={roundsUsed}
								maxRounds={maxRounds}
								isWordCountValid={isWordCountValid}
								disabled={roundsUsed >= maxRounds || !isWordCountValid} // Disable button after maxRounds
							/>
						</div>

						<FormControl>
							<RichInput {...field} value={field.value || ""} onChange={field.onChange} />
						</FormControl>

						{/* Status messages */}
						{!isWordCountValid && field.value && field.value.trim().split(/\s+/).filter(Boolean).length < 5 && (
							<p className="mt-1 text-amber-600 text-xs">
								<Trans>Write at least 5 words to enable Ask Zoe</Trans>
							</p>
						)}

						{roundsUsed === 1 && (
							<p className="mt-1 text-blue-600 text-xs">
								<Trans>You have 1 more AI suggestion left for this text.</Trans>
							</p>
						)}

						{roundsUsed >= maxRounds && (
							<p className="mt-1 font-medium text-red-600 text-xs">
								<Trans>✓ You've used both AI suggestions. Edit the text to get new suggestions.</Trans>
							</p>
						)}

						<FormMessage />
					</FormItem>
				)}
			/>
		</>
	);
}
