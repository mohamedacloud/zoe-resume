import { useLingui } from "@lingui/react";
import { Trans } from "@lingui/react/macro";
import { ArrowLeftIcon, SlideshowIcon } from "@phosphor-icons/react";
import { type RefObject, useRef } from "react";
import { CometCard } from "@/components/animation/comet-card";
import { useResumeStore } from "@/components/resume/store/resume";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { type DialogProps, useDialogStore } from "@/dialogs/store";
import { useIsMobile } from "@/hooks/use-mobile";
import type { Template } from "@/schema/templates";
import { cn } from "@/utils/style";
import { type TemplateMetadata, templates } from "./data";

export function TemplateGalleryDialog(_: DialogProps<"resume.template.gallery">) {
	const isMobile = useIsMobile();
	const scrollAreaRef = useRef<HTMLDivElement | null>(null);

	const closeDialog = useDialogStore((state) => state.closeDialog);
	const selectedTemplate = useResumeStore((state) => state.resume.data.metadata.template);
	const updateResumeData = useResumeStore((state) => state.updateResumeData);

	function onSelectTemplate(template: Template) {
		const templateMetadata = templates[template];

		updateResumeData((draft) => {
			draft.metadata.template = template;
			// Apply template default colors and typography
			draft.metadata.design.colors = { ...templateMetadata.defaults.design.colors };
			draft.metadata.typography = {
				body: { ...templateMetadata.defaults.typography.body },
				heading: { ...templateMetadata.defaults.typography.heading },
			};

			// Reorganize sections based on template's sidebar position
			const sidebarPosition = templateMetadata.sidebarPosition;

			// Define which sections typically go in sidebar vs main
			const sidebarSections = ["skills", "certifications", "awards", "languages", "interests", "publications"];

			// Get all current sections
			const allSections = [
				...new Set([...draft.metadata.layout.pages.flatMap((page) => [...page.main, ...page.sidebar])]),
			];

			// Reorganize based on sidebar position
			draft.metadata.layout.pages.forEach((page) => {
				if (sidebarPosition === "none") {
					// No sidebar - move everything to main
					page.main = allSections;
					page.sidebar = [];
					page.fullWidth = true;
				} else {
					// Has sidebar (left or right) - organize sections appropriately
					page.fullWidth = false;
					page.sidebar = allSections.filter((section) => sidebarSections.includes(section));
					page.main = allSections.filter((section) => !sidebarSections.includes(section));
				}
			});
		});

		closeDialog();
	}

	return (
		<DialogContent className="max-w-[95vw] p-4 sm:p-6 md:max-w-3xl lg:max-w-5xl">
			<DialogHeader className="gap-2">
				<div className="flex items-center gap-2">
					{isMobile && (
						<Button size="icon" variant="ghost" onClick={closeDialog} className="h-8 w-8 shrink-0">
							<ArrowLeftIcon className="h-5 w-5" />
						</Button>
					)}
					<DialogTitle className="flex items-center gap-2 text-base sm:gap-3 sm:text-xl">
						<SlideshowIcon className="h-4 w-4 sm:h-5 sm:w-5" />
						<Trans>Template Gallery</Trans>
					</DialogTitle>
				</div>
				<DialogDescription className="text-xs leading-relaxed sm:text-sm">
					<Trans>
						Here's a range of resume templates for different professions and personalities. Whether you prefer modern or
						classic, bold or simple, there is a design to match you. Look through the options below and choose a
						template that fits your style.
					</Trans>
				</DialogDescription>
			</DialogHeader>

			<ScrollArea ref={scrollAreaRef} className="max-h-[60svh] pb-4 sm:max-h-[70svh] sm:pb-8">
				<div className="grid grid-cols-1 gap-3 p-2 sm:grid-cols-2 sm:gap-4 sm:p-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
					{Object.entries(templates).map(([template, metadata]) => (
						<TemplateCard
							key={template}
							metadata={metadata}
							id={template as Template}
							collisionBoundary={scrollAreaRef}
							isActive={template === selectedTemplate}
							onSelect={onSelectTemplate}
						/>
					))}
				</div>
			</ScrollArea>
		</DialogContent>
	);
}

type TemplateCardProps = {
	id: Template;
	isActive?: boolean;
	metadata: TemplateMetadata;
	collisionBoundary: RefObject<HTMLDivElement | null>;
	onSelect: (template: Template) => void;
};

function TemplateCard({ id, metadata, isActive, collisionBoundary, onSelect }: TemplateCardProps) {
	const { i18n } = useLingui();

	return (
		<HoverCard openDelay={0} closeDelay={0}>
			<CometCard translateDepth={3} rotateDepth={6} glareOpacity={0}>
				<HoverCardTrigger asChild>
					<button
						tabIndex={-1}
						onClick={() => onSelect(id)}
						className={cn(
							"relative block aspect-page size-full cursor-pointer overflow-hidden rounded-md bg-popover outline-none",
							isActive && "ring-2 ring-ring ring-offset-4 ring-offset-background",
						)}
					>
						<img src={metadata.imageUrl} alt={metadata.name} className="size-full object-cover" />
					</button>
				</HoverCardTrigger>

				<div className="flex items-center justify-center">
					<span className="font-bold leading-loose tracking-tight">{metadata.name}</span>
				</div>

				<HoverCardContent
					side="right"
					sideOffset={-32}
					align="start"
					alignOffset={32}
					collisionBoundary={collisionBoundary.current}
					className="pointer-events-none! flex w-80 flex-col justify-between space-y-6 rounded-md bg-background/80 p-4 pb-6"
				>
					<div className="space-y-1">
						<h3 className="font-semibold text-lg">{metadata.name}</h3>
						<p className="text-muted-foreground">{i18n.t(metadata.description)}</p>
					</div>

					{metadata.tags.length > 0 && (
						<div className="flex flex-wrap gap-2">
							{metadata.tags
								.sort((a, b) => a.localeCompare(b))
								.map((tag) => (
									<Badge key={tag} variant="default">
										{tag}
									</Badge>
								))}
						</div>
					)}
				</HoverCardContent>
			</CometCard>
		</HoverCard>
	);
}
