import { getGroq } from "./groq";
import { ResumeBuilderInput, ResumeData } from "@/types";

export async function generateResume(input: ResumeBuilderInput): Promise<ResumeData> {
  const { mode, targetRole, rawText } = input;

  const modeInstructions =
    mode === "create"
      ? `The user has provided rough, unstructured notes about their background (education, work, projects, skills). Turn this into a polished, ATS-friendly resume. Invent nothing — only structure and rewrite what's given. If a section has no information, return an empty array for it.`
      : `The user has provided their EXISTING resume text. Rewrite and improve it: strengthen weak bullet points into quantified, action-verb-led statements, fix vague phrasing, and reorganize into the schema below. Do not invent employers, dates, or metrics that aren't implied by the original text.`;

  const targetRoleLine = targetRole
    ? `Tailor word choice, summary, and skill ordering toward this target role: "${targetRole}". Do not fabricate experience the user doesn't have — only emphasize and reorder what's real.`
    : `No specific target role was given — keep it general and role-agnostic.`;

  const response = await getGroq().chat.completions.create({
    model: "openai/gpt-oss-120b",
    messages: [
      {
        role: "system",
        content: `You are an expert resume writer and ATS optimization engine. Return ONLY valid JSON. No explanation, no markdown, no preamble.`,
      },
      {
        role: "user",
        content: `
${modeInstructions}
${targetRoleLine}

Source text:
"""
${rawText}
"""

Return this exact JSON structure:
{
  "fullName": "",
  "email": "",
  "phone": "",
  "location": "",
  "linkedin": "",
  "github": "",
  "summary": "2-3 sentence professional summary, achievement-oriented",
  "education": [{ "degree": "", "institution": "", "year": "", "details": "" }],
  "experience": [{ "role": "", "company": "", "duration": "", "bullets": ["quantified, action-verb-led bullet"] }],
  "projects": [{ "name": "", "description": "", "bullets": [""], "tech": ["tech1", "tech2"] }],
  "skills": ["skill1", "skill2"],
  "certifications": [],
  "ats_score": 0,
  "ats_notes": ["short actionable note about what would raise the ATS score further"]
}

Rules:
- bullets must start with strong action verbs (Built, Led, Reduced, Designed, Automated...) and quantify impact where the source text allows it
- ats_score = 0-100 estimate of how well this resume would parse and rank in an ATS, based on structure, keyword density, and quantification
- ats_notes = 3-5 concrete, specific suggestions (not generic advice)
- Leave any field empty ("" or []) rather than inventing information
- Return ONLY the JSON object
`,
      },
    ],
    temperature: 0.4,
  });

  const raw = response.choices[0].message.content || "";
  try {
    return JSON.parse(raw);
  } catch {
    const cleaned = raw.replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned);
  }
}
