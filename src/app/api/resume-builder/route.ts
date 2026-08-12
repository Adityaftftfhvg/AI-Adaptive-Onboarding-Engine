import { NextRequest, NextResponse } from "next/server";
import { extractTextFromPDF } from "@/lib/parsePDF";
import { generateResume } from "@/lib/generateResume";
import { ResumeBuilderMode } from "@/types";
import { auth } from "@/auth";
export const runtime = "nodejs";
export const maxDuration = 60;
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: "You must be logged in to use the Resume Builder." },
        { status: 401 }
      );
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: "GROQ_API_KEY is not set. Add it to your .env.local file." },
        { status: 500 }
      );
    }

    const formData = await req.formData();

    const mode = formData.get("mode") as ResumeBuilderMode | null;
    if (mode !== "create" && mode !== "improve") {
      return NextResponse.json(
        { error: "mode must be 'create' or 'improve'" },
        { status: 400 }
      );
    }

    const targetRole = (formData.get("target_role") as string | null) || undefined;

   
    const file = formData.get("resume_file") as File | null;
    const text = formData.get("resume_text") as string | null;

    let rawText = "";
    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      rawText = await extractTextFromPDF(buffer);
    } else if (text) {
      rawText = text;
    } else {
      return NextResponse.json(
        {
          error:
            mode === "create"
              ? "Please provide some notes about your background."
              : "Please upload or paste your existing resume.",
        },
        { status: 400 }
      );
    }

    if (rawText.trim().length < 20) {
      return NextResponse.json(
        { error: "Provided text is too short to generate a meaningful resume." },
        { status: 400 }
      );
    }

    
    let resume;
    try {
      resume = await generateResume({ mode, targetRole, rawText });
    } catch (err: any) {
      console.error("[resume-builder] generation failed:", err);
      return NextResponse.json(
        { error: "Resume generation failed. Check your Groq API key or try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ resume });
  } catch (err: any) {
    console.error("[resume-builder] unhandled error:", err);
    return NextResponse.json(
      { error: err?.message || "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
