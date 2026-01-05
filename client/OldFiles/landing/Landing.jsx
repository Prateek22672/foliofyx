// src/pages/Landing.jsx

import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSplash } from "../context/SplashContext";
import { AnimatePresence } from "framer-motion"; // Import AnimatePresence

// ... existing imports (Hero, Talent, etc.)
import Hero from "./sections/SectionHero";
import Talent from "./sections/SectionTalent";
import White from "./sections/SectionWhite";
import Blue from "./sections/SectionBlue";
import Themes from "./sections/SectionThemes";
import Outro from "./sections/SectionOutro";
import Bento from "./sections/SectionBento";

// ✅ Import the new Popup
import TryMaxPopup from "../components/TryMaxPopup";

const Landing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showSplash } = useSplash();

  const [message, setMessage] = useState("");
  const [showOfferPopup, setShowOfferPopup] = useState(false); // ✅ State for popup
  const containerRef = useRef(null);
  const [vh, setVh] = useState(window.innerHeight);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const onResize = () => setVh(window.innerHeight);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // ✅ Trigger Popup after 5 seconds if user is NOT logged in
  useEffect(() => {
    let timer;
    if (!user) {
        timer = setTimeout(() => {
            setShowOfferPopup(true);
        }, 5000); // 5000ms = 5 seconds
    }
    return () => clearTimeout(timer);
  }, [user]);

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const progress = scrollY / vh;
      setScrollProgress(progress);

      if (containerRef.current) {
        containerRef.current.style.setProperty("--scroll", progress);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [vh]);

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
        {/* ✅ Render Popup with Animation */}
        <AnimatePresence>
            {showOfferPopup && (
                <TryMaxPopup 
                    onClose={() => setShowOfferPopup(false)} 
                    onLogin={() => {
                        setShowOfferPopup(false);
                        navigate("/login");
                    }} 
                />
            )}
        </AnimatePresence>

        <div
          ref={containerRef}
          className="relative w-full bg-transparent overflow-x-hidden font-['Wix_Madefor_Text']"
          style={{ height: "2600vh" }}
        >
          {/* 1. HERO (z-1) */}
          <Hero message={message} handleNavigation={handleNavigation} />

          {/* 2. BENTO (z-2) */}
          <div style={{
            position: 'fixed', inset: 0, zIndex: 2,
            transform: `translateY(calc(max(0px, (1 - var(--scroll, 0)) * 100vh)))`
          }}>
            <Bento scrollProgress={scrollProgress} />
          </div>

          {/* 3. TALENT (z-3) Starts at 7.5 */}
          <div style={{
            position: 'fixed', inset: 0, zIndex: 3,
            transform: `translateY(calc(max(0px, (7.5 - var(--scroll, 0)) * 100vh)))`
          }}>
            <Talent />
          </div>

          {/* 4. WHITE (z-4) Starts at 9.5 */}
          <div style={{
            position: 'fixed', inset: 0, zIndex: 4,
            transform: `translateY(calc(max(0px, (9.5 - var(--scroll, 0)) * 100vh)))`
          }}>
            <White handleNavigation={handleNavigation} message={message} />
          </div>

          {/* 5. BLUE (z-5) */}
          <div style={{
            position: 'fixed', inset: 0, zIndex: 5,
            transform: `translateY(calc(max(0px, (13.5 - var(--scroll, 0)) * 100vh)))`
          }}>
            <Blue handleNavigation={handleNavigation} />
          </div>

          {/* 6. THEMES (z-6) Moved to 15.5 */}
          <div style={{
            position: 'fixed', inset: 0, zIndex: 6,
            transform: `translateY(calc(max(0px, (15.5 - var(--scroll, 0)) * 100vh)))`
          }}>
            <Themes localScroll={Math.max(0, scrollProgress - 15.5)} />
          </div>

          {/* 7. OUTRO (z-7) Moved to 19.5 */}
          <div style={{
            position: 'fixed', inset: 0, zIndex: 7,
            transform: `translateY(calc(max(-60vh, (19.5 - var(--scroll, 0)) * 150vh)))`
          }}>
            <Outro handleNavigation={handleNavigation} />
          </div>
        </div>
    </>
  );
};

export default Landing;