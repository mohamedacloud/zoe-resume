// Light-themed dialog wrappers for section forms (without SectionBase accordion)

import { t } from "@lingui/core/macro";
import { CircleNotchIcon, DownloadIcon, FileDocIcon, FilePdfIcon } from "@phosphor-icons/react";
import { useMutation } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { useResumeStore } from "@/components/resume/store/resume";
import { orpc } from "@/integrations/orpc/client";
import { CSSSectionBuilder } from "@/routes/builder/$resumeId/-sidebar/right/sections/css.tsx";
import { downloadFromUrl, generateFilename } from "@/utils/file";

// Wrapper that applies light theme styling to section content
export function SectionDialogWrapper({ children }: { children: React.ReactNode }) {
	return (
		<div className="space-y-4 text-gray-900 [&_h2]:text-gray-900 [&_h3]:text-gray-900 [&_label]:text-gray-700 [&_p]:text-gray-700 [&_span]:text-gray-700">
			{children}
		</div>
	);
}

export function TypographyDialog() {
	const typography = useResumeStore((state) => state.resume.data.metadata.typography);
	const updateResumeData = useResumeStore((state) => state.updateResumeData);

	const [primaryFont, setPrimaryFont] = useState(typography.body.fontFamily);
	const [headingFont, setHeadingFont] = useState(typography.heading.fontFamily);
	const [bodyFontSize, setBodyFontSize] = useState(typography.body.fontSize);
	const [headingFontSize, setHeadingFontSize] = useState(typography.heading.fontSize);
	const [lineHeight, setLineHeight] = useState(typography.body.lineHeight);

	// Popular Google Fonts
	const popularFonts = [
		"Inter",
		"Roboto",
		"Open Sans",
		"Lato",
		"Montserrat",
		"Poppins",
		"Raleway",
		"Merriweather",
		"Playfair Display",
		"Source Sans Pro",
		"Nunito",
		"PT Sans",
		"Rubik",
		"Work Sans",
		"Libre Baskerville",
		"Crimson Text",
		"Cormorant Garamond",
		"EB Garamond",
		"IBM Plex Sans",
		"DM Sans",
	];

	const handlePrimaryFontChange = (font: string) => {
		setPrimaryFont(font);
		updateResumeData((draft) => {
			draft.metadata.typography.body.fontFamily = font;
		});
	};

	const handleHeadingFontChange = (font: string) => {
		setHeadingFont(font);
		updateResumeData((draft) => {
			draft.metadata.typography.heading.fontFamily = font;
		});
	};

	const handleBodyFontSizeChange = (size: number) => {
		setBodyFontSize(size);
		updateResumeData((draft) => {
			draft.metadata.typography.body.fontSize = size;
		});
	};

	const handleHeadingFontSizeChange = (size: number) => {
		setHeadingFontSize(size);
		updateResumeData((draft) => {
			draft.metadata.typography.heading.fontSize = size;
		});
	};

	const handleLineHeightChange = (height: number) => {
		setLineHeight(height);
		updateResumeData((draft) => {
			draft.metadata.typography.body.lineHeight = height;
		});
	};

	return (
		<SectionDialogWrapper>
			<div className="space-y-6">
				{/* Feature Highlight Banner */}
				<div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
					<div className="flex gap-3">
						<svg
							className="mt-0.5 h-5 w-5 shrink-0 text-blue-600"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
							/>
						</svg>
						<div>
							<h4 className="mb-1 font-semibold text-blue-900 text-sm">Google Fonts Library Access</h4>
							<p className="text-blue-800 text-xs">
								Access to 1000+ professional fonts. Changes preview in real-time. Fonts are automatically embedded in
								PDF exports.
							</p>
						</div>
					</div>
				</div>

				{/* Primary Font (Body Text) */}
				<div className="space-y-3">
					<h3 className="font-semibold text-gray-900 text-sm">Primary Font (Body Text)</h3>
					<p className="text-gray-600 text-xs">Used for paragraphs, lists, and general content</p>

					{/* Popular Fonts Quick Select */}
					<div className="grid grid-cols-2 gap-2">
						{popularFonts.slice(0, 8).map((font) => (
							<button
								key={font}
								type="button"
								onClick={() => handlePrimaryFontChange(font)}
								className={`rounded-lg border-2 p-3 text-left transition-all ${
									primaryFont === font
										? "border-emerald-500 bg-emerald-50"
										: "border-gray-200 bg-white hover:border-gray-300"
								}`}
								style={{ fontFamily: font }}
							>
								<div className="font-medium text-sm">{font}</div>
								<div className="text-gray-600 text-xs">Aa Bb Cc</div>
							</button>
						))}
					</div>

					{/* Custom Font Input */}
					<div>
						<label className="mb-1.5 block text-gray-700 text-xs">Or enter custom Google Font name</label>
						<input
							type="text"
							value={primaryFont}
							onChange={(e) => handlePrimaryFontChange(e.target.value)}
							placeholder="Enter font name..."
							className="w-full rounded-lg border-2 border-gray-300 px-3 py-2 text-sm transition-all focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
						/>
					</div>

					{/* Font Preview */}
					<div className="rounded-lg border-2 border-gray-200 bg-white p-4">
						<div className="mb-2 font-medium text-gray-700 text-xs">Live Preview</div>
						<p
							className="text-gray-900"
							style={{ fontFamily: primaryFont, fontSize: `${bodyFontSize}pt`, lineHeight: lineHeight }}
						>
							The quick brown fox jumps over the lazy dog. This is how your body text will appear in your resume with
							the selected font.
						</p>
					</div>
				</div>

				{/* Secondary Font (Headings) */}
				<div className="space-y-3">
					<h3 className="font-semibold text-gray-900 text-sm">Secondary Font (Headings)</h3>
					<p className="text-gray-600 text-xs">Used for section headings and your name</p>

					{/* Popular Fonts Quick Select */}
					<div className="grid grid-cols-2 gap-2">
						{popularFonts.slice(8, 16).map((font) => (
							<button
								key={font}
								type="button"
								onClick={() => handleHeadingFontChange(font)}
								className={`rounded-lg border-2 p-3 text-left transition-all ${
									headingFont === font
										? "border-emerald-500 bg-emerald-50"
										: "border-gray-200 bg-white hover:border-gray-300"
								}`}
								style={{ fontFamily: font }}
							>
								<div className="font-medium text-sm">{font}</div>
								<div className="text-gray-600 text-xs">Aa Bb Cc</div>
							</button>
						))}
					</div>

					{/* Custom Font Input */}
					<div>
						<label className="mb-1.5 block text-gray-700 text-xs">Or enter custom Google Font name</label>
						<input
							type="text"
							value={headingFont}
							onChange={(e) => handleHeadingFontChange(e.target.value)}
							placeholder="Enter font name..."
							className="w-full rounded-lg border-2 border-gray-300 px-3 py-2 text-sm transition-all focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
						/>
					</div>

					{/* Font Preview */}
					<div className="rounded-lg border-2 border-gray-200 bg-white p-4">
						<div className="mb-2 font-medium text-gray-700 text-xs">Live Preview</div>
						<h1
							className="mb-2 text-2xl text-gray-900"
							style={{ fontFamily: headingFont, fontSize: `${headingFontSize}pt` }}
						>
							Professional Experience
						</h1>
						<h2
							className="text-gray-900 text-lg"
							style={{ fontFamily: headingFont, fontSize: `${headingFontSize * 0.85}pt` }}
						>
							Senior Software Engineer
						</h2>
					</div>
				</div>

				{/* Font Size Adjustments */}
				<div className="space-y-4 rounded-lg border-2 border-blue-200 bg-blue-50 p-4">
					<h3 className="font-semibold text-gray-900 text-sm">Font Size Adjustments</h3>

					{/* Body Font Size */}
					<div>
						<label className="mb-2 flex items-center justify-between text-gray-900 text-sm">
							<span>Body Text Size</span>
							<span className="rounded bg-blue-100 px-2 py-0.5 font-mono text-blue-900 text-xs">{bodyFontSize} pt</span>
						</label>
						<input
							type="range"
							min="8"
							max="14"
							step="0.5"
							value={bodyFontSize}
							onChange={(e) => handleBodyFontSizeChange(Number(e.target.value))}
							className="w-full accent-emerald-600"
						/>
						<div className="mt-1 flex justify-between text-gray-600 text-xs">
							<span>Smaller (8pt)</span>
							<span>Larger (14pt)</span>
						</div>
					</div>

					{/* Heading Font Size */}
					<div>
						<label className="mb-2 flex items-center justify-between text-gray-900 text-sm">
							<span>Heading Text Size</span>
							<span className="rounded bg-blue-100 px-2 py-0.5 font-mono text-blue-900 text-xs">
								{headingFontSize} pt
							</span>
						</label>
						<input
							type="range"
							min="12"
							max="24"
							step="0.5"
							value={headingFontSize}
							onChange={(e) => handleHeadingFontSizeChange(Number(e.target.value))}
							className="w-full accent-emerald-600"
						/>
						<div className="mt-1 flex justify-between text-gray-600 text-xs">
							<span>Smaller (12pt)</span>
							<span>Larger (24pt)</span>
						</div>
					</div>

					{/* Line Height */}
					<div>
						<label className="mb-2 flex items-center justify-between text-gray-900 text-sm">
							<span>Line Height (Spacing)</span>
							<span className="rounded bg-blue-100 px-2 py-0.5 font-mono text-blue-900 text-xs">{lineHeight}</span>
						</label>
						<input
							type="range"
							min="1.0"
							max="2.0"
							step="0.1"
							value={lineHeight}
							onChange={(e) => handleLineHeightChange(Number(e.target.value))}
							className="w-full accent-emerald-600"
						/>
						<div className="mt-1 flex justify-between text-gray-600 text-xs">
							<span>Compact (1.0)</span>
							<span>Spacious (2.0)</span>
						</div>
					</div>
				</div>

				{/* Font Pairing Suggestions */}
				<div className="space-y-3">
					<h4 className="font-semibold text-gray-900 text-sm">Font Pairing Suggestions</h4>
					<div className="space-y-2">
						<button
							type="button"
							onClick={() => {
								handlePrimaryFontChange("Inter");
								handleHeadingFontChange("Playfair Display");
							}}
							className="w-full rounded-lg border-2 border-gray-200 bg-white p-3 text-left transition-all hover:border-emerald-500 hover:bg-emerald-50"
						>
							<div className="mb-1 font-semibold text-gray-900 text-sm">Modern Professional</div>
							<div className="flex items-center justify-between text-gray-600 text-xs">
								<span style={{ fontFamily: "Inter" }}>Inter</span>
								<span>+</span>
								<span style={{ fontFamily: "Playfair Display" }}>Playfair Display</span>
							</div>
						</button>

						<button
							type="button"
							onClick={() => {
								handlePrimaryFontChange("Roboto");
								handleHeadingFontChange("Montserrat");
							}}
							className="w-full rounded-lg border-2 border-gray-200 bg-white p-3 text-left transition-all hover:border-emerald-500 hover:bg-emerald-50"
						>
							<div className="mb-1 font-semibold text-gray-900 text-sm">Clean & Minimal</div>
							<div className="flex items-center justify-between text-gray-600 text-xs">
								<span style={{ fontFamily: "Roboto" }}>Roboto</span>
								<span>+</span>
								<span style={{ fontFamily: "Montserrat" }}>Montserrat</span>
							</div>
						</button>

						<button
							type="button"
							onClick={() => {
								handlePrimaryFontChange("Merriweather");
								handleHeadingFontChange("Raleway");
							}}
							className="w-full rounded-lg border-2 border-gray-200 bg-white p-3 text-left transition-all hover:border-emerald-500 hover:bg-emerald-50"
						>
							<div className="mb-1 font-semibold text-gray-900 text-sm">Classic Elegance</div>
							<div className="flex items-center justify-between text-gray-600 text-xs">
								<span style={{ fontFamily: "Merriweather" }}>Merriweather</span>
								<span>+</span>
								<span style={{ fontFamily: "Raleway" }}>Raleway</span>
							</div>
						</button>
					</div>
				</div>

				{/* Typography Tips */}
				<div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
					<h4 className="mb-2 font-semibold text-gray-900 text-sm">💡 Typography Tips</h4>
					<ul className="space-y-1 text-gray-700 text-xs">
						<li className="flex gap-2">
							<span className="text-blue-600">•</span>
							<span>Use 10-12pt for body text for optimal readability</span>
						</li>
						<li className="flex gap-2">
							<span className="text-blue-600">•</span>
							<span>Pair serif headings with sans-serif body text (or vice versa)</span>
						</li>
						<li className="flex gap-2">
							<span className="text-blue-600">•</span>
							<span>Line height of 1.4-1.6 is ideal for resume readability</span>
						</li>
						<li className="flex gap-2">
							<span className="text-blue-600">•</span>
							<span>All fonts are embedded in PDF exports - no installation needed</span>
						</li>
						<li className="flex gap-2">
							<span className="text-blue-600">•</span>
							<span>Stick to 2 fonts maximum for a professional look</span>
						</li>
					</ul>
				</div>
			</div>
		</SectionDialogWrapper>
	);
}

