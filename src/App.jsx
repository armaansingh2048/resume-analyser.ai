import { useState, useRef } from "react";

const ACCENT = "#00FF88";
const BG = "#0a0a0f";
const CARD = "#111118";
const BORDER = "#1e1e2e";
const TEXT = "#e2e8f0";
const MUTED = "#64748b";

const styles = {
  root: { minHeight: "100vh", background: BG, color: TEXT, fontFamily: "'Courier New', monospace" },
  header: { borderBottom: `1px solid ${BORDER}`, padding: "24px 40px", display: "flex", alignItems: "center", gap: "12px" },
  logo: { width: 36, height: 36, background: ACCENT, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: "bold", color: "#000" },
  title: { fontSize: 20, fontWeight: "bold", color: TEXT },
  subtitle: { fontSize: 12, color: MUTED, marginTop: 2 },
  badge: { marginLeft: "auto", background: "rgba(0,255,136,0.1)", border: `1px solid rgba(0,255,136,0.3)`, color: ACCENT, fontSize: 11, padding: "4px 10px", borderRadius: 20 },
  main: { maxWidth: 860, margin: "0 auto", padding: "48px 24px" },
  hero: { textAlign: "center", marginBottom: 48 },
  heroTitle: { fontSize: 42, fontWeight: "900", color: TEXT, lineHeight: 1.1, letterSpacing: "-2px", marginBottom: 12 },
  heroAccent: { color: ACCENT },
  heroSub: { color: MUTED, fontSize: 15, lineHeight: 1.6 },
  uploadCard: { background: CARD, border: `2px dashed ${BORDER}`, borderRadius: 16, padding: "48px 32px", textAlign: "center", cursor: "pointer", marginBottom: 20 },
  uploadIcon: { fontSize: 40, marginBottom: 16 },
  uploadText: { fontSize: 16, fontWeight: "bold", color: TEXT, marginBottom: 8 },
  uploadSub: { fontSize: 13, color: MUTED },
  orDivider: { display: "flex", alignItems: "center", gap: 16, margin: "20px 0", color: MUTED, fontSize: 12 },
  divLine: { flex: 1, height: 1, background: BORDER },
  textarea: { width: "100%", background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "16px", color: TEXT, fontSize: 13, fontFamily: "'Courier New', monospace", resize: "vertical", minHeight: 200, outline: "none", boxSizing: "border-box", lineHeight: 1.6 },
  btn: { width: "100%", padding: "16px", background: ACCENT, color: "#000", border: "none", borderRadius: 12, fontSize: 15, fontWeight: "900", fontFamily: "'Courier New', monospace", cursor: "pointer", marginTop: 16 },
  btnDisabled: { opacity: 0.4, cursor: "not-allowed" },
  loadingBox: { background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: "40px", textAlign: "center", marginTop: 32 },
  spinner: { display: "inline-block", width: 32, height: 32, border: `3px solid ${BORDER}`, borderTop: `3px solid ${ACCENT}`, borderRadius: "50%", animation: "spin 0.8s linear infinite", marginBottom: 16 },
  resultBox: { marginTop: 32, display: "flex", flexDirection: "column", gap: 16 },
  sectionCard: { background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, overflow: "hidden" },
  sectionHeader: { padding: "14px 20px", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", gap: 10, fontSize: 13, fontWeight: "bold", letterSpacing: "0.5px" },
  sectionBody: { padding: "20px", fontSize: 14, lineHeight: 1.7, color: "#c8d3df" },
  scoreRow: { display: "flex", gap: 12, flexWrap: "wrap" },
  scoreChip: { flex: "1 1 140px", background: "#0d0d1a", border: `1px solid ${BORDER}`, borderRadius: 10, padding: "16px", textAlign: "center" },
  scoreNum: { fontSize: 32, fontWeight: "900", lineHeight: 1, marginBottom: 6 },
  scoreLabel: { fontSize: 11, color: MUTED, letterSpacing: "0.5px" },
  tagRow: { display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 },
  tag: { fontSize: 12, padding: "5px 12px", borderRadius: 20, fontWeight: "bold" },
  tagGreen: { background: "rgba(0,255,136,0.1)", color: ACCENT, border: "1px solid rgba(0,255,136,0.25)" },
  tagRed: { background: "rgba(255,80,80,0.1)", color: "#ff6b6b", border: "1px solid rgba(255,80,80,0.25)" },
  tagBlue: { background: "rgba(99,179,237,0.1)", color: "#63b3ed", border: "1px solid rgba(99,179,237,0.25)" },
};

function parseAnalysis(text) {
  try {
    const clean = text.replace(/```json|```/g, "").trim();
    const start = clean.indexOf("{");
    const end = clean.lastIndexOf("}");
    if (start !== -1 && end !== -1) return JSON.parse(clean.slice(start, end + 1));
  } catch {}
  return null;
}

function ScoreBar({ score, color }) {
  return (
    <div style={{ height: 4, background: "#1e1e2e", borderRadius: 4, marginTop: 8, overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${score}%`, background: color, borderRadius: 4 }} />
    </div>
  );
}

export default function ResumeAnalyzer() {
  const [resumeText, setResumeText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const fileRef = useRef();

  const handleFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => setResumeText(e.target.result);
    reader.readAsText(file);
  };

  const analyze = async () => {
    if (!resumeText.trim()) return;
    setLoading(true); setResult(null); setError("");
    const prompt = `You are an expert tech recruiter. Analyze this resume and return ONLY valid JSON, no markdown:
{
  "overall_score": <0-100>,
  "ats_score": <0-100>,
  "impact_score": <0-100>,
  "clarity_score": <0-100>,
  "summary": "<2-3 sentence impression>",
  "strengths": ["s1","s2","s3"],
  "weaknesses": ["w1","w2","w3"],
  "missing_keywords": ["k1","k2","k3","k4"],
  "suggested_roles": ["r1","r2","r3"],
  "quick_fixes": ["f1","f2","f3"]
}
Resume:
${resumeText.slice(0, 4000)}`;
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, messages: [{ role: "user", content: prompt }] }),
      });
      const data = await res.json();
      const raw = data.content?.map(b => b.text || "").join("") || "";
      const parsed = parseAnalysis(raw);
      if (parsed) setResult(parsed);
      else setError("Couldn't parse analysis. Try again!");
    } catch { setError("API error. Check connection."); }
    setLoading(false);
  };

  const scoreColor = (s) => s >= 80 ? ACCENT : s >= 60 ? "#facc15" : "#ff6b6b";

  return (
    <div style={styles.root}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={styles.header}>
        <div style={styles.logo}>R</div>
        <div>
          <div style={styles.title}>ResumeAI</div>
          <div style={styles.subtitle}>AI-powered resume analyzer</div>
        </div>
        <div style={styles.badge}>POWERED BY CLAUDE</div>
      </div>
      <div style={styles.main}>
        <div style={styles.hero}>
          <div style={styles.heroTitle}>Get Your Resume<br /><span style={styles.heroAccent}>Roasted & Fixed.</span></div>
          <div style={styles.heroSub}>Paste your resume below. Claude analyzes it like a real recruiter.</div>
        </div>
        <textarea style={styles.textarea} placeholder="Paste your full resume text here..." value={resumeText} onChange={(e) => setResumeText(e.target.value)} />
        <button style={{ ...styles.btn, ...(!resumeText.trim() || loading ? styles.btnDisabled : {}) }} disabled={!resumeText.trim() || loading} onClick={analyze}>
          {loading ? "ANALYZING..." : "⚡ ANALYZE MY RESUME"}
        </button>
        {loading && <div style={styles.loadingBox}><div style={styles.spinner} /><div style={{ color: ACCENT, fontWeight: "bold" }}>Claude is reading your resume...</div></div>}
        {error && <div style={{ ...styles.loadingBox, color: "#ff6b6b", marginTop: 32 }}>⚠️ {error}</div>}
        {result && (
          <div style={styles.resultBox}>
            <div style={styles.sectionCard}>
              <div style={{ ...styles.sectionHeader, color: ACCENT }}>📊 SCORES</div>
              <div style={styles.sectionBody}>
                <div style={styles.scoreRow}>
                  {[["OVERALL", result.overall_score], ["ATS", result.ats_score], ["IMPACT", result.impact_score], ["CLARITY", result.clarity_score]].map(([label, val]) => (
                    <div key={label} style={styles.scoreChip}>
                      <div style={{ ...styles.scoreNum, color: scoreColor(val) }}>{val}</div>
                      <div style={styles.scoreLabel}>{label}</div>
                      <ScoreBar score={val} color={scoreColor(val)} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div style={styles.sectionCard}>
              <div style={{ ...styles.sectionHeader, color: "#63b3ed" }}>🧠 IMPRESSION</div>
              <div style={styles.sectionBody}>{result.summary}</div>
            </div>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <div style={{ ...styles.sectionCard, flex: "1 1 300px" }}>
                <div style={{ ...styles.sectionHeader, color: ACCENT }}>✅ STRENGTHS</div>
                <div style={styles.sectionBody}><ul style={{ margin: 0, paddingLeft: 20 }}>{result.strengths?.map((s, i) => <li key={i} style={{ marginBottom: 6 }}>{s}</li>)}</ul></div>
              </div>
              <div style={{ ...styles.sectionCard, flex: "1 1 300px" }}>
                <div style={{ ...styles.sectionHeader,