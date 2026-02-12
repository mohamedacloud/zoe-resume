import {
	DownloadIcon,
	LayoutIcon,
	NotepadIcon,
	PaletteIcon,
	ReadCvLogoIcon,
	ShareFatIcon,
	TextTIcon,
} from "@phosphor-icons/react";
import { useState } from "react";
import { useResumeStore } from "@/components/resume/store/resume";
import { Button } from "@/components/ui/button";
import {
	DesignDialog,
	ExportDialog,
	LayoutDialog,
	NotesDialog,
	PageDialog,
	SharingDialog,
	TypographyDialog,
} from "./section-dialogs";

/* ============================================
   OLD IMPORTS (Commented out - used in old header)
   ============================================
import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import {
    CaretDownIcon,
    CopySimpleIcon,
    HouseSimpleIcon,
    LockSimpleIcon,
    LockSimpleOpenIcon,
    PencilSimpleLineIcon,
    SidebarSimpleIcon,
    TrashSimpleIcon,
} from "@phosphor-icons/react";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDialogStore } from "@/dialogs/store";
import { useConfirm } from "@/hooks/use-confirm";
import { orpc } from "@/integrations/orpc/client";
import { useBuilderSidebar } from "../-store/sidebar";
*/

export function BuilderHeader() {
	const name = useResumeStore((state) => state.resume.name);
	const [openSection, setOpenSection] = useState<string | null>(null);
	const [exportOpen, setExportOpen] = useState(false);
	const [sharingOpen, setSharingOpen] = useState(false);
	const [pageOpen, setPageOpen] = useState(false);
	const [designOpen, setDesignOpen] = useState(false);
	const [typographyOpen, setTypographyOpen] = useState(false);
	const [layoutOpen, setLayoutOpen] = useState(false);

	// Separate export and sharing from other sections
	const regularSections = [
		// { icon: FileCssIcon, title: "Custom CSS", section: "css", component: CSSDialog },
		{ icon: NotepadIcon, title: "Cover Letter", section: "notes", component: NotesDialog },
	];

	// Layout, Typography, Design, and Page sections open as side panels
	const layoutSectionItem = { icon: LayoutIcon, title: "Layout", section: "layout", component: LayoutDialog };
	const typographySectionItem = {
		icon: TextTIcon,
		title: "Typography",
		section: "typography",
		component: TypographyDialog,
	};
	const designSectionItem = { icon: PaletteIcon, title: "Design", section: "design", component: DesignDialog };
	const pageSectionItem = { icon: ReadCvLogoIcon, title: "Page", section: "page", component: PageDialog };

	const handleSectionClick = (section: string) => {
		setOpenSection(section);
	};

	return (
		<>
			<header className="z-10 flex shrink-0 items-center justify-between border-gray-200 border-b bg-white px-6 py-3">
				<div className="flex items-center gap-4">
					<div className="flex items-center gap-3">
						<img src="/src/dialogs/resume/zoe-talking.png" alt="Zoe AI" className="h-10 w-8 rounded-full" />
						<div>
							<h1 className="font-bold text-gray-900 text-lg">Zoe Resume Builder</h1>
							<p className="text-gray-500 text-xs">{name || "Untitled Resume"}</p>
						</div>
					</div>
				</div>

			<div className="flex items-center gap-1">
				{/* Layout Button - Opens as Side Panel */}
				<Button
					variant="ghost"
					onClick={() => setLayoutOpen(!layoutOpen)}
					className="h-9 gap-2 px-3 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
				>
					<layoutSectionItem.icon className="h-5 w-5" />
					<span className="font-medium text-sm">{layoutSectionItem.title}</span>
				</Button>

				{/* Design Button - Opens as Side Panel */}
				<Button
					variant="ghost"
					onClick={() => setDesignOpen(!designOpen)}
					className="h-9 gap-2 px-3 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
				>
					<designSectionItem.icon className="h-5 w-5" />
					<span className="font-medium text-sm">{designSectionItem.title}</span>
				</Button>

				{/* Page Button - Opens as Side Panel */}
				<Button
					variant="ghost"
					onClick={() => setPageOpen(!pageOpen)}
					className="h-9 gap-2 px-3 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
				>
					<pageSectionItem.icon className="h-5 w-5" />
					<span className="font-medium text-sm">{pageSectionItem.title}</span>
				</Button>

				{/* Typography Button - Opens as Side Panel */}
				<Button
					variant="ghost"
					onClick={() => setTypographyOpen(!typographyOpen)}
					className="h-9 gap-2 px-3 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
				>
					<typographySectionItem.icon className="h-5 w-5" />
					<span className="font-medium text-sm">{typographySectionItem.title}</span>
				</Button>

				{regularSections.map((btn) => (
					<Button
						key={btn.section}
						variant="ghost"
						onClick={() => handleSectionClick(btn.section)}
						className="h-9 gap-2 px-3 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
					>
						<btn.icon className="h-5 w-5" />
						<span className="font-medium text-sm">{btn.title}</span>
					</Button>
				))}

				{/* Sharing Button - Opens as Side Panel */}
				<Button
					variant="ghost"
					onClick={() => setSharingOpen(!sharingOpen)}
					className="h-9 gap-2 px-3 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
				>
					<ShareFatIcon className="h-5 w-5" />
					<span className="font-medium text-sm">Share</span>
				</Button>

				{/* Export Button - Opens as Side Panel */}
				<Button
					variant="ghost"
					onClick={() => setExportOpen(!exportOpen)}
					className="h-9 gap-2 px-3 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
				>
					<DownloadIcon className="h-5 w-5" />
					<span className="font-medium text-sm">Export</span>
				</Button>
			</div>
		</header>			{/* Cover Letter Dialog - Side Panel on Right */}
			{openSection === "notes" && (
				<div className="fixed top-18.25 right-0 z-50 h-[calc(100vh-73px)] w-100 overflow-y-auto border-gray-200 border-l bg-white shadow-lg">
					<div className="p-6">
						<div className="mb-4 flex items-center justify-between">
							<h2 className="font-semibold text-gray-900 text-xl">Cover Letter</h2>
							<Button
								size="icon"
								variant="ghost"
								onClick={() => setOpenSection(null)}
								className="h-8 w-8 text-gray-500 hover:text-gray-900"
							>
								<span className="text-xl">×</span>
							</Button>
						</div>
						<NotesDialog />
					</div>
				</div>
			)}

			{/* Layout Settings - Side Panel */}
			{layoutOpen && (
				<div className="fixed top-18.25 right-0 z-50 h-[calc(100vh-73px)] w-100 overflow-y-auto border-gray-200 border-l bg-white shadow-lg">
					<div className="p-6">
						<div className="mb-4 flex items-center justify-between">
							<h2 className="font-semibold text-gray-900 text-xl">{layoutSectionItem.title}</h2>
							<Button
								size="icon"
								variant="ghost"
								onClick={() => setLayoutOpen(false)}
								className="h-8 w-8 text-gray-500 hover:text-gray-900"
							>
								<span className="text-xl">×</span>
							</Button>
						</div>
						<LayoutDialog />
					</div>
				</div>
			)}

			{/* Typography Settings - Side Panel */}
			{typographyOpen && (
				<div className="fixed top-18.25 right-0 z-50 h-[calc(100vh-73px)] w-100 overflow-y-auto border-gray-200 border-l bg-white shadow-lg">
					<div className="p-6">
						<div className="mb-4 flex items-center justify-between">
							<h2 className="font-semibold text-gray-900 text-xl">{typographySectionItem.title}</h2>
							<Button
								size="icon"
								variant="ghost"
								onClick={() => setTypographyOpen(false)}
								className="h-8 w-8 text-gray-500 hover:text-gray-900"
							>
								<span className="text-xl">×</span>
							</Button>
						</div>
						<TypographyDialog />
					</div>
				</div>
			)}

			{/* Design Settings - Side Panel */}
			{designOpen && (
				<div className="fixed top-18.25 right-0 z-50 h-[calc(100vh-73px)] w-100 overflow-y-auto border-gray-200 border-l bg-white shadow-lg">
					<div className="p-6">
						<div className="mb-4 flex items-center justify-between">
							<h2 className="font-semibold text-gray-900 text-xl">{designSectionItem.title}</h2>
							<Button
								size="icon"
								variant="ghost"
								onClick={() => setDesignOpen(false)}
								className="h-8 w-8 text-gray-500 hover:text-gray-900"
							>
								<span className="text-xl">×</span>
							</Button>
						</div>
						<DesignDialog />
					</div>
				</div>
			)}

			{/* Page Settings - Side Panel */}
			{pageOpen && (
				<div className="fixed top-18.25 right-0 z-50 h-[calc(100vh-73px)] w-100 overflow-y-auto border-gray-200 border-l bg-white shadow-lg">
					<div className="p-6">
						<div className="mb-4 flex items-center justify-between">
							<h2 className="font-semibold text-gray-900 text-xl">{pageSectionItem.title}</h2>
							<Button
								size="icon"
								variant="ghost"
								onClick={() => setPageOpen(false)}
								className="h-8 w-8 text-gray-500 hover:text-gray-900"
							>
								<span className="text-xl">×</span>
							</Button>
						</div>
						<PageDialog />
					</div>
				</div>
			)}

			{/* Sharing Settings - Side Panel */}
			{sharingOpen && (
				<div className="fixed top-18.25 right-0 z-50 h-[calc(100vh-73px)] w-100 overflow-y-auto border-gray-200 border-l bg-white shadow-lg">
					<div className="p-6">
						<div className="mb-4 flex items-center justify-between">
							<h2 className="font-semibold text-gray-900 text-xl">Share Resume</h2>
							<Button
								size="icon"
								variant="ghost"
								onClick={() => setSharingOpen(false)}
								className="h-8 w-8 text-gray-500 hover:text-gray-900"
							>
								<span className="text-xl">×</span>
							</Button>
						</div>
						<SharingDialog />
					</div>
				</div>
			)}

			{/* Export Settings - Side Panel */}
			{exportOpen && (
				<div className="fixed top-18.25 right-0 z-50 h-[calc(100vh-73px)] w-100 overflow-y-auto border-gray-200 border-l bg-white shadow-lg">
					<div className="p-6">
						<div className="mb-4 flex items-center justify-between">
							<h2 className="font-semibold text-gray-900 text-xl">Download Resume</h2>
							<Button
								size="icon"
								variant="ghost"
								onClick={() => setExportOpen(false)}
								className="h-8 w-8 text-gray-500 hover:text-gray-900"
							>
								<span className="text-xl">×</span>
							</Button>
						</div>
						<ExportDialog />
					</div>
				</div>
			)}
		</>
	);
}

