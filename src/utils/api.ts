import type { ResumeData } from "@/schema/resume/data";

const BASE_URL = "https://api.resume-builder.zuvy.org/api/openapi";
const AUTH_TOKEN = import.meta.env.VITE_AUTH_TOKEN as string;

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
	const url = path.startsWith("http") ? path : `${BASE_URL}${path}`;
	const response = await fetch(url, {
		...options,
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${AUTH_TOKEN}`,
			...options.headers,
		},
	});

	if (!response.ok) {
		const errorBody = await response.json().catch(() => ({}));
		throw new Error(errorBody.message || `Request failed with status ${response.status}`);
	}

	if (response.status === 204) {
		return undefined as unknown as T;
	}

	return response.json();
}

// ----- Types -----

export interface ResumeSummary {
	id: string;
	name: string;
	slug: string;
	tags: string[];
	isPublic: boolean;
	isLocked: boolean;
	createdAt: Date;
	updatedAt: Date;
	data: ResumeData;
}

export interface ResumeStatistics {
	totalResumes: number;
	totalDownloads: number;
	lastUpdated: string | null;
}

// ----- Helpers -----

const mapResume = (resume: ResumeSummary): ResumeSummary => ({
	...resume,
	createdAt: new Date(resume.createdAt),
	updatedAt: new Date(resume.updatedAt),
});

// ----- API -----

export const api = {
	// 1. GET: /resumes/user?sort=name
	fetchResumes: async (sort: string = "name") => {
		const resumes = await request<ResumeSummary[]>(`/resumes/user?sort=${sort}`);
		return resumes.map(mapResume);
	},

	// 2. GET: /resumes/{id}
	fetchResume: async (id: string) => {
		const resume = await request<ResumeSummary>(`/resumes/${id}`);
		return mapResume(resume);
	},

	// 3. PUT: /resumes/{id}
	updateResume: (id: string, data: Partial<Omit<ResumeSummary, "id" | "createdAt" | "updatedAt">>) =>
		request<void>(`/resumes/${id}`, {
			method: "PUT",
			body: JSON.stringify(data),
		}),

	// 4. DELETE: /resumes/{id}
	deleteResume: (id: string) =>
		request<void>(`/resumes/${id}`, {
			method: "DELETE",
		}),

	// 5. POST: /resumes
	createResume: (data: {
		name: string;
		slug: string;
		tags?: string[];
		data?: ResumeData;
		isPublic?: boolean;
		withSampleData?: boolean;
	}) =>
		request<{ id: string }>("/resumes", {
			method: "POST",
			body: JSON.stringify(data),
		}),

	// 6. POST: /resumes/{id}/duplicate
	duplicateResume: (id: string, overrides: { name?: string; slug?: string; tags?: string[] } = {}) =>
		request<{ id: string }>(`/resumes/${id}/duplicate`, {
			method: "POST",
			body: JSON.stringify(overrides),
		}),

	// 7. GET: /resumes/statistics
	fetchStatistics: () => request<ResumeStatistics>("/resumes/statistics"),
};
