import { zodResolver } from "@hookform/resolvers/zod";
import { Trans } from "@lingui/react/macro";
import { PencilSimpleLineIcon, PlusIcon } from "@phosphor-icons/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm, useFormContext, useWatch } from "react-hook-form";
import type z from "zod";
import { RichInput } from "@/components/input/rich-input";
import { useResumeStore } from "@/components/resume/store/resume";
import { AIGenerateButton } from "@/components/ui/ai-generate-button";
import { Button } from "@/components/ui/button";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import type { DialogProps } from "@/dialogs/store";
import { useDialogStore } from "@/dialogs/store";
import { useFormBlocker } from "@/hooks/use-form-blocker";
import { summaryItemSchema } from "@/schema/resume/data";
import { generateId } from "@/utils/string";

const formSchema = summaryItemSchema;

type FormValues = z.infer<typeof formSchema>;

export function CreateSummaryItemDialog({ data }: DialogProps<"resume.sections.summary.create">) {
	const closeDialog = useDialogStore((state) => state.closeDialog);
	const updateResumeData = useResumeStore((state) => state.updateResumeData);

	const [roundsUsed, setRoundsUsed] = useState(0);
	const maxRounds = 2;

	const incrementRoundsUsed = useCallback(() => {
		setRoundsUsed((prev) => {
			const newRounds = prev + 1;
			return newRounds <= maxRounds ? newRounds : prev; // Ensure it doesn't exceed maxRounds
		});
	}, []); // Removed maxRounds from dependencies

	const resetRounds = useCallback(() => {
		setRoundsUsed(0);
	}, []);

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			id: generateId(),
			hidden: data?.item?.hidden ?? false,
			content: data?.item?.content ?? "",
		},
	});

	const onSubmit = (formData: FormValues) => {
		updateResumeData((draft) => {
			if (data?.customSectionId) {
				const section = draft.customSections.find((s) => s.id === data.customSectionId);
				if (section) section.items.push(formData);
			}
		});
		closeDialog();
	};

	const { blockEvents, requestClose } = useFormBlocker(form);

	return (
		<DialogContent {...blockEvents}>
			<DialogHeader>
				<DialogTitle className="flex items-center gap-x-2">
					<PlusIcon />
					<Trans>Create a new summary item</Trans>
				</DialogTitle>
				<DialogDescription />
			</DialogHeader>

			<Form {...form}>
				<form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
					<SummaryItemForm aiUsage={{ roundsUsed, maxRounds, incrementRoundsUsed, resetRounds }} />

					<DialogFooter>
						<Button variant="ghost" onClick={requestClose}>
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

export function UpdateSummaryItemDialog({ data }: DialogProps<"resume.sections.summary.update">) {
	const closeDialog = useDialogStore((state) => state.closeDialog);
	const updateResumeStore = useResumeStore((state) => state.updateResumeData);

	const [roundsUsed, setRoundsUsed] = useState(0);
	const maxRounds = 2;

	const incrementRoundsUsed = useCallback(() => {
		setRoundsUsed((prev) => {
			const newRounds = prev + 1;
			return newRounds <= maxRounds ? newRounds : prev; // Ensure it doesn't exceed maxRounds
		});
	}, []); // Removed maxRounds from dependencies

	const resetRounds = useCallback(() => {
		setRoundsUsed(0);
	}, []);

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			id: data.item.id,
			hidden: data.item.hidden,
			content: data.item.content,
		},
	});

	const onSubmit = (formData: FormValues) => {
		updateResumeStore((draft) => {
			if (data?.customSectionId) {
				const section = draft.customSections.find((s) => s.id === data.customSectionId);

				if (!section) {
					return;
				}

				const index = section.items.findIndex((item) => item.id === formData.id);

				if (index !== -1) {
					section.items[index] = formData;
				}
			} else {
				draft.summary.content = formData.content;
			}
		});

		closeDialog();
	};

	const { blockEvents, requestClose } = useFormBlocker(form);

	return (
		<DialogContent {...blockEvents}>
			<DialogHeader>
				<DialogTitle className="flex items-center gap-x-2">
					<PencilSimpleLineIcon />
					<Trans>Update an existing summary item</Trans>
				</DialogTitle>
				<DialogDescription />
			</DialogHeader>

			<Form {...form}>
				<form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
					<SummaryItemForm aiUsage={{ roundsUsed, maxRounds, incrementRoundsUsed, resetRounds }} />

					<DialogFooter>
						<Button variant="ghost" onClick={requestClose}>
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

function SummaryItemForm({
	aiUsage,
}: {
	aiUsage: {
		roundsUsed: number;
		maxRounds: number;
		incrementRoundsUsed: () => void;
		resetRounds: () => void;
	};
}) {
	const form = useFormContext<FormValues>();
	const resumeData = useResumeStore((state) => state.resume.data);

	const content = useWatch({ control: form.control, name: "content" });
	const previousContentRef = useRef(content); // Track previous content

	// const { roundsUsed, maxRounds, incrementRoundsUsed, resetRounds } = aiUsage;
	const isAIUpdatingRef = useRef(false);
	const roundsUsed = useResumeStore((state) => state.summaryAIRoundsUsed);
	const incrementRoundsUsed = useResumeStore((state) => state.incrementSummaryRounds);
	const resetRounds = useResumeStore((state) => state.resetSummaryRounds);

	const maxRounds = 2;
	// Reset rounds when content changes
	useEffect(() => {
		if (isAIUpdatingRef.current) {
			// Skip reset when AI updates content
			isAIUpdatingRef.current = false;
			previousContentRef.current = content;
			return;
		}

		if (content !== previousContentRef.current) {
			resetRounds();
		}

		previousContentRef.current = content;
	}, [content, resetRounds]);

	const isWordCountValid = (() => {
		if (typeof content !== "string") return false;
		return content.trim().split(/\s+/).filter(Boolean).length >= 5;
	})();

	const handleAIGenerated = (aiSummary: string) => {
		if (aiSummary && aiSummary.length > 10) {
			isAIUpdatingRef.current = true;

			form.setValue("content", aiSummary, {
				shouldDirty: true,
				shouldValidate: true,
			});

			incrementRoundsUsed();
		}
	};

	return (
		<>
			<FormField
				control={form.control}
				name="content"
				render={({ field }) => {
					return (
						<FormItem>
							<div className="flex items-center justify-between">
								<FormLabel>
									<Trans>Content</Trans>
								</FormLabel>
								<AIGenerateButton
									type="summary"
									data={{
										name: resumeData.basics.name,
										headline: resumeData.basics.headline,
										experience: resumeData.sections.experience.items.slice(0, 2),
										skills: resumeData.sections.skills.items.slice(0, 5).map((skill) => skill.name),
										currentSummary: typeof field.value === "string" ? field.value : "",
									}}
									onGenerated={handleAIGenerated}
									roundsUsed={roundsUsed}
									maxRounds={maxRounds}
									isWordCountValid={isWordCountValid}
									disabled={roundsUsed >= maxRounds || !isWordCountValid} // Disable button after maxRounds
								/>
							</div>
							<FormControl>
								<RichInput
									{...field}
									value={field.value}
									onChange={(value) => {
										field.onChange(value);
									}}
								/>
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
					);
				}}
			/>
			<div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
				<h4 className="mb-2 font-semibold text-blue-900 text-sm">
					<Trans>Summary Writing Tips</Trans>
				</h4>
				<ul className="space-y-1 text-blue-800 text-xs">
					<li>
						• <Trans>Start with your job title and years of experience</Trans>
					</li>
					<li>
						• <Trans>Highlight 2-3 key skills or achievements</Trans>
					</li>
					<li>
						• <Trans>Mention what makes you unique</Trans>
					</li>
					<li>
						• <Trans>Keep it concise and relevant</Trans>
					</li>
				</ul>
			</div>
		</>
	);
}
