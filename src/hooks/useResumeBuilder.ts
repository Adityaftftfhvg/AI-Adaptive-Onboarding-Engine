"use client";

import { useState } from "react";
import { ResumeData, ResumeBuilderMode, ResumeTemplate } from "@/types";

export type ResumeLoadingStep = "idle" | "generating" | "done";

export function useResumeBuilder() {
  const [loadingStep, setLoadingStep] = useState<ResumeLoadingStep>("idle");
  const [error, setError] = useState("");
  const [resume, setResume] = useState<ResumeData | null>(null);
  const [template, setTemplate] = useState<ResumeTemplate>("classic");

  const loading = loadingStep === "generating";

  async function build({
    mode, targetRole, text, file, template: chosenTemplate,
  }: {
    mode: ResumeBuilderMode;
    targetRole: string;
    text: string;
    file: File | null;
    template: ResumeTemplate;
  }) {
    setTemplate(chosenTemplate);
    setError("");
    setResume(null);
    setLoadingStep("generating");

    try {
      const formData = new FormData();
      formData.append("mode", mode);
      if (targetRole.trim()) formData.append("target_role", targetRole);

      if (file) {
        formData.append("resume_file", file);
      } else if (text.trim()) {
        formData.append("resume_text", text);
      } else {
        throw new Error(
          mode === "create"
            ? "Please add some notes about your background"
            : "Please upload or paste your existing resume"
        );
      }

      const res = await fetch("/api/resume-builder", {
        method: "POST",
        body: formData,
      });

      let data: any;
      const contentType = res.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const t = await res.text();
        throw new Error(`Server error (${res.status}): ${t.slice(0, 200)}`);
      }

      if (!res.ok) throw new Error(data.error || "Resume generation failed");

      setLoadingStep("done");
      setResume(data.resume);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      setLoadingStep("idle");
    }
  }

  function reset() {
    setResume(null);
    setError("");
    setLoadingStep("idle");
  }

  return { loading, loadingStep, error, resume, template, build, reset };
}