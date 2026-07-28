"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { colors, fonts, radius, spacing, gradients } from "@/styles/tokens";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setError("");
    setLoading(true);
    try {
      const result = await signIn("credentials", { email, password, redirect: false });
      if (result?.error) throw new Error("Invalid email or password");
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={s.wrap}>
      <div style={s.card}>
        <h1 style={s.title}>Welcome back</h1>
        <p style={s.subtitle}>Log in to access your saved resumes and analyses.</p>

        <label style={s.label}>Email</label>
        <input style={s.input} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />

        <label style={s.label}>Password</label>
        <input style={s.input} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Your password" />

        {error && <p style={s.error}>{error}</p>}

        <button style={{ ...s.submitBtn, opacity: loading ? 0.6 : 1 }} onClick={handleLogin} disabled={loading}>
          {loading ? "Logging in..." : "Log In"}
        </button>

        <div style={s.divider}><span>or</span></div>

        <button style={s.googleBtn} onClick={() => signIn("google", { callbackUrl: "/" })}>
          Continue with Google
        </button>

        <p style={s.switchText}>
          Don't have an account? <Link href="/signup" style={s.link}>Sign up</Link>
        </p>
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  wrap: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: colors.bg, fontFamily: fonts.body, padding: 24 },
  card: { width: "100%", maxWidth: 400, background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: radius.xl, padding: spacing.xxl },
  title: { fontFamily: fonts.display, fontSize: 26, fontWeight: 800, color: colors.textPrimary, margin: "0 0 8px 0" },
  subtitle: { fontSize: 13, color: colors.textSub, marginBottom: spacing.xl },
  label: { display: "block", fontSize: 12, color: colors.textMuted, textTransform: "uppercase", letterSpacing: 0.05, marginBottom: 6, marginTop: spacing.md },
  input: { width: "100%", padding: "10px 14px", borderRadius: radius.md, border: `1px solid ${colors.border}`, background: colors.bgDeep, color: colors.textPrimary, fontFamily: fonts.body, fontSize: 14, boxSizing: "border-box" },
  error: { color: colors.danger, fontSize: 13, marginTop: spacing.md },
  submitBtn: { width: "100%", marginTop: spacing.xl, padding: "12px", borderRadius: radius.lg, border: "none", background: gradients.accent, color: colors.textDark, fontFamily: fonts.body, fontWeight: 700, fontSize: 15, cursor: "pointer" },
  divider: { textAlign: "center", color: colors.textMuted, fontSize: 12, margin: `${spacing.lg}px 0`, position: "relative" },
  googleBtn: { width: "100%", padding: "12px", borderRadius: radius.lg, border: `1px solid ${colors.border}`, background: "transparent", color: colors.textPrimary, fontFamily: fonts.body, fontSize: 14, cursor: "pointer" },
  switchText: { textAlign: "center", fontSize: 13, color: colors.textMuted, marginTop: spacing.xl },
  link: { color: colors.accent, textDecoration: "none" },
};