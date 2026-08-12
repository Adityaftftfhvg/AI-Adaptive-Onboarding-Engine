"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { useResumeBuilder } from "@/hooks/useResumeBuilder";
import ResumeBuilderForm from "@/components/ResumeBuilderForm";
import { colors, fonts } from "@/styles/tokens";

const ResumeEditor = dynamic(() => import("@/components/ResumeEditor"), { ssr: false });

export default function ResumeBuilderPage() {
  const { loading, error, resume, template, build, reset } = useResumeBuilder();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const style = document.createElement("style");
  style.innerHTML = `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');`;
    document.head.appendChild(style);
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div style={{ minHeight: "100vh", background: colors.bg, fontFamily: fonts.body, color: colors.textPrimary }}>
      <header
        className="flex-wrap gap-3 px-4 sm:px-8 md:px-12 py-3 sm:py-4"
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          borderBottom: `1px solid ${colors.borderSubtle}`,
          background: "rgba(255,255,255,0.85)", backdropFilter: "blur(20px)",
        }}
      >
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, color: colors.textPrimary, textDecoration: "none", fontFamily: fonts.display, fontWeight: 800, fontSize: 20 }}>
          <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 30, height: 30, borderRadius: 8, background: "linear-gradient(135deg, #FF7A50, #FF5A36)", color: "#fff", fontSize: 15 }}>⬡</span>
          PathForge
        </Link>
        <Link href="/" style={{ color: colors.accent, textDecoration: "none", fontSize: 14 }}>
          ← Back to Skill Analyzer
        </Link>
      </header>

      {!resume ? (
        <ResumeBuilderForm onGenerate={build} loading={loading} error={error} />
      ) : (
        <ResumeEditor resume={resume} onReset={reset} initialTemplate={template} />
      )}
    </div>
  );
}
