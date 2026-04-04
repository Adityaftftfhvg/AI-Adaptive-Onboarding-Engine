"use client";

import { useAnalyze } from "@/hooks/useAnalyze";
import UploadForm from "@/components/UploadForm";
import ResultTabs from "@/components/ResultTabs";
import { colors, fonts, radius, spacing, gradients } from "@/styles/tokens";
const DownloadReport = dynamic(() => import("@/components/DownloadReport"), {
  ssr: false,
});
function CopyButton({ result }: { result: AnalysisResult }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    const summary = `
🎯 PathForge Learning Pathway Summary

Missing Skills: ${result.skill_gap.missing_skills.join(", ")}

Recommended Courses:
${result.pathway.map((c, i) => `${i + 1}. ${c.course} (${c.level} · ⭐${c.rating})`).join("\n")}


export default function Home() {
  const { loading, loadingStep, error, result, analyze, reset } = useAnalyze();
  const [activeTab, setActiveTab] = useState<Tab>("gap");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Inject fonts
    const style = document.createElement("style");
    style.innerHTML = `@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');`;
    document.head.appendChild(style);
    setMounted(true);
  }, []);

  return (
    <div style={s.page}>

      {/* Noise overlay */}
      <div className="noise-overlay" />

      {/* Particle canvas */}
      <ParticleField />

      {/* Aurora blobs */}
      <div className="aurora-1" style={{ top: "-200px", left: "-200px" }} />
      <div className="aurora-2" style={{ bottom: "-300px", right: "-300px" }} />

      {/* Grid */}
      <div style={s.grid} />

      {/* Radial vignette */}
      <div style={s.vignette} />

      {/* Header */}
      <header style={s.header} className="glass">
        <div style={s.logoRow}>
          <HexLogo />
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <span style={s.logoText}>PathForge</span>
            {mounted && <TypedTagline text="AI-ADAPTIVE ONBOARDING ENGINE" />}
          </div>
        </div>

        <div style={s.headerRight}>
          <div style={s.statusDot} />
          <span style={{ fontSize: 12, color: colors.textMuted }}>AI Ready</span>
        </div>
      </header>

      {/* Upload or Results */}
      {!result ? (
        <UploadForm
          onAnalyze={analyze}
          loading={loading}
          loadingStep={loadingStep}  
          error={error}
        />
      ) : (
        <main style={s.results} className="animate-fadeIn">

          {/* Summary Pills */}
          <div style={s.summary}>
            <Pill label="Skills You Have"       value={result.skill_gap.resume_skills.length} delay={0} />
            <Pill label="Skills Missing"        value={result.skill_gap.missing_skills.length} danger delay={1} />
            <Pill label="Courses Recommended"   value={result.pathway.length} accent delay={2} />
            <Pill
              label="Grounding Score"
              value={`${result.grounding.total_grounded}/${result.grounding.total_recommended}`}
              accent
              delay={3}
            />
          </div>
          {result.skill_gap.missing_skills.length === 0 ? (
            <div style={{
              textAlign: "center",
              padding: "60px 24px",
              background: colors.surface,
              border: `1px solid ${colors.border}`,
              borderRadius: radius.xxl,
              marginBottom: 32,
            }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
              <h2 style={{
                fontFamily: fonts.display,
                fontSize: 24, fontWeight: 700,
                color: colors.accent, marginBottom: 8,
              }}>
                Perfect Match!
              </h2>
              <p style={{ color: colors.textMuted, fontSize: 16 }}>
                Your resume already covers all the required skills for this role.
                No additional training needed.
              </p>
            </div>
          ) : (
            <ResultTabs result={result} activeTab={activeTab} onTabChange={setActiveTab} />
          )}
          <ResultTabs result={result} activeTab={activeTab} onTabChange={setActiveTab} />


        </main>
      )}
    </div>
  );
}

