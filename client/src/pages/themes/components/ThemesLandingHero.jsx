import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, RefreshCcw, Filter, Sparkles } from "lucide-react";

const C = {
  lavender: "#cb9fd2",
  indigo: "#5551ff",
  peach: "#ffc9c1",
  mint: "#24cb71",
  violet: "#874fff",
};

const useIsMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < breakpoint : false
  );
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, [breakpoint]);
  return isMobile;
};

const MarqueeRow = ({ direction, speed }) => {
  const moveDir = direction === "left" ? -1 : 1;
  return (
    <motion.div
      style={{
        display: "flex", whiteSpace: "nowrap", gap: "3rem",
        fontWeight: 900, fontSize: "9vw", textTransform: "uppercase",
        lineHeight: 1, color: "rgba(0,0,0,0.025)",
        userSelect: "none", willChange: "transform",
      }}
      animate={{ x: [0, moveDir * 1400] }}
      transition={{ repeat: Infinity, duration: speed, ease: "linear" }}
    >
      {[...Array(10)].map((_, i) => <span key={i}>FOLIOFYX&nbsp;&nbsp;</span>)}
    </motion.div>
  );
};

const LeftCollagePanel = () => (
  <motion.div
    initial={{ opacity: 0, y: 40, rotate: -3 }}
    animate={{ opacity: 1, y: 0, rotate: -3 }}
    transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
    whileHover={{ rotate: -1, scale: 1.03, transition: { duration: 0.4 } }}
    style={{
      background: C.indigo, borderRadius: 24, padding: 24,
      width: 220, flexShrink: 0, cursor: "default",
      boxShadow: "0 24px 60px rgba(85,81,255,0.3)",
    }}
  >

    {/* Wordmark Container */}
    <motion.div
      variants={fadeUp}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end", // ✅ This pushes the contents to the right
        gap: 10,
        width: "100%",             // ✅ Ensures it takes up the full width of the card
        marginBottom: 16            // Adds space between badge and content below
      }}
    >
      {/* The Mint Dot */}
      <div style={{
        width: 8,
        height: 8,
        borderRadius: "50%",
        background: C.mint,
        flexShrink: 0
      }} />

      {/* The Logo Image */}
      <img
        src="FYX/BlackClearBGNew.png"
        alt="Foliofyx Studio Logo"
        style={{
          width: 80,               // Scaled down slightly to fit better in a 220px card
          height: "auto",
          objectFit: "contain"
        }}
        className="brightness-0 invert" // Ensures it shows up white on the indigo background
      />
    </motion.div>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
      <span style={{ color: "#fff", fontWeight: 800, fontSize: 15, letterSpacing: "-0.02em" }}>Discover</span>
      <div style={{ display: "flex", gap: 6 }}>
        {["≡", "⊙"].map((s, i) => (
          <div key={i} style={{ width: 26, height: 26, borderRadius: 8, background: "rgba(255,255,255,0.18)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 13 }}>{s}</div>
        ))}
      </div>
    </div>
    <div style={{ borderRadius: 14, background: "rgba(255,255,255,0.15)", marginBottom: 8, height: 110, display: "flex", alignItems: "flex-end", padding: 12 }}>
      <div>
        <div style={{ color: "#fff", fontWeight: 800, fontSize: 14 }}>TheGrandEra Theme</div>
        <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 11 }}>Aesthetic Theme</div>
      </div>
    </div>
    <div style={{ borderRadius: 14, background: "rgba(255,201,193,0.25)", height: 75, display: "flex", alignItems: "flex-end", padding: 12 }}>
      <div style={{ color: "#fff", fontWeight: 700, fontSize: 13 }}>Luxe Theme</div>
    </div>
    <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
      {["Modern", "Dark"].map(t => (
        <span key={t} style={{ background: "rgba(255,255,255,0.18)", color: "#fff", fontSize: 10, fontWeight: 700, padding: "4px 10px", borderRadius: 999, letterSpacing: "0.04em" }}>{t}</span>
      ))}
    </div>
  </motion.div>
);

/* ── Burst particle ── */
const Particle = ({ x, y, color, dx, dy }) => (
  <motion.div
    initial={{ opacity: 1, scale: 0.5, x, y }}
    animate={{ opacity: 0, scale: 1.4, x: x + dx, y: y + dy }}
    transition={{ duration: 0.65, ease: "easeOut" }}
    style={{
      position: "absolute", width: 7, height: 7,
      borderRadius: "50%", background: color,
      pointerEvents: "none", zIndex: 20,
    }}
  />
);

