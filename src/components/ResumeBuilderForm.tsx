"use client";

import { useState, useRef } from "react";
import { ResumeBuilderMode, ResumeTemplate } from "@/types";
import { colors, fonts, radius, spacing, gradients } from "@/styles/tokens";

interface Props {
  onGenerate: (params: {
    mode: ResumeBuilderMode;
    targetRole: string;
    text: string;
    file: File | null;
    template: ResumeTemplate;
  }) => void;
  loading: boolean;
  error: string;
}

interface EduRow { degree: string; institution: string; year: string; }
interface ExpRow { role: string; company: string; duration: string; description: string; }
interface ProjRow { name: string; tech: string; description: string; }

const emptyEdu: EduRow = { degree: "", institution: "", year: "" };
const emptyExp: ExpRow = { role: "", company: "", duration: "", description: "" };
const emptyProj: ProjRow = { name: "", tech: "", description: "" };

const TEMPLATES: { id: ResumeTemplate; label: string; blurb: string }[] = [
  { id: "classic", label: "Classic", blurb: "Clean, black & white, most ATS-safe" },
  { id: "modern", label: "Modern", blurb: "Accent color headers, sleeker look" },
  { id: "minimal", label: "Minimal", blurb: "Extra whitespace, understated" },
];

export default function ResumeBuilderForm({ onGenerate, loading, error }: Props) {
  const [mode, setMode] = useState<ResumeBuilderMode>("create");
  const [template, setTemplate] = useState<ResumeTemplate>("classic");
  const [inputType, setInputType] = useState<"text" | "pdf">("text");
  const [targetRole, setTargetRole] = useState("");

 
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [github, setGithub] = useState("");
  const [skills, setSkills] = useState("");
  const [education, setEducation] = useState<EduRow[]>([{ ...emptyEdu }]);
  const [experience, setExperience] = useState<ExpRow[]>([{ ...emptyExp }]);
  const [projects, setProjects] = useState<ProjRow[]>([{ ...emptyProj }]);

  function updateRow<T>(rows: T[], i: number, patch: Partial<T>, setRows: (r: T[]) => void) {
    const next = [...rows];
    next[i] = { ...next[i], ...patch };
    setRows(next);
  }

  function serializeCreateForm(): string {
    const lines: string[] = [];
    lines.push(`Name: ${fullName}`);
    if (email) lines.push(`Email: ${email}`);
    if (phone) lines.push(`Phone: ${phone}`);
    if (location) lines.push(`Location: ${location}`);
    if (linkedin) lines.push(`LinkedIn: ${linkedin}`);
    if (github) lines.push(`GitHub: ${github}`);

    const edu = education.filter((e) => e.degree || e.institution);
    if (edu.length) {
      lines.push("\nEducation:");
      edu.forEach((e) => lines.push(`- ${e.degree}, ${e.institution} (${e.year})`));
    }

    const exp = experience.filter((e) => e.role || e.company || e.description);
    if (exp.length) {
      lines.push("\nExperience:");
      exp.forEach((e) => {
        lines.push(`- ${e.role} at ${e.company} (${e.duration})`);
        if (e.description) lines.push(`  ${e.description}`);
      });
    }

    const proj = projects.filter((p) => p.name || p.description);
    if (proj.length) {
      lines.push("\nProjects:");
      proj.forEach((p) => {
        lines.push(`- ${p.name}${p.tech ? ` (Tech: ${p.tech})` : ""}`);
        if (p.description) lines.push(`  ${p.description}`);
      });
    }

    if (skills.trim()) lines.push(`\nSkills: ${skills}`);

    return lines.join("\n");
  }

  function handleSubmit() {
    if (mode === "create") {
      onGenerate({ mode, targetRole, text: serializeCreateForm(), file: null, template });
    } else {
      onGenerate({ mode, targetRole, text, file, template });
    }
  }

  return (
    <main style={s.main} className="px-4 sm:px-6">
      <div style={s.badge} className="animate-fadeIn">
        <span style={s.badgeDot} />
        <span style={s.badgeText}>AI Resume Builder · Powered by LLaMA 3.3</span>
      </div>

      <h1 style={s.headline} className="animate-fadeInUp delay-100 text-[32px] sm:text-[44px]">
        Build a Resume That{" "}
        <span style={s.accentText}>Gets You Interviews</span>
      </h1>

      <p style={s.subheadline} className="animate-fadeInUp delay-200">
        Start from scratch or improve what you already have — ATS-optimized, every time.
      </p>

      <div style={s.modeRow} className="animate-fadeIn delay-300 flex-wrap justify-center">
        <button
          className="btn-lift"
          style={{ ...s.modeBtn, ...(mode === "create" ? s.modeBtnActive : {}) }}
          onClick={() => setMode("create")}
        >
          ✦ Build from scratch
        </button>
        <button
          className="btn-lift"
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

        {mode === "create" ? (
          <>
            <SectionLabel step={1}>Contact</SectionLabel>
            <div style={s.grid2} className="grid-cols-1 sm:grid-cols-2">
              <Field label="Full Name" value={fullName} onChange={setFullName} />
              <Field label="Email" value={email} onChange={setEmail} />
              <Field label="Phone" value={phone} onChange={setPhone} />
              <Field label="Location" value={location} onChange={setLocation} />
              <Field label="LinkedIn (optional)" value={linkedin} onChange={setLinkedin} />
              <Field label="GitHub (optional)" value={github} onChange={setGithub} />
            </div>

            <SectionLabel step={2}>Education</SectionLabel>
            {education.map((e, i) => (
              <div key={i} style={s.itemBlock}>
                <div style={s.grid3} className="grid-cols-1 sm:grid-cols-3">
                  <Field label="Degree" value={e.degree} onChange={(v) => updateRow(education, i, { degree: v }, setEducation)} />
                  <Field label="Institution" value={e.institution} onChange={(v) => updateRow(education, i, { institution: v }, setEducation)} />
                  <Field label="Year" value={e.year} onChange={(v) => updateRow(education, i, { year: v }, setEducation)} />
                </div>
              </div>
            ))}
            <AddRowBtn label="+ Add education" onClick={() => setEducation([...education, { ...emptyEdu }])} />

            <SectionLabel step={3}>Experience (optional)</SectionLabel>
            {experience.map((e, i) => (
              <div key={i} style={s.itemBlock}>
                <div style={s.grid2} className="grid-cols-1 sm:grid-cols-2">
                  <Field label="Role" value={e.role} onChange={(v) => updateRow(experience, i, { role: v }, setExperience)} />
                  <Field label="Company" value={e.company} onChange={(v) => updateRow(experience, i, { company: v }, setExperience)} />
                </div>
                <Field label="Duration (e.g. Jun 2024 – Aug 2024)" value={e.duration} onChange={(v) => updateRow(experience, i, { duration: v }, setExperience)} />
                <label style={s.label}>What did you do?</label>
                <textarea
                  style={s.textareaSmall}
                  rows={2}
                  value={e.description}
                  onChange={(ev) => updateRow(experience, i, { description: ev.target.value }, setExperience)}
                />
              </div>
            ))}
            <AddRowBtn label="+ Add experience" onClick={() => setExperience([...experience, { ...emptyExp }])} />

            <SectionLabel step={4}>Projects (optional)</SectionLabel>
            {projects.map((p, i) => (
              <div key={i} style={s.itemBlock}>
                <div style={s.grid2} className="grid-cols-1 sm:grid-cols-2">
                  <Field label="Project name" value={p.name} onChange={(v) => updateRow(projects, i, { name: v }, setProjects)} />
                  <Field label="Tech used (comma-separated)" value={p.tech} onChange={(v) => updateRow(projects, i, { tech: v }, setProjects)} />
                </div>
                <label style={s.label}>Description</label>
                <textarea
                  style={s.textareaSmall}
                  rows={2}
                  value={p.description}
                  onChange={(ev) => updateRow(projects, i, { description: ev.target.value }, setProjects)}
                />
              </div>
            ))}
            <AddRowBtn label="+ Add project" onClick={() => setProjects([...projects, { ...emptyProj }])} />

            <SectionLabel step={5}>Skills</SectionLabel>
            <input
              style={s.input}
              placeholder="e.g. Python, React, SQL, Communication"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
            />
          </>
        ) : (
          <>
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

            {inputType === "pdf" ? (
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
                placeholder="Paste your existing resume text here, or upload a PDF above."
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={8}
              />
            )}
          </>
        )}

        <SectionLabel step={6}>Choose a template</SectionLabel>
        <div style={s.templateRow} className="grid-cols-1 sm:grid-cols-3">
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              className="btn-lift"
              style={{ ...s.templateCard, ...(template === t.id ? s.templateCardActive : {}) }}
              onClick={() => setTemplate(t.id)}
              type="button"
            >
              <TemplatePreview id={t.id} active={template === t.id} />
              <span style={s.templateLabel}>{t.label}</span>
              <span style={s.templateBlurb}>{t.blurb}</span>
            </button>
          ))}
        </div>

        {error && <p style={s.error}>{error}</p>}

        <button
          className="btn-lift"
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

