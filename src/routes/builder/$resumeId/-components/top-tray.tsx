import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import {
	CaretDownIcon,
	CircleNotchIcon,
	DownloadSimpleIcon,
	FilePdfIcon,
	MagnifyingGlassIcon,
	MicrosoftWordLogoIcon,
	PaletteIcon,
	SwapIcon,
	TextTIcon,
} from "@phosphor-icons/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { toast } from "sonner";
import { ColorPicker } from "@/components/input/color-picker";
import { useResumeStore } from "@/components/resume/store/resume";
import { FontFamilyCombobox, FontWeightCombobox, getNextWeight } from "@/components/typography/combobox";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";
import { Popover, PopoverContent, PopoverHeader, PopoverTitle, PopoverTrigger } from "@/components/ui/popover";
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

	const isReviewing = useResumeStore((state) => state.isReviewing);
	const setReviewing = useResumeStore((state) => state.setReviewing);

	const onFinalReview = async () => {
		setReviewing(true);
		const toastId = toast.loading(t`AI is reviewing your resume...`, {
			description: t`Looking for improvements in layout, spacing, and content.`,
		});

		// Mock AI review process
		setTimeout(() => {
			setReviewing(false);
			toast.success(t`Review complete!`, {
				id: toastId,
				description: t`Zoe has finished reviewing your resume. Check the suggestions for improvements.`,
			});
		}, 5000);
	};

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

	const onDownloadDocx = async () => {
		toast.error(t`Word download is not yet implemented on the backend.`);
	};

	return (
		<div className="flex flex-wrap items-center justify-end gap-1.5 sm:gap-2">
			{/* Colors Button */}
			<Popover>
				<PopoverTrigger asChild>
					<Button size="sm" variant="outline" className="h-8 gap-1.5 px-2 sm:h-9 sm:gap-2 sm:px-3" aria-label="Colors">
						<PaletteIcon className="h-4 w-4" />
						<span className="hidden sm:inline">
							<Trans>Colors</Trans>
						</span>
					</Button>
				</PopoverTrigger>
				<PopoverContent
					className="w-[90vw] max-w-[min(400px,95vw)] p-3 sm:w-100 sm:p-4"
					onOpenAutoFocus={(e) => e.preventDefault()}
					side="bottom"
					align="center"
					sideOffset={8}
				>
					<PopoverHeader>
						<PopoverTitle className="text-sm sm:text-base">
							<Trans>Resume Colours</Trans>
						</PopoverTitle>
					</PopoverHeader>
					<ColorsPopoverContent />
				</PopoverContent>
			</Popover>

			{/* Fonts Button */}
			<Popover>
				<PopoverTrigger asChild>
					<Button size="sm" variant="outline" className="h-8 gap-1.5 px-2 sm:h-9 sm:gap-2 sm:px-3" aria-label="Fonts">
						<TextTIcon className="h-4 w-4" />
						<span className="hidden sm:inline">
							<Trans>Fonts</Trans>
						</span>
					</Button>
				</PopoverTrigger>
				<PopoverContent
					className="w-[90vw] max-w-[min(300px,95vw)] p-3 sm:mr-2 sm:w-100 sm:p-4"
					side="bottom"
					align="center"
					sideOffset={8}
				>
					<PopoverHeader>
						<PopoverTitle className="text-sm sm:text-base">
							<Trans>Typography Settings</Trans>
						</PopoverTitle>
					</PopoverHeader>
					<TypographyPopoverContent />
				</PopoverContent>
			</Popover>

			{/* Templates Button */}
			<Button
				size="sm"
				variant="outline"
				onClick={() => openDialog("resume.template.gallery", undefined)}
				className="h-8 gap-1.5 px-2 sm:h-9 sm:gap-2 sm:px-3"
				aria-label="Templates"
			>
				<SwapIcon className="h-4 w-4" />
				<span className="hidden sm:inline">
					<Trans>Templates</Trans>
				</span>
			</Button>

			<Button
				size="sm"
				disabled={isPrinting || isReviewing}
				className={cn(
					"bg-linear-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700",
					"border-0 shadow-sm transition-all duration-300",
					isReviewing && "scale-[0.98] brightness-90",
				)}
				onClick={onFinalReview}
			>
				{isReviewing ? <CircleNotchIcon className="animate-spin" /> : <MagnifyingGlassIcon className="text-white" />}
				<Trans>Final Review</Trans>
			</Button>

			{/* Consolidated Download button */}
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						size="sm"
						variant="default"
						disabled={isPrinting}
						className="bg-emerald-600 text-white hover:bg-emerald-700"
					>
						{isPrinting ? <CircleNotchIcon className={cn("animate-spin")} /> : <DownloadSimpleIcon />}
						<Trans>Download</Trans>
						<CaretDownIcon className="ms-1 size-3.5 opacity-50" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="min-w-[140px]">
					<DropdownMenuItem onClick={onDownloadPDF} disabled={isPrinting}>
						<FilePdfIcon className="size-4 text-red-500" />
						<Trans>Download PDF</Trans>
					</DropdownMenuItem>

					<DropdownMenuItem onClick={onDownloadDocx}>
						<MicrosoftWordLogoIcon className="size-4 text-blue-600" />
						<Trans>Download Word</Trans>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
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
		<div className="space-y-3 sm:space-y-4">
			<div className="space-y-1.5 sm:space-y-2">
				<p className="font-semibold text-[10px] text-muted-foreground tracking-wide sm:text-xs">
					<Trans>Primary Color</Trans>
				</p>
				<div className="flex items-center gap-2">
					<ColorPicker value={colors.primary} onValueChange={(value) => setColor("primary", value)} />
					<Input
						value={colors.primary}
						onChange={(e) => setColor("primary", e.target.value)}
						className="text-xs sm:text-sm"
					/>
				</div>
			</div>

			<div className="space-y-1.5 sm:space-y-2">
				<p className="font-semibold text-[10px] text-muted-foreground tracking-wide sm:text-xs">
					<Trans>Text Color</Trans>
				</p>
				<div className="flex items-center gap-2">
					<ColorPicker value={colors.text} onValueChange={(value) => setColor("text", value)} />
					<Input
						value={colors.text}
						onChange={(e) => setColor("text", e.target.value)}
						className="text-xs sm:text-sm"
					/>
				</div>
			</div>

			<div className="space-y-1.5 sm:space-y-2">
				<p className="font-semibold text-[10px] text-muted-foreground tracking-wide sm:text-xs">
					<Trans>Background Color</Trans>
				</p>
				<div className="flex items-center gap-2">
					<ColorPicker value={colors.background} onValueChange={(value) => setColor("background", value)} />
					<Input
						value={colors.background}
						onChange={(e) => setColor("background", e.target.value)}
						className="text-xs sm:text-sm"
					/>
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
			<div className="grid grid-cols-2 gap-3">
				<div className="min-w-0 space-y-2">
					<p className="font-semibold text-muted-foreground text-xs tracking-wide">
						<Trans>Font Family</Trans>
					</p>
					<FontFamilyCombobox
						buttonProps={{ className: "w-full" }}
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

				<div className="min-w-0 space-y-2">
					<p className="font-semibold text-muted-foreground text-xs tracking-wide">
						<Trans>Font Weight</Trans>
					</p>
					<FontWeightCombobox
						buttonProps={{ className: "w-full" }}
						fontFamily={typography.body.fontFamily}
						value={typography.body.fontWeights}
						onValueChange={(value: string[]) =>
							updateBody({
								fontWeights: value as ("100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900")[],
							})
						}
					/>
				</div>
			</div>

			<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
				<div className="space-y-1.5 sm:space-y-2">
					<p className="font-semibold text-[10px] text-muted-foreground tracking-wide sm:text-xs">
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
								if (value === "") {
									return;
								}
								updateBody({ fontSize: Number(value) });
							}}
							className="text-xs sm:text-sm"
						/>
						<InputGroupAddon>
							<InputGroupText className="text-xs sm:text-sm">
								<Trans>px</Trans>
							</InputGroupText>
						</InputGroupAddon>
					</InputGroup>
				</div>

				<div className="space-y-1.5 sm:space-y-2">
					<p className="font-semibold text-[10px] text-muted-foreground tracking-wide sm:text-xs">
						<Trans>Line Height</Trans>
					</p>
					<InputGroup>
						<InputGroupInput
							type="number"
							min={1}
							max={3}
							step={0.1}
							value={typography.body.lineHeight}
							onChange={(e) => {
								const value = e.target.value;
								if (value === "") {
									return;
								}
								updateBody({ lineHeight: Number(value) });
							}}
							className="text-xs sm:text-sm"
						/>
						<InputGroupAddon>
							<InputGroupText className="text-xs sm:text-sm">
								<Trans>em</Trans>
							</InputGroupText>
						</InputGroupAddon>
					</InputGroup>
				</div>
			</div>
		</div>
	);
}
