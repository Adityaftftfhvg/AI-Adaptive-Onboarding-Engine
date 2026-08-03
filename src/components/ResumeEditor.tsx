"use client";

import { useState } from "react";
import { ResumeData, ResumeExperience, ResumeEducation, ResumeProject, ResumeTemplate } from "@/types";
import { colors, fonts, radius, spacing, gradients } from "@/styles/tokens";
import { TemplatePreview } from "./ResumeBuilderForm";

interface Props {
  resume: ResumeData;
  onReset: () => void;
  initialTemplate?: ResumeTemplate;
}

const TEMPLATES: { id: ResumeTemplate; label: string }[] = [
  { id: "classic", label: "Classic" },
  { id: "modern", label: "Modern" },
  { id: "minimal", label: "Minimal" },
];

export default function ResumeEditor({ resume, onReset, initialTemplate }: Props) {
  const [data, setData] = useState<ResumeData>(resume);
  const [downloading, setDownloading] = useState(false);
  const [template, setTemplate] = useState<ResumeTemplate>(initialTemplate || "classic");

  function update<K extends keyof ResumeData>(key: K, value: ResumeData[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  function updateExperience(i: number, patch: Partial<ResumeExperience>) {
    const next = [...data.experience];
    next[i] = { ...next[i], ...patch };
    update("experience", next);
  }

  function updateEducation(i: number, patch: Partial<ResumeEducation>) {
    const next = [...data.education];
    next[i] = { ...next[i], ...patch };
    update("education", next);
  }

  function updateProject(i: number, patch: Partial<ResumeProject>) {
    const next = [...data.projects];
    next[i] = { ...next[i], ...patch };
    update("projects", next);
  }

  async function handleDownload() {
    setDownloading(true);
    const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
      import("jspdf"),
      import("html2canvas"),
    ]);

    const el = document.createElement("div");
    el.style.position = "fixed";
    el.style.left = "-9999px";
    el.style.top = "0";
    el.style.width = "800px";
    el.innerHTML = buildResumeHTML(data, template);
    document.body.appendChild(el);

    await new Promise((r) => setTimeout(r, 200));

    try {
      const canvas = await html2canvas(el, { backgroundColor: "#FFFFFF", scale: 2, useCORS: true, logging: false });
      const imgData = canvas.toDataURL("image/jpeg", 0.98);
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgHeight = (canvas.height * pageWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;
      pdf.addImage(imgData, "JPEG", 0, position, pageWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position -= pageHeight;
        pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, position, pageWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${data.fullName.replace(/\s+/g, "_") || "resume"}.pdf`);
    } finally {
      document.body.removeChild(el);
      setDownloading(false);
    }
  }

  return (
    <div style={s.wrap} className="animate-fadeIn">
      
      <div style={s.atsCard}>
        <div>
          <span style={s.atsLabel}>ATS Score</span>
          <div style={s.atsScoreRow}>
            <span style={{ ...s.atsScore, color: scoreColor(data.ats_score) }}>{data.ats_score}</span>
            <span style={s.atsMax}>/100</span>
          </div>
        </div>
        <ul style={s.atsNotes}>
          {data.ats_notes.map((n, i) => <li key={i} style={s.atsNoteItem}>{n}</li>)}
        </ul>
      </div>

      {/* Editable form */}
      <div style={s.card}>
        <SectionLabel>Contact</SectionLabel>
        <div style={s.grid2}>
          <Field label="Full Name" value={data.fullName} onChange={(v) => update("fullName", v)} />
          <Field label="Email" value={data.email} onChange={(v) => update("email", v)} />
          <Field label="Phone" value={data.phone} onChange={(v) => update("phone", v)} />
          <Field label="Location" value={data.location} onChange={(v) => update("location", v)} />
          <Field label="LinkedIn" value={data.linkedin || ""} onChange={(v) => update("linkedin", v)} />
          <Field label="GitHub" value={data.github || ""} onChange={(v) => update("github", v)} />
        </div>
      </div>

      <div style={s.card}>
        <SectionLabel>Summary</SectionLabel>
        <textarea style={s.textarea} rows={3} value={data.summary} onChange={(e) => update("summary", e.target.value)} />
      </div>

      <div style={s.card}>
        <SectionLabel>Experience</SectionLabel>
        {data.experience.map((exp, i) => (
          <div key={i} style={s.itemBlock}>
            <div style={s.grid2}>
              <Field label="Role" value={exp.role} onChange={(v) => updateExperience(i, { role: v })} />
              <Field label="Company" value={exp.company} onChange={(v) => updateExperience(i, { company: v })} />
            </div>
            <Field label="Duration" value={exp.duration} onChange={(v) => updateExperience(i, { duration: v })} />
            <label style={s.label}>Bullets (one per line)</label>
            <textarea
              style={s.textarea}
              rows={4}
              value={exp.bullets.join("\n")}
              onChange={(e) => updateExperience(i, { bullets: e.target.value.split("\n") })}
            />
          </div>
        ))}
      </div>

      <div style={s.card}>
        <SectionLabel>Projects</SectionLabel>
        {data.projects.map((proj, i) => (
          <div key={i} style={s.itemBlock}>
            <Field label="Name" value={proj.name} onChange={(v) => updateProject(i, { name: v })} />
            <Field label="Tech (comma-separated)" value={proj.tech.join(", ")} onChange={(v) => updateProject(i, { tech: v.split(",").map((t) => t.trim()) })} />
            <label style={s.label}>Bullets (one per line)</label>
            <textarea
              style={s.textarea}
              rows={3}
              value={proj.bullets.join("\n")}
              onChange={(e) => updateProject(i, { bullets: e.target.value.split("\n") })}
            />
          </div>
        ))}
      </div>

      <div style={s.card}>
        <SectionLabel>Education</SectionLabel>
        {data.education.map((edu, i) => (
          <div key={i} style={s.itemBlock}>
            <div style={s.grid2}>
              <Field label="Degree" value={edu.degree} onChange={(v) => updateEducation(i, { degree: v })} />
              <Field label="Institution" value={edu.institution} onChange={(v) => updateEducation(i, { institution: v })} />
              <Field label="Year" value={edu.year} onChange={(v) => updateEducation(i, { year: v })} />
            </div>
          </div>
        ))}
      </div>

      <div style={s.card}>
        <SectionLabel>Skills (comma-separated)</SectionLabel>
        <textarea
          style={s.textarea}
          rows={2}
          value={data.skills.join(", ")}
          onChange={(e) => update("skills", e.target.value.split(",").map((sk) => sk.trim()).filter(Boolean))}
        />
      </div>

      <div style={s.card}>
        <SectionLabel>Template</SectionLabel>
        <div style={s.templateRow}>
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              type="button"
              className="btn-lift"
              style={{ ...s.templateBtn, ...(template === t.id ? s.templateBtnActive : {}) }}
              onClick={() => setTemplate(t.id)}
            >
              <TemplatePreview id={t.id} active={template === t.id} />
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: spacing.md, marginTop: spacing.xl }}>
        <button className="btn-lift" style={s.backBtn} onClick={onReset}>← Start Over</button>
        <button className="btn-lift" style={{ ...s.downloadBtn, opacity: downloading ? 0.6 : 1 }} onClick={handleDownload} disabled={downloading}>
          {downloading ? "Preparing PDF..." : "↓ Download PDF"}
        </button>
      </div>
    </div>
  );
}

function scoreColor(score: number): string {
  if (score >= 80) return colors.accent;
  if (score >= 50) return colors.warning;
  return colors.danger;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p style={s.sectionLabel}>{children}</p>;
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ marginBottom: spacing.md }}>
      <label style={s.label}>{label}</label>
      <input style={s.input} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}


function buildResumeHTML(data: ResumeData, template: ResumeTemplate = "classic"): string {
  if (template === "modern") return buildModernHTML(data);
  if (template === "minimal") return buildMinimalHTML(data);
  return buildClassicHTML(data);
}

function buildClassicHTML(data: ResumeData): string {
  return `
    <div style="font-family: Arial, sans-serif; color: #1a1a1a; padding: 40px; max-width: 800px; background: #fff;">
      <h1 style="margin: 0 0 4px 0; font-size: 26px;">${data.fullName}</h1>
      <p style="margin: 0 0 16px 0; font-size: 12px; color: #444;">
        ${[data.email, data.phone, data.location, data.linkedin, data.github].filter(Boolean).join(" · ")}
      </p>

      ${data.summary ? `<p style="font-size: 13px; line-height: 1.5; margin-bottom: 18px;">${data.summary}</p>` : ""}

      ${data.experience.length ? `
        <h2 style="font-size: 14px; text-transform: uppercase; border-bottom: 1px solid #ccc; padding-bottom: 4px; margin-bottom: 10px;">Experience</h2>
        ${data.experience.map((e) => `
          <div style="margin-bottom: 14px;">
            <div style="display: flex; justify-content: space-between; font-size: 13px; font-weight: bold;">
              <span>${e.role} — ${e.company}</span><span>${e.duration}</span>
            </div>
            <ul style="margin: 4px 0 0 18px; padding: 0; font-size: 12px; line-height: 1.5;">
              ${e.bullets.filter(Boolean).map((b) => `<li>${b}</li>`).join("")}
            </ul>
          </div>
        `).join("")}
      ` : ""}

      ${data.projects.length ? `
        <h2 style="font-size: 14px; text-transform: uppercase; border-bottom: 1px solid #ccc; padding-bottom: 4px; margin-bottom: 10px;">Projects</h2>
        ${data.projects.map((p) => `
          <div style="margin-bottom: 14px;">
            <div style="font-size: 13px; font-weight: bold;">${p.name} ${p.tech.length ? `<span style="font-weight: normal; color: #555;">(${p.tech.join(", ")})</span>` : ""}</div>
            <ul style="margin: 4px 0 0 18px; padding: 0; font-size: 12px; line-height: 1.5;">
              ${p.bullets.filter(Boolean).map((b) => `<li>${b}</li>`).join("")}
            </ul>
          </div>
        `).join("")}
      ` : ""}

      ${data.education.length ? `
        <h2 style="font-size: 14px; text-transform: uppercase; border-bottom: 1px solid #ccc; padding-bottom: 4px; margin-bottom: 10px;">Education</h2>
        ${data.education.map((e) => `
          <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 6px;">
            <span>${e.degree}, ${e.institution}</span><span>${e.year}</span>
          </div>
        `).join("")}
      ` : ""}

      ${data.skills.length ? `
        <h2 style="font-size: 14px; text-transform: uppercase; border-bottom: 1px solid #ccc; padding-bottom: 4px; margin-bottom: 10px;">Skills</h2>
        <p style="font-size: 12px;">${data.skills.join(" · ")}</p>
      ` : ""}
    </div>
  `;
}

function buildModernHTML(data: ResumeData): string {
  const accent = "#0B7A5B";
  return `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; color: #1f2937; padding: 40px; max-width: 800px; background: #fff;">
      <div style="border-left: 5px solid ${accent}; padding-left: 16px; margin-bottom: 20px;">
        <h1 style="margin: 0 0 4px 0; font-size: 28px; color: #111;">${data.fullName}</h1>
        <p style="margin: 0; font-size: 12px; color: #555;">
          ${[data.email, data.phone, data.location, data.linkedin, data.github].filter(Boolean).join("  ·  ")}
        </p>
      </div>

      ${data.summary ? `<p style="font-size: 13px; line-height: 1.6; margin-bottom: 20px; color: #333;">${data.summary}</p>` : ""}

      ${data.experience.length ? `
        <h2 style="font-size: 13px; text-transform: uppercase; letter-spacing: 1px; color: ${accent}; margin-bottom: 10px;">Experience</h2>
        ${data.experience.map((e) => `
          <div style="margin-bottom: 16px;">
            <div style="display: flex; justify-content: space-between; font-size: 13px; font-weight: 700; color: #111;">
              <span>${e.role} <span style="font-weight: 400; color: #555;">— ${e.company}</span></span><span style="color: #777;">${e.duration}</span>
            </div>
            <ul style="margin: 6px 0 0 18px; padding: 0; font-size: 12px; line-height: 1.6; color: #333;">
              ${e.bullets.filter(Boolean).map((b) => `<li>${b}</li>`).join("")}
            </ul>
          </div>
        `).join("")}
      ` : ""}

      ${data.projects.length ? `
        <h2 style="font-size: 13px; text-transform: uppercase; letter-spacing: 1px; color: ${accent}; margin-bottom: 10px;">Projects</h2>
        ${data.projects.map((p) => `
          <div style="margin-bottom: 16px;">
            <div style="font-size: 13px; font-weight: 700; color: #111;">${p.name} ${p.tech.length ? `<span style="font-weight: 400; color: ${accent};">· ${p.tech.join(", ")}</span>` : ""}</div>
            <ul style="margin: 6px 0 0 18px; padding: 0; font-size: 12px; line-height: 1.6; color: #333;">
              ${p.bullets.filter(Boolean).map((b) => `<li>${b}</li>`).join("")}
            </ul>
          </div>
        `).join("")}
      ` : ""}

      ${data.education.length ? `
        <h2 style="font-size: 13px; text-transform: uppercase; letter-spacing: 1px; color: ${accent}; margin-bottom: 10px;">Education</h2>
        ${data.education.map((e) => `
          <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 8px; color: #333;">
            <span><strong>${e.degree}</strong>, ${e.institution}</span><span style="color: #777;">${e.year}</span>
          </div>
        `).join("")}
      ` : ""}

      ${data.skills.length ? `
        <h2 style="font-size: 13px; text-transform: uppercase; letter-spacing: 1px; color: ${accent}; margin-bottom: 10px;">Skills</h2>
        <p style="font-size: 12px;">
          ${data.skills.map((sk) => `<span style="display: inline-block; background: #EEF7F3; color: ${accent}; padding: 3px 10px; border-radius: 12px; margin: 0 6px 6px 0;">${sk}</span>`).join("")}
        </p>
      ` : ""}
    </div>
  `;
}

function buildMinimalHTML(data: ResumeData): string {
  return `
    <div style="font-family: Georgia, 'Times New Roman', serif; color: #222; padding: 48px; max-width: 800px; background: #fff;">
      <h1 style="margin: 0 0 6px 0; font-size: 24px; font-weight: 400; letter-spacing: 1px;">${data.fullName}</h1>
      <p style="margin: 0 0 24px 0; font-size: 11px; color: #666; letter-spacing: 0.5px;">
        ${[data.email, data.phone, data.location, data.linkedin, data.github].filter(Boolean).join("   |   ")}
      </p>

      ${data.summary ? `<p style="font-size: 12.5px; line-height: 1.7; margin-bottom: 24px; color: #333;">${data.summary}</p>` : ""}

      ${data.experience.length ? `
        <h2 style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #888; margin-bottom: 12px; font-weight: 400;">Experience</h2>
        ${data.experience.map((e) => `
          <div style="margin-bottom: 18px;">
            <div style="font-size: 13px; margin-bottom: 2px;">
              <span style="font-weight: 700;">${e.role}</span>, ${e.company} <span style="color: #999; font-size: 11px;">— ${e.duration}</span>
            </div>
            <ul style="margin: 6px 0 0 16px; padding: 0; font-size: 12px; line-height: 1.7; color: #444;">
              ${e.bullets.filter(Boolean).map((b) => `<li>${b}</li>`).join("")}
            </ul>
          </div>
        `).join("")}
      ` : ""}

      ${data.projects.length ? `
        <h2 style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #888; margin-bottom: 12px; font-weight: 400;">Projects</h2>
        ${data.projects.map((p) => `
          <div style="margin-bottom: 18px;">
            <div style="font-size: 13px; font-weight: 700;">${p.name} ${p.tech.length ? `<span style="font-weight: 400; color: #999; font-size: 11px;">(${p.tech.join(", ")})</span>` : ""}</div>
            <ul style="margin: 6px 0 0 16px; padding: 0; font-size: 12px; line-height: 1.7; color: #444;">
              ${p.bullets.filter(Boolean).map((b) => `<li>${b}</li>`).join("")}
            </ul>
          </div>
        `).join("")}
      ` : ""}

      ${data.education.length ? `
        <h2 style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #888; margin-bottom: 12px; font-weight: 400;">Education</h2>
        ${data.education.map((e) => `
          <div style="font-size: 13px; margin-bottom: 8px; color: #333;">
            ${e.degree}, ${e.institution} <span style="color: #999; font-size: 11px;">— ${e.year}</span>
          </div>
        `).join("")}
      ` : ""}

      ${data.skills.length ? `
        <h2 style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #888; margin-bottom: 12px; font-weight: 400;">Skills</h2>
        <p style="font-size: 12px; color: #444;">${data.skills.join("  ·  ")}</p>
      ` : ""}
    </div>
  `;
}

const s: Record<string, React.CSSProperties> = {
  wrap: { maxWidth: 720, margin: "0 auto", padding: "40px 24px 80px" },
  atsCard: { background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: radius.xl, padding: spacing.xl, marginBottom: spacing.xl },
  atsLabel: { fontFamily: fonts.body, fontSize: 12, color: colors.textMuted, textTransform: "uppercase", letterSpacing: 0.05 },
  atsScoreRow: { display: "flex", alignItems: "baseline", gap: 6, marginBottom: spacing.md },
  atsScore: { fontFamily: fonts.display, fontSize: 40, fontWeight: 800 },
  atsMax: { fontFamily: fonts.body, fontSize: 16, color: colors.textMuted },
  atsNotes: { margin: 0, paddingLeft: 18, fontFamily: fonts.body, fontSize: 13, color: colors.textSub, lineHeight: 1.6 },
  atsNoteItem: { marginBottom: 4 },
  card: { background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: radius.xl, padding: spacing.xl, marginBottom: spacing.lg },
  sectionLabel: { fontFamily: fonts.display, fontSize: 13, color: colors.textAccent, textTransform: "uppercase", letterSpacing: 0.08, marginTop: 0, marginBottom: spacing.md, fontWeight: 700 },
  itemBlock: { marginBottom: spacing.lg, paddingBottom: spacing.lg, borderBottom: `1px solid ${colors.borderSubtle}` },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: spacing.md },
  label: { display: "block", fontFamily: fonts.body, fontSize: 11, color: colors.textMuted, textTransform: "uppercase", letterSpacing: 0.05, marginBottom: 4 },
  input: { width: "100%", padding: "8px 12px", borderRadius: radius.sm, border: `1px solid ${colors.border}`, background: colors.bgDeep, color: colors.textPrimary, fontFamily: fonts.body, fontSize: 13, boxSizing: "border-box" },
  textarea: { width: "100%", padding: "10px 12px", borderRadius: radius.sm, border: `1px solid ${colors.border}`, background: colors.bgDeep, color: colors.textPrimary, fontFamily: fonts.body, fontSize: 13, boxSizing: "border-box", resize: "vertical" },
  templateRow: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: spacing.md },
  templateBtn: { display: "flex", flexDirection: "column", alignItems: "stretch", gap: 6, padding: "10px 12px", borderRadius: radius.md, borderWidth: 1, borderStyle: "solid", borderColor: colors.border, background: "transparent", color: colors.textSub, fontFamily: fonts.body, fontSize: 13, fontWeight: 600, cursor: "pointer" },
  templateBtnActive: { background: colors.accentBgStrong, color: colors.textAccent, borderColor: colors.accent },
  backBtn: { padding: "10px 24px", background: "transparent", border: `1px solid ${colors.border}`, borderRadius: radius.md, color: colors.textMuted, fontFamily: fonts.body, fontSize: 14, cursor: "pointer" },
  downloadBtn: { padding: "10px 24px", background: gradients.accent, border: "none", borderRadius: radius.md, color: colors.textDark, fontFamily: fonts.body, fontWeight: 700, fontSize: 14, cursor: "pointer" },
};