export function LayoutDialog() {
	const layout = useResumeStore((state) => state.resume.data.metadata.layout);
	const updateResumeData = useResumeStore((state) => state.updateResumeData);

	// Get the first page (most resumes have only one page)
	const currentPage = layout.pages[0] || { fullWidth: false, main: [], sidebar: [] };

	const handleSidebarWidthChange = (width: number) => {
		updateResumeData((draft) => {
			draft.metadata.layout.sidebarWidth = width;
		});
	};

	const handleToggleFullWidth = (enabled: boolean) => {
		updateResumeData((draft) => {
			if (draft.metadata.layout.pages[0]) {
				draft.metadata.layout.pages[0].fullWidth = enabled;
			}
		});
	};

	const moveSection = (sectionId: string, from: "main" | "sidebar", to: "main" | "sidebar", index?: number) => {
		updateResumeData((draft) => {
			const page = draft.metadata.layout.pages[0];
			if (!page) return;

			// Remove from source
			if (from === "main") {
				page.main = page.main.filter((id) => id !== sectionId);
			} else {
				page.sidebar = page.sidebar.filter((id) => id !== sectionId);
			}

			// Add to target
			if (to === "main") {
				if (index !== undefined) {
					page.main.splice(index, 0, sectionId);
				} else {
					page.main.push(sectionId);
				}
			} else {
				if (index !== undefined) {
					page.sidebar.splice(index, 0, sectionId);
				} else {
					page.sidebar.push(sectionId);
				}
			}
		});
	};

	const moveSectionUp = (sectionId: string, location: "main" | "sidebar") => {
		updateResumeData((draft) => {
			const page = draft.metadata.layout.pages[0];
			if (!page) return;

			const arr = location === "main" ? page.main : page.sidebar;
			const index = arr.indexOf(sectionId);
			if (index > 0) {
				[arr[index], arr[index - 1]] = [arr[index - 1], arr[index]];
			}
		});
	};

	const moveSectionDown = (sectionId: string, location: "main" | "sidebar") => {
		updateResumeData((draft) => {
			const page = draft.metadata.layout.pages[0];
			if (!page) return;

			const arr = location === "main" ? page.main : page.sidebar;
			const index = arr.indexOf(sectionId);
			if (index < arr.length - 1 && index >= 0) {
				[arr[index], arr[index + 1]] = [arr[index + 1], arr[index]];
			}
		});
	};

	// Helper to get section display name
	const getSectionName = (sectionId: string) => {
		const names: Record<string, string> = {
			summary: "Summary",
			experience: "Experience",
			education: "Education",
			projects: "Projects",
			skills: "Skills",
			languages: "Languages",
			interests: "Interests",
			awards: "Awards",
			certifications: "Certifications",
			publications: "Publications",
			volunteer: "Volunteer",
			references: "References",
			profiles: "Profiles",
		};

		return names[sectionId] || sectionId;
	};

	const renderSectionItem = (sectionId: string, location: "main" | "sidebar", index: number, totalCount: number) => {
		const name = getSectionName(sectionId);
		const isFirst = index === 0;
		const isLast = index === totalCount - 1;

		return (
			<div
				key={sectionId}
				className="flex items-center gap-3 rounded-lg border-2 border-gray-200 bg-white p-3 transition-all"
			>
				{/* Drag Handle */}
				<div className="cursor-move text-gray-400">
					<svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
						<path d="M7 2a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V4a2 2 0 00-2-2H7zM7 10a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H7zM15 2a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V4a2 2 0 00-2-2h-2zM15 10a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2h-2z" />
					</svg>
				</div>

				{/* Section Info */}
				<div className="flex-1">
					<h4 className="font-semibold text-gray-900 text-sm">{name}</h4>
					<p className="text-gray-500 text-xs">{location === "main" ? "Main Column" : "Sidebar Column"}</p>
				</div>

				{/* Controls */}
				<div className="flex items-center gap-2">
					{/* Move Up */}
					<button
						type="button"
						onClick={() => moveSectionUp(sectionId, location)}
						disabled={isFirst}
						className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-30"
						title="Move up"
					>
						<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
						</svg>
					</button>

					{/* Move Down */}
					<button
						type="button"
						onClick={() => moveSectionDown(sectionId, location)}
						disabled={isLast}
						className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-30"
						title="Move down"
					>
						<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
						</svg>
					</button>

					{/* Move to other column */}
					<button
						type="button"
						onClick={() => moveSection(sectionId, location, location === "main" ? "sidebar" : "main")}
						className="rounded bg-blue-100 px-2 py-1 text-blue-700 text-xs hover:bg-blue-200"
						title={location === "main" ? "Move to sidebar" : "Move to main"}
					>
						{location === "main" ? "→ Sidebar" : "← Main"}
					</button>
				</div>
			</div>
		);
	};

	return (
		<SectionDialogWrapper>
			<div className="space-y-6">
				{/* Feature Highlight Banner */}
				<div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
					<div className="flex gap-3">
						<svg
							className="mt-0.5 h-5 w-5 shrink-0 text-blue-600"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z"
							/>
						</svg>
						<div>
							<h4 className="mb-1 font-semibold text-blue-900 text-sm">Advanced Layout Customization</h4>
							<p className="text-blue-800 text-xs">
								Organize sections between main and sidebar columns. Reorder sections to highlight what matters most.
							</p>
						</div>
					</div>
				</div>

				{/* Sidebar Width Control */}
				{!currentPage.fullWidth && (
					<div className="rounded-lg border-2 border-blue-200 bg-blue-50 p-4">
						<h3 className="mb-3 font-semibold text-gray-900 text-sm">Sidebar Width Control</h3>
						<div className="space-y-3">
							<label className="mb-2 flex items-center justify-between text-gray-900 text-sm">
								<span>Sidebar Width</span>
								<span className="rounded bg-blue-100 px-2 py-0.5 font-mono text-blue-900 text-xs">
									{layout.sidebarWidth}%
								</span>
							</label>
							<input
								type="range"
								min="20"
								max="50"
								step="1"
								value={layout.sidebarWidth}
								onChange={(e) => handleSidebarWidthChange(Number(e.target.value))}
								className="w-full accent-emerald-600"
							/>
							<div className="mt-1 flex justify-between text-gray-600 text-xs">
								<span>Narrow (20%)</span>
								<span>Wide (50%)</span>
							</div>
						</div>
					</div>
				)}

				{/* Full Width Option */}
				<div className="rounded-lg border-2 border-gray-200 p-4">
					<label className="flex cursor-pointer items-start gap-3">
						<input
							type="checkbox"
							checked={currentPage.fullWidth}
							onChange={(e) => handleToggleFullWidth(e.target.checked)}
							className="mt-0.5 h-5 w-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
						/>
						<div className="flex-1">
							<h4 className="font-semibold text-gray-900 text-sm">Full Width Page</h4>
							<p className="text-gray-600 text-xs">
								Remove sidebar completely and use entire page width for maximum content space
							</p>
						</div>
					</label>
					{currentPage.fullWidth && (
						<div className="mt-3 rounded-lg border border-green-200 bg-green-50 p-3">
							<p className="text-green-800 text-xs">✓ All sections will be displayed in a single column layout</p>
						</div>
					)}
				</div>

				{/* Section Management */}
				{!currentPage.fullWidth && (
					<div className="space-y-4">
						<h3 className="font-semibold text-gray-900 text-sm">Manage Sections</h3>

						{/* Main Column Sections */}
						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<h4 className="font-medium text-gray-700 text-sm">📄 Main Column</h4>
								<span className="rounded-full bg-gray-200 px-2 py-0.5 text-gray-700 text-xs">
									{currentPage.main.length} sections
								</span>
							</div>
							<div className="space-y-2">
								{currentPage.main.length === 0 ? (
									<div className="rounded-lg border-2 border-gray-300 border-dashed bg-gray-50 p-4 text-center">
										<p className="text-gray-500 text-sm">No sections in main column</p>
										<p className="text-gray-400 text-xs">Move sections from sidebar to here</p>
									</div>
								) : (
									currentPage.main.map((sectionId, index) =>
										renderSectionItem(sectionId, "main", index, currentPage.main.length),
									)
								)}
							</div>
						</div>

						{/* Sidebar Column Sections */}
						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<h4 className="font-medium text-gray-700 text-sm">📌 Sidebar Column</h4>
								<span className="rounded-full bg-gray-200 px-2 py-0.5 text-gray-700 text-xs">
									{currentPage.sidebar.length} sections
								</span>
							</div>
							<div className="space-y-2">
								{currentPage.sidebar.length === 0 ? (
									<div className="rounded-lg border-2 border-gray-300 border-dashed bg-gray-50 p-4 text-center">
										<p className="text-gray-500 text-sm">No sections in sidebar</p>
										<p className="text-gray-400 text-xs">Move sections from main to here</p>
									</div>
								) : (
									currentPage.sidebar.map((sectionId, index) =>
										renderSectionItem(sectionId, "sidebar", index, currentPage.sidebar.length),
									)
								)}
							</div>
						</div>
					</div>
				)}

				{/* Full Width Mode Section List */}
				{currentPage.fullWidth && (
					<div className="space-y-2">
						<h3 className="font-semibold text-gray-900 text-sm">Section Order</h3>
						<div className="space-y-2">
							{currentPage.main.map((sectionId, index) =>
								renderSectionItem(sectionId, "main", index, currentPage.main.length),
							)}
						</div>
					</div>
				)}

				{/* Layout Tips */}
				<div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
					<h4 className="mb-2 font-semibold text-gray-900 text-sm">💡 Layout Tips</h4>
					<ul className="space-y-1 text-gray-700 text-xs">
						<li className="flex gap-2">
							<span className="text-blue-600">•</span>
							<span>Put most important content (Experience, Education) in the main column</span>
						</li>
						<li className="flex gap-2">
							<span className="text-blue-600">•</span>
							<span>Use sidebar for Skills, Languages, and Contact info</span>
						</li>
						<li className="flex gap-2">
							<span className="text-blue-600">•</span>
							<span>Reorder sections by clicking the up/down arrows</span>
						</li>
						<li className="flex gap-2">
							<span className="text-blue-600">•</span>
							<span>Move sections between columns using the arrow buttons</span>
						</li>
						<li className="flex gap-2">
							<span className="text-blue-600">•</span>
							<span>Full-width layout works best for minimal, modern resumes</span>
						</li>
					</ul>
				</div>
			</div>
		</SectionDialogWrapper>
	);
}

