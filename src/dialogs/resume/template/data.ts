import type { MessageDescriptor } from "@lingui/core";
import { msg } from "@lingui/core/macro";
import type { Template } from "@/schema/templates";
import type { ResumeData } from "@/schema/resume/data";

export type TemplateDefaults = {
	design: {
		colors: {
			primary: string;
			text: string;
			background: string;
		};
	};
	typography: {
		body: {
			fontFamily: string;
			fontWeights: ("100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900")[];
			fontSize: number;
			lineHeight: number;
		};
		heading: {
			fontFamily: string;
			fontWeights: ("100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900")[];
			fontSize: number;
			lineHeight: number;
		};
	};
};

export type TemplateMetadata = {
	name: string;
	description: MessageDescriptor;
	imageUrl: string;
	tags: string[];
	sidebarPosition: "left" | "right" | "none";
	defaults: TemplateDefaults;
};

export const templates = {
	azurill: {
		name: "Azurill",
		description: msg`Two-column with a bold colored sidebar and skill bars; great for creative or tech roles where visual flair is welcome.`,
		imageUrl: "/templates/jpg/azurill.jpg",
		tags: ["Two-column", "Creative", "Tech", "Visual flair"],
		sidebarPosition: "left",
		defaults: {
			design: {
				colors: {
					primary: "rgba(124, 58, 237, 1)", // Purple
					text: "rgba(0, 0, 0, 1)",
					background: "rgba(255, 255, 255, 1)",
				},
			},
			typography: {
				body: {
					fontFamily: "Inter",
					fontWeights: ["400", "500"],
					fontSize: 10,
					lineHeight: 1.5,
				},
				heading: {
					fontFamily: "Inter",
					fontWeights: ["600"],
					fontSize: 14,
					lineHeight: 1.5,
				},
			},
		},
	},
	bronzor: {
		name: "Bronzor",
		description: msg`Two-column, clean and professional with subtle section dividers; suits corporate, finance, or consulting positions.`,
		imageUrl: "/templates/jpg/bronzor.jpg",
		tags: ["Two-column", "Clean", "Professional", "Corporate", "Finance", "Consulting"],
		sidebarPosition: "none",
		defaults: {
			design: {
				colors: {
					primary: "rgba(71, 85, 105, 1)", // Gray/Slate
					text: "rgba(0, 0, 0, 1)",
					background: "rgba(255, 255, 255, 1)",
				},
			},
			typography: {
				body: {
					fontFamily: "IBM Plex Sans",
					fontWeights: ["400", "500"],
					fontSize: 10,
					lineHeight: 1.5,
				},
				heading: {
					fontFamily: "IBM Plex Sans",
					fontWeights: ["600"],
					fontSize: 14,
					lineHeight: 1.5,
				},
			},
		},
	},
	chikorita: {
		name: "Chikorita",
		description: msg`Two-column with a soft header accent and circular profile photo; ideal for marketing, HR, or client-facing roles.`,
		imageUrl: "/templates/jpg/chikorita.jpg",
		tags: ["Two-column", "Soft accent", "Marketing", "HR", "Client-facing"],
		sidebarPosition: "right",
		defaults: {
			design: {
				colors: {
					primary: "rgba(236, 72, 153, 1)", // Pink
					text: "rgba(0, 0, 0, 1)",
					background: "rgba(255, 255, 255, 1)",
				},
			},
			typography: {
				body: {
					fontFamily: "Lato",
					fontWeights: ["400", "500"],
					fontSize: 10,
					lineHeight: 1.5,
				},
				heading: {
					fontFamily: "Lato",
					fontWeights: ["600", "700"],
					fontSize: 14,
					lineHeight: 1.5,
				},
			},
		},
	},
	ditgar: {
		name: "Ditgar",
		description: msg`Two-column with a dark teal sidebar and skills grid; modern feel for developers, data scientists, or technical PMs.`,
		imageUrl: "/templates/jpg/ditgar.jpg",
		tags: ["Two-column", "Modern", "Developer", "Data science", "Technical PM", "Dark sidebar"],
		sidebarPosition: "left",
		defaults: {
			design: {
				colors: {
					primary: "rgba(20, 184, 166, 1)", // Teal
					text: "rgba(0, 0, 0, 1)",
					background: "rgba(255, 255, 255, 1)",
				},
			},
			typography: {
				body: {
					fontFamily: "Roboto",
					fontWeights: ["400", "500"],
					fontSize: 10,
					lineHeight: 1.5,
				},
				heading: {
					fontFamily: "Roboto",
					fontWeights: ["600", "700"],
					fontSize: 14,
					lineHeight: 1.5,
				},
			},
		},
	},
	ditto: {
		name: "Ditto",
		description: msg`Two-column, minimal and text-dense with no decorative elements; perfect for traditional industries or ATS-heavy applications.`,
		imageUrl: "/templates/jpg/ditto.jpg",
		tags: ["Two-column", "ATS friendly", "Minimal", "Text-dense", "Traditional", "No decoration"],
		sidebarPosition: "left",
		defaults: {
			design: {
				colors: {
					primary: "rgba(0, 0, 0, 1)", // Black
					text: "rgba(0, 0, 0, 1)",
					background: "rgba(255, 255, 255, 1)",
				},
			},
			typography: {
				body: {
					fontFamily: "IBM Plex Serif",
					fontWeights: ["400"],
					fontSize: 10,
					lineHeight: 1.5,
				},
				heading: {
					fontFamily: "IBM Plex Serif",
					fontWeights: ["600"],
					fontSize: 14,
					lineHeight: 1.5,
				},
			},
		},
	},
	gengar: {
		name: "Gengar",
		description: msg`Two-column with accent colors and clean typography; balanced choice for business analysts or operations roles.`,
		imageUrl: "/templates/jpg/gengar.jpg",
		tags: ["Two-column", "Accent colors", "Clean typography", "Business analyst", "Operations"],
		sidebarPosition: "left",
		defaults: {
			design: {
				colors: {
					primary: "rgba(139, 92, 246, 1)", // Violet
					text: "rgba(0, 0, 0, 1)",
					background: "rgba(255, 255, 255, 1)",
				},
			},
			typography: {
				body: {
					fontFamily: "Open Sans",
					fontWeights: ["400", "500"],
					fontSize: 10,
					lineHeight: 1.5,
				},
				heading: {
					fontFamily: "Open Sans",
					fontWeights: ["600", "700"],
					fontSize: 14,
					lineHeight: 1.5,
				},
			},
		},
	},
	glalie: {
		name: "Glalie",
		description: msg`Two-column, minimal with light gray sidebar and subtle icons; professional and understated for legal, finance, or executive roles.`,
		imageUrl: "/templates/jpg/glalie.jpg",
		tags: ["Two-column", "Minimal", "Professional", "Legal", "Finance", "Executive", "Understated"],
		sidebarPosition: "left",
		defaults: {
			design: {
				colors: {
					primary: "rgba(100, 116, 139, 1)", // Light gray/slate
					text: "rgba(0, 0, 0, 1)",
					background: "rgba(255, 255, 255, 1)",
				},
			},
			typography: {
				body: {
					fontFamily: "Source Sans Pro",
					fontWeights: ["400"],
					fontSize: 10,
					lineHeight: 1.5,
				},
				heading: {
					fontFamily: "Source Sans Pro",
					fontWeights: ["600"],
					fontSize: 14,
					lineHeight: 1.5,
				},
			},
		},
	},
	kakuna: {
		name: "Kakuna",
		description: msg`Single-column with a magenta left border accent; compact and efficient for entry-level or internship applications.`,
		imageUrl: "/templates/jpg/kakuna.jpg",
		tags: ["Single-column", "ATS friendly", "Compact", "Efficient", "Entry level", "Internship", "Magenta accent"],
		sidebarPosition: "none",
		defaults: {
			design: {
				colors: {
					primary: "rgba(219, 39, 119, 1)", // Magenta
					text: "rgba(0, 0, 0, 1)",
					background: "rgba(255, 255, 255, 1)",
				},
			},
			typography: {
				body: {
					fontFamily: "Noto Sans",
					fontWeights: ["400"],
					fontSize: 10,
					lineHeight: 1.5,
				},
				heading: {
					fontFamily: "Noto Sans",
					fontWeights: ["600"],
					fontSize: 14,
					lineHeight: 1.5,
				},
			},
		},
	},
	lapras: {
		name: "Lapras",
		description: msg`Single-column; polished and serious for senior or enterprise-level positions.`,
		imageUrl: "/templates/jpg/lapras.jpg",
		tags: ["Single-column", "ATS friendly", "Polished", "Senior", "Enterprise"],
		sidebarPosition: "none",
		defaults: {
			design: {
				colors: {
					primary: "rgba(30, 58, 138, 1)", // Navy blue
					text: "rgba(0, 0, 0, 1)",
					background: "rgba(255, 255, 255, 1)",
				},
			},
			typography: {
				body: {
					fontFamily: "Merriweather",
					fontWeights: ["400"],
					fontSize: 10,
					lineHeight: 1.5,
				},
				heading: {
					fontFamily: "Merriweather",
					fontWeights: ["700"],
					fontSize: 14,
					lineHeight: 1.5,
				},
			},
		},
	},
	leafish: {
		name: "Leafish",
		description: msg`Two-column with a muted color sidebar; earthy and calm, suits sustainability, healthcare, or nonprofit sectors.`,
		imageUrl: "/templates/jpg/leafish.jpg",
		tags: ["Two-column", "Muted sidebar", "Earthy", "Calm", "Sustainability", "Healthcare", "Nonprofit"],
		sidebarPosition: "right",
		defaults: {
			design: {
				colors: {
					primary: "rgba(101, 163, 13, 1)", // Olive green
					text: "rgba(0, 0, 0, 1)",
					background: "rgba(255, 255, 255, 1)",
				},
			},
			typography: {
				body: {
					fontFamily: "Lora",
					fontWeights: ["400"],
					fontSize: 10,
					lineHeight: 1.5,
				},
				heading: {
					fontFamily: "Lora",
					fontWeights: ["600"],
					fontSize: 14,
					lineHeight: 1.5,
				},
			},
		},
	},
	onyx: {
		name: "Onyx",
		description: msg`Single-column with a sidebar and clean grid layout; versatile for any professional or technical role.`,
		imageUrl: "/templates/jpg/onyx.jpg",
		tags: ["Single-column", "ATS friendly", "Sidebar", "Grid layout", "Versatile", "Professional", "Technical"],
		sidebarPosition: "none",
		defaults: {
			design: {
				colors: {
					primary: "rgba(220, 38, 38, 1)", // Red
					text: "rgba(0, 0, 0, 1)",
					background: "rgba(255, 255, 255, 1)",
				},
			},
			typography: {
				body: {
					fontFamily: "IBM Plex Serif",
					fontWeights: ["400", "500"],
					fontSize: 10,
					lineHeight: 1.5,
				},
				heading: {
					fontFamily: "IBM Plex Serif",
					fontWeights: ["600"],
					fontSize: 14,
					lineHeight: 1.5,
				},
			},
		},
	},
	pikachu: {
		name: "Pikachu",
		description: msg`Two-column with a left margin color; simple and approachable for creative, editorial, or junior roles.`,
		imageUrl: "/templates/jpg/pikachu.jpg",
		tags: ["Two-column", "Simple", "Creative", "Editorial", "Junior", "Accent colors"],
		sidebarPosition: "left",
		defaults: {
			design: {
				colors: {
					primary: "rgba(234, 179, 8, 1)", // Yellow/gold
					text: "rgba(0, 0, 0, 1)",
					background: "rgba(255, 255, 255, 1)",
				},
			},
			typography: {
				body: {
					fontFamily: "Raleway",
					fontWeights: ["400", "500"],
					fontSize: 10,
					lineHeight: 1.5,
				},
				heading: {
					fontFamily: "Raleway",
					fontWeights: ["600", "700"],
					fontSize: 14,
					lineHeight: 1.5,
				},
			},
		},
	},
	rhyhorn: {
		name: "Rhyhorn",
		description: msg`Single-column with a minimal top header and lots of whitespace; clean and modern for designers or content creators.`,
		imageUrl: "/templates/jpg/rhyhorn.jpg",
		tags: ["Single-column", "ATS friendly", "Minimal", "Clean", "Modern", "Designer", "Content creator", "Whitespace"],
		sidebarPosition: "none",
		defaults: {
			design: {
				colors: {
					primary: "rgba(59, 130, 246, 1)", // Blue
					text: "rgba(0, 0, 0, 1)",
					background: "rgba(255, 255, 255, 1)",
				},
			},
			typography: {
				body: {
					fontFamily: "Montserrat",
					fontWeights: ["400"],
					fontSize: 10,
					lineHeight: 1.5,
				},
				heading: {
					fontFamily: "Montserrat",
					fontWeights: ["600"],
					fontSize: 14,
					lineHeight: 1.5,
				},
			},
		},
	},
} as const satisfies Record<Template, TemplateMetadata>;
