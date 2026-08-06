"use client";

import { useState, useRef } from "react";
import { InputMode } from "@/types";
import { colors, fonts, radius, spacing, gradients } from "@/styles/tokens";
import { LoadingStep } from "@/hooks/useAnalyze";

interface Props {
  onAnalyze: (params: {
    resumeMode: InputMode;
    jdMode: InputMode;
    resumeText: string;
    jdText: string;
    resumeFile: File | null;
    jdFile: File | null;
  }) => void;
  loading: boolean;
  loadingStep: LoadingStep;
  error: string;
}

export default function UploadForm({ onAnalyze, loading, loadingStep, error }: Props) {
  const [resumeMode, setResumeMode] = useState<InputMode>("text");
  const [jdMode, setJdMode] = useState<InputMode>("text");
  const [resumeText, setResumeText] = useState("");
  const [jdText, setJdText] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jdFile, setJdFile] = useState<File | null>(null);
  const [btnHover, setBtnHover] = useState(false);

  function handleSubmit() {
    onAnalyze({ resumeMode, jdMode, resumeText, jdText, resumeFile, jdFile });
  }

  const STEPS: Partial<Record<LoadingStep, string>> = {
    parsing: "✓ Parsing documents...",
    extracting: "✓ Extracting skills...",
    searching: "⟳ Searching catalog...",
    generating: "⟳ Generating pathway...",
  };

  function scrollToStart() {
    const resumeFilled = (resumeMode === "pdf" && resumeFile) || resumeText.trim();
    const jdFilled = (jdMode === "pdf" && jdFile) || jdText.trim();

    if (resumeFilled && jdFilled) {
      handleSubmit();
    } else {
      document.getElementById("start")?.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <main style={s.wrap}>
      <section style={s.hero}>
        <div style={s.heroLeft} className="animate-fadeInUp">
          <div style={s.badge} className="animate-fadeInUp delay-100">
            <span style={s.badgeDot} />
            <span style={s.badgeText}>Powered by LLaMA 3.3 · Semantic Vector Search</span>
          </div>

          <h1 style={s.headline} className="animate-fadeInUp delay-200">
            The Smartest Way to
            <br />
            Close Your <span style={s.accentText}>Skill Gap</span>
          </h1>

          <p style={s.subheadline} className="animate-fadeInUp delay-300">
            Upload your resume and a job description to get an instant, AI-grounded
            training roadmap — skip what you already know, learn exactly what matters.
          </p>

          <div style={s.ctaRow} className="animate-fadeInUp delay-400">
            <button style={s.ctaPrimary} onClick={scrollToStart} className="btn-ripple">
              Build My Pathway Now
            </button>
            <a href="#start" style={s.ctaSecondary}>
              See How It Works
            </a>
          </div>

          <div style={s.trustRow} className="animate-fadeInUp delay-500">
            <div style={s.avatarStack}>
              {["🧑‍💻", "👩‍🎓", "🧑‍🔬"].map((emoji, i) => (
                <span key={i} style={{ ...s.avatar, marginLeft: i === 0 ? 0 : -10, zIndex: 3 - i }}>
                  {emoji}
                </span>
              ))}
            </div>
            <span style={s.trustText}>
              Trusted by <strong>10,000+</strong> learners
            </span>
            <span style={s.trustDivider} />
            <span style={s.ratingRow}>
              <span style={s.stars}>★★★★★</span>
              <span style={s.trustText}>
                <strong>4.8</strong> Rating
              </span>
            </span>
          </div>
        </div>

        <div style={s.heroRight} className="animate-fadeInUp delay-200">
          <div style={s.browserMock} className="animate-floatSlow">
            <div style={s.browserBar}>
              <span style={{ ...s.browserDot, background: "#FF5F57" }} />
              <span style={{ ...s.browserDot, background: "#FEBC2E" }} />
              <span style={{ ...s.browserDot, background: "#28C840" }} />
            </div>
            <div style={s.browserBody}>
              <div style={s.mockRow}>
                <MockBar w="55%" h={14} accent />
                <MockBar w="30%" h={10} />
              </div>
              <div style={s.mockStatRow}>
                <MockStat value="12" label="Skills Matched" />
                <MockStat value="4" label="Gaps Found" accent />
              </div>
              <MockBar w="100%" h={8} />
              <MockBar w="90%" h={8} />
              <MockBar w="70%" h={8} />
              <div style={s.mockChipRow}>
                {["React", "Node.js", "SQL", "+3"].map((chip) => (
                  <span key={chip} style={s.mockChip}>
                    {chip}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div style={s.floatCard1} className="animate-floatSlow">
            <span style={{ fontSize: 20 }}>🎯</span>
            <div>
              <div style={s.floatCardTitle}>Grounded</div>
              <div style={s.floatCardSub}>100% verified courses</div>
            </div>
          </div>

          <div style={s.floatCard2} className="animate-floatSlow delay-300">
            <span style={{ fontSize: 20 }}>⚡</span>
            <div>
              <div style={s.floatCardTitle}>3x Faster</div>
              <div style={s.floatCardSub}>Onboarding time</div>
            </div>
          </div>
        </div>
      </section>

      <section id="start" style={s.startSection}>
        <div style={s.statsRow} className="animate-fadeIn">
          {[
            { val: "0", label: "Hallucinations" },
            { val: "100%", label: "Grounded Courses" },
            { val: "3x", label: "Faster Onboarding" },
          ].map((stat, i) => (
            <div key={i} style={s.stat}>
              <span style={s.statVal}>{stat.val}</span>
              <span style={s.statLabel}>{stat.label}</span>
            </div>
          ))}
        </div>

        <div style={s.grid} className="animate-fadeIn delay-200">
          <InputCard
            title="Resume"
            mode={resumeMode}
            onModeChange={setResumeMode}
            text={resumeText}
            onTextChange={setResumeText}
            file={resumeFile}
            onFileChange={setResumeFile}
            icon="📄"
            placeholder="Paste your resume text here..."
            accentColor={colors.accent}
          />
          <InputCard
            title="Job Description"
            mode={jdMode}
            onModeChange={setJdMode}
            text={jdText}
            onTextChange={setJdText}
            file={jdFile}
            onFileChange={setJdFile}
            icon="📋"
            placeholder="Paste the job description here..."
            accentColor={colors.accentBlue}
          />
        </div>

        {error && (
          <div style={s.errorBox} className="animate-fadeIn">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <div style={{ position: "relative", display: "flex", justifyContent: "center" }} className="animate-fadeIn delay-300">
          <div
            style={{
              ...s.btnGlow,
              opacity: btnHover && !loading ? 1 : 0.4,
            }}
          />
          <button
            style={{
              ...s.btn,
              ...(loading ? s.btnDisabled : {}),
              ...(btnHover && !loading ? s.btnHover : {}),
            }}
            onClick={handleSubmit}
            disabled={loading}
            onMouseEnter={() => setBtnHover(true)}
            onMouseLeave={() => setBtnHover(false)}
            className="btn-ripple"
          >
            {loading ? (
              <span style={s.loadingRow}>
                <span style={s.spinner} />
                <span>{STEPS[loadingStep] || "Analyzing your profile..."}</span>
              </span>
            ) : (
              <span style={s.btnInner}>
                <span>Analyze & Generate Pathway</span>
                <span
                  style={{
                    fontSize: 20,
                    transform: btnHover ? "translateX(4px)" : "translateX(0)",
                    transition: "transform 0.2s ease",
                    display: "inline-block",
                  }}
                >
                  →
                </span>
              </span>
            )}
          </button>
        </div>

        <p style={s.hint} className="animate-fadeIn delay-400">
          Your data is processed locally · No storage · Instant results
        </p>
      </section>
    </main>
  );
}

// ── Mock preview helpers ─────────────────────────────────────────────────

function MockBar({ w, h, accent }: { w: string; h: number; accent?: boolean }) {
  return (
    <div
      style={{
        width: w,
        height: h,
        borderRadius: h / 2,
        background: accent ? gradients.accent : "rgba(20,20,30,0.08)",
        marginBottom: 8,
      }}
    />
  );
}

function MockStat({ value, label, accent }: { value: string; label: string; accent?: boolean }) {
  return (
    <div
      style={{
        flex: 1,
        padding: "12px 14px",
        borderRadius: radius.md,
        background: accent ? colors.accentBg : colors.bgDeep,
        border: `1px solid ${accent ? "rgba(255,90,54,0.2)" : colors.border}`,
      }}
    >
      <div
        style={{
          fontFamily: fonts.display,
          fontWeight: 800,
          fontSize: 20,
          color: accent ? colors.accent : colors.textPrimary,
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: 11, color: colors.textMuted }}>{label}</div>
    </div>
  );
}

// ── InputCard ──────────────────────────────────────────────────────────────

function InputCard({
  title, mode, onModeChange, text, onTextChange,
  file, onFileChange, icon, placeholder, accentColor,
}: {
  title: string;
  mode: InputMode;
  onModeChange: (m: InputMode) => void;
  text: string;
  onTextChange: (t: string) => void;
  file: File | null;
  onFileChange: (f: File | null) => void;
  icon: string;
  placeholder: string;
  accentColor: string;
}) {
  const [focused, setFocused] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div
      className="card-animated-border"
      style={{
        ...s.card,
        borderColor: focused ? `${accentColor}40` : colors.border,
        boxShadow: focused ? `0 0 0 3px ${accentColor}12` : "0 2px 12px rgba(20,20,30,0.04)",
        transition: "all 0.3s ease",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "10%",
          right: "10%",
          height: 1,
          background: `linear-gradient(90deg, transparent, ${accentColor}60, transparent)`,
          borderRadius: 1,
        }}
      />

      <div style={s.cardHeader}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: accentColor,
              boxShadow: `0 0 8px ${accentColor}`,
            }}
          />
          <span style={{ ...s.cardTitle, color: accentColor }}>{title}</span>
        </div>
        <div style={s.toggle}>
          {(["text", "pdf"] as InputMode[]).map((m) => (
            <button
              key={m}
              style={{
                ...s.toggleBtn,
                ...(mode === m ? { ...s.toggleActive, background: accentColor } : {}),
              }}
              onClick={() => onModeChange(m)}
            >
              {m.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {mode === "text" ? (
        <textarea
          style={{
            ...s.textarea,
            borderColor: focused ? `${accentColor}40` : colors.border,
          }}
          placeholder={placeholder}
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      ) : (
        <div
          style={{
            ...s.dropzone,
            borderColor: dragOver ? accentColor : `${accentColor}40`,
            background: dragOver ? `${accentColor}08` : colors.bgDeep,
            transform: dragOver ? "scale(1.01)" : "scale(1)",
            transition: "all 0.2s ease",
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            const f = e.dataTransfer.files[0];
            if (f?.type === "application/pdf") onFileChange(f);
          }}
          onClick={() => fileRef.current?.click()}
        >
          <input
            ref={fileRef}
            type="file"
            accept=".pdf"
            style={{ display: "none" }}
            onChange={(e) => onFileChange(e.target.files?.[0] || null)}
          />
          <span style={{ fontSize: 36, filter: file ? "none" : "grayscale(0.5)" }}>
            {file ? "✅" : icon}
          </span>
          <span style={s.dropText}>{file ? file.name : "Drop PDF here or click to upload"}</span>
          {!file && <span style={{ fontSize: 12, color: colors.textMuted }}>Supports PDF files up to 10MB</span>}
          {file && (
            <button
              style={s.removeFile}
              onClick={(e) => {
                e.stopPropagation();
                onFileChange(null);
              }}
            >
              Remove ×
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────
const s: Record<string, React.CSSProperties> = {
  wrap: {
    position: "relative",
    zIndex: 1,
  },
  hero: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "72px 24px 96px",
    display: "grid",
    gridTemplateColumns: "1.05fr 0.95fr",
    gap: 56,
    alignItems: "center",
  },
  heroLeft: {},
  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "6px 16px",
    background: colors.accentBg,
    border: "1px solid rgba(255,90,54,0.2)",
    borderRadius: 20,
    marginBottom: 24,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: colors.accent,
    boxShadow: `0 0 6px ${colors.accent}`,
    animation: "pulseGlow 2s ease-in-out infinite",
  },
  badgeText: {
    fontSize: 12,
    color: colors.textSub,
    letterSpacing: "0.05em",
    textTransform: "uppercase",
    fontWeight: 600,
  },
  headline: {
    fontFamily: fonts.display,
    fontSize: "clamp(38px, 4.8vw, 62px)",
    fontWeight: 800,
    lineHeight: 1.08,
    marginBottom: 20,
    letterSpacing: "-1.5px",
    color: colors.textPrimary,
  },
  accentText: {
    color: colors.accent,
  },
  subheadline: {
    fontSize: 18,
    color: colors.textMuted,
    marginBottom: 32,
    fontWeight: 400,
    lineHeight: 1.6,
    maxWidth: 480,
  },
  ctaRow: {
    display: "flex",
    gap: 14,
    marginBottom: 36,
    flexWrap: "wrap",
  },
  ctaPrimary: {
    padding: "16px 32px",
    background: gradients.accent,
    border: "none",
    borderRadius: radius.lg,
    color: "#fff",
    fontFamily: fonts.display,
    fontWeight: 700,
    fontSize: 16,
    cursor: "pointer",
    boxShadow: "0 12px 30px rgba(255,90,54,0.3)",
    transition: "transform 0.2s ease",
  },
  ctaSecondary: {
    padding: "16px 32px",
    background: colors.surface,
    border: `1px solid ${colors.border}`,
    borderRadius: radius.lg,
    color: colors.textPrimary,
    fontFamily: fonts.display,
    fontWeight: 700,
    fontSize: 16,
    cursor: "pointer",
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
  },
  trustRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    flexWrap: "wrap",
  },
  avatarStack: { display: "flex", alignItems: "center" },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: "50%",
    background: colors.bgDeep,
    border: `2px solid ${colors.bg}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 15,
  },
  trustText: { fontSize: 14, color: colors.textSub },
  trustDivider: { width: 1, height: 16, background: colors.border },
  ratingRow: { display: "flex", alignItems: "center", gap: 6 },
  stars: { color: "#F59E0B", fontSize: 14, letterSpacing: 1 },

  heroRight: { position: "relative" },
  browserMock: {
    background: colors.surface,
    border: `1px solid ${colors.border}`,
    borderRadius: radius.xxl,
    overflow: "hidden",
    boxShadow: "0 24px 60px rgba(20,20,30,0.12)",
  },
  browserBar: {
    display: "flex",
    gap: 6,
    padding: "12px 16px",
    background: colors.bgDeep,
    borderBottom: `1px solid ${colors.border}`,
  },
  browserDot: { width: 10, height: 10, borderRadius: "50%" },
  browserBody: { padding: 24 },
  mockRow: { marginBottom: 16 },
  mockStatRow: { display: "flex", gap: 12, marginBottom: 20 },
  mockChipRow: { display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 },
  mockChip: {
    padding: "5px 12px",
    background: colors.bgDeep,
    border: `1px solid ${colors.border}`,
    borderRadius: 20,
    fontSize: 12,
    color: colors.textSub,
  },
  floatCard1: {
    position: "absolute",
    top: -20,
    right: -20,
    display: "flex",
    alignItems: "center",
    gap: 10,
    background: colors.surface,
    border: `1px solid ${colors.border}`,
    borderRadius: radius.lg,
    padding: "10px 16px",
    boxShadow: "0 12px 30px rgba(20,20,30,0.12)",
  },
  floatCard2: {
    position: "absolute",
    bottom: -16,
    left: -24,
    display: "flex",
    alignItems: "center",
    gap: 10,
    background: colors.surface,
    border: `1px solid ${colors.border}`,
    borderRadius: radius.lg,
    padding: "10px 16px",
    boxShadow: "0 12px 30px rgba(20,20,30,0.12)",
  },
  floatCardTitle: { fontSize: 13, fontWeight: 700, color: colors.textPrimary },
  floatCardSub: { fontSize: 11, color: colors.textMuted },

  startSection: {
    maxWidth: 920,
    margin: "0 auto",
    padding: "40px 24px 80px",
    textAlign: "center",
    borderTop: `1px solid ${colors.border}`,
  },
  statsRow: {
    display: "flex",
    justifyContent: "center",
    gap: 48,
    marginTop: 48,
    marginBottom: 48,
  },
  stat: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 4,
  },
  statVal: {
    fontFamily: fonts.display,
    fontSize: 28,
    fontWeight: 800,
    color: colors.accent,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: spacing.xl,
    marginBottom: spacing.xxxl,
    textAlign: "left",
  },
  card: {
    background: colors.surface,
    border: "1px solid",
    borderRadius: radius.xxl,
    padding: spacing.xl,
    position: "relative",
    overflow: "hidden",
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  cardTitle: {
    fontFamily: fonts.display,
    fontWeight: 700,
    fontSize: 15,
  },
  toggle: {
    display: "flex",
    background: colors.bgDeep,
    borderRadius: radius.md,
    padding: 3,
    gap: 2,
  },
  toggleBtn: {
    padding: "4px 12px",
    borderRadius: radius.sm,
    border: "none",
    background: "transparent",
    color: colors.textMuted,
    cursor: "pointer",
    fontSize: 12,
    fontFamily: fonts.body,
    transition: "all 0.2s",
  },
  toggleActive: {
    color: colors.textDark,
    fontWeight: 700,
  },
  textarea: {
    width: "100%",
    height: 180,
    background: colors.bgDeep,
    border: "1px solid",
    borderRadius: radius.md,
    padding: "12px 14px",
    color: colors.textPrimary,
    fontFamily: fonts.body,
    fontSize: 14,
    resize: "vertical",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s ease",
    lineHeight: 1.6,
  },
  dropzone: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: 180,
    border: "2px dashed",
    borderRadius: radius.md,
    cursor: "pointer",
    gap: spacing.sm,
  },
  dropText: { fontSize: 14, color: colors.textSub, fontWeight: 500 },
  removeFile: {
    padding: "4px 12px",
    fontSize: 12,
    background: "rgba(220,38,38,0.08)",
    border: "1px solid rgba(220,38,38,0.25)",
    borderRadius: radius.sm,
    color: colors.danger,
    cursor: "pointer",
  },
  errorBox: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "10px 20px",
    background: "rgba(220,38,38,0.06)",
    border: "1px solid rgba(220,38,38,0.2)",
    borderRadius: radius.md,
    color: colors.danger,
    fontSize: 14,
    marginBottom: spacing.xl,
  },
  btnGlow: {
    position: "absolute",
    inset: -20,
    background: `radial-gradient(ellipse, ${colors.accent}25 0%, transparent 70%)`,
    borderRadius: "50%",
    transition: "opacity 0.3s ease",
    pointerEvents: "none",
  },
  btn: {
    position: "relative",
    padding: "18px 52px",
    background: gradients.accent,
    border: "none",
    borderRadius: radius.lg,
    color: "#fff",
    fontFamily: fonts.display,
    fontWeight: 700,
    fontSize: 18,
    cursor: "pointer",
    transition: "all 0.3s ease",
    letterSpacing: "-0.3px",
    boxShadow: "0 12px 30px rgba(255,90,54,0.25)",
  },
  btnHover: {
    transform: "translateY(-2px) scale(1.02)",
    boxShadow: "0 20px 45px rgba(255,90,54,0.35)",
  },
  btnDisabled: { opacity: 0.7, cursor: "not-allowed" },
  btnInner: { display: "flex", alignItems: "center", gap: 10 },
  loadingRow: { display: "flex", alignItems: "center", gap: 10 },
  spinner: {
    display: "inline-block",
    width: 18,
    height: 18,
    border: "2px solid rgba(255,255,255,0.35)",
    borderTop: "2px solid #FFFFFF",
    borderRadius: "50%",
    animation: "spin 0.7s linear infinite",
  },
  hint: {
    marginTop: 20,
    fontSize: 12,
    color: colors.textMuted,
    letterSpacing: "0.03em",
  },
};