function SectionLabel({ step, children }: { step?: number; children: React.ReactNode }) {
  return (
    <p style={s.sectionLabel}>
      {step != null && (
        <span className="step-tag" style={s.stepTag}>{String(step).padStart(2, "0")}</span>
      )}
      {children}
    </p>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ marginBottom: spacing.md }}>
      <label style={s.label}>{label}</label>
      <input style={s.input} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

export function TemplatePreview({ id, active }: { id: ResumeTemplate; active: boolean }) {
  const lineColor = active ? "rgba(221, 139, 46,0.55)" : "rgba(148,163,184,0.35)";
  const strongColor = active ? colors.accent : "rgba(148,163,184,0.6)";
  const line = (w: string, h = 3) => (
    <span style={{ display: "block", width: w, height: h, borderRadius: 2, background: lineColor, marginBottom: 3 }} />
  );
  return (
    <div style={s.previewBox}>
      {id === "classic" && (
        <>
          <span style={{ display: "block", width: "55%", height: 5, borderRadius: 2, background: strongColor, marginBottom: 5 }} />
          {line("80%")}{line("40%", 2)}
          <div style={{ height: 6 }} />
          {line("30%", 2)}{line("70%")}{line("60%")}
        </>
      )}
      {id === "modern" && (
        <div style={{ display: "flex", gap: 4, width: "100%" }}>
          <span style={{ width: 3, alignSelf: "stretch", background: strongColor, borderRadius: 2 }} />
          <div style={{ flex: 1 }}>
            <span style={{ display: "block", width: "60%", height: 5, borderRadius: 2, background: strongColor, marginBottom: 5 }} />
            {line("75%")}
            <div style={{ height: 5 }} />
            <span style={{ display: "inline-block", width: 16, height: 6, borderRadius: 8, background: lineColor, marginRight: 3 }} />
            <span style={{ display: "inline-block", width: 22, height: 6, borderRadius: 8, background: lineColor }} />
          </div>
        </div>
      )}
      {id === "minimal" && (
        <>
          <span style={{ display: "block", width: "40%", height: 4, borderRadius: 1, background: strongColor, margin: "0 auto 8px" }} />
          <span style={{ display: "block", width: "70%", height: 2, borderRadius: 1, background: lineColor, margin: "0 auto 3px" }} />
          <span style={{ display: "block", width: "50%", height: 2, borderRadius: 1, background: lineColor, margin: "0 auto" }} />
        </>
      )}
    </div>
  );
}

