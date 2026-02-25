import { zodResolver } from "@hookform/resolvers/zod";
import { Trans } from "@lingui/react/macro";
import { PencilSimpleLineIcon, PlusIcon } from "@phosphor-icons/react";
import { useForm, useFormContext } from "react-hook-form";
import type z from "zod";
import { RichInput } from "@/components/input/rich-input";
import { useResumeStore } from "@/components/resume/store/resume";
import { Button } from "@/components/ui/button";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import type { DialogProps } from "@/dialogs/store";
import { useDialogStore } from "@/dialogs/store";
import { useFormBlocker } from "@/hooks/use-form-blocker";
import { educationItemSchema } from "@/schema/resume/data";
import { generateId } from "@/utils/string";

const formSchema = educationItemSchema;

type FormValues = z.infer<typeof formSchema>;

export function CreateEducationDialog({ data }: DialogProps<"resume.sections.education.create">) {
	const closeDialog = useDialogStore((state) => state.closeDialog);
	const updateResumeData = useResumeStore((state) => state.updateResumeData);

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			id: generateId(),
			hidden: data?.item?.hidden ?? false,
			options: data?.item?.options ?? { showLinkInTitle: false },
			school: data?.item?.school ?? "",
			degree: data?.item?.degree ?? "",
			area: data?.item?.area ?? "",
			grade: data?.item?.grade ?? "",
			location: data?.item?.location ?? "",
			period: data?.item?.period ?? "",
			description: data?.item?.description ?? "",
			currentlyStudyingHere: data?.item?.currentlyStudyingHere ?? false,
			website: data?.item?.website ?? { url: "", label: "" },
		},
	});

	const onSubmit = (formData: FormValues) => {
		console.log("Form submission triggered");
		console.log("Form data:", formData);
		console.log("Calling updateResumeData with:", formData); // Log the data being passed to updateResumeData
		console.log("Form data passed to updateResumeData:", formData); // Inspect the structure and values of formData

		updateResumeData((draft) => {
			if (data?.customSectionId) {
				const section = draft.customSections.find((s) => s.id === data.customSectionId);
				if (section) {
					console.log("Updating custom section:", section); // Debugging log
					section.items.push(formData);
				}
			} else {
				console.log("Adding to education section:", draft.sections.education.items); // Debugging log
				draft.sections.education.items.push(formData);
			}
		});
		console.log("Closing dialog"); // Debugging log
		closeDialog(); // Ensure dialog closes after submission
	};

	const handleSubmit = form.handleSubmit(onSubmit); // Ensure handleSubmit is bound

	const { blockEvents, requestClose } = useFormBlocker(form);

	return (
		<DialogContent {...blockEvents}>
			<DialogHeader>
				<DialogTitle className="flex items-center gap-x-2">
					<PlusIcon />
					<Trans>Create a new education</Trans>
				</DialogTitle>
				<DialogDescription />
			</DialogHeader>

			<Form {...form}>
				<form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
					<EducationForm />

					<DialogFooter className="sm:col-span-full">
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

export function UpdateEducationDialog({ data }: DialogProps<"resume.sections.education.update">) {
	const closeDialog = useDialogStore((state) => state.closeDialog);
	const updateResumeData = useResumeStore((state) => state.updateResumeData);

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			id: data.item.id,
			hidden: data.item.hidden,
			options: data.item.options ?? { showLinkInTitle: false },
			school: data.item.school,
			degree: data.item.degree,
			area: data.item.area,
			grade: data.item.grade,
			location: data.item.location,
			period: data.item.period,
			description: data.item.description,
			currentlyStudyingHere: data.item.currentlyStudyingHere,
			website: data.item.website ?? { url: "", label: "" },
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
				const index = draft.sections.education.items.findIndex((item) => item.id === formData.id);
				if (index !== -1) draft.sections.education.items[index] = formData;
			}
		});
		closeDialog();
	};

	const { blockEvents, requestClose } = useFormBlocker(form);
console.log("Form errors:", form.formState.errors);
	return (
		<DialogContent {...blockEvents}>
			<DialogHeader>
				<DialogTitle className="flex items-center gap-x-2">
					<PencilSimpleLineIcon />
					<Trans>Update an existing education</Trans>
				</DialogTitle>
				<DialogDescription />
			</DialogHeader>

			<Form {...form}>
				<form className="grid gap-4 sm:grid-cols-2" onSubmit={form.handleSubmit(onSubmit)}>
					<EducationForm />

					<DialogFooter className="sm:col-span-full">
						<Button variant="ghost" onClick={requestClose}>
							<Trans>Cancel</Trans>
						</Button>

						<Button type="submit" disabled={form.formState.isSubmitting} onClick={() => console.log("Save Changes button clicked")}>
							<Trans>Save Changes</Trans>
						</Button>
					</DialogFooter>
				</form>
			</Form>
		</DialogContent>
	);
}

function EducationForm() {
	const form = useFormContext<FormValues>();

	return (
		<>
			<FormField
				control={form.control}
				name="school"
				render={({ field }) => (
					<FormItem>
						<FormLabel>
							<Trans>School</Trans>
						</FormLabel>
						<FormControl>
							<Input {...field} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name="degree"
				render={({ field }) => (
					<FormItem>
						<FormLabel>
							<Trans>Degree</Trans>
						</FormLabel>
						<FormControl>
							<Input {...field} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name="area"
				render={({ field }) => (
					<FormItem>
						<FormLabel>
							<Trans>Area of Study</Trans>
						</FormLabel>
						<FormControl>
							<Input {...field} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name="grade"
				render={({ field }) => (
					<FormItem>
						<FormLabel>
							<Trans>Grade</Trans>
						</FormLabel>
						<FormControl>
							<Input {...field} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
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
				control={form.control}
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
				control={form.control}
				name="currentlyStudyingHere"
				render={({ field }) => (
					<FormItem className="flex items-center gap-x-2">
						<FormControl>
							<Switch checked={field.value} onCheckedChange={field.onChange} />
						</FormControl>
						<FormLabel className="mt-0!">
							<Trans>Currently studying here</Trans>
						</FormLabel>
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name="description"
				render={({ field }) => (
					<FormItem className="sm:col-span-full">
						<FormLabel>
							<Trans>Description</Trans>
						</FormLabel>
						<FormControl>
							<RichInput {...field} value={field.value} onChange={field.onChange} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
		</>
	);
}