export function DesignDialog() {
	const colors = useResumeStore((state) => state.resume.data.metadata.design.colors);
	const updateResumeData = useResumeStore((state) => state.updateResumeData);

	const [primaryColor, setPrimaryColor] = useState(colors.primary);
	const [accentColor, setAccentColor] = useState(colors.primary); // Using primary as accent for now
	const [textColor, setTextColor] = useState(colors.text);
	const [backgroundColor, setBackgroundColor] = useState(colors.background);

	const quickColorOptions = [
		"#E7000B", // red
		"#F54900", // orange
		"#E17100", // amber
		"#D08700", // yellow
		"#5EA500", // lime
		"#00A63E", // green
		"#009966", // emerald
		"#009689", // teal
		"#0092B8", // cyan
		"#0084D1", // sky
		"#155DFC", // blue
		"#4F39F6", // indigo
		"#7F22FE", // violet
		"#9810FA", // purple
		"#C800DE", // fuchsia
		"#E60076", // pink
		"#EC003F", // rose
		"#45556C", // slate
		"#4A5565", // gray
		"#52525C", // zinc
		"#525252", // neutral
		"#57534D", // stone
	];

	const handlePrimaryColorChange = (color: string) => {
		setPrimaryColor(color);
		updateResumeData((draft) => {
			draft.metadata.design.colors.primary = color;
		});
	};

	const handleTextColorChange = (color: string) => {
		setTextColor(color);
		updateResumeData((draft) => {
			draft.metadata.design.colors.text = color;
		});
	};

	const handleBackgroundColorChange = (color: string) => {
		setBackgroundColor(color);
		updateResumeData((draft) => {
			draft.metadata.design.colors.background = color;
		});
	};

	const handleAccentColorChange = (color: string) => {
		setAccentColor(color);
		// You can add accent color to schema if needed
		handlePrimaryColorChange(color); // For now, update primary
	};

	return (
		<SectionDialogWrapper>
			<div className="space-y-6">
				{/* Feature Highlight Banner */}
				<div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
					<div className="flex gap-3">
						<svg
							className="mt-0.5 h-5 w-5 shrink-0 text-blue-600"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
							/>
						</svg>
						<div>
							<h4 className="mb-1 font-semibold text-blue-900 text-sm">Unlimited Color Options</h4>
							<p className="text-blue-800 text-xs">
								Customize any color with full color picker access. Changes apply instantly to your resume.
							</p>
						</div>
					</div>
				</div>

				{/* Quick Color Selection */}
				<div className="space-y-3">
					<h3 className="font-semibold text-gray-900 text-sm">Quick Color Presets</h3>
					<p className="text-gray-600 text-xs">Select a preset color or use the custom picker below</p>
					<div className="flex flex-wrap gap-2">
						{quickColorOptions.map((color) => (
							<button
								key={color}
								type="button"
								onClick={() => handlePrimaryColorChange(color)}
								className="group relative h-10 w-10 rounded-lg border-2 border-gray-200 transition-all hover:scale-110 hover:border-gray-400"
								style={{ backgroundColor: color }}
								title={color}
							>
								{primaryColor === color && (
									<div className="absolute inset-0 flex items-center justify-center">
										<svg className="h-5 w-5 text-white drop-shadow-md" fill="currentColor" viewBox="0 0 20 20">
											<path
												fillRule="evenodd"
												d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
												clipRule="evenodd"
											/>
										</svg>
									</div>
								)}
							</button>
						))}
					</div>
				</div>

				{/* Accent Color */}
				<div className="space-y-3">
					<h3 className="font-semibold text-gray-900 text-sm">Accent Color</h3>
					<p className="text-gray-600 text-xs">Used for headings, icons, and highlights</p>
					<div className="flex items-center gap-3">
						<input
							type="color"
							value={accentColor}
							onChange={(e) => handleAccentColorChange(e.target.value)}
							className="h-12 w-12 cursor-pointer rounded-lg border-2 border-gray-200"
						/>
						<input
							type="text"
							value={accentColor}
							onChange={(e) => handleAccentColorChange(e.target.value)}
							className="flex-1 rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
							placeholder="#000000"
						/>
					</div>
					<div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
						<div className="mb-2 font-medium text-gray-700 text-xs">Preview</div>
						<div className="space-y-2">
							<div className="flex items-center gap-2">
								<div className="h-4 w-4 rounded" style={{ backgroundColor: accentColor }} />
								<span className="text-gray-600 text-xs">Section headings</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="h-4 w-4 rounded" style={{ backgroundColor: accentColor }} />
								<span className="text-gray-600 text-xs">Icons and bullets</span>
							</div>
						</div>
					</div>
				</div>

				{/* Text Color */}
				<div className="space-y-3">
					<h3 className="font-semibold text-gray-900 text-sm">Text Color</h3>
					<p className="text-gray-600 text-xs">Primary text color for body content</p>
					<div className="flex items-center gap-3">
						<input
							type="color"
							value={textColor}
							onChange={(e) => handleTextColorChange(e.target.value)}
							className="h-12 w-12 cursor-pointer rounded-lg border-2 border-gray-200"
						/>
						<input
							type="text"
							value={textColor}
							onChange={(e) => handleTextColorChange(e.target.value)}
							className="flex-1 rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
							placeholder="#000000"
						/>
					</div>
				</div>

				{/* Background Color */}
				<div className="space-y-3">
					<h3 className="font-semibold text-gray-900 text-sm">Background Color</h3>
					<p className="text-gray-600 text-xs">Page background color</p>
					<div className="flex items-center gap-3">
						<input
							type="color"
							value={backgroundColor}
							onChange={(e) => handleBackgroundColorChange(e.target.value)}
							className="h-12 w-12 cursor-pointer rounded-lg border-2 border-gray-200"
						/>
						<input
							type="text"
							value={backgroundColor}
							onChange={(e) => handleBackgroundColorChange(e.target.value)}
							className="flex-1 rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
							placeholder="#FFFFFF"
						/>
					</div>
				</div>

				{/* Color Tips */}
				<div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
					<h4 className="mb-2 font-semibold text-gray-900 text-sm">💡 Color Tips</h4>
					<ul className="space-y-1 text-gray-700 text-xs">
						<li className="flex gap-2">
							<span className="text-blue-600">•</span>
							<span>Use high contrast between text and background for readability</span>
						</li>
						<li className="flex gap-2">
							<span className="text-blue-600">•</span>
							<span>Accent colors should complement your industry (blue for tech, green for finance)</span>
						</li>
						<li className="flex gap-2">
							<span className="text-blue-600">•</span>
							<span>Keep it professional - avoid overly bright or neon colors</span>
						</li>
						<li className="flex gap-2">
							<span className="text-blue-600">•</span>
							<span>Test printing in black & white to ensure good contrast</span>
						</li>
					</ul>
				</div>
			</div>
		</SectionDialogWrapper>
	);
}

