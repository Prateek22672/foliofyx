import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─────────────────────────────────────────────────────────────────────────────
// FONT — Switzer from Fontshare
// ─────────────────────────────────────────────────────────────────────────────
const SwitzerFont = () => (
  <style>{`
    @import url('https://api.fontshare.com/v2/css?f[]=switzer@300,400,500,600&display=swap');
    .ff-switzer, .ff-switzer * { font-family: 'Switzer', sans-serif !important; }
  `}</style>
);

// ─────────────────────────────────────────────────────────────────────────────
// ICONS — lightweight, stroke-based
// ─────────────────────────────────────────────────────────────────────────────
const Ico = ({ children, size = 16 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} style={{ display: "block", flexShrink: 0 }}>
    {children}
  </svg>
);

const IconMouse = () => (
  <Ico>
    <rect x="8" y="2" width="8" height="13" rx="4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M12 6v3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M5 17a7 7 0 0 0 14 0" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </Ico>
);
const IconGrid = () => (
  <Ico>
    <rect x="3" y="3" width="7" height="7" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
  </Ico>
);
const IconZap = () => (
  <Ico>
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
  </Ico>
);
const IconX = () => (
  <Ico size={10}>
    <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </Ico>
);
const IconArrow = () => (
  <Ico size={12}>
    <path d="M5 12h14M12 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Ico>
);

// ─────────────────────────────────────────────────────────────────────────────
// STEPS
// ─────────────────────────────────────────────────────────────────────────────
const STEPS = [
  {
    id: 0,
    tag: "Welcome",
    accent: "#000000", // Changed from pink to black
    glow: "rgba(0, 0, 0, 0.08)", // Subtle black glow
    grad: ["#444444", "#000000"], // Sleek dark gradient
    title: "Welcome to FolioFYX",
    body: "Your AI-powered portfolio builder. Let's take a quick tour — 30 seconds and you'll know exactly what FolioFyx can do for you.",
    bodyColor: "rgba(0, 0, 0, 1)", // Pure black text intent
    cta: null,
  },
  {
    id: 1,
    icon: <IconMouse />,
    tag: "Explore",
    accent: "#000000",
    glow: "rgba(0, 0, 0, 0.08)",
    grad: ["#444444", "#000000"],
    title: "Scroll to explore",
    body: "Scroll down through this page to see FolioFyx in action — themes, bento layouts, talent showcases, and more.",
    cta: null,
    showScrollHint: true,
  },
  {
    id: 2,
    icon: <IconGrid />,
    tag: "Designs",
    accent: "#000000",
    glow: "rgba(0, 0, 0, 0.08)",
    grad: ["#444444", "#000000"],
    title: "Browse real examples",
    body: "See portfolios built by real people using FolioFyx. Minimal, bold, editorial — pick a style that speaks to you.",
    cta: { label: "View Examples", path: "/designs", primary: false },
  },
  {
    id: 3,
    icon: <IconZap />,
    tag: "Create",
    accent: "#000000",
    glow: "rgba(0, 0, 0, 0.08)",
    grad: ["#444444", "#000000"],
    title: "Build yours in minutes",
    body: "Answer a few questions — our AI crafts your full portfolio site instantly. No code, no design skills, no stress.",
    cta: { label: "Start Creating Now", path: "/create", primary: true },
  },
];

const FF = "'Switzer', sans-serif";

