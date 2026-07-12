import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSplash } from "../context/SplashContext";
import { AnimatePresence, useScroll, useTransform, motion } from "framer-motion";

import Hero from "./sections/SectionHero";
import Talent from "./sections/SectionTalent";
import White from "./sections/SectionWhite";
import Themes from "./sections/SectionThemes";
import Outro from "./sections/SectionOutro";
import Bento from "./sections/SectionBento";
import TryMaxPopup from "../components/TryMaxPopup";
import ScrollHUD from "./components/ScrollHUD";
import LandingTutorial from "./components/LandingTutorial";

const Landing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showSplash } = useSplash();
  const [message, setMessage] = useState("");

  // ── TryMaxPopup is LOCKED until tutorialDone flips true ──────────────────
  const [showOfferPopup, setShowOfferPopup] = useState(false);
  const [tutorialDone, setTutorialDone] = useState(false);

  const [vh, setVh] = useState(
    typeof window !== "undefined" ? window.innerHeight : 900
  );

  useEffect(() => {
    const onResize = () => setVh(window.innerHeight);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const containerRef = useRef(null);
  const { scrollY } = useScroll();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const scrollProgressMV = useTransform(scrollY, (v) => v / vh);

  // ── SCROLL TIMELINE ──────────────────────────────────────────────────────
  // The hero lives in normal document flow, so it scrolls away 1:1 with the
  // page. White MUST track that exit exactly ([0, 1] at 1:1 speed) or the
  // black app background peeks through between hero bottom and White top.
  // After that, sections are sequential: each slides in over 2 viewport-
  // scrolls above the previous (pinned) one, then dwells so its content and
  // internal animations fully play out before the next section starts.
  // Units are viewport-heights of scroll.
  //
  //   hero+white  0 – 1    (1:1 — feels like native scrolling into White)
  //   white strip 1.5 – 8.5 horizontal cards (SectionWhite)
  //   bento       9 – 11 in, dwell → 13
  //   talent     13 – 15 in, dwell → 17
  //   themes     17 – 19 in, internals 19 – 20, dwell → 21
  //   outro      21 – 23 in, 23 – 25.5 footer reveal (measured), end 26
  //
  // Container height below must stay = 100vh + (end × 100vh) = 2700vh.
  // SectionWhite/SectionThemes internal ranges and ScrollHUD breaks reference
  // these numbers — keep them in sync.
  // Parked position is 110vh (not 100vh): Bento (-mt-60px), Talent (-mt-10)
  // and Themes' rotated marquee all paint slightly ABOVE their own top edge,
  // so a section parked exactly at the viewport bottom leaks a dark band into
  // the section before it. The extra 10vh keeps every overhang hidden until
  // the section's own window. White stays at exactly 100vh — it must remain
  // glued to the hero's bottom edge (no overhang, 1:1 hand-off).
  const yWhite = useTransform(scrollY, [0, 1 * vh],       ["100vh", "0vh"], { clamp: true });
  const yBento = useTransform(scrollY, [9 * vh, 11 * vh], ["110vh", "0vh"], { clamp: true });
  const yTalent= useTransform(scrollY, [13 * vh, 15 * vh],["110vh", "0vh"], { clamp: true });
  const yThemes= useTransform(scrollY, [17 * vh, 19 * vh],["110vh", "0vh"], { clamp: true });

  // Outro slides in, then keeps travelling upward by exactly the measured
  // overflow (footer height) — no magic constants, correct on every viewport.
  const outroRef = useRef(null);
  const [outroExtraVh, setOutroExtraVh] = useState(85); // fallback until measured
  useEffect(() => {
    const el = outroRef.current;
    if (!el) return;
    const measure = () => {
      const overflow = el.scrollHeight - window.innerHeight;
      setOutroExtraVh(Math.max(0, (overflow / window.innerHeight) * 100));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const yOutro = useTransform(
    scrollY,
    [21 * vh, 23 * vh, 25.5 * vh],
    ["110vh", "0vh", `-${outroExtraVh}vh`],
    { clamp: true }
  );

  // ── TryMaxPopup: starts ONLY after tutorial dismissed / already seen ──────
  useEffect(() => {
    if (!tutorialDone) return; // ← hard gate
    if (user) return;          // ← logged-in users don't see it

    const timer = setTimeout(() => setShowOfferPopup(true), 5000);
    return () => clearTimeout(timer);
  }, [tutorialDone, user]);

  // Callback passed to LandingTutorial
  const handleTutorialFinished = useCallback(() => {
    setTutorialDone(true);
  }, []);

  const handleNavigation = (path, msg = "Loading...") => {
    if (!user) {
      setMessage("Please log in to continue");
      setTimeout(() => {
        setMessage("");
        showSplash(2000, () => navigate("/login"), "Redirecting to login...");
      }, 1200);
      return;
    }
    showSplash(2000, () => navigate(path), msg);
  };

  return (
    <>
      {/* TryMaxPopup — never renders during or before tutorial */}
      <AnimatePresence>
        {showOfferPopup && (
          <TryMaxPopup
            onClose={() => setShowOfferPopup(false)}
            onLogin={() => {
              setShowOfferPopup(false);
              // Best-UX flow for the Max offer: log in first (the student
              // check runs on the account email), then land directly on the
              // Benefits page with the student-verification modal open.
              sessionStorage.setItem("fyx_post_login", "/Benefits");
              sessionStorage.setItem("fyx_student_intent", "1");
              navigate("/login");
            }}
          />
        )}
      </AnimatePresence>

      {/* Tutorial — mounts immediately, shows after 1.8s delay internally */}
      <LandingTutorial
        onNavigate={(path) => handleNavigation(path)}
        onFinished={handleTutorialFinished}
      />

      {/* ScrollHUD */}
      <ScrollHUD scrollYProgress={scrollYProgress} />

      {/* Main scroll container.
          Height must equal the timeline end (26 viewport-scrolls) plus one
          viewport, or the page keeps scrolling after the outro settles —
          a dead zone where nothing moves. 26×100vh + 100vh = 2700vh. */}
      <div
        ref={containerRef}
        className="relative w-full bg-transparent overflow-x-hidden font-['Wix_Madefor_Text']"
        style={{ height: "2700vh" }}
      >
        <Hero message={message} handleNavigation={handleNavigation} />

        <motion.div style={{ position: "fixed", inset: 0, zIndex: 2, y: yWhite }} className="will-change-transform">
          <White handleNavigation={handleNavigation} message={message} scrollProgress={scrollProgressMV} />
        </motion.div>

        <motion.div style={{ position: "fixed", inset: 0, zIndex: 3, y: yBento }} className="will-change-transform">
          <Bento scrollProgress={scrollProgressMV} />
        </motion.div>

        <motion.div style={{ position: "fixed", inset: 0, zIndex: 4, y: yTalent }} className="will-change-transform">
          <Talent />
        </motion.div>

        <motion.div style={{ position: "fixed", inset: 0, zIndex: 5, y: yThemes }} className="will-change-transform">
          <Themes scrollProgress={scrollProgressMV} handleNavigation={handleNavigation} />
        </motion.div>

        <motion.div ref={outroRef} style={{ position: "fixed", inset: 0, zIndex: 6, y: yOutro }} className="will-change-transform">
          <Outro handleNavigation={handleNavigation} />
        </motion.div>
      </div>
    </>
  );
};

export default Landing;