export function PageDialog() {
	const page = useResumeStore((state) => state.resume.data.metadata.page);
	const updateResumeData = useResumeStore((state) => state.updateResumeData);

	const [format, setFormat] = useState(page.format);
	const [marginX, setMarginX] = useState(page.marginX);
	const [marginY, setMarginY] = useState(page.marginY);
	const contentWarning = false; // TODO: Implement content height detection

	const handleFormatChange = (value: string) => {
		setFormat(value as "a4" | "letter" | "free-form");
		updateResumeData((draft) => {
			draft.metadata.page.format = value as "a4" | "letter" | "free-form";
		});
	};

	const handleMarginXChange = (value: number) => {
		setMarginX(value);
		updateResumeData((draft) => {
			draft.metadata.page.marginX = value;
		});
	};

	const handleMarginYChange = (value: number) => {
		setMarginY(value);
		updateResumeData((draft) => {
			draft.metadata.page.marginY = value;
		});
	};

	return (
		<SectionDialogWrapper>
			<div className="space-y-6">
				{/* Content Height Warning */}
				{contentWarning && (
					<div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
						<div className="flex gap-3">
							<svg
								className="mt-0.5 h-5 w-5 shrink-0 text-orange-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
								/>
							</svg>
							<div>
								<h4 className="mb-1 font-semibold text-orange-900 text-sm">Content Height Alert</h4>
								<p className="text-orange-800 text-xs">
									Your content is too tall for the current page. Consider using the tools below to fit everything on one
									page.
								</p>
							</div>
						</div>
					</div>
				)}

				{/* Page Format Selection */}
				<div className="space-y-3">
					<h3 className="font-semibold text-gray-900 text-sm">Page Format</h3>
					<div className="grid grid-cols-3 gap-3">
						<button
							onClick={() => handleFormatChange("a4")}
							type="button"
							className={`rounded-lg border-2 p-4 text-center transition-all ${
								format === "a4" ? "border-emerald-500 bg-emerald-50" : "border-gray-200 bg-white hover:border-gray-300"
							}`}
						>
							<div className="mb-2 text-2xl">📄</div>
							<div className="font-semibold text-gray-900 text-sm">A4</div>
							<div className="text-gray-600 text-xs">210 × 297 mm</div>
						</button>
						<button
							onClick={() => handleFormatChange("letter")}
							type="button"
							className={`rounded-lg border-2 p-4 text-center transition-all ${
								format === "letter"
									? "border-emerald-500 bg-emerald-50"
									: "border-gray-200 bg-white hover:border-gray-300"
							}`}
						>
							<div className="mb-2 text-2xl">📃</div>
							<div className="font-semibold text-gray-900 text-sm">Letter</div>
							<div className="text-gray-600 text-xs">8.5 × 11 in</div>
						</button>
						<button
							onClick={() => handleFormatChange("free-form")}
							type="button"
							className={`rounded-lg border-2 p-4 text-center transition-all ${
								format === "free-form"
									? "border-emerald-500 bg-emerald-50"
									: "border-gray-200 bg-white hover:border-gray-300"
							}`}
						>
							<div className="mb-2 text-2xl">📋</div>
							<div className="font-semibold text-gray-900 text-sm">Free-Form</div>
							<div className="text-gray-600 text-xs">Dynamic</div>
						</button>
					</div>
				</div>

				{/* Content Fitting Tools */}
				<div className="rounded-lg border-2 border-blue-200 bg-blue-50 p-5">
					<div className="mb-4 flex items-start gap-3">
						<svg
							className="mt-0.5 h-6 w-6 shrink-0 text-blue-600"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
							/>
						</svg>
						<div>
							<h3 className="mb-1 font-bold text-base text-blue-900">Content Fitting Tools</h3>
							<p className="text-blue-800 text-xs">Optimize your resume to fit perfectly on one page</p>
						</div>
					</div>

					{/* Margin Adjustments */}
					<div className="space-y-4">
						<div>
							<label className="mb-2 flex items-center justify-between text-gray-900 text-sm">
								<span className="font-semibold">Horizontal Margins</span>
								<span className="rounded bg-blue-100 px-2 py-0.5 font-mono text-blue-900 text-xs">{marginX} pt</span>
							</label>
							<input
								type="range"
								min="0"
								max="100"
								step="5"
								value={marginX}
								onChange={(e) => handleMarginXChange(Number(e.target.value))}
								className="w-full accent-emerald-600"
							/>
							<div className="mt-1 flex justify-between text-gray-600 text-xs">
								<span>Narrower (more space)</span>
								<span>Wider (less space)</span>
							</div>
						</div>

						<div>
							<label className="mb-2 flex items-center justify-between text-gray-900 text-sm">
								<span className="font-semibold">Vertical Margins</span>
								<span className="rounded bg-blue-100 px-2 py-0.5 font-mono text-blue-900 text-xs">{marginY} pt</span>
							</label>
							<input
								type="range"
								min="0"
								max="100"
								step="5"
								value={marginY}
								onChange={(e) => handleMarginYChange(Number(e.target.value))}
								className="w-full accent-emerald-600"
							/>
							<div className="mt-1 flex justify-between text-gray-600 text-xs">
								<span>Narrower (more space)</span>
								<span>Wider (less space)</span>
							</div>
						</div>
					</div>
				</div>

				{/* Optimization Guide */}
				<div className="space-y-3">
					<h4 className="font-semibold text-gray-900 text-sm">Page Fitting Guide</h4>
					<div className="space-y-2">
						<div className="flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
							<div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-700 text-xs">
								1
							</div>
							<div>
								<p className="mb-1 font-medium text-gray-900 text-sm">Reduce Margins</p>
								<p className="text-gray-600 text-xs">
									Try reducing horizontal and vertical margins to create more space for content.
								</p>
							</div>
						</div>

						<div className="flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
							<div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-700 text-xs">
								2
							</div>
							<div>
								<p className="mb-1 font-medium text-gray-900 text-sm">Adjust Font Sizes</p>
								<p className="text-gray-600 text-xs">
									Use the Typography section to reduce font sizes slightly (try 9-10pt for body text).
								</p>
							</div>
						</div>

						<div className="flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
							<div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-700 text-xs">
								3
							</div>
							<div>
								<p className="mb-1 font-medium text-gray-900 text-sm">Optimize Spacing</p>
								<p className="text-gray-600 text-xs">
									Reduce line height and section spacing in the Design section to condense content.
								</p>
							</div>
						</div>

						<div className="flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
							<div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-700 text-xs">
								4
							</div>
							<div>
								<p className="mb-1 font-medium text-gray-900 text-sm">Prioritize Content</p>
								<p className="text-gray-600 text-xs">
									Remove or shorten less relevant experiences to focus on your most impressive achievements.
								</p>
							</div>
						</div>

						<div className="flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
							<div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-700 text-xs">
								5
							</div>
							<div>
								<p className="mb-1 font-medium text-gray-900 text-sm">Use Compact Layout</p>
								<p className="text-gray-600 text-xs">
									Try different templates or layouts that use space more efficiently (e.g., two-column designs).
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* Quick Tips */}
				<div className="rounded-lg border border-green-200 bg-green-50 p-4">
					<div className="mb-2 flex items-center gap-2">
						<svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
							/>
						</svg>
						<h4 className="font-semibold text-green-900 text-sm">Pro Tips</h4>
					</div>
					<ul className="space-y-1 text-green-800 text-xs">
						<li>• Most resumes should fit on one page unless you have 10+ years of experience</li>
						<li>• Recruiters typically spend only 6-7 seconds on initial resume review</li>
						<li>• Keep margins between 0.5-0.75 inches (36-54pt) for professional appearance</li>
						<li>• A4 format is standard in most countries; Letter is common in North America</li>
					</ul>
				</div>
			</div>
		</SectionDialogWrapper>
	);
}