// ─────────────────────────────────────────────────────────────────────────────
// SCROLL HINT
// ─────────────────────────────────────────────────────────────────────────────
const ScrollHint = ({ accent }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5, marginTop: 12 }}>
    <div style={{
      width: 22, height: 36, borderRadius: 11,
      border: `1.5px solid ${accent}45`,
      display: "flex", justifyContent: "center", paddingTop: 6,
    }}>
      <motion.div
        style={{ width: 4, height: 4, borderRadius: "50%", background: accent }}
        animate={{ y: [0, 12, 0], opacity: [1, 0.2, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
    <span style={{
      fontSize: 8.5, letterSpacing: "0.26em", textTransform: "uppercase",
      fontWeight: 500, color: accent + "55", fontFamily: FF,
    }}>
      scroll down
    </span>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// STEP PILLS
// ─────────────────────────────────────────────────────────────────────────────
const StepPills = ({ total, current, onJump, accent }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
    {Array.from({ length: total }).map((_, i) => (
      <motion.button
        key={i}
        onClick={() => onJump(i)}
        animate={{
          width: i === current ? 24 : 6,
          opacity: i <= current ? 1 : 0.18,
          backgroundColor: i === current ? accent : i < current ? accent + "55" : "rgba(0,0,0,0.1)",
        }}
        transition={{ type: "spring", stiffness: 360, damping: 26 }}
        style={{ height: 5, borderRadius: 3, border: "none", cursor: "pointer", padding: 0, flexShrink: 0 }}
        aria-label={`Step ${i + 1}`}
      />
    ))}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// DESKTOP RAIL
// ─────────────────────────────────────────────────────────────────────────────
const DesktopRail = ({ steps, current, onJump }) => (
  <motion.div
    initial={{ opacity: 0, x: 14 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 14 }}
    transition={{ delay: 0.3, duration: 0.4 }}
    className="hidden lg:flex"
    style={{
      position: "fixed", right: 22, top: "50%", transform: "translateY(-50%)",
      zIndex: 9999, flexDirection: "column", alignItems: "flex-end", gap: 14,
    }}
  >
    {steps.map((s, i) => (
      <button
        key={i}
        onClick={() => onJump(i)}
        style={{ display: "flex", alignItems: "center", gap: 9, background: "none", border: "none", cursor: "pointer", padding: "2px 0" }}
        aria-label={s.tag}
      >
        <motion.span
          animate={{ opacity: i === current ? 0.5 : 0, x: i === current ? 0 : 8 }}
          style={{ fontSize: 9, color: "#111", fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", whiteSpace: "nowrap", fontFamily: FF }}
        >
          {s.tag}
        </motion.span>
        <motion.div
          animate={{
            width: i === current ? 22 : 5,
            backgroundColor: i === current ? s.accent : "rgba(0,0,0,0.15)",
          }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          style={{ height: 5, borderRadius: 3 }}
        />
      </button>
    ))}
  </motion.div>
);

// ─────────────────────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────────────────────
const LandingTutorial = ({ onNavigate, onFinished }) => {
  const [step, setStep]       = useState(0);
  const [show, setShow]       = useState(false);
  const [exiting, setExiting] = useState(false);

  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 1024 : false
  );
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const seen = sessionStorage.getItem("ff_tut_v3");
    if (seen) { if (onFinished) onFinished(); return; }
    const t = setTimeout(() => setShow(true), 1800);
    return () => clearTimeout(t);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const dismiss = useCallback(() => {
    if (exiting) return;
    sessionStorage.setItem("ff_tut_v3", "1");
    setExiting(true);
    setTimeout(() => { setShow(false); setExiting(false); if (onFinished) onFinished(); }, 380);
  }, [exiting, onFinished]);

  const next      = () => step < STEPS.length - 1 ? setStep(s => s + 1) : dismiss();
  const handleCta = (path) => { dismiss(); if (onNavigate) onNavigate(path); };

  const cur    = STEPS[step];
  const isLast = step === STEPS.length - 1;

  if (!show) return null;

  const wrapperStyle = {
    position: "fixed",
    inset: 0,
    zIndex: 9995,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingLeft: 12,
    paddingRight: 12,
    pointerEvents: "none",
    paddingBottom: isMobile
      ? "max(calc(35vh), calc(env(safe-area-inset-bottom, 0px) + 36px))"
      : "max(9vh, 60px)",
  };

  return (
    <AnimatePresence>
      {!exiting && (
        <>
          <SwitzerFont />

          {/* BACKDROP — lighter for white card. data-native-cursor restores
              the OS cursor across the whole overlay: the custom landing
              cursor made the card's small controls hard to target. */}
          <motion.div
            key="tut-bg"
            data-native-cursor
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.32 }}
            onClick={dismiss}
            style={{
              position: "fixed", inset: 0, zIndex: 9990,
              background: "rgba(0,0,0,0.42)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
            }}
          />

          <DesktopRail steps={STEPS} current={step} onJump={setStep} />

          <div key="tut-pos" style={wrapperStyle}>
            <motion.div
              key="tut-card"
              data-native-cursor
              initial={{ opacity: 0, y: 60, scale: 0.93 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 44, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 260, damping: 24, mass: 0.9 }}
              style={{ width: "100%", maxWidth: 420, pointerEvents: "auto" }}
              className="ff-switzer"
            >
              {/* ── CARD SHELL — white ── */}
              <motion.div
                animate={{
                  boxShadow: `0 0 0 1px ${cur.accent}18, 0 24px 60px rgba(0,0,0,0.16), 0 2px 8px rgba(0,0,0,0.06), 0 0 40px ${cur.glow}`,
                }}
                transition={{ duration: 0.4 }}
                style={{
                  background: "#ffffff",
                  border: "1px solid rgba(0,0,0,0.08)",
                  borderRadius: 24,
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                {/* Soft pastel aurora inside the card so it never reads flat */}
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute", inset: 0, pointerEvents: "none",
                    background:
                      "radial-gradient(ellipse 60% 45% at 92% 0%, rgba(233,213,255,0.35), transparent 70%), radial-gradient(ellipse 45% 35% at 0% 100%, rgba(199,210,254,0.22), transparent 70%)",
                  }}
                />

                {/* BRAND ACCENT TOP LINE */}
                <div
                  style={{
                    height: 3, width: "100%",
                    background: "linear-gradient(90deg, #6366f1, #a855f7, #ec4899)",
                  }}
                />

                {/* ── HEADER ── */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px 0 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                    {/* Logo */}
                    <div style={{
                      width: 58, height: 30, borderRadius: 8, flexShrink: 0,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      overflow: "hidden",
                    }}>
                      <img
                        src="/fyx3.png"
                        alt="FolioFyx"
                        width={53} height={28}
                        style={{ objectFit: "contain" }}
                        onError={e => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "/FYX/BlackClearBG.svg";
                        }}
                      />
                    </div>

                    <div style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(0,0,0,0.14)", flexShrink: 0 }} />



                    {/* Tag */}
                    <motion.span
                      animate={{ color: cur.accent }}
                      transition={{ duration: 0.4 }}
                      style={{ fontSize: 9.5, fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", fontFamily: FF, flexShrink: 0 }}
                    >
                      {cur.tag}
                    </motion.span>
                  </div>

                  {/* Close */}
                  <button
                    onClick={dismiss}
                    aria-label="Close tutorial"
                    style={{
                      width: 26, height: 26, borderRadius: "50%", flexShrink: 0,
                      background: "#f5f5f4",
                      border: "1px solid rgba(0,0,0,0.07)",
                      color: "rgba(0,0,0,0.3)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      cursor: "pointer",
                      transition: "background 0.15s",
                    }}
                  >
                    <IconX />
                  </button>
                </div>

                {/* ── CONTENT ── */}
                <div style={{ padding: "11px 16px 0 16px" }}>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={step}
                      initial={{ opacity: 0, x: 14, filter: "blur(3px)" }}
                      animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, x: -14, filter: "blur(3px)" }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                    >
                      {/* Title */}
                      <h2 style={{
                        fontSize: "clamp(17px, 4.4vw, 21px)",
                        fontWeight: 600,
                        color: "#0a0a0a",
                        lineHeight: 1.24,
                        margin: "0 0 8px",
                        letterSpacing: "-0.025em",
                        fontFamily: FF,
                      }}>
                        {cur.title}
                        {cur.emoji && (
                          <motion.span animate={{ color: cur.accent }} transition={{ duration: 0.4 }} style={{ marginLeft: 4 }}>
                            {cur.emoji}
                          </motion.span>
                        )}
                      </h2>

                      {/* Body */}
                      <p style={{
                        fontSize: "clamp(12px, 2.8vw, 13.5px)",
                        color: "rgba(0,0,0,0.44)",
                        lineHeight: 1.72,
                        margin: 0,
                        fontFamily: FF,
                        fontWeight: 400,
                      }}>
                        {cur.body}
                      </p>

                      {cur.showScrollHint && <ScrollHint accent={cur.accent} />}

                      {/* CTA */}
                      {cur.cta && (
                        <motion.button
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.12 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => handleCta(cur.cta.path)}
                          style={{
                            marginTop: 11, width: "100%",
                            padding: "10px 0", borderRadius: 10,
                            fontSize: 12.5, fontWeight: 500,
                            letterSpacing: "0.01em",
                            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                            cursor: "pointer", fontFamily: FF,
                            ...(cur.cta.primary
                              ? {
                                  background: `linear-gradient(135deg, ${cur.grad[0]}, ${cur.grad[1]})`,
                                  color: "#fff", border: "none",
                                  boxShadow: `0 4px 16px ${cur.glow}`,
                                }
                              : {
                                  background: "#f5f5f4",
                                  color: "#333",
                                  border: "1px solid rgba(0,0,0,0.09)",
                                }),
                          }}
                        >
                          {cur.cta.label}
                          <IconArrow />
                        </motion.button>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* ── FOOTER ── */}
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "10px 16px 14px 16px",
                  marginTop: 12,
                  borderTop: "1px solid rgba(0,0,0,0.055)",
                }}>
                  {/* Pills + counter */}
                  <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                    <StepPills total={STEPS.length} current={step} onJump={setStep} accent={cur.accent} />
                    <span style={{ fontSize: 9.5, color: "rgba(0,0,0,0.22)", fontWeight: 500, fontFamily: FF }}>
                      {step + 1}/{STEPS.length}
                    </span>
                  </div>

                  {/* Skip + Next */}
                  <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <button
                      onClick={dismiss}
                      style={{
                        background: "none", border: "none", cursor: "pointer",
                        fontSize: 10.5, fontWeight: 500,
                        color: "rgba(0,0,0,0.26)",
                        padding: "5px 7px", borderRadius: 7, fontFamily: FF,
                      }}
                    >
                      Skip
                    </button>
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={next}
                      style={{
                        display: "flex", alignItems: "center", gap: 6,
                        padding: "9px 18px", borderRadius: 999,
                        fontSize: 12, fontWeight: 600, color: "#fff",
                        background: "#0a0a0a",
                        border: "none", cursor: "pointer",
                        boxShadow: "0 6px 18px rgba(0,0,0,0.22)",
                        fontFamily: FF,
                      }}
                    >
                      {isLast ? "Let's go" : "Next"}
                      <IconArrow />
                    </motion.button>
                  </div>
                </div>
              </motion.div>

              {/* BRAND WATERMARK */}
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                gap: 5, marginTop: 8, opacity: 0.22,
              }}>
                <img
                  src="/FYX/BlackClearBG.svg"
                  alt=""
                  width={11} height={11}
                  style={{ objectFit: "contain" }}
                  onError={e => { e.currentTarget.style.display = "none"; }}
                />
                <span style={{ fontSize: 8.5, color: "#fff", fontWeight: 500, letterSpacing: "0.28em", textTransform: "uppercase", fontFamily: FF }}>
                  FolioFyx Studio
                </span>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default LandingTutorial;