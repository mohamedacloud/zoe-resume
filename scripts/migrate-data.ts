import { eq } from "drizzle-orm";
import * as schema from "../src/integrations/drizzle/schema";
import { db } from "./db-client";

const sectionItemDefaults: Record<string, any> = {
	experience: { period: "", website: { url: "", label: "" }, position: "", location: "", description: "" },
	education: {
		period: "",
		website: { url: "", label: "" },
		degree: "",
		area: "",
		grade: "",
		location: "",
		description: "",
		currentlyStudyingHere: false,
	},
	projects: { period: "", website: { url: "", label: "" }, name: "", description: "" },
	profiles: { username: "", website: { url: "", label: "" }, icon: "", network: "" },
	awards: { awarder: "", date: "", website: { url: "", label: "" }, description: "", title: "" },
	certifications: { issuer: "", date: "", website: { url: "", label: "" }, description: "", title: "" },
	interests: { icon: "", name: "", keywords: [] },
	languages: { language: "", fluency: "", level: 0 },
	skills: { icon: "", name: "", proficiency: "", level: 0, keywords: [] },
	publications: { publisher: "", date: "", website: { url: "", label: "" }, description: "", title: "" },
	references: { position: "", website: { url: "", label: "" }, phone: "", description: "", name: "" },
	volunteer: { location: "", period: "", website: { url: "", label: "" }, description: "", organization: "" },
	"cover-letter": { recipient: "", content: "" },
	summary: { content: "" },
};

async function migrate() {
	console.log("Starting REFINED migration...");
	const resumes = await db.select().from(schema.resume);

	for (const resume of resumes) {
		const data = JSON.parse(JSON.stringify(resume.data)) as any;
		let modified = false;

		const fixValue = (obj: any, key: string, defaultValue: any) => {
			if (obj[key] === undefined || obj[key] === null) {
				obj[key] = JSON.parse(JSON.stringify(defaultValue));
				return true;
			}
			return false;
		};

		if (!data.sections) {
			data.sections = {};
			modified = true;
		}

		const topLevelSections = [
			"profiles",
			"experience",
			"education",
			"projects",
			"skills",
			"languages",
			"interests",
			"awards",
			"certifications",
			"publications",
			"volunteer",
			"references",
		];

		for (const sectionKey of topLevelSections) {
			if (!data.sections[sectionKey]) {
				data.sections[sectionKey] = { title: "", columns: 1, hidden: false, items: [] };
				modified = true;
			} else {
				if (fixValue(data.sections[sectionKey], "title", "")) modified = true;
				if (fixValue(data.sections[sectionKey], "columns", 1)) modified = true;
				if (fixValue(data.sections[sectionKey], "hidden", false)) modified = true;
				if (fixValue(data.sections[sectionKey], "items", [])) modified = true;
			}

			const defaults = sectionItemDefaults[sectionKey];
			if (defaults && data.sections[sectionKey].items) {
				for (const item of data.sections[sectionKey].items) {
					for (const [key, val] of Object.entries(defaults)) {
						if (fixValue(item, key, val)) modified = true;
					}
					if (fixValue(item, "id", "temp-id")) modified = true;
					if (fixValue(item, "hidden", false)) modified = true;
				}
			}
		}

		// Basics
		if (!data.basics) {
			data.basics = {
				name: "",
				headline: "",
				email: "",
				phone: "",
				location: "",
				website: { url: "", label: "" },
				customFields: [],
			};
			modified = true;
		} else {
			if (fixValue(data.basics, "name", "")) modified = true;
			if (fixValue(data.basics, "headline", "")) modified = true;
			if (fixValue(data.basics, "email", "")) modified = true;
			if (fixValue(data.basics, "phone", "")) modified = true;
			if (fixValue(data.basics, "location", "")) modified = true;
			if (fixValue(data.basics, "website", { url: "", label: "" })) modified = true;
			if (fixValue(data.basics, "customFields", [])) modified = true;
		}

		// Metadata
		if (!data.metadata) {
			// ... existing big chunk ...
		} else {
			if (fixValue(data.metadata, "template", "onyx")) modified = true;
			if (fixValue(data.metadata, "layout", { sidebarWidth: 35, pages: [] })) modified = true;
			if (fixValue(data.metadata, "css", { enabled: false, value: "" })) modified = true;
			if (
				fixValue(data.metadata, "page", {
					gapX: 0,
					gapY: 0,
					marginX: 54,
					marginY: 54,
					format: "a4",
					locale: "en-US",
					hideIcons: false,
				})
			)
				modified = true;
			if (
				fixValue(data.metadata, "design", {
					level: { icon: "", type: "hidden" },
					colors: { primary: "", text: "", background: "" },
				})
			)
				modified = true;
			if (
				fixValue(data.metadata, "typography", {
					body: { fontFamily: "Inter", fontWeights: ["400"], fontSize: 11, lineHeight: 1.5 },
					heading: { fontFamily: "Inter", fontWeights: ["600"], fontSize: 14, lineHeight: 1.2 },
				})
			)
				modified = true;
			if (fixValue(data.metadata, "notes", "")) modified = true;
			if (fixValue(data.metadata, "coverLetter", "")) modified = true;
		}

		if (modified) {
			console.log(`Migrating resume: ${resume.id} (${resume.name})`);
			await db.update(schema.resume).set({ data }).where(eq(schema.resume.id, resume.id));
		}
	}
	console.log("Refined migration completed.");
	process.exit(0);
}

migrate().catch(console.error);