export function CSSDialog() {
	return (
		<SectionDialogWrapper>
			<CSSSectionBuilder />
		</SectionDialogWrapper>
	);
}

export function NotesDialog() {
	const coverLetter = useResumeStore((state) => state.resume.data.metadata.coverLetter || "");
	const updateResumeData = useResumeStore((state) => state.updateResumeData);

	const handleCoverLetterChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		updateResumeData((draft) => {
			if (!draft.metadata.coverLetter) {
				draft.metadata.coverLetter = "";
			}
			draft.metadata.coverLetter = e.target.value;
		});
	};

	return (
		<SectionDialogWrapper>
			<div className="space-y-4">
				{/* Info Banner */}
				<div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
					<div className="flex gap-3">
						<svg
							className="mt-0.5 h-5 w-5 shrink-0 text-blue-600"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						<div>
							<h4 className="mb-1 font-semibold text-blue-900 text-sm">Cover Letter Features</h4>
							<ul className="space-y-1 text-blue-800 text-xs">
								<li>• Dedicated cover letter section separate from your resume</li>
								<li>• Rich text formatting support</li>
								<li>• Automatically included when you export your resume</li>
								<li>• Perfect for job applications that require both documents</li>
							</ul>
						</div>
					</div>
				</div>

				{/* Cover Letter Textarea */}
				<div>
					<label className="mb-2 block font-semibold text-gray-900 text-sm">Your Cover Letter</label>
					<textarea
						value={coverLetter}
						onChange={handleCoverLetterChange}
						rows={16}
						placeholder="Dear Hiring Manager,&#10;&#10;I am writing to express my interest in the [Position] at [Company]...&#10;&#10;[First paragraph - introduce yourself and state why you're interested]&#10;&#10;[Second paragraph - highlight relevant skills and experiences]&#10;&#10;[Third paragraph - explain why you're a good fit]&#10;&#10;[Closing paragraph - thank them and express enthusiasm]&#10;&#10;Sincerely,&#10;[Your Name]"
						className="w-full resize-none rounded-lg border-2 border-gray-300 px-4 py-3 font-serif text-gray-900 leading-relaxed transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500"
					/>
				</div>

				{/* Success Banner */}
				<div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-3">
					<svg className="h-5 w-5 shrink-0 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
					<p className="text-green-800 text-xs">
						Your cover letter will be included when you download your resume as PDF or DOCX
					</p>
				</div>

				{/* Formatting Tips */}
				<div className="space-y-2">
					<h4 className="font-semibold text-gray-900 text-sm">Formatting Tips:</h4>
					<ul className="space-y-1 text-gray-600 text-xs">
						<li>• Keep it to one page (3-4 paragraphs)</li>
						<li>• Address the hiring manager by name if possible</li>
						<li>• Customize for each position and company</li>
						<li>• Highlight specific achievements relevant to the role</li>
						<li>• End with a call to action</li>
					</ul>
				</div>
			</div>
		</SectionDialogWrapper>
	);
}

