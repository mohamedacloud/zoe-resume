import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import {
	CircleNotchIcon,
	DownloadSimpleIcon,
	FilePdfIcon,
	MicrosoftWordLogoIcon,
	PaletteIcon,
	ShieldWarningIcon,
	SwapIcon,
	TextTIcon,
} from "@phosphor-icons/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
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
import { ReviewDrawer } from "@/components/ui/review-drawer";
import { useDialogStore } from "@/dialogs/store";
import { orpc } from "@/integrations/orpc/client";
import { downloadFromUrl, generateFilename } from "@/utils/file";
import { cn } from "@/utils/style";
import { AnimatedEyes } from "./animated-eyes";

export function BuilderTopTray() {
	const openDialog = useDialogStore((state) => state.openDialog);
	const params = useParams({ from: "/builder/$resumeId" });
	const { data: resume } = useQuery(orpc.resume.getById.queryOptions({ input: { id: params.resumeId } }));

	const { mutateAsync: printResumeAsPDF, isPending: isPrinting } = useMutation(
		orpc.printer.printResumeAsPDF.mutationOptions(),
	);

	const { mutateAsync: runFinalReview } = useMutation(orpc.ai.finalReview.mutationOptions());

	const isReviewing = useResumeStore((state) => state.isReviewing);
	const setReviewing = useResumeStore((state) => state.setReviewing);
	const setReviewResult = useResumeStore((state) => state.setReviewResult);
	const setShowReviewDrawer = useResumeStore((state) => state.setShowReviewDrawer);
	const reviewResult = useResumeStore((state) => state.reviewResult);
	const reviewAttempts = useResumeStore((state) => state.reviewAttempts);
	const incrementReviewAttempts = useResumeStore((state) => state.incrementReviewAttempts);

	const [reviewStartTime, setReviewStartTime] = useState<number>(0);
	const fallbackTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	const provider = import.meta.env.VITE_AI_PROVIDER || "gemini";
	const model = import.meta.env.VITE_AI_MODEL || "gemini-2.0-flash-exp";
	const apiKey = import.meta.env.VITE_AI_API_KEY || "";
	const baseURL = import.meta.env.VITE_AI_BASE_URL || "https://generativelanguage.googleapis.com/v1beta";

	const isConfigured = !!apiKey && !!model;

	useEffect(() => {
		return () => {
			if (fallbackTimeoutRef.current) {
				clearTimeout(fallbackTimeoutRef.current);
			}
		};
	}, []);

	const onFinalReview = async () => {
		if (!resume || !isConfigured) {
			toast.error(t`AI is not configured. Please set VITE_AI_API_KEY and VITE_AI_MODEL in your .env file.`);
			return;
		}

		// Check if limit is reached
		if (reviewAttempts >= 2) {
			toast.error(t`Review limit reached. You have already used both attempts.`);
			return;
		}

		// Increment attempts before starting review
		incrementReviewAttempts();

		setReviewing(true);
		setReviewStartTime(Date.now());

		const toastId = toast.loading(t`AI is reviewing your resume...`, {
			description: t`Looking for improvements in layout, spacing, and content.`,
		});

		// Show fallback message if API takes too long
		fallbackTimeoutRef.current = setTimeout(() => {
			if (isReviewing) {
				toast.loading(t`Still analyzing your resume...`, {
					id: toastId,
					description: t`This is taking a bit longer than expected, please wait...`,
				});
			}
		}, 6000);

		try {
			const result = await runFinalReview({
				provider,
				model,
				apiKey,
				baseURL,
				resume: resume.data as Record<string, unknown>,
				photo: {
					url: resume.data.picture?.url,
					visible: !resume.data.picture?.hidden,
				},
			});

			// Ensure minimum 1.2 seconds loading time for UX
			const elapsedTime = Date.now() - reviewStartTime;
			const remainingTime = Math.max(0, 1200 - elapsedTime);

			await new Promise((resolve) => setTimeout(resolve, remainingTime));

			if (fallbackTimeoutRef.current) {
				clearTimeout(fallbackTimeoutRef.current);
			}

			setReviewing(false);
			setReviewResult(result);
			setShowReviewDrawer(true);

			toast.success(t`Review complete!`, {
				id: toastId,
				description: t`Score: ${result.overall_score}/100 - ${result.final_verdict === "READY" ? "Ready to export!" : "Check suggestions for improvements"}`,
			});
		} catch (error) {
			if (fallbackTimeoutRef.current) {
				clearTimeout(fallbackTimeoutRef.current);
			}

			setReviewing(false);
			console.error("Final Review Error:", error);

			toast.error(t`Review failed. Please try again.`, {
				id: toastId,
				description: t`There was an error analyzing your resume. Please check your AI configuration.`,
			});
		}
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

			{/* Final Review Button with Warning */}
			<div className="flex flex-col items-end gap-1">
				<Button
					size="sm"
					variant="outline"
					disabled={isPrinting || isReviewing || reviewAttempts >= 2}
					className={cn(
						"flex items-center justify-center gap-1.5 px-2 sm:h-9 sm:w-auto sm:gap-2 sm:px-3",
						"bg-linear-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700",
						"border-0 shadow-sm transition-all duration-300",
						isReviewing && "scale-[0.98] brightness-90",
						reviewAttempts >= 2 && "cursor-not-allowed opacity-50",
					)}
					onClick={onFinalReview}
					aria-label="Final Review"
				>
					{isReviewing ? (
						<CircleNotchIcon className="animate-spin" />
					) : (
						<motion.div whileHover={{ scale: 1.1 }}>
							<AnimatedEyes />
						</motion.div>
					)}{" "}
					<span className="hidden sm:inline">
						<Trans>Final Review</Trans>
					</span>
				</Button>
				{/* Warning Message */}
				{reviewAttempts === 1 && (
					<motion.p
						initial={{ opacity: 0, y: -5 }}
						animate={{ opacity: 1, y: 0 }}
						className="font-medium text-red-600 text-xs dark:text-red-400"
					>
						⚠️ <Trans>One attempt left only!</Trans>
					</motion.p>
				)}
				{reviewAttempts >= 2 && (
					<motion.p
						initial={{ opacity: 0, y: -5 }}
						animate={{ opacity: 1, y: 0 }}
						className="font-medium text-red-600 text-xs dark:text-red-400"
					>
						🚫 <Trans>Review limit reached</Trans>
					</motion.p>
				)}
			</div>

			{/* View Last Review Button - Only shows if review result exists */}
			{reviewResult && !isReviewing && (
				<Button
					size="sm"
					variant="outline"
					onClick={() => setShowReviewDrawer(true)}
					className="h-8 gap-1.5 px-2 sm:h-9 sm:gap-2 sm:px-3"
					aria-label="View Last Review"
					title="View your last review results"
				>
					<ShieldWarningIcon className="h-4 w-4" />
					<span className="hidden sm:inline">
						<Trans>View Review</Trans>
					</span>
				</Button>
			)}

			{/* Consolidated Download button */}
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						size="sm"
						variant="default"
						disabled={isPrinting || (reviewResult?.critical && reviewResult.critical.length > 0)}
						className="flex items-center justify-center gap-1.5 bg-emerald-600 px-2 text-white hover:bg-emerald-700 sm:h-9 sm:w-auto sm:gap-2 sm:px-3"
						aria-label="Download"
					>
						{isPrinting ? <CircleNotchIcon className={cn("animate-spin")} /> : <DownloadSimpleIcon />}
						<span className="hidden sm:inline">
							<Trans>Download</Trans>
						</span>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="min-w-35">
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

			{/* Review Drawer */}
			{reviewResult && <ReviewDrawer result={reviewResult} />}
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
								const parsed = Number(e.target.value);
								if (Number.isNaN(parsed)) return;
								updateBody({ fontSize: parsed });
							}}
						/>
						<InputGroupAddon>
							<InputGroupText>px</InputGroupText>
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
							step={0.01}
							value={typography.body.lineHeight ?? 1.4}
							onChange={(e) => {
								const parsed = Number(e.target.value);
								if (Number.isNaN(parsed)) return;
								updateBody({ lineHeight: parsed });
							}}
						/>
						<InputGroupAddon>
							<InputGroupText>em</InputGroupText>
						</InputGroupAddon>
					</InputGroup>
				</div>
			</div>
		</div>
	);
}
