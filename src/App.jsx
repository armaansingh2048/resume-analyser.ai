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
  textarea: { width: "100%", background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "16px", c