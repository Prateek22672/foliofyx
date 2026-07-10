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
  const yWhite = useTransform(scrollY, [0, 1.5 * vh],  ["150vh", "0vh"],  { clamp: true });
  const yBento = useTransform(scrollY, [0, 9.5 * vh],  ["750vh", "0vh"],  { clamp: true });
  const yTalent= useTransform(scrollY, [0, 12.5 * vh], ["690vh", "0vh"],  { clamp: true });
  const yThemes= useTransform(scrollY,
    [0, 15.5 * vh, 18.5 * vh, 20.0 * vh],
    ["1500vh", "0vh", "0vh", "-100vh"],
    { clamp: true }
  );
  const yOutro = useTransform(scrollY,
    [0, 18.5 * vh, 20.0 * vh],
    ["100vh", "100vh", "-85vh"],
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
            onLogin={() => { setShowOfferPopup(false); navigate("/login"); }}
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
          Height must equal the last timeline keyframe (20 * vh of scroll) plus
          one viewport, or the page keeps scrolling after the outro settles —
          a dead zone where nothing moves. 20vh scroll + 100vh viewport = 2100vh. */}
      <div
        ref={containerRef}
        className="relative w-full bg-transparent overflow-x-hidden font-['Wix_Madefor_Text']"
        style={{ height: "2100vh" }}
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

        <motion.div style={{ position: "fixed", inset: 0, zIndex: 6, y: yOutro }} className="will-change-transform">
          <Outro handleNavigation={handleNavigation} />
        </motion.div>
      </div>
    </>
  );
};

export default Landing;