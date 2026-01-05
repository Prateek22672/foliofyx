import React, { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSplash } from "../context/SplashContext";
import { AnimatePresence } from "framer-motion"; 

import Hero from "./sections/SectionHero";
import Talent from "./sections/SectionTalent";
import White from "./sections/SectionWhite";
import Blue from "./sections/SectionBlue";
import Themes from "./sections/SectionThemes";
import Outro from "./sections/SectionOutro";
import Bento from "./sections/SectionBento";
import TryMaxPopup from "../components/TryMaxPopup";

const Landing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showSplash } = useSplash();

  const [message, setMessage] = useState("");
  const [showOfferPopup, setShowOfferPopup] = useState(false); 
  const containerRef = useRef(null);
  const [vh, setVh] = useState(window.innerHeight);
  const [scrollProgress, setScrollProgress] = useState(0);

  const throttledSetScrollProgress = useCallback(
    (() => {
      let timeout;
      return (value) => {
        if (timeout) return;
        timeout = setTimeout(() => {
          setScrollProgress(value);
          timeout = null;
        }, 16);
      };
    })(),
    []
  );

  useEffect(() => {
    const onResize = () => setVh(window.innerHeight);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    let timer;
    if (!user) {
        timer = setTimeout(() => { setShowOfferPopup(true); }, 5000); 
    }
    return () => clearTimeout(timer);
  }, [user]);

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const progress = scrollY / vh;
      throttledSetScrollProgress(progress);
      if (containerRef.current) {
        containerRef.current.style.setProperty("--scroll", progress);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [vh, throttledSetScrollProgress]);

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

        <div
          ref={containerRef}
          className="relative w-full bg-transparent overflow-x-hidden font-['Wix_Madefor_Text']"
          // Increased height again to 2800vh for the extra delay
          style={{ height: "2800vh" }} 
        >
          {/* 1. HERO (z-1) */}
          <Hero message={message} handleNavigation={handleNavigation} />

          {/* 2. WHITE (z-2) - Starts at 1.5, Horizontal Scroll Ends at 5.5 */}
          <div style={{
            position: 'fixed', inset: 0, zIndex: 2,
            transform: `translateY(calc(max(0px, (1.5 - var(--scroll, 0)) * 100vh)))`
          }}>
            <White 
              handleNavigation={handleNavigation} 
              message={message} 
              scrollProgress={scrollProgress} 
            />
          </div>

          {/* 3. BENTO (z-3) - DELAYED TO 7.5 (2.0 unit buffer after White finishes) */}
          <div style={{
            position: 'fixed', inset: 0, zIndex: 3,
            transform: `translateY(calc(max(0px, (7.5 - var(--scroll, 0)) * 100vh)))` 
          }}>
            <Bento scrollProgress={scrollProgress} />
          </div>

          {/* 4. TALENT (z-4) - Pushed down relative to Bento */}
          <div style={{
            position: 'fixed', inset: 0, zIndex: 4,
            transform: `translateY(calc(max(0px, (11.5 - var(--scroll, 0)) * 60vh)))`
          }}>
            <Talent />
          </div>

          {/* 5. BLUE (z-5) */}
          <div style={{
            position: 'fixed', inset: 0, zIndex: 5,
            transform: `translateY(calc(max(0px, (12 - var(--scroll, 0)) * 100vh)))`
          }}>
            <Blue handleNavigation={handleNavigation} />
          </div>

          {/* 6. THEMES (z-6) */}
          <div style={{
            position: 'fixed', inset: 0, zIndex: 6,
            transform: `translateY(calc(max(0px, (19.5 - var(--scroll, 0)) * 100vh)))`
          }}>
            <Themes localScroll={Math.max(0, scrollProgress - 19.5)} handleNavigation={handleNavigation} />
          </div>

          {/* 7. OUTRO (z-7) */}
          <div style={{
            position: 'fixed', inset: 0, zIndex: 7,
            transform: `translateY(calc(max(-80vh, (23.5 - var(--scroll, 0)) * 100vh)))`
          }}>
            <Outro handleNavigation={handleNavigation} />
          </div>
        </div>
    </>
  );
};

export default Landing;