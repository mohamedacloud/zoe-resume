import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { CircleNotchIcon, FilePdfIcon, PaletteIcon, SwapIcon, TextTIcon } from "@phosphor-icons/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { toast } from "sonner";
import { ColorPicker } from "@/components/input/color-picker";
import { FontFamilyCombobox, FontWeightCombobox, getNextWeight } from "@/components/typography/combobox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";
import {
	Popover,
	PopoverContent,
	PopoverHeader,
	PopoverTitle,
	PopoverTrigger,
} from "@/components/ui/popover";
import { useResumeStore } from "@/components/resume/store/resume";
import { useDialogStore } from "@/dialogs/store";
import { orpc } from "@/integrations/orpc/client";
import { downloadFromUrl, generateFilename } from "@/utils/file";
import { cn } from "@/utils/style";

export function BuilderTopTray() {
	const openDialog = useDialogStore((state) => state.openDialog);
	const params = useParams({ from: "/builder/$resumeId" });
	const { data: resume } = useQuery(orpc.resume.getById.queryOptions({ input: { id: params.resumeId } }));

	const { mutateAsync: printResumeAsPDF, isPending: isPrinting } = useMutation(
		orpc.printer.printResumeAsPDF.mutationOptions(),
	);

	const onDownloadPDF = async () => {
		if (!resume?.id) return;
		const filename = generateFilename(resume.data.basics.name, "pdf");
		const toastId = toast.loading(t`Please wait while your PDF is being generated...`, {
			description: t`This may take a while depending on the server capacity. Please do not close the window or refresh the page.`,
		});

		try {
			const { url } = await printResumeAsPDF({ id: resume.id });
			downloadFromUrl(url, filename);
		} catch {
			toast.error(t`There was a problem while generating the PDF, please try again in some time.`);
		} finally {
			toast.dismiss(toastId);
		}
	};

	return (
		<div className="flex items-center gap-2">
			<Popover>
				<PopoverTrigger asChild>
					<Button size="sm" variant="outline">
						<PaletteIcon />
						<Trans>Colours</Trans>
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-[320px]">
					<PopoverHeader>
						<PopoverTitle>
							<Trans>Resume Colours</Trans>
						</PopoverTitle>
					</PopoverHeader>
					<ColorsPopoverContent />
				</PopoverContent>
			</Popover>

			<Popover>
				<PopoverTrigger asChild>
					<Button size="sm" variant="outline">
						<TextTIcon />
						<Trans>Fonts</Trans>
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-[320px]">
					<PopoverHeader>
						<PopoverTitle>
							<Trans>Typography Settings</Trans>
						</PopoverTitle>
					</PopoverHeader>
					<TypographyPopoverContent />
				</PopoverContent>
			</Popover>

			<Button
				size="sm"
				variant="outline"
				onClick={() => openDialog("resume.template.gallery", undefined)}
			>
				<SwapIcon />
				<Trans>Templates</Trans>
			</Button>

			<Button
				size="sm"
				variant="default"
				onClick={onDownloadPDF}
				disabled={isPrinting}
				className="bg-emerald-600 text-white hover:bg-emerald-700"
			>
				{isPrinting ? <CircleNotchIcon className={cn("animate-spin")} /> : <FilePdfIcon />}
				<Trans>Download</Trans>
			</Button>
		</div>
	);
}

function ColorsPopoverContent() {
	const colors = useResumeStore((state) => state.resume.data.metadata.design.colors);
	const updateResumeData = useResumeStore((state) => state.updateResumeData);

	const setColor = (key: "primary" | "text" | "background", value: string) => {
		updateResumeData((draft) => {
			draft.metadata.design.colors[key] = value;
		});
	};

	return (
		<div className="space-y-4">
			<div className="space-y-2">
				<p className="text-xs font-semibold tracking-wide text-muted-foreground">
					<Trans>Primary Color</Trans>
				</p>
				<div className="flex items-center gap-2">
					<ColorPicker value={colors.primary} onValueChange={(value) => setColor("primary", value)} />
					<Input value={colors.primary} onChange={(e) => setColor("primary", e.target.value)} />
				</div>
			</div>

			<div className="space-y-2">
				<p className="text-xs font-semibold tracking-wide text-muted-foreground">
					<Trans>Text Color</Trans>
				</p>
				<div className="flex items-center gap-2">
					<ColorPicker value={colors.text} onValueChange={(value) => setColor("text", value)} />
					<Input value={colors.text} onChange={(e) => setColor("text", e.target.value)} />
				</div>
			</div>

			<div className="space-y-2">
				<p className="text-xs font-semibold tracking-wide text-muted-foreground">
					<Trans>Background Color</Trans>
				</p>
				<div className="flex items-center gap-2">
					<ColorPicker value={colors.background} onValueChange={(value) => setColor("background", value)} />
					<Input value={colors.background} onChange={(e) => setColor("background", e.target.value)} />
				</div>
			</div>
		</div>
	);
}

function TypographyPopoverContent() {
	const typography = useResumeStore((state) => state.resume.data.metadata.typography);
	const updateResumeData = useResumeStore((state) => state.updateResumeData);

	const updateBody = (data: Partial<typeof typography.body>) => {
		updateResumeData((draft) => {
			draft.metadata.typography.body = { ...draft.metadata.typography.body, ...data };
		});
	};

	return (
		<div className="space-y-4">
			<div className="space-y-2">
				<p className="text-xs font-semibold tracking-wide text-muted-foreground">
					<Trans>Font Family</Trans>
				</p>
				<FontFamilyCombobox
					value={typography.body.fontFamily}
					onValueChange={(value) => {
						if (value === null) return;
						const nextWeight = getNextWeight(value);
						updateBody({
							fontFamily: value,
							fontWeights: nextWeight ? [nextWeight] : typography.body.fontWeights,
						});
					}}
				/>
			</div>

			<div className="space-y-2">
				<p className="text-xs font-semibold tracking-wide text-muted-foreground">
					<Trans>Font Weight</Trans>
				</p>
				<FontWeightCombobox
					fontFamily={typography.body.fontFamily}
					value={typography.body.fontWeights}
					onValueChange={(value) => updateBody({ fontWeights: value })}
				/>
			</div>

			<div className="grid grid-cols-2 gap-3">
				<div className="space-y-2">
					<p className="text-xs font-semibold tracking-wide text-muted-foreground">
						<Trans>Size</Trans>
					</p>
					<InputGroup>
						<InputGroupInput
							type="number"
							min={6}
							max={24}
							step={0.1}
							value={typography.body.fontSize}
							onChange={(e) => {
								const value = e.target.value;
								if (value === "") return;
								updateBody({ fontSize: Number(value) });
							}}
						/>
						<InputGroupAddon align="inline-end">
							<InputGroupText>pt</InputGroupText>
						</InputGroupAddon>
					</InputGroup>
				</div>

				<div className="space-y-2">
					<p className="text-xs font-semibold tracking-wide text-muted-foreground">
						<Trans>Line Height</Trans>
					</p>
					<InputGroup>
						<InputGroupInput
							type="number"
							min={0.5}
							max={4}
							step={0.05}
							value={typography.body.lineHeight}
							onChange={(e) => {
								const value = e.target.value;
								if (value === "") return;
								updateBody({ lineHeight: Number(value) });
							}}
						/>
						<InputGroupAddon align="inline-end">
							<InputGroupText>x</InputGroupText>
						</InputGroupAddon>
					</InputGroup>
				</div>
			</div>
		</div>
	);
}
