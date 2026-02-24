import {
	BorderStyle,
	Document,
	HeadingLevel,
	type IParagraphOptions,
	Packer,
	Paragraph,
	ShadingType,
	Table,
	TableCell,
	TableRow,
	TextRun,
	VerticalAlign,
	WidthType,
} from "docx";
import type { ResumeData } from "@/schema/resume/data";

/** Convert a CSS color (rgba/rgb/hex) to a 6-char uppercase hex string for docx. */
function colorToHex(color: string): string {
	// Handle rgba(r, g, b, a) or rgb(r, g, b)
	const rgbaMatch = color.match(/rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
	if (rgbaMatch) {
		const r = Number.parseInt(rgbaMatch[1]).toString(16).padStart(2, "0");
		const g = Number.parseInt(rgbaMatch[2]).toString(16).padStart(2, "0");
		const b = Number.parseInt(rgbaMatch[3]).toString(16).padStart(2, "0");
		return `${r}${g}${b}`.toUpperCase();
	}
	// Handle #rrggbb or #rgb
	const hexMatch = color.match(/^#?([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/);
	if (hexMatch) {
		let hex = hexMatch[1];
		if (hex.length === 3) hex = hex.split("").map((c) => c + c).join("");
		return hex.toUpperCase();
	}
	return "2B6CB0"; // default blue fallback
}

/** Mixes a hex color with white to get a lighter version (0-1 alpha). */
function lightenHex(hex: string, alpha: number): string {
	const r = Number.parseInt(hex.slice(0, 2), 16);
	const g = Number.parseInt(hex.slice(2, 4), 16);
	const b = Number.parseInt(hex.slice(4, 6), 16);

	const mix = (c: number) => Math.round(c * alpha + 255 * (1 - alpha)).toString(16).padStart(2, "0");
	return `${mix(r)}${mix(g)}${mix(b)}`.toUpperCase();
}

/** Strip HTML tags and decode basic entities from HTML strings. */
function stripHtml(html: string): string {
	return html
		.replace(/<br\s*\/?>/gi, "\n")
		.replace(/<\/p>/gi, "\n")
		.replace(/<\/li>/gi, "\n")
		.replace(/<li>/gi, "• ")
		.replace(/<[^>]+>/g, "")
		.replace(/&amp;/g, "&")
		.replace(/&lt;/g, "<")
		.replace(/&gt;/g, ">")
		.replace(/&nbsp;/g, " ")
		.replace(/&#10;/g, "\n")
		.replace(/\n{3,}/g, "\n\n")
		.trim();
}

function heading2(text: string): Paragraph {
	return new Paragraph({
		text,
		heading: HeadingLevel.HEADING_2,
		spacing: { before: 20, after: 5, line: 200 },
	});
}

function bold(text: string, options?: IParagraphOptions): Paragraph {
	return new Paragraph({
		children: [new TextRun({ text, bold: true, size: 20 })],
		spacing: { after: 5, line: 240 },
		...options,
	});
}

function small(text: string, options?: IParagraphOptions): Paragraph {
	return new Paragraph({
		children: [new TextRun({ text, color: "555555", size: 16 })],
		spacing: { after: 5, line: 220 },
		...options,
	});
}

function body(text: string, options?: IParagraphOptions): Paragraph {
	return new Paragraph({
		children: [new TextRun({ text, size: 20 })],
		spacing: { after: 15, line: 240 },
		...options,
	});
}


export async function generateResumeDocx(data: ResumeData): Promise<Blob> {
	const { basics, summary, sections, customSections, metadata } = data;


	// Extract the primary color from the resume's design settings
	const rawPrimary = metadata.design?.colors?.primary ?? "";
	const primaryHex = rawPrimary ? colorToHex(rawPrimary) : "2B6CB0";

	// ── Helper: get sections by ID ──────────────────────────
	const getSection = (id: string) => {
		if (id in sections) return { key: id, ...(sections as any)[id] };
		if (id === "summary") return { key: id, ...summary };
		return customSections.find((s) => s.id === id);
	};

	const getSectionTitle = (id: string, section: any) =>
		section.title || id.charAt(0).toUpperCase() + id.slice(1);

	// ── Helper: Render items within a section ────────────────
	const renderSectionItems = (id: string, section: any) => {
		if (section.hidden) return [];
		const visible = (section.items as any[])?.filter((i) => !i.hidden) ?? [];
		if (id !== "summary" && visible.length === 0) return [];

		const paras: Paragraph[] = [];
		paras.push(heading2(getSectionTitle(id, section)));

		if (id === "summary") {
			const text = stripHtml(section.content);
			for (const line of text.split("\n")) {
				if (line.trim()) paras.push(body(line.trim()));
			}
		} else {
			for (const item of visible) {
				// Simplified rendering for items
				if (id === "experience") {
					paras.push(bold(item.company));
					const meta = [item.position, item.location, item.period].filter(Boolean).join("  ·  ");
					if (meta) paras.push(small(meta, { spacing: { after: 10 } }));
					if (item.description) {
						const text = stripHtml(item.description);
						for (const line of text.split("\n")) if (line.trim()) paras.push(body(line.trim(), { spacing: { after: 10 } }));
					}
				} else if (id === "education") {
					paras.push(bold(item.school));
					const meta = [item.degree, item.area, item.grade, item.location, item.period].filter(Boolean).join("  ·  ");
					if (meta) paras.push(small(meta, { spacing: { after: 10 } }));
					if (item.description) {
						const text = stripHtml(item.description);
						for (const line of text.split("\n")) if (line.trim()) paras.push(body(line.trim(), { spacing: { after: 10 } }));
					}
				} else if (id === "projects") {
					paras.push(bold(item.name));
					const meta = [item.period].filter(Boolean).join("  ·  ");
					if (meta) paras.push(small(meta, { spacing: { after: 10 } }));
					if (item.description) {
						const text = stripHtml(item.description);
						for (const line of text.split("\n")) if (line.trim()) paras.push(body(line.trim(), { spacing: { after: 10 } }));
					}
				} else if (id === "skills" || id === "languages") {
					const nameField = id === "skills" ? item.name : item.language;
					const profField = id === "skills" ? item.proficiency : item.fluency;
					const parts = [nameField, profField].filter(Boolean).join(" – ");
					paras.push(body(parts, { spacing: { after: 5 } }));
				} else {
					// Generic fallback for other sections
					const name = item.name || item.title || item.language || item.organization || "";
					if (name) paras.push(bold(name));
					const desc = item.description || item.content || "";
					if (desc) {
						const text = stripHtml(desc);
						for (const line of text.split("\n")) if (line.trim()) paras.push(body(line.trim(), { spacing: { after: 10 } }));
					}
				}
			}
		}
		return paras;
	};

	// ── Layout logic ───────────────────────────────────────
	const pageLayout = metadata.layout.pages[0] || { fullWidth: true, main: Object.keys(sections), sidebar: [] };
	// Calibrate sidebar width: Word tables handle percentages differently than CSS.
	// We'll cap the sidebar to a more reasonable 28% for better spatial balance.
	const sidebarWidth = Math.min(metadata.layout.sidebarWidth || 28, 28);

	const mainChildren: Paragraph[] = [];
	const sidebarChildren: Paragraph[] = [];

	for (const id of pageLayout.main) {
		const section = getSection(id);
		if (section) mainChildren.push(...renderSectionItems(id, section));
	}

	if (!pageLayout.fullWidth) {
		for (const id of pageLayout.sidebar) {
			const section = getSection(id);
			if (section) sidebarChildren.push(...renderSectionItems(id, section));
		}
	}

	// ── Header ──────────────────────────────────────────────
	const lightPrimaryHex = lightenHex(primaryHex, 0.02);

	const headerChildren: Paragraph[] = [];
	if (basics.name) {
		headerChildren.push(
			new Paragraph({
				text: basics.name,
				heading: HeadingLevel.HEADING_1,
				spacing: { after: 5, line: 220 },
			}),
		);
	}
	if (basics.headline) {
		headerChildren.push(
			new Paragraph({
				children: [new TextRun({ text: basics.headline, italics: true, color: "444444", size: 18 })],
				spacing: { after: 10, line: 180 },
			}),
		);
	}
	const contactParts = [
		basics.email,
		basics.phone,
		basics.location,
		basics.website?.label || basics.website?.url,
	].filter(Boolean);
	if (contactParts.length > 0) {
		headerChildren.push(
			new Paragraph({
				children: [new TextRun({ text: contactParts.join("  |  "), color: "666666", size: 18 })],
				spacing: { after: 10, line: 200 },
			}),
		);
	}

	const headerTable = new Table({
		width: { size: 100, type: WidthType.PERCENTAGE },
		borders: {
			top: { style: BorderStyle.NONE },
			bottom: { style: BorderStyle.NONE },
			left: { style: BorderStyle.NONE },
			right: { style: BorderStyle.NONE },
			insideHorizontal: { style: BorderStyle.NONE },
			insideVertical: { style: BorderStyle.NONE },
		},
		rows: [
			new TableRow({
				children: [
					new TableCell({
						children: headerChildren,
						shading: {
							fill: lightPrimaryHex,
							type: ShadingType.CLEAR,
						},
						margins: { left: 120, right: 120, top: 120, bottom: 120 },
					}),
				],
			}),
		],
	});


	// ── Table Construction ──────────────────────────────────
	const contentTable = new Table({
		width: { size: 100, type: WidthType.PERCENTAGE },
		borders: {
			top: { style: BorderStyle.NONE },
			bottom: { style: BorderStyle.NONE },
			left: { style: BorderStyle.NONE },
			right: { style: BorderStyle.NONE },
			insideHorizontal: { style: BorderStyle.NONE },
			insideVertical: { style: BorderStyle.NONE },
		},
		rows: [
			new TableRow({
				children: [
					new TableCell({
						children: mainChildren,
						width: { size: pageLayout.fullWidth ? 100 : 100 - sidebarWidth, type: WidthType.PERCENTAGE },
						verticalAlign: VerticalAlign.TOP,
						margins: { right: 80, top: 10 },
					}),
					...(pageLayout.fullWidth
						? []
						: [
								new TableCell({
									children: sidebarChildren,
									width: { size: sidebarWidth, type: WidthType.PERCENTAGE },
									verticalAlign: VerticalAlign.TOP,
									shading: {
										fill: lightenHex(primaryHex, 0.15),
										type: ShadingType.CLEAR,
									},
									margins: { left: 120, right: 120, top: 120 },
									borders: {
										left: { style: BorderStyle.SINGLE, size: 4, color: "EAEAEA" },
									},
								}),
						  ]),
				],
			}),
		],
	});

	// ── Build Document ───────────────────────────────────────
	const doc = new Document({
		styles: {
			paragraphStyles: [
				{
					id: "Heading1",
					name: "Heading 1",
					basedOn: "Normal",
					quickFormat: true,
					run: { size: 36, bold: true, color: primaryHex },
					paragraph: { spacing: { after: 10, line: 300 } },
				},
				{
					id: "Heading2",
					name: "Heading 2",
					basedOn: "Normal",
					quickFormat: true,
					run: { size: 22, bold: true, color: primaryHex },
					paragraph: { spacing: { before: 400, after: 80, line: 240 } },
				},
			],
		},
		sections: [
			{
				properties: {
					page: {
						margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 },
					},
				},
				children: [headerTable, new Paragraph({ text: "", spacing: { after: 20 } }), contentTable],
			},
		],

	});

	const buffer = await Packer.toBlob(doc);
	return buffer;
}
