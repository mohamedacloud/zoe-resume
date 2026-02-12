import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_AI_API_KEY || "";
const MODEL_NAME = import.meta.env.VITE_AI_MODEL || "models/gemini-2.0-flash-exp";

const genAI = new GoogleGenerativeAI(API_KEY);

interface ExperienceData {
  position: string;
  company: string;
  location: string;
  period: string;
}

interface SummaryData {
  name: string;
  headline: string;
  experience: Array<{ position: string; company: string }>;
  skills: string[];
  currentSummary?: string;
}

export async function generateExperienceDescription(data: ExperienceData): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ 
      model: MODEL_NAME,
      generationConfig: {
        maxOutputTokens: 512,
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
      },
    });

    const prompt = `SYSTEM PROMPT
Role: You are an expert resume writer and ATS (Applicant Tracking System) optimization specialist with 15+ years of experience. Your goal is to help users create professional, ATS-friendly resume content.

Core Principles:
• Generate factual, accurate content based only on user-provided information
• Never exaggerate or fabricate achievements, skills, or experiences
• Use action verbs and quantifiable metrics when possible
• Ensure ATS compatibility with clear formatting and standard terminology
• Keep language professional, concise, and impact-focused
• Avoid buzzwords, clichés, and overly generic statements
• No icons, tables, or special characters
• Each bullet should be 1–2 lines maximum
• If information is missing, stay silent
• Keep a professional tone market-friendly
• Consume vernacular or Hinglish inputs but give only English output

EXPERIENCE TASK: Generate achievement-focused work experience bullet points.

INPUT:
• Job Title: ${data.position || "Not specified"}
• Company: ${data.company || "Not specified"}
• Location: ${data.location || "Not specified"}
• Period: ${data.period || "Not specified"}

RULES:
• Output ONLY bullet points (no headers, no extra text)
• Generate EXACTLY 4 bullets
• Start every bullet with a strong action verb
• Focus on impact, performance, scalability, and collaboration
• Use metrics only if they can be reasonably inferred from the role
• Keep each bullet 1–2 lines
• English only
• Format bullets starting with •`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    return text.trim();
  } catch (error) {
    console.error("Error generating experience description:", error);
    throw new Error("Failed to generate description. Please try again.");
  }
}

export async function generateProfessionalSummary(data: SummaryData): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ 
      model: MODEL_NAME,
      generationConfig: {
        maxOutputTokens: 1024,
        temperature: 0.8,
        topP: 0.95,
        topK: 40,
      },
    });

    const experienceText = data.experience
      .slice(0, 2)
      .map((exp) => `${exp.position} at ${exp.company}`)
      .join(", ");

    const skillsText = data.skills.slice(0, 5).join(", ");

    // Build the prompt based on whether user has existing summary
    let prompt = "";

    // If user has written something, use it as the base
    if (data.currentSummary?.trim()) {
      prompt = `You are an expert resume writer. Convert this draft into a professional 3-4 sentence resume summary.

USER'S DRAFT:
"${data.currentSummary}"

CONTEXT:
- Role: ${data.headline || "Not specified"}
- Experience: ${experienceText || "Not specified"}
- Skills: ${skillsText || "Not specified"}

INSTRUCTIONS:
1. Convert Hinglish/informal language to professional English
2. Write exactly 3-4 complete sentences
3. Keep the original meaning and personality
4. Use ATS-friendly keywords
5. Make it compelling and achievement-focused
6. Output ONLY the summary, no extra text

Write the complete professional summary now:`;
    } else {
      // Generate from scratch if no summary exists
      prompt = `You are an expert resume writer. Write a professional 3-4 sentence resume summary.

CONTEXT:
- Name: ${data.name || "Professional"}
- Role: ${data.headline || "Professional"}
- Experience: ${experienceText || "Various roles"}
- Skills: ${skillsText || "Multiple skills"}

INSTRUCTIONS:
1. Write exactly 3-4 complete sentences
2. Highlight role, skills, and value
3. Use ATS-friendly keywords
4. Make it professional and compelling
5. Output ONLY the summary, no extra text

Write the complete professional summary now:`;
    }

    const result = await model.generateContent(prompt);
    const response = result.response;
    
    // Debug: Check finish reason and safety ratings
    console.log("Gemini Response Debug:", {
      finishReason: response.candidates?.[0]?.finishReason,
      safetyRatings: response.candidates?.[0]?.safetyRatings,
      text: response.text()
    });
    
    // Check if response was blocked or incomplete
    if (!response || !response.text) {
      console.error("Incomplete response:", response);
      throw new Error("AI response was incomplete. Please try again.");
    }
    
    const text = response.text();
    
    // Log for debugging
    console.log("AI Summary generated, length:", text.length, "chars");
    
    return text.trim();
  } catch (error) {
    console.error("Error generating professional summary:", error);
    throw new Error("Failed to generate summary. Please try again.");
  }
}
