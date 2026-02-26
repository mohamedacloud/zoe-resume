import { zodResolver } from "@hookform/resolvers/zod";
import { Trans } from "@lingui/react/macro";
import { PencilSimpleLineIcon, PlusIcon } from "@phosphor-icons/react";
import { useForm, useFormContext, useWatch } from "react-hook-form";
import type z from "zod";
import { RichInput } from "@/components/input/rich-input";
import { URLInput } from "@/components/input/url-input";
import { useResumeStore } from "@/components/resume/store/resume";
import { AIGenerateButton } from "@/components/ui/ai-generate-button";
import { Button } from "@/components/ui/button";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import type { DialogProps } from "@/dialogs/store";
import { useDialogStore } from "@/dialogs/store";
import { useAIUsage } from "@/hooks/use-ai-usage";
import { projectItemSchema } from "@/schema/resume/data";
import { generateId } from "@/utils/string";

const formSchema = projectItemSchema;

type FormValues = z.infer<typeof formSchema>;

export function CreateProjectDialog({ data }: DialogProps<"resume.sections.projects.create">) {
	const closeDialog = useDialogStore((state) => state.closeDialog);
	const updateResumeData = useResumeStore((state) => state.updateResumeData);

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			id: generateId(),
			hidden: data?.item?.hidden ?? false,
			options: data?.item?.options ?? { showLinkInTitle: false },
			name: data?.item?.name ?? "",
			period: data?.item?.period ?? "",
			website: data?.item?.website ?? { url: "", label: "" },
			description: data?.item?.description ?? "",
		},
	});

	const onSubmit = (formData: FormValues) => {
		updateResumeData((draft) => {
			if (data?.customSectionId) {
				const section = draft.customSections.find((s) => s.id === data.customSectionId);
				if (section) section.items.push(formData);
			} else {
				draft.sections.projects.items.push(formData);
			}
		});
		closeDialog();
	};

	return (
		<DialogContent>
			<DialogHeader>
				<DialogTitle className="flex items-center gap-x-2">
					<PlusIcon />
					<Trans>Create a new project</Trans>
				</DialogTitle>
				<DialogDescription />
			</DialogHeader>

			<Form {...form}>
				<form className="grid gap-4 sm:grid-cols-2" onSubmit={form.handleSubmit(onSubmit)}>
					<ProjectForm />

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

export function UpdateProjectDialog({ data }: DialogProps<"resume.sections.projects.update">) {
	const closeDialog = useDialogStore((state) => state.closeDialog);
	const updateResumeData = useResumeStore((state) => state.updateResumeData);

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			id: data.item.id,
			hidden: data.item.hidden,
			options: data.item.options ?? { showLinkInTitle: false },
			name: data.item.name,
			period: data.item.period,
			website: data.item.website,
			description: data.item.description,
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
				const index = draft.sections.projects.items.findIndex((item) => item.id === formData.id);
				if (index !== -1) draft.sections.projects.items[index] = formData;
			}
		});
		closeDialog();
	};

	return (
		<DialogContent>
			<DialogHeader>
				<DialogTitle className="flex items-center gap-x-2">
					<PencilSimpleLineIcon />
					<Trans>Update an existing project</Trans>
				</DialogTitle>
				<DialogDescription />
			</DialogHeader>

			<Form {...form}>
				<form className="grid gap-4 sm:grid-cols-2" onSubmit={form.handleSubmit(onSubmit)}>
					<ProjectForm />

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

// Update the ProjectForm component
function ProjectForm() {
	const form = useFormContext<FormValues>();
	const { control } = form;

	const name = useWatch({ control, name: "name" });
	const description = useWatch({ control, name: "description" });

	// Use the AI usage hook
	const { roundsUsed, canUseAI, recordAIUsage, isWordCountValid, maxRounds, roundsRemaining, hasReachedLimit } =
		useAIUsage(description || "", 2); // Ensure description is valid and the second argument is the correct limit

	const handleAIGenerated = (content: string) => {
		form.setValue("description", content, { shouldDirty: true });
	};

	return (
		<>
			<FormField
				control={control}
				name="name"
				render={({ field }) => (
					<FormItem>
						<FormLabel>
							<Trans>Name</Trans>
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
				name="period"
				render={({ field }) => (
					<FormItem>
						<FormLabel>
							<Trans>Period</Trans>
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
				name="website"
				render={({ field }) => (
					<FormItem className="sm:col-span-full">
						<FormLabel>
							<Trans>Website</Trans>
						</FormLabel>
						<FormControl>
							<URLInput
								{...field}
								value={field.value}
								onChange={field.onChange}
								hideLabelButton={form.watch("options.showLinkInTitle")}
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={control}
				name="options.showLinkInTitle"
				render={({ field }) => (
					<FormItem className="flex items-center gap-x-2 sm:col-span-full">
						<FormControl>
							<Switch checked={field.value} onCheckedChange={field.onChange} />
						</FormControl>
						<FormLabel className="mt-0!">
							<Trans>Show link in title</Trans>
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
							<FormLabel>
								<Trans>Description</Trans>
							</FormLabel>
							<AIGenerateButton
								type="projects"
								data={{
									name,
									technologies: "",
									description: field.value,
									highlights: "",
								}}
								onGenerated={handleAIGenerated}
								roundsUsed={roundsUsed}
								isWordCountValid={isWordCountValid}
								onRoundComplete={recordAIUsage}
							/>
						</div>
						<FormControl>
							<RichInput {...field} value={field.value} onChange={field.onChange} />
						</FormControl>
						{!isWordCountValid && field.value && field.value.trim().split(/\s+/).filter(Boolean).length < 5 && (
							<p className="mt-1 text-amber-600 text-xs">
								<Trans>Write at least 5 words to enable Ask Zoe</Trans>
							</p>
						)}
						<FormMessage />
					</FormItem>
				)}
			/>
			<FormField
				control={control}
				name="description"
				render={({ field }) => (
					<FormItem className="sm:col-span-full">
						<div className="flex items-center justify-between">
							<FormLabel>
								<Trans>Description</Trans>
							</FormLabel>
							<AIGenerateButton
								type="projects"
								data={{
									name,
									technologies: "",
									description: field.value,
									highlights: "",
								}}
								onGenerated={handleAIGenerated}
								roundsUsed={roundsUsed}
								maxRounds={2}
								roundsRemaining={2 - roundsUsed}
								hasReachedLimit={roundsUsed >= 2}
								isWordCountValid={isWordCountValid}
								onRoundComplete={recordAIUsage}
							/>
						</div>
						<FormControl>
							<RichInput {...field} value={field.value} onChange={field.onChange} />
						</FormControl>

						{/* Status messages */}
						{!isWordCountValid && field.value && field.value.trim().split(/\s+/).filter(Boolean).length < 5 && (
							<p className="mt-1 text-amber-600 text-xs">
								<Trans>Write at least 5 words to enable Ask Zoe</Trans>
							</p>
						)}

						{roundsUsed > 0 && roundsUsed < 2 && (
							<p className="mt-1 text-blue-600 text-xs">
								<Trans>
									You have {2 - roundsUsed} more AI suggestion{2 - roundsUsed !== 1 ? "s" : ""} left for this text.
								</Trans>
							</p>
						)}

						{roundsUsed >= 2 && (
							<p className="mt-1 font-medium text-red-600 text-xs">
								<Trans>✓ You've used both AI suggestions for this text. Edit the content to get new suggestions.</Trans>
							</p>
						)}

						<FormMessage />
					</FormItem>
				)}
			/>
		</>
	);
}
