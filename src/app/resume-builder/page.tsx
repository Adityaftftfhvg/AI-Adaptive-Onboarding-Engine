"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { useResumeBuilder } from "@/hooks/useResumeBuilder";
import ResumeBuilderForm from "@/components/ResumeBuilderForm";
import { colors, fonts } from "@/styles/tokens";

const ResumeEditor = dynamic(() => import("@/components/ResumeEditor"), { ssr: false });

export default function ResumeBuilderPage() {
  const { loading, error, resume, build, reset } = useResumeBuilder();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');`;
    document.head.appendChild(style);
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div style={{ minHeight: "100vh", background: colors.bg, fontFamily: fonts.body, color: colors.textPrimary }}>
      <header style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 48px", borderBottom: `1px solid ${colors.borderSubtle}`,
        background: "rgba(10,15,30,0.8)", backdropFilter: "blur(20px)",
      }}>
        <Link href="/" style={{ color: colors.textPrimary, textDecoration: "none", fontFamily: fonts.display, fontWeight: 800, fontSize: 20 }}>
          ⬡ PathForge
        </Link>
        <Link href="/" style={{ color: colors.accent, textDecoration: "none", fontSize: 14 }}>
          ← Back to Skill Analyzer
        </Link>
      </header>

      {!resume ? (
        <ResumeBuilderForm onGenerate={build} loading={loading} error={error} />
      ) : (
        <ResumeEditor resume={resume} onReset={reset} />
      )}
    </div>
  );
}