/* ============================================
   OLD HEADER DROPDOWN (Commented out)
   ============================================
function BuilderHeaderDropdown() {
    const confirm = useConfirm();
    const navigate = useNavigate();
    const { openDialog } = useDialogStore();

    const id = useResumeStore((state) => state.resume.id);
    const name = useResumeStore((state) => state.resume.name);
    const slug = useResumeStore((state) => state.resume.slug);
    const tags = useResumeStore((state) => state.resume.tags);
    const isLocked = useResumeStore((state) => state.resume.isLocked);

    const { mutate: deleteResume } = useMutation(orpc.resume.delete.mutationOptions());
    const { mutate: setLockedResume } = useMutation(orpc.resume.setLocked.mutationOptions());

    const handleUpdate = () => {
        openDialog("resume.update", { id, name, slug, tags });
    };

    const handleDuplicate = () => {
        openDialog("resume.duplicate", { id, name, slug, tags, shouldRedirect: true });
    };

    const handleToggleLock = async () => {
        if (!isLocked) {
            const confirmation = await confirm(t`Are you sure you want to lock this resume?`, {
                description: t`When locked, the resume cannot be updated or deleted.`,
            });

            if (!confirmation) return;
        }

        setLockedResume(
            { id, isLocked: !isLocked },
            {
                onError: (error) => {
                    toast.error(error.message);
                },
            },
        );
    };

    const handleDelete = async () => {
        const confirmation = await confirm(t`Are you sure you want to delete this resume?`, {
            description: t`This action cannot be undone.`,
        });

        if (!confirmation) return;

        const toastId = toast.loading(t`Deleting your resume...`);

        deleteResume(
            { id },
            {
                onSuccess: () => {
                    toast.success(t`Your resume has been deleted successfully.`, { id: toastId });
                    navigate({ to: "/dashboard/resumes", search: { sort: "lastUpdatedAt", tags: [] } });
                },
                onError: (error) => {
                    toast.error(error.message, { id: toastId });
                },
            },
        );
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost">
                    <CaretDownIcon />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
                <DropdownMenuItem disabled={isLocked} onSelect={handleUpdate}>
                    <PencilSimpleLineIcon className="me-2" />
                    <Trans>Update</Trans>
                </DropdownMenuItem>

                <DropdownMenuItem onSelect={handleDuplicate}>
                    <CopySimpleIcon className="me-2" />
                    <Trans>Duplicate</Trans>
                </DropdownMenuItem>

                <DropdownMenuItem onSelect={handleToggleLock}>
                    {isLocked ? <LockSimpleOpenIcon className="me-2" /> : <LockSimpleIcon className="me-2" />}
                    {isLocked ? <Trans>Unlock</Trans> : <Trans>Lock</Trans>}
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem variant="destructive" disabled={isLocked} onSelect={handleDelete}>
                    <TrashSimpleIcon className="me-2" />
                    <Trans>Delete</Trans>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
*/
