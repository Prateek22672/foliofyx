import React, { useEffect, useState, useRef } from "react";
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
import ScrollHUD from "./components/ScrollHUD"; // <--- IMPORT THIS

const Landing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showSplash } = useSplash();
  const [message, setMessage] = useState("");
  const [showOfferPopup, setShowOfferPopup] = useState(false);
  
  const [vh, setVh] = useState(typeof window !== "undefined" ? window.innerHeight : 900);

  useEffect(() => {
    const handleResize = () => setVh(window.innerHeight);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const containerRef = useRef(null);
  const { scrollY } = useScroll(); // Global scroll

  // Normalized progress 0 to 1 based on total container height
  // We use containerRef to measure total scrollable distance accurately
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const scrollProgressMV = useTransform(scrollY, (value) => value / vh);

  // --- SCROLL TIMELINE ---
  // WHITE: 0 -> 1.5
  const yWhite = useTransform(scrollY, [0, 1.5 * vh], ["150vh", "0vh"], { clamp: true });

  // BENTO: 0 -> 9.5
  const yBento = useTransform(scrollY, [0, 9.5 * vh], ["750vh", "0vh"], { clamp: true });

  // TALENT: 0 -> 12.5
  const yTalent = useTransform(scrollY, [0, 12.5 * vh], ["690vh", "0vh"], { clamp: true });

  // THEMES: 
  const yThemes = useTransform(scrollY, [0, 15.5 * vh, 18.5 * vh, 20.0 * vh], ["1500vh", "0vh", "0vh", "-100vh"], { clamp: true });

  // OUTRO: 
  const yOutro = useTransform(scrollY, [0, 18.5 * vh, 20.0 * vh], ["100vh", "100vh", "-85vh"], { clamp: true });

  useEffect(() => {
    let timer;
    if (!user) {
        timer = setTimeout(() => { setShowOfferPopup(true); }, 5000); 
    }
    return () => clearTimeout(timer);
  }, [user]);

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
        <AnimatePresence>
            {showOfferPopup && (
                <TryMaxPopup onClose={() => setShowOfferPopup(false)} onLogin={() => { setShowOfferPopup(false); navigate("/login"); }} />
            )}
        </AnimatePresence>

        {/* --- ADDED SCROLL HUD HERE --- */}
        {/* It sits fixed on top of everything, using mix-blend-mode to invert colors */}
        <ScrollHUD scrollYProgress={scrollYProgress} />

        <div
          ref={containerRef}
          className="relative w-full bg-transparent overflow-x-hidden font-['Wix_Madefor_Text']"
          style={{ height: "2200vh" }} 
        >
          <Hero message={message} handleNavigation={handleNavigation} />

          <motion.div style={{ position: 'fixed', inset: 0, zIndex: 2, y: yWhite }} className="will-change-transform">
            <White handleNavigation={handleNavigation} message={message} scrollProgress={scrollProgressMV} />
          </motion.div>

          <motion.div style={{ position: 'fixed', inset: 0, zIndex: 3, y: yBento }} className="will-change-transform">
            <Bento scrollProgress={scrollProgressMV} />
          </motion.div>

          <motion.div style={{ position: 'fixed', inset: 0, zIndex: 4, y: yTalent }} className="will-change-transform">
            <Talent />
          </motion.div>

          <motion.div style={{ position: 'fixed', inset: 0, zIndex: 5, y: yThemes }} className="will-change-transform">
            <Themes scrollProgress={scrollProgressMV} handleNavigation={handleNavigation} />
          </motion.div>

          <motion.div style={{ position: 'fixed', inset: 0, zIndex: 6, y: yOutro }} className="will-change-transform">
            <Outro handleNavigation={handleNavigation} />
          </motion.div>
        </div>
    </>
  );
};

export default Landing;