function AddRowBtn({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button type="button" className="btn-lift" style={s.addRowBtn} onClick={onClick}>
      {label}
    </button>
  );
}

const s: Record<string, React.CSSProperties> = {
  main: { display: "flex", flexDirection: "column", alignItems: "center", padding: `${spacing.xxxl}px ${spacing.lg}px`, textAlign: "center" },
  badge: { display: "inline-flex", alignItems: "center", gap: spacing.sm, padding: "6px 14px", borderRadius: radius.xl, border: `1px solid ${colors.border}`, background: colors.accentBg, marginBottom: spacing.xl },
  badgeDot: { width: 6, height: 6, borderRadius: "50%", background: colors.accent },
  badgeText: { fontFamily: fonts.body, fontSize: 12, color: colors.textAccent, letterSpacing: 0.05 },
  headline: { fontFamily: fonts.display, fontWeight: 800, color: colors.textPrimary, margin: `0 0 ${spacing.md}px 0`, maxWidth: 700 },
  accentText: { background: gradients.accent, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  subheadline: { fontFamily: fonts.body, fontSize: 16, color: colors.textSub, marginBottom: spacing.xl, maxWidth: 560 },
  modeRow: { display: "flex", gap: spacing.md, marginBottom: spacing.xl },
  modeBtn: { padding: "10px 20px", borderRadius: radius.lg, borderWidth: 1, borderStyle: "solid", borderColor: colors.border, background: "transparent", color: colors.textSub, fontFamily: fonts.body, fontSize: 14, cursor: "pointer" },
  modeBtnActive: { background: colors.accentBgStrong, color: colors.textAccent, borderColor: colors.accent },
  card: { width: "100%", maxWidth: 640, background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: radius.xl, padding: spacing.xl, textAlign: "left" },
  label: { display: "block", fontFamily: fonts.body, fontSize: 12, color: colors.textMuted, textTransform: "uppercase", letterSpacing: 0.05, marginBottom: spacing.sm },
  input: { width: "100%", padding: "10px 14px", borderRadius: radius.md, border: `1px solid ${colors.border}`, background: colors.bgDeep, color: colors.textPrimary, fontFamily: fonts.body, fontSize: 14, marginBottom: spacing.lg, boxSizing: "border-box" },
  toggleRow: { display: "flex", gap: spacing.sm, marginBottom: spacing.md },
  toggleBtn: { padding: "6px 14px", borderRadius: radius.sm, borderWidth: 1, borderStyle: "solid", borderColor: colors.border, background: "transparent", color: colors.textSub, fontFamily: fonts.body, fontSize: 13, cursor: "pointer" },
  toggleBtnActive: { background: colors.accentBgStrong, color: colors.textAccent },
  textarea: { width: "100%", padding: "12px 14px", borderRadius: radius.md, border: `1px solid ${colors.border}`, background: colors.bgDeep, color: colors.textPrimary, fontFamily: fonts.body, fontSize: 14, marginBottom: spacing.lg, boxSizing: "border-box", resize: "vertical" },
  textareaSmall: { width: "100%", padding: "10px 12px", borderRadius: radius.md, border: `1px solid ${colors.border}`, background: colors.bgDeep, color: colors.textPrimary, fontFamily: fonts.body, fontSize: 13, marginBottom: spacing.md, boxSizing: "border-box", resize: "vertical" },
  dropzone: { padding: spacing.xxl, borderRadius: radius.md, border: `1px dashed ${colors.border}`, background: colors.bgDeep, color: colors.textSub, textAlign: "center", cursor: "pointer", marginBottom: spacing.lg, fontFamily: fonts.body, fontSize: 14 },
  error: { color: colors.danger, fontFamily: fonts.body, fontSize: 13, marginBottom: spacing.md },
  submitBtn: { width: "100%", padding: "14px", borderRadius: radius.lg, border: "none", background: gradients.accent, color: colors.textDark, fontFamily: fonts.body, fontWeight: 700, fontSize: 15, cursor: "pointer" },
  sectionLabel: { display: "flex", alignItems: "center", gap: 8, fontFamily: fonts.display, fontSize: 13, color: colors.textAccent, textTransform: "uppercase", letterSpacing: 0.08, marginTop: spacing.lg, marginBottom: spacing.md, fontWeight: 700 },
  stepTag: { fontFamily: fonts.mono, fontSize: 11, color: colors.textMuted, background: colors.bgDeep, border: `1px solid ${colors.borderSubtle}`, borderRadius: 4, padding: "2px 6px" },
  grid2: { display: "grid", gap: spacing.md },
  grid3: { display: "grid", gap: spacing.md },
  itemBlock: { marginBottom: spacing.md, paddingBottom: spacing.md, borderBottom: `1px solid ${colors.borderSubtle}` },
  addRowBtn: { background: "transparent", border: "none", color: colors.textAccent, fontFamily: fonts.body, fontSize: 13, cursor: "pointer", padding: "4px 0", marginBottom: spacing.lg, textAlign: "left" },
  templateRow: { display: "grid", gap: spacing.md, marginBottom: spacing.lg },
  templateCard: { display: "flex", flexDirection: "column", alignItems: "stretch", gap: 4, padding: "12px 14px", borderRadius: radius.md, borderWidth: 1, borderStyle: "solid", borderColor: colors.border, background: "transparent", cursor: "pointer", textAlign: "left" },
  templateCardActive: { background: colors.accentBgStrong, borderColor: colors.accent },
  previewBox: { background: colors.bgDeep, border: `1px solid ${colors.borderSubtle}`, borderRadius: 4, padding: "10px 12px", marginBottom: 8, minHeight: 46, display: "flex", flexDirection: "column", justifyContent: "center" },
  templateLabel: { fontFamily: fonts.body, fontWeight: 700, fontSize: 13, color: colors.textPrimary },
  templateBlurb: { fontFamily: fonts.body, fontSize: 11, color: colors.textMuted },
};
