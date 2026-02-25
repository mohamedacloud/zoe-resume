import { zodResolver } from "@hookform/resolvers/zod";
import { Trans } from "@lingui/react/macro";
import { PencilSimpleLineIcon, PlusIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { useForm, useFormContext } from "react-hook-form";
import { toast } from "sonner";
import type z from "zod";
import { RichInput } from "@/components/input/rich-input";
import { useResumeStore } from "@/components/resume/store/resume";
import { Button } from "@/components/ui/button";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import type { DialogProps } from "@/dialogs/store";
import { useDialogStore } from "@/dialogs/store";
import { useFormBlocker } from "@/hooks/use-form-blocker";
import { summaryItemSchema } from "@/schema/resume/data";
import { generateProfessionalSummary } from "@/utils/ai-service";
import { generateId } from "@/utils/string";

const formSchema = summaryItemSchema;

type FormValues = z.infer<typeof formSchema>;

export function CreateSummaryItemDialog({ data }: DialogProps<"resume.sections.summary.create">) {
	const closeDialog = useDialogStore((state) => state.closeDialog);
	const updateResumeData = useResumeStore((state) => state.updateResumeData);

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
					<SummaryItemForm />

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
				if (!section) return;
				const index = section.items.findIndex((item) => item.id === formData.id);
				if (index !== -1) section.items[index] = formData;
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
					<SummaryItemForm />

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

function SummaryItemForm() {
	const form = useFormContext<FormValues>();
	const resumeData = useResumeStore((state) => state.resume.data);
	const [isGenerating, setIsGenerating] = useState(false);

	const handleAskZoe = async () => {
		setIsGenerating(true);

		try {
			const experienceItems = resumeData.sections.experience.items.slice(0, 2).map((exp) => ({
				company: exp.company,
				position: exp.position,
			}));

			const skillItems = resumeData.sections.skills.items.slice(0, 5).map((skill) => skill.name);

			const aiSummary = await generateProfessionalSummary({
				name: resumeData.basics.name,
				headline: resumeData.basics.headline,
				experience: experienceItems,
				skills: skillItems,
				currentSummary: form.getValues("content"),
			});

			form.setValue("content", aiSummary);
			toast.success("AI summary generated successfully!");
		} catch (error) {
			toast.error("Failed to generate summary");
			console.error("Error generating summary:", error);
		} finally {
			setIsGenerating(false);
		}
	};

	return (
		<>
			{/* 🔥 Ask Zoe ABOVE content */}
			<Button
				type="button"
				variant="secondary"
				className="float-right flex items-center gap-2 px-4 py-2"
				onClick={handleAskZoe}
				disabled={isGenerating}
				style={{ width: "150px", display: "flex", justifySelf: "flex-end" }}
			>
				<img src="/public/zoe-icon.png" alt="Zoe Icon" className="h-5 w-5" />
				{isGenerating ? "Generating..." : "Ask Zoe"}
			</Button>

			{/* Content Field */}
			<FormField
				control={form.control}
				name="content"
				render={({ field }) => {
					console.log("📝 Field Value:", field.value);

					return (
						<FormItem>
							<FormLabel>
								<Trans>Content</Trans>
							</FormLabel>
							<FormControl>
								<RichInput
									{...field}
									onChange={(value) => {
										console.log("✍️ RichInput Changed:", value);
										field.onChange(value);
									}}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					);
				}}
			/>

			{/* 🔥 Tips BELOW content */}
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