/* ── Interactive Right Collage Panel ── */
const RightCollagePanel = ({ onPreviewClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [activeTheme, setActiveTheme] = useState(0);
  const [particles, setParticles] = useState([]);
  const [likeCount, setLikeCount] = useState(247);
  const [liked, setLiked] = useState(false);

  const previewThemes = [
    { name: "Veloura", sub: "Creative — Gradient", color: C.violet },
    { name: "Plexis", sub: "Developer — Dark", color: C.indigo },
    { name: "Luxe", sub: "Premium — Bold", color: "#e8a045" },
  ];

  /* cycle themes while hovered */
  useEffect(() => {
    if (!isHovered) return;
    const id = setInterval(() => setActiveTheme(p => (p + 1) % previewThemes.length), 1800);
    return () => clearInterval(id);
  }, [isHovered]);

  const spawnParticles = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    const colors = [C.mint, C.peach, C.lavender, C.violet, C.indigo, "#fff"];
    const newP = colors.map((color, i) => ({
      id: Date.now() + i, color,
      x: cx, y: cy,
      dx: (Math.random() - 0.5) * 70,
      dy: -(20 + Math.random() * 50),
    }));
    setParticles(p => [...p, ...newP]);
    setTimeout(() => setParticles(p => p.filter(px => !newP.find(n => n.id === px.id))), 800);
  };

  const handleLike = (e) => {
    e.stopPropagation();
    setLiked(prev => !prev);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
    spawnParticles(e);
  };

  const t = previewThemes[activeTheme];

  return (

    <motion.div
      initial={{ opacity: 0, y: 40, rotate: 3 }}
      animate={{ opacity: 1, y: 0, rotate: isHovered ? 1 : 3 }}
      transition={{ duration: isHovered ? 0.25 : 0.8, delay: isHovered ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.04 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={spawnParticles}
      style={{
        background: C.lavender, borderRadius: 24, padding: 24,
        width: 200, flexShrink: 0, cursor: "pointer",
        position: "relative", minHeight: 280, overflow: "hidden",
        boxShadow: isHovered
          ? `0 32px 80px rgba(203,159,210,0.6), 0 0 0 2px rgba(255,255,255,0.5)`
          : "0 24px 60px rgba(203,159,210,0.35)",
        transition: "box-shadow 0.3s",
      }}
    >
      {/* Particles */}
      {particles.map(p => <Particle key={p.id} x={p.x} y={p.y} color={p.color} dx={p.dx} dy={p.dy} />)}

      {/* Shimmer sweep on hover */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            key="shimmer"
            initial={{ x: -220, opacity: 0.6 }}
            animate={{ x: 280, opacity: 0 }}
            exit={{}}
            transition={{ duration: 0.55, ease: "easeIn" }}
            style={{
              position: "absolute", top: 0, bottom: 0, width: 80, zIndex: 1,
              background: "linear-gradient(105deg, transparent, rgba(255,255,255,0.35), transparent)",
              pointerEvents: "none",
            }}
          />
        )}
      </AnimatePresence>

      {/* Like button — top-left */}
      <motion.button
        onClick={handleLike}
        whileTap={{ scale: 0.8 }}
        style={{
          position: "absolute", top: 14, left: 14, zIndex: 10,
          background: liked ? "#ff4d6d" : "rgba(255,255,255,0.3)",
          border: "none", borderRadius: 999, padding: "4px 10px",
          display: "flex", alignItems: "center", gap: 4,
          cursor: "pointer", backdropFilter: "blur(6px)",
          transition: "background 0.2s",
        }}
      >
        <motion.span
          animate={liked ? { scale: [1, 1.6, 1] } : {}}
          transition={{ duration: 0.3 }}
          style={{ fontSize: 12, lineHeight: 1 }}
        >
          {liked ? "❤️" : "🤍"}
        </motion.span>
        <span style={{ color: liked ? "#fff" : "rgba(255,255,255,0.85)", fontSize: 10, fontWeight: 700 }}>
          {likeCount}
        </span>
      </motion.button>

      {/* LIVE badge — top-right, only on hover */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            key="live"
            initial={{ opacity: 0, scale: 0.6, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.6 }}
            style={{
              position: "absolute", top: 14, right: 14, zIndex: 10,
              background: C.mint, borderRadius: 999, padding: "3px 9px",
              display: "flex", alignItems: "center", gap: 4,
            }}
          >
            <motion.div
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ repeat: Infinity, duration: 0.9 }}
              style={{ width: 5, height: 5, borderRadius: "50%", background: "#fff" }}
            />
            <span style={{ color: "#fff", fontSize: 9, fontWeight: 800, letterSpacing: "0.06em" }}>LIVE</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Big display text — gently pulses on hover */}
      <motion.div
        style={{ marginTop: 28, fontWeight: 900, fontSize: 48, lineHeight: 0.9, color: "rgba(135,79,255,0.5)", letterSpacing: "-0.04em", textTransform: "uppercase", userSelect: "none", position: "relative", zIndex: 2 }}
        animate={isHovered ? { scale: [1, 1.03, 1] } : { scale: 1 }}
        transition={{ repeat: isHovered ? Infinity : 0, duration: 2 }}
      >
        FYX<br />Designs
      </motion.div>

      {/* Floating theme card — cycles + bounces faster on hover */}
      <motion.div
        animate={{ y: isHovered ? [0, -10, 0] : [0, -5, 0] }}
        transition={{ repeat: Infinity, duration: isHovered ? 1.6 : 3.2, ease: "easeInOut" }}
        onClick={(e) => { e.stopPropagation(); onPreviewClick?.(); }}
        style={{
          position: "absolute", bottom: 16, left: 12, right: 12,
          background: "#1a1a1a", borderRadius: 14, padding: "12px 14px",
          zIndex: 5, cursor: "pointer",
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTheme}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              {/* Color dot spins on hover */}
              <motion.div
                animate={isHovered ? { rotate: 360 } : { rotate: 0 }}
                transition={{ repeat: isHovered ? Infinity : 0, duration: 1.5, ease: "linear" }}
                style={{ width: 22, height: 22, borderRadius: 6, background: t.color, flexShrink: 0 }}
              />
              <div>
                <div style={{ color: "#fff", fontWeight: 700, fontSize: 12 }}>{t.name}</div>
                <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 10 }}>{t.sub}</div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
              {[C.mint, C.peach, C.lavender].map((c, i) => (
                <motion.div
                  key={i}
                  animate={isHovered ? { scale: [1, 1.35, 1] } : { scale: 1 }}
                  transition={{ delay: i * 0.12, duration: 0.5, repeat: isHovered ? Infinity : 0 }}
                  style={{ width: 14, height: 14, borderRadius: "50%", background: c }}
                />
              ))}
              <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 10, marginLeft: 4 }}>+9 themes</span>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* "Click to preview" hint — only on hover */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              style={{ overflow: "hidden" }}
            >
              <div style={{ marginTop: 8, paddingTop: 7, borderTop: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", gap: 5 }}>
                <Sparkles size={10} style={{ color: C.mint }} />
                <span style={{ color: C.mint, fontSize: 10, fontWeight: 700 }}>Click to preview →</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

/* ── Mobile preview strip ── */
const MobilePreviewStrip = () => (
  <div style={{ display: "flex", gap: 12, padding: "24px 24px 0", overflowX: "auto", scrollbarWidth: "none", WebkitOverflowScrolling: "touch", position: "relative", zIndex: 5 }}>
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
      style={{ background: C.indigo, borderRadius: 18, padding: 16, minWidth: 160, flexShrink: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <span style={{ color: "#fff", fontWeight: 800, fontSize: 13 }}>Discover</span>
      </div>
      <div style={{ borderRadius: 10, background: "rgba(255,255,255,0.15)", height: 72, display: "flex", alignItems: "flex-end", padding: 8, marginBottom: 6 }}>
        <span style={{ color: "#fff", fontWeight: 800, fontSize: 11 }}>TheGrandEra</span>
      </div>
      <div style={{ borderRadius: 10, background: "rgba(255,201,193,0.25)", height: 50, display: "flex", alignItems: "flex-end", padding: 8 }}>
        <span style={{ color: "#fff", fontWeight: 700, fontSize: 11 }}>Luxe Theme</span>
      </div>
    </motion.div>
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
      style={{ background: C.lavender, borderRadius: 18, padding: 16, minWidth: 140, flexShrink: 0, position: "relative", minHeight: 200 }}>
      <div style={{ fontWeight: 900, fontSize: 36, lineHeight: 0.9, color: "rgba(135,79,255,0.5)", letterSpacing: "-0.04em", textTransform: "uppercase" }}>FYX<br />Designs</div>
      <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
        style={{ position: "absolute", bottom: 12, left: 10, right: 10, background: "#1a1a1a", borderRadius: 10, padding: "10px 12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 18, height: 18, borderRadius: 5, background: C.violet, flexShrink: 0 }} />
          <div style={{ color: "#fff", fontWeight: 700, fontSize: 11 }}>Veloura</div>
        </div>
      </motion.div>
    </motion.div>
  </div>
);

const containerVar = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};
const fadeUp = {
  hidden: { y: 32, opacity: 0, filter: "blur(8px)" },
  visible: { y: 0, opacity: 1, filter: "blur(0px)", transition: { type: "spring", damping: 20, stiffness: 85 } },
};

const themeTags = ["Minimal", "Modern", "Developer", "Dark Mode", "Creative", "Student"];

/* ─────────────────────────────────────────────
   Main Component
   Props:
     searchTerm / setSearchTerm  — search state
     onBrowseThemes              — scroll to grid
     onPreviewFirst              — open first theme modal
───────────────────────────────────────────── */
const ThemesLandingHero = ({
  searchTerm = "",
  setSearchTerm = () => { },
  onBrowseThemes,
  onPreviewFirst,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const isMobile = useIsMobile(768);

  return (
    <div style={{
      position: "relative", overflow: "hidden",
      background: "#FAFAF8",
      borderBottomLeftRadius: isMobile ? 32 : 52,
      borderBottomRightRadius: isMobile ? 32 : 52,
      minHeight: "100svh",
      paddingTop: isMobile ? 72 : 130,
      paddingBottom: isMobile ? 48 : 80,
    }}>

      {/* Marquee BG */}
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", gap: "1.2rem", pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        <MarqueeRow direction="left" speed={32} />
        <MarqueeRow direction="right" speed={44} />
        <MarqueeRow direction="left" speed={38} />
      </div>

      {/* Desktop collage panels */}
      {!isMobile && (
        <div style={{ position: "absolute", right: -20, top: "50%", transform: "translateY(-52%)", display: "flex", gap: 20, alignItems: "center", pointerEvents: "all", zIndex: 5 }}>
          <LeftCollagePanel />
          <RightCollagePanel onPreviewClick={onPreviewFirst} />
        </div>
      )}

      {/* Main content */}
      <motion.div
        variants={containerVar} initial="hidden" animate="visible"
        style={{ position: "relative", zIndex: 10, maxWidth: isMobile ? "100%" : 680, paddingLeft: isMobile ? 24 : 72, paddingRight: isMobile ? 24 : 48 }}
      >

        {/* Headline */}
        <h1 style={{
          fontSize: isMobile ? "clamp(2rem, 10vw, 2.8rem)" : "clamp(2.8rem, 5vw, 4.6rem)",
          lineHeight: 1.08,
          letterSpacing: "-0.035em",
          color: "#0a0a0a",
          // ✅ Dynamic margin: 40px top for mobile, 0px top for desktop
          margin: isMobile ? "40px 0 20px" : "0 0 20px",
          fontFamily: "'Georgia', serif"
        }}>
          {["Discover", "Top", "Designs", "for", "Your", "Portfolio"].map((word, i) => (
            <motion.span key={i} variants={fadeUp} style={{ display: "inline-block", marginRight: "0.26em" }}>
              {word === "Designs" ? (
                <span
                  style={{
                    background: `linear-gradient(135deg, #5551ff 0%, #a374ff 50%, #874fff 100%)`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {word}
                </span>
              ) : word}
            </motion.span>
          ))}
        </h1>
        {/* Subtitle */}
        <motion.p variants={fadeUp} style={{ fontSize: isMobile ? 15 : 17, lineHeight: 1.7, color: "#666", maxWidth: isMobile ? "100%" : 500, margin: "0 0 32px", fontFamily: "-apple-system, sans-serif", fontWeight: 400 }}>
          Handcrafted templates for developers, designers, and students.
          Pick a theme and launch your portfolio in minutes.
        </motion.p>

        {/* Search */}
        <motion.div variants={fadeUp} style={{ maxWidth: isMobile ? "100%" : 560 }}>
          <motion.div
            animate={isFocused ? { scale: 1.015 } : { scale: 1 }}
            transition={{ type: "spring", stiffness: 280, damping: 24 }}
            style={{ display: "flex", alignItems: "center", gap: 10, background: "#fff", borderRadius: 999, padding: isMobile ? "11px 14px" : "13px 18px", border: isFocused ? `2px solid ${C.indigo}` : "2px solid #e8e8e8", boxShadow: isFocused ? `0 0 0 5px ${C.indigo}18` : "0 4px 20px rgba(0,0,0,0.05)", transition: "border-color 0.2s, box-shadow 0.2s" }}
          >
            <Search size={17} style={{ color: isFocused ? C.indigo : "#bbb", flexShrink: 0, transition: "color 0.2s" }} />
            <input type="text"
              placeholder={isMobile ? "Search themes…" : "Search themes — Minimal, Modern, Student..."}
              value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)}
              style={{ flex: 1, minWidth: 0, border: "none", outline: "none", fontSize: isMobile ? 13 : 14, color: "#111", background: "transparent", fontFamily: "-apple-system, sans-serif" }}
            />
            <div style={{ display: "flex", alignItems: "center", gap: 2, borderLeft: "1px solid #efefef", paddingLeft: 8 }}>
              {[<RefreshCcw size={14} />, <Filter size={14} />].map((icon, i) => (
                <button key={i} onClick={i === 0 ? () => setSearchTerm("") : undefined}
                  style={{ width: 30, height: 30, borderRadius: "50%", border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#bbb", transition: "background 0.15s, color 0.15s" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#f3f4f6"; e.currentTarget.style.color = "#555"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#bbb"; }}
                >{icon}</button>
              ))}
            </div>
          </motion.div>

          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 12 }}>
            {themeTags.map((tag, i) => (
              <motion.button key={tag} onClick={() => setSearchTerm(tag)}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 + i * 0.055 }}
                whileHover={{ scale: 1.07, y: -2 }} whileTap={{ scale: 0.96 }}
                style={{ padding: isMobile ? "5px 12px" : "6px 15px", borderRadius: 999, border: "1.5px solid #e5e5e5", background: "#fff", fontSize: 11, fontWeight: 700, color: "#555", cursor: "pointer", letterSpacing: "0.03em", fontFamily: "-apple-system, sans-serif", transition: "border-color 0.15s, color 0.15s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = C.indigo; e.currentTarget.style.color = C.indigo; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#e5e5e5"; e.currentTarget.style.color = "#555"; }}
              >{tag}</motion.button>
            ))}
          </div>
        </motion.div>

        {/* CTAs */}
        <motion.div variants={fadeUp} style={{ display: "flex", gap: 10, marginTop: isMobile ? 28 : 40, alignItems: "center", flexWrap: isMobile ? "wrap" : "nowrap" }}>
          {/* Browse Themes → scroll to grid */}
          <motion.button
            whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}
            onClick={onBrowseThemes}
            style={{ padding: isMobile ? "12px 26px" : "13px 30px", borderRadius: 999, background: "#0a0a0a", color: "#fff", border: "none", fontSize: isMobile ? 13 : 14, fontWeight: 700, cursor: "pointer", letterSpacing: "-0.01em", fontFamily: "-apple-system, sans-serif", boxShadow: "0 8px 28px rgba(0,0,0,0.2)", flexShrink: 0 }}
          >
            Browse Themes
          </motion.button>

          {/* See Live Previews → open first theme modal */}
          <motion.button
            whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}
            onClick={onPreviewFirst}
            style={{ padding: isMobile ? "12px 26px" : "13px 30px", borderRadius: 999, background: "transparent", color: "#0a0a0a", border: "2px solid #e0e0e0", fontSize: isMobile ? 13 : 14, fontWeight: 600, cursor: "pointer", fontFamily: "-apple-system, sans-serif", flexShrink: 0 }}
          >
            See Live Previews
          </motion.button>
        </motion.div>

        {/* Stats */}
        <motion.div variants={fadeUp} style={{ display: "flex", gap: 0, marginTop: isMobile ? 36 : 52, flexWrap: "wrap", rowGap: 16 }}>
          {[{ val: "12+", label: "Premium themes" }, { val: "10k+", label: "Portfolios live" }, { val: "Free", label: "To get started" }].map((s, i) => (
            <React.Fragment key={s.label}>
              {i > 0 && <div style={{ width: 1, background: "#e8e8e8", margin: "0 20px", alignSelf: "stretch", minHeight: 36 }} />}
              <div>
                <div style={{ fontSize: isMobile ? 20 : 24, fontWeight: 900, color: "#0a0a0a", lineHeight: 1, fontFamily: "Georgia, serif" }}>{s.val}</div>
                <div style={{ fontSize: 11, color: "#999", marginTop: 5, fontWeight: 600, fontFamily: "-apple-system, sans-serif", letterSpacing: "0.03em" }}>{s.label}</div>
              </div>
            </React.Fragment>
          ))}
        </motion.div>
      </motion.div>

      {isMobile && <MobilePreviewStrip />}

      {/* Color bar */}
      <motion.div
        initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
        transition={{ duration: 1.4, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, transformOrigin: "left", background: `linear-gradient(90deg, ${C.indigo}, ${C.violet}, ${C.lavender}, ${C.peach}, ${C.mint})` }}
      />
    </div>
  );
};

export default ThemesLandingHero;