export function SharingDialog() {
	const [username, setUsername] = useState("johndoe");
	const [slug, setSlug] = useState("software-engineer-resume");
	const [publicUrl, setPublicUrl] = useState(`https://zoeresu.me/${username}/${slug}`);
	const [copied, setCopied] = useState(false);
	const [email, setEmail] = useState("");
	const [message, setMessage] = useState("");
	const [shareOption, setShareOption] = useState<"link" | "social" | "email">("link");
	const [allowDownload, setAllowDownload] = useState(true);
	const [trackViews, setTrackViews] = useState(false);

	// Update URL when username or slug changes
	const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newUsername = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "");
		setUsername(newUsername);
		setPublicUrl(`https://zoeresu.me/${newUsername}/${slug}`);
	};

	const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newSlug = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "");
		setSlug(newSlug);
		setPublicUrl(`https://zoeresu.me/${username}/${newSlug}`);
	};

	const handleCopyLink = () => {
		navigator.clipboard.writeText(publicUrl);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	const handleEmailShare = () => {
		// Validate email
		if (!email) {
			toast.error("Please enter a recipient email address");
			return;
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			toast.error("Please enter a valid email address");
			return;
		}

		try {
			// Prepare email content
			const subject = encodeURIComponent("Check out my resume!");
			const bodyText = message 
				? `${message}\n\nYou can view my resume here: ${publicUrl}` 
				: `Hi,\n\nI wanted to share my professional resume with you.\n\nYou can view it here: ${publicUrl}\n\nBest regards`;
			const body = encodeURIComponent(bodyText);

			// Create mailto link
			const mailtoLink = `mailto:${email}?subject=${subject}&body=${body}`;

			// Open email client
			window.location.href = mailtoLink;
			
			toast.success("Opening your email client...");
			
			// Reset form after a delay
			setTimeout(() => {
				setEmail("");
				setMessage("");
			}, 1000);
		} catch (error) {
			console.error("Error opening email client:", error);
			toast.error("Failed to open email client. Please try again.");
		}
	};

	const handleUpdateSettings = () => {
		// Save the public URL settings
		console.log("Updating settings:", {
			username,
			slug,
			publicUrl,
			allowDownload,
			trackViews,
		});
		toast.success("Public URL settings updated successfully!");
	};

	const handleSocialShare = (platformId: string, platformName: string) => {
		const shareUrl = encodeURIComponent(publicUrl);
		const shareText = encodeURIComponent(`Check out my resume!`);

		let url = "";
		switch (platformId) {
			case "linkedin":
				url = `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`;
				break;
			case "twitter":
				url = `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`;
				break;
			case "facebook":
				url = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;
				break;
			case "whatsapp":
				url = `https://api.whatsapp.com/send?text=${shareText}%20${shareUrl}`;
				break;
			case "telegram":
				url = `https://t.me/share/url?url=${shareUrl}&text=${shareText}`;
				break;
			case "email":
				url = `mailto:?subject=My Resume&body=${shareText}%20${shareUrl}`;
				break;
		}

		if (url) {
			try {
				// Try to open in new window
				const popup = window.open(url, "_blank", "width=600,height=400,menubar=no,toolbar=no,location=no");
				
				if (popup) {
					toast.success(`Opening ${platformName} share dialog...`);
				} else {
					// Popup was blocked, try direct navigation
					window.location.href = url;
					toast.info(`If the share dialog didn't open, please allow popups for this site.`);
				}
			} catch (error) {
				console.error("Error opening share dialog:", error);
				toast.error(`Failed to open ${platformName} share dialog. Please try again.`);
			}
		}
	};

	const socialPlatforms = [
		{
			id: "linkedin",
			name: "LinkedIn",
			icon: (
				<svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
					<path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
				</svg>
			),
			color: "bg-blue-600 hover:bg-blue-700",
		},
		{
			id: "twitter",
			name: "Twitter",
			icon: (
				<svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
					<path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
				</svg>
			),
			color: "bg-sky-500 hover:bg-sky-600",
		},
		{
			id: "facebook",
			name: "Facebook",
			icon: (
				<svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
					<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
				</svg>
			),
			color: "bg-blue-700 hover:bg-blue-800",
		},
		{
			id: "whatsapp",
			name: "WhatsApp",
			icon: (
				<svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
					<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
				</svg>
			),
			color: "bg-green-600 hover:bg-green-700",
		},
		{
			id: "telegram",
			name: "Telegram",
			icon: (
				<svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
					<path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
				</svg>
			),
			color: "bg-sky-600 hover:bg-sky-700",
		},
		{
			id: "email",
			name: "Email",
			icon: (
				<svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
					/>
				</svg>
			),
			color: "bg-gray-600 hover:bg-gray-700",
		},
	];

	return (
		<div className="space-y-6 text-gray-900 **:text-gray-900">
			{/* Tab Navigation */}
			<div className="flex gap-2 rounded-lg bg-gray-100 p-1">
				<button
					onClick={() => setShareOption("link")}
					type="button"
					className={`flex-1 rounded-lg px-4 py-2 font-medium text-sm transition-all ${
						shareOption === "link" ? "bg-white text-emerald-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
					}`}
				>
					Share Link
				</button>
				<button
					onClick={() => setShareOption("social")}
					type="button"
					className={`flex-1 rounded-lg px-4 py-2 font-medium text-sm transition-all ${
						shareOption === "social" ? "bg-white text-emerald-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
					}`}
				>
					Social Media
				</button>
				<button
					onClick={() => setShareOption("email")}
					type="button"
					className={`flex-1 rounded-lg px-4 py-2 font-medium text-sm transition-all ${
						shareOption === "email" ? "bg-white text-emerald-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
					}`}
				>
					Send Email
				</button>
			</div>

			{/* Share Link Tab - Public URL */}
			{shareOption === "link" && (
				<div className="space-y-5">
					{/* Info Banner */}
					<div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
						<div className="flex gap-3">
							<svg
								className="mt-0.5 h-5 w-5 shrink-0 text-blue-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
							<div>
								<h4 className="mb-1 font-semibold text-blue-900 text-sm">Public URL Features</h4>
								<ul className="space-y-1 text-blue-800 text-xs">
									<li>• Permanent shareable link - always shows latest version</li>
									<li>• No login required for viewers</li>
									<li>• Perfect for email signatures, portfolios & LinkedIn</li>
									<li>• Visitors can download and print your resume</li>
								</ul>
							</div>
						</div>
					</div>

					{/* URL Customization */}
					<div className="space-y-3">
						<h4 className="font-semibold text-gray-900 text-sm">Customize Your URL</h4>

						{/* Username Field */}
						<div>
							<label className="mb-1.5 block text-gray-700 text-xs">Username</label>
							<input
								type="text"
								value={username}
								onChange={handleUsernameChange}
								placeholder="johndoe"
								className="w-full rounded-lg border-2 border-gray-300 px-3 py-2 text-gray-900 text-sm transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500"
							/>
							<p className="mt-1 text-gray-500 text-xs">Only lowercase letters, numbers, and hyphens</p>
						</div>

						{/* Slug Field */}
						<div>
							<label className="mb-1.5 block text-gray-700 text-xs">Custom Slug</label>
							<input
								type="text"
								value={slug}
								onChange={handleSlugChange}
								placeholder="software-engineer-resume"
								className="w-full rounded-lg border-2 border-gray-300 px-3 py-2 text-gray-900 text-sm transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500"
							/>
							<p className="mt-1 text-gray-500 text-xs">Customize the resume identifier in your URL</p>
						</div>
					</div>

					{/* Generated Public URL */}
					<div>
						<label className="mb-2 block font-semibold text-gray-900 text-sm">Your Public URL</label>
						<div className="flex gap-2">
							<input
								type="text"
								value={publicUrl}
								readOnly
								className="flex-1 rounded-lg border-2 border-emerald-200 bg-emerald-50 px-4 py-3 font-mono text-gray-800 text-sm"
							/>
							<button
								onClick={handleCopyLink}
								type="button"
								className={`rounded-lg px-6 py-3 font-medium transition-all ${
									copied ? "bg-green-600 text-white" : "bg-emerald-600 text-white hover:bg-emerald-700"
								}`}
							>
								{copied ? (
									<div className="flex items-center gap-2">
										<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
										</svg>
										Copied!
									</div>
								) : (
									<div className="flex items-center gap-2">
										<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
											/>
										</svg>
										Copy
									</div>
								)}
							</button>
						</div>
						<p className="mt-2 text-gray-500 text-xs">
							✓ Anyone with this link can view and download your resume
							<br />✓ Link automatically updates when you edit your resume
							<br />✓ Compatible with link shorteners (bit.ly, etc.)
						</p>
					</div>

					{/* Privacy Settings */}
					<div className="rounded-lg border-2 border-gray-200 p-4">
						<h4 className="mb-3 font-semibold text-gray-900 text-sm">Privacy Settings</h4>
						<div className="space-y-3">
							<label className="flex cursor-pointer items-center gap-3">
								<input
									type="checkbox"
									checked={allowDownload}
									onChange={(e) => setAllowDownload(e.target.checked)}
									className="h-5 w-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
								/>
								<div>
									<p className="font-medium text-gray-900 text-sm">Allow download</p>
									<p className="text-gray-600 text-xs">Viewers can download your resume as PDF</p>
								</div>
							</label>
							{/* <label className="flex cursor-pointer items-center gap-3">
								<input
									type="checkbox"
									checked={passwordProtect}
									onChange={(e) => setPasswordProtect(e.target.checked)}
									className="h-5 w-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
								/>
								<div>
									<p className="font-medium text-gray-900 text-sm">Password protect</p>
									<p className="text-gray-600 text-xs">Require password to view resume</p>
								</div>
							</label> */}
							<label className="flex cursor-pointer items-center gap-3">
								<input
									type="checkbox"
									checked={trackViews}
									onChange={(e) => setTrackViews(e.target.checked)}
									className="h-5 w-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
								/>
								<div>
									<p className="font-medium text-gray-900 text-sm">Track views</p>
									<p className="text-gray-600 text-xs">See analytics about who viewed your resume</p>
								</div>
							</label>
						</div>
					</div>

					{/* Publish Button */}
					<button
						onClick={handleUpdateSettings}
						type="button"
						className="w-full rounded-lg bg-emerald-600 px-6 py-3 font-medium text-white shadow-sm transition-all hover:bg-emerald-700"
					>
						Update Public URL Settings
					</button>
				</div>
			)}

			{/* Social Media Tab */}
			{shareOption === "social" && (
				<div className="space-y-4">
					<p className="mb-4 text-gray-600 text-sm">Share your resume directly on social platforms</p>
					<div className="grid grid-cols-2 gap-3">
						{socialPlatforms.map((platform) => (
							<button
								key={platform.id}
								onClick={() => handleSocialShare(platform.id, platform.name)}
								type="button"
								className={`flex items-center gap-3 rounded-lg px-4 py-3 text-white shadow-sm transition-all ${platform.color}`}
							>
								{platform.icon}
								<span className="font-medium">Share on {platform.name}</span>
							</button>
						))}
					</div>
				</div>
			)}

			{/* Email Tab */}
			{shareOption === "email" && (
				<div className="space-y-4">
					<div>
						<label className="mb-2 block font-semibold text-gray-900 text-sm">Recipient Email</label>
						<input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="recruiter@company.com"
							className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-gray-900 transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500"
						/>
					</div>

					<div>
						<label className="mb-2 block font-semibold text-gray-900 text-sm">Message (Optional)</label>
						<textarea
							value={message}
							onChange={(e) => setMessage(e.target.value)}
							rows={4}
							placeholder="Add a personal message..."
							className="w-full resize-none rounded-lg border-2 border-gray-300 px-4 py-3 text-gray-900 transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500"
						></textarea>
					</div>

					<div className="flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 p-3">
						<svg className="h-5 w-5 shrink-0 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						<p className="text-blue-800 text-xs">Your resume will be attached as a PDF file</p>
					</div>

					<button
						onClick={handleEmailShare}
						type="button"
						className="w-full rounded-lg bg-emerald-600 px-6 py-3 font-medium text-white shadow-sm transition-all hover:bg-emerald-700"
					>
						Send Email
					</button>
				</div>
			)}
		</div>
	);
}

export function ExportDialog() {
	const resume = useResumeStore((state) => state.resume);
	const [selectedFormat, setSelectedFormat] = useState<"pdf" | "docx">("pdf");
	const [fileName, setFileName] = useState(resume.data.basics.name || "resume");

	const { mutateAsync: printResumeAsPDF, isPending: isPrintingPDF } = useMutation(
		orpc.printer.printResumeAsPDF.mutationOptions(),
	);

	const formats = [
		{
			id: "pdf" as const,
			name: "PDF",
			description: "Best for job applications. Preserves formatting and is universally compatible.",
			icon: <FilePdfIcon className="h-6 w-6" />,
		},
		{
			id: "docx" as const,
			name: "DOCX",
			description: "Microsoft Word format. Choose this if you need to make further edits.",
			icon: <FileDocIcon className="h-6 w-6" />,
		},
	];

	const handleDownload = useCallback(async () => {
		if (selectedFormat === "pdf") {
			const filename = generateFilename(fileName, "pdf");
			const toastId = toast.loading(t`Please wait while your PDF is being generated...`, {
				description: t`This may take a while depending on the server capacity. Please do not close the window or refresh the page.`,
			});

			try {
				const { url } = await printResumeAsPDF({ id: resume.id });
				downloadFromUrl(url, filename);
				toast.success(t`Your PDF has been downloaded successfully!`);
			} catch {
				toast.error(t`There was a problem while generating the PDF, please try again in some time.`);
			} finally {
				toast.dismiss(toastId);
			}
		} else {
			toast.info(t`DOCX format is coming soon!`);
		}
	}, [selectedFormat, fileName, resume, printResumeAsPDF]);

	return (
		<div className="space-y-6 text-gray-900 **:text-gray-900">
			{/* Format Selection */}
			<div className="space-y-3">
				<h3 className="font-semibold text-gray-900 text-sm">Select Format</h3>
				{formats.map((format) => (
					<div
						key={format.id}
						onClick={() => setSelectedFormat(format.id)}
						className={`relative flex cursor-pointer items-start gap-4 rounded-xl border-2 p-4 transition-all ${
							selectedFormat === format.id
								? "border-emerald-500 bg-emerald-50"
								: "border-gray-200 bg-white hover:border-gray-300"
						}`}
					>
						{/* Radio Button */}
						<div className="mt-1 shrink-0">
							<div
								className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
									selectedFormat === format.id ? "border-emerald-500 bg-emerald-500" : "border-gray-300 bg-white"
								}`}
							>
								{selectedFormat === format.id && <div className="h-2 w-2 rounded-full bg-white"></div>}
							</div>
						</div>

						{/* Icon */}
						<div className={`shrink-0 ${selectedFormat === format.id ? "text-emerald-600" : "text-gray-400"}`}>
							{format.icon}
						</div>

						{/* Text */}
						<div className="flex-1">
							<h4 className="mb-1 font-semibold text-gray-900">{format.name}</h4>
							<p className="text-gray-600 text-sm">{format.description}</p>
						</div>

						{/* Selected Badge */}
						{selectedFormat === format.id && (
							<div className="absolute top-4 right-4">
								<div className="rounded-full bg-emerald-500 p-1 text-white">
									<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
									</svg>
								</div>
							</div>
						)}
					</div>
				))}
			</div>

			{/* File Name Input */}
			<div>
				<label className="mb-2 block font-semibold text-gray-900 text-sm">File Name</label>
				<div className="relative">
					<input
						type="text"
						value={fileName}
						onChange={(e) => setFileName(e.target.value)}
						className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 pr-20 text-gray-900 transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500"
						placeholder="Enter file name"
					/>
					<div className="absolute top-1/2 right-3 -translate-y-1/2 font-medium text-gray-500 text-sm">
						.{selectedFormat}
					</div>
				</div>
			</div>

			{/* Info Box */}
			<div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
				<div className="flex gap-3">
					<svg className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
					<div>
						<h4 className="mb-1 font-semibold text-blue-900 text-sm">Download Tips</h4>
						<p className="text-blue-800 text-xs">
							PDF is recommended for job applications as it preserves formatting. Choose DOCX if you need to make
							further edits.
						</p>
					</div>
				</div>
			</div>

			{/* Download Button */}
			<div className="flex items-center justify-end gap-3 pt-2">
				<button
					onClick={handleDownload}
					disabled={isPrintingPDF || !fileName.trim()}
					className="flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-2.5 font-medium text-white transition-all hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-gray-300"
				>
					{isPrintingPDF ? (
						<>
							<CircleNotchIcon className="h-5 w-5 animate-spin" />
							Generating...
						</>
					) : (
						<>
							<DownloadIcon className="h-5 w-5" />
							Download {selectedFormat.toUpperCase()}
						</>
					)}
				</button>
			</div>
		</div>
	);
}