// ── Pill Component ─────────────────────────────────────────────────────────
function Pill({ label, value, danger, accent, delay = 0 }: {
  label: string;
  value: number | string;
  danger?: boolean;
  accent?: boolean;
  delay?: number;
}) {
  return (
    <div
      className="hover-lift card-animated-border"
      style={{
        ...s.pill,
        ...(danger ? s.pillDanger : {}),
        ...(accent ? s.pillAccent : {}),
        animation: `cardEntrance 0.5s ease ${delay * 0.1}s both`,
      }}
    >
      <span style={s.pillLabel}>{label}</span>
      <span style={{
        ...s.pillValue,
        ...(accent ? { background: gradients.accent, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" } : {}),
        ...(danger ? { color: colors.danger } : {}),
      }}>
        {value}
      </span>
    </div>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────
const s: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: colors.bg,
    fontFamily: fonts.body,
    color: colors.textPrimary,
    position: "relative",
    overflowX: "hidden",
  },
  grid: {
    position: "fixed", inset: 0,
    backgroundImage: `
      linear-gradient(rgba(0,212,170,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,212,170,0.04) 1px, transparent 1px)
    `,
    backgroundSize: "40px 40px",
    pointerEvents: "none", zIndex: 0,
  },
  vignette: {
    position: "fixed", inset: 0,
    background: "radial-gradient(ellipse at center, transparent 40%, rgba(10,15,30,0.8) 100%)",
    pointerEvents: "none", zIndex: 0,
  },
  header: {
    position: "relative", zIndex: 10,
    display: "flex", alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 48px",
    borderBottom: `1px solid rgba(0,212,170,0.1)`,
    borderTop: "none", borderLeft: "none", borderRight: "none",
    backdropFilter: "blur(20px)",
    background: "rgba(10,15,30,0.8)",
  },
  logoRow: { display: "flex", alignItems: "center", gap: 12 },
  logoText: {
    fontFamily: fonts.display,
    fontWeight: 800, fontSize: 22,
    color: colors.textPrimary,
    letterSpacing: "-0.5px",
    textShadow: "0 0 30px rgba(0,212,170,0.3)",
  },
  headerRight: {
    display: "flex", alignItems: "center", gap: 8,
    padding: "6px 14px",
    background: "rgba(0,212,170,0.05)",
    border: "1px solid rgba(0,212,170,0.15)",
    borderRadius: 20,
  },
  statusDot: {
    width: 8, height: 8,
    borderRadius: "50%",
    background: colors.accent,
    boxShadow: "0 0 8px rgba(0,212,170,0.8)",
    animation: "pulseGlow 2s ease-in-out infinite",
  },
  results: {
    position: "relative", zIndex: 1,
    maxWidth: 960, margin: "0 auto",
    padding: "40px 24px 80px",
  },
  summary: {
    display: "flex", gap: spacing.md,
    marginBottom: spacing.xxl, flexWrap: "wrap",
  },
  pill: {
    flex: 1, minWidth: 160,
    background: "rgba(26,35,50,0.7)",
    backdropFilter: "blur(10px)",
    border: `1px solid ${colors.border}`,
    borderRadius: radius.lg,
    padding: "16px 24px",
    display: "flex", flexDirection: "column", gap: spacing.xs,
    cursor: "default",
    transition: "all 0.3s ease",
  },
  pillDanger: {
    borderColor: colors.borderDanger,
    background: "rgba(255,107,107,0.05)",
  },
  pillAccent: {
    borderColor: "rgba(0,212,170,0.25)",
    background: "rgba(0,212,170,0.05)",
  },
  pillLabel: {
    fontSize: 12, color: colors.textMuted,
    textTransform: "uppercase", letterSpacing: "0.05em",
  },
  pillValue: {
    fontFamily: fonts.display, fontSize: 32,
    fontWeight: 800, color: colors.textPrimary,
  },
  backBtn: {
    marginTop: spacing.xxl,
    background: "transparent",
    border: `1px solid ${colors.border}`,
    color: colors.accent, padding: "8px 20px",
    borderRadius: radius.md, cursor: "pointer",
    fontFamily: fonts.body, fontSize: 14,
    transition: "all 0.2s ease",
  },
};
