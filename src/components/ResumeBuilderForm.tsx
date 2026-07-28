"use client";

import { useState, useRef } from "react";
import { ResumeBuilderMode } from "@/types";
import { colors, fonts, radius, spacing, gradients } from "@/styles/tokens";

interface Props {
  onGenerate: (params: {
    mode: ResumeBuilderMode;
    targetRole: string;
    text: string;
    file: File | null;
  }) => void;
  loading: boolean;
  error: string;
}

export default function ResumeBuilderForm({ onGenerate, loading, error }: Props) {
  const [mode, setMode] = useState<ResumeBuilderMode>("create");
  const [inputType, setInputType] = useState<"text" | "pdf">("text");
  const [targetRole, setTargetRole] = useState("");
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const placeholder =
    mode === "create"
      ? "Paste your rough notes: education, work history, projects, skills — doesn't need to be organized. E.g. 'B.Tech CSE 2026, built a food delivery app with React and Node, interned at XYZ doing backend work, know Python, JS, SQL...'"
      : "Paste your existing resume text here, or upload a PDF below.";

  function handleSubmit() {
    onGenerate({ mode, targetRole, text, file });
  }

  return (
    <main style={s.main}>
      <div style={s.badge} className="animate-fadeIn">
        <span style={s.badgeDot} />
        <span style={s.badgeText}>AI Resume Builder · Powered by LLaMA 3.3</span>
      </div>

      <h1 style={s.headline} className="animate-fadeInUp delay-100">
        Build a Resume That{" "}
        <span style={s.accentText}>Gets You Interviews</span>
      </h1>

      <p style={s.subheadline} className="animate-fadeInUp delay-200">
        Start from scratch or improve what you already have — ATS-optimized, every time.
      </p>

    
      <div style={s.modeRow} className="animate-fadeIn delay-300">
        <button
          style={{ ...s.modeBtn, ...(mode === "create" ? s.modeBtnActive : {}) }}
          onClick={() => setMode("create")}
        >
          ✦ Build from scratch
        </button>
        <button
          style={{ ...s.modeBtn, ...(mode === "improve" ? s.modeBtnActive : {}) }}
          onClick={() => setMode("improve")}
        >
          ⟳ Improve existing resume
        </button>
      </div>

      <div style={s.card} className="animate-fadeIn delay-300">
       
        <label style={s.label}>Target role (optional — helps tailor keywords)</label>
        <input
          style={s.input}
          placeholder="e.g. Frontend Developer, Data Analyst..."
          value={targetRole}
          onChange={(e) => setTargetRole(e.target.value)}
        />

       
        {mode === "improve" && (
          <div style={s.toggleRow}>
            <button
              style={{ ...s.toggleBtn, ...(inputType === "text" ? s.toggleBtnActive : {}) }}
              onClick={() => setInputType("text")}
            >
              Paste text
            </button>
            <button
              style={{ ...s.toggleBtn, ...(inputType === "pdf" ? s.toggleBtnActive : {}) }}
              onClick={() => setInputType("pdf")}
            >
              Upload PDF
            </button>
          </div>
        )}

        {mode === "improve" && inputType === "pdf" ? (
          <div style={s.dropzone} onClick={() => fileRef.current?.click()}>
            <input
              ref={fileRef}
              type="file"
              accept="application/pdf"
              style={{ display: "none" }}
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            {file ? `📄 ${file.name}` : "Click to upload your resume PDF"}
          </div>
        ) : (
          <textarea
            style={s.textarea}
            placeholder={placeholder}
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={8}
          />
        )}

        {error && <p style={s.error}>{error}</p>}

        <button
          style={{ ...s.submitBtn, opacity: loading ? 0.6 : 1 }}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Resume →"}
        </button>
      </div>
    </main>
  );
}

const s: Record<string, React.CSSProperties> = {
  main: { display: "flex", flexDirection: "column", alignItems: "center", padding: `${spacing.xxxl}px ${spacing.lg}px`, textAlign: "center" },
  badge: { display: "inline-flex", alignItems: "center", gap: spacing.sm, padding: "6px 14px", borderRadius: radius.xl, border: `1px solid ${colors.border}`, background: colors.accentBg, marginBottom: spacing.xl },
  badgeDot: { width: 6, height: 6, borderRadius: "50%", background: colors.accent },
  badgeText: { fontFamily: fonts.body, fontSize: 12, color: colors.textAccent, letterSpacing: 0.05 },
  headline: { fontFamily: fonts.display, fontSize: 44, fontWeight: 800, color: colors.textPrimary, margin: `0 0 ${spacing.md}px 0`, maxWidth: 700 },
  accentText: { background: gradients.accent, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  subheadline: { fontFamily: fonts.body, fontSize: 16, color: colors.textSub, marginBottom: spacing.xl, maxWidth: 560 },
  modeRow: { display: "flex", gap: spacing.md, marginBottom: spacing.xl },
  modeBtn: { padding: "10px 20px", borderRadius: radius.lg, border: `1px solid ${colors.border}`, background: "transparent", color: colors.textSub, fontFamily: fonts.body, fontSize: 14, cursor: "pointer" },
  modeBtnActive: { background: colors.accentBgStrong, color: colors.textAccent, borderColor: colors.accent },
  card: { width: "100%", maxWidth: 640, background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: radius.xl, padding: spacing.xl, textAlign: "left" },
  label: { display: "block", fontFamily: fonts.body, fontSize: 12, color: colors.textMuted, textTransform: "uppercase", letterSpacing: 0.05, marginBottom: spacing.sm },
  input: { width: "100%", padding: "10px 14px", borderRadius: radius.md, border: `1px solid ${colors.border}`, background: colors.bgDeep, color: colors.textPrimary, fontFamily: fonts.body, fontSize: 14, marginBottom: spacing.lg, boxSizing: "border-box" },
  toggleRow: { display: "flex", gap: spacing.sm, marginBottom: spacing.md },
  toggleBtn: { padding: "6px 14px", borderRadius: radius.sm, border: `1px solid ${colors.border}`, background: "transparent", color: colors.textSub, fontFamily: fonts.body, fontSize: 13, cursor: "pointer" },
  toggleBtnActive: { background: colors.accentBgStrong, color: colors.textAccent },
  textarea: { width: "100%", padding: "12px 14px", borderRadius: radius.md, border: `1px solid ${colors.border}`, background: colors.bgDeep, color: colors.textPrimary, fontFamily: fonts.body, fontSize: 14, marginBottom: spacing.lg, boxSizing: "border-box", resize: "vertical" },
  dropzone: { padding: spacing.xxl, borderRadius: radius.md, border: `1px dashed ${colors.border}`, background: colors.bgDeep, color: colors.textSub, textAlign: "center", cursor: "pointer", marginBottom: spacing.lg, fontFamily: fonts.body, fontSize: 14 },
  error: { color: colors.danger, fontFamily: fonts.body, fontSize: 13, marginBottom: spacing.md },
  submitBtn: { width: "100%", padding: "14px", borderRadius: radius.lg, border: "none", background: gradients.accent, color: colors.textDark, fontFamily: fonts.body, fontWeight: 700, fontSize: 15, cursor: "pointer" },
};