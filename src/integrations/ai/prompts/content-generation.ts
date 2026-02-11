export const AI_PROMPTS = {
	experience: (data: {
		title?: string;
		company?: string;
		position?: string;
		responsibilities?: string;
		projectDetails?: string;
	}) => `
You are an expert ATS resume writer.

TASK:
Generate achievement-focused work experience bullet points.

INPUT:
Job Title: ${data.position || data.title || 'N/A'}
Company: ${data.company || 'N/A'}
Responsibilities: ${data.responsibilities || ''}
Projects: ${data.projectDetails || ''}

STRICT RULES:
- Output ONLY bullet points
- Generate EXACTLY 4 bullets
- Start every bullet with a strong action verb
- Focus on impact, performance, scalability, and collaboration
- Use metrics only if provided
- Keep each bullet 1–2 lines
- Do NOT apologize, explain, or mention missing data
- English only
- Format bullets starting with •

Generate bullet points now:
`,

	projects: (data: {
		name?: string;
		technologies?: string;
		description?: string;
		highlights?: string;
	}) => `
You are an expert ATS resume writer.

TASK:
Generate technical, ATS-friendly project bullet points.

INPUT:
Project Name: ${data.name || 'N/A'}
Technologies: ${data.technologies || 'N/A'}
Description: ${data.description || ''}
Highlights: ${data.highlights || ''}

STRICT RULES:
- Output ONLY bullet points
- Generate EXACTLY 3 bullets
- Start each bullet with a strong action verb
- Clearly state what was built and its impact
- Highlight technologies and functionality
- Keep each bullet 1–2 lines
- Do NOT apologize, explain, or mention missing data
- English only
- Format bullets starting with •

Generate bullet points now:
`,

	summary: (userData: string | Record<string, unknown>) => `
You are an expert ATS resume writer.

TASK:
Write a professional resume summary.

INPUT:
${typeof userData === 'string' ? userData : JSON.stringify(userData, null, 2)}

STRICT RULES:
- Output ONLY the summary
- Write EXACTLY 3–4 sentences
- Convert Hinglish to professional English
- Highlight role, core skills, and career focus
- Use ATS-friendly keywords
- Do NOT apologize, explain, or mention missing data

Generate the professional summary now:
`,

	custom: (data: { sectionName: string; description: string; round: number }) => `
You are a resume expert specializing in creating sections for "${data.sectionName}" in a resume optimized for ATS systems.

ROUND INFORMATION:
• Current Round: ${data.round} of 2

CONTEXT:
The user is describing a section on ${data.sectionName}:
• User's description: ${data.description}

TASK:
${
	data.round === 1
		? `1. Refine user's input to be more professional and ATS-friendly
2. Maintain factual accuracy from user's original input`
		: `Provide an alternative description that:
1. Uses varied sentence structure and phrasing
2. Maintains factual accuracy from user's original input
3. Offers a fresh perspective while staying ATS-optimized`
}

OUTPUT FORMAT:
Provide 2-5 bullet points, each on a new line, starting with a bullet point (•), in English only.

Generate the content now:
`,
};
