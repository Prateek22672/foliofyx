import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSplash } from "../../context/SplashContext";

// Components
import StudioHeroSection from "./components/StudioHeroSection";
import ManifestoSection from "./components/ManifestoSection";
import FounderSection from "./components/FounderSection";
import ContactSection from "./components/ContactSection";
import FAQFooterSection from "./components/FAQFooterSection";

const AboutContactPage = () => {
  const { showSplash } = useSplash();
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [vh, setVh] = useState(window.innerHeight);

  useEffect(() => {
    const onResize = () => setVh(window.innerHeight);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Optional: Keep this strictly for the Hero fade-out effect
  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      // Calculate progress roughly for the first screen height only
      const progress = Math.min(scrollY / vh, 2); 
      if (containerRef.current) {
        containerRef.current.style.setProperty("--scroll", progress);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [vh]);

  const handleScrollToContact = () => {
    // Simple smooth scroll to the bottom area
    const contactSection = document.getElementById("contact-section");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-black font-['Wix_Madefor_Text']"
      // Removed fixed height. Let content dictate height.
    >
      {/* 0. HERO: Base Layer (z-0) */}
      <StudioHeroSection navigate={navigate} />

            {/* 2. FOUNDER: Slides over Manifesto (z-20) */}
      <FounderSection onScrollToContact={handleScrollToContact} />

      {/* 1. MANIFESTO: Slides over Hero (z-10) */}
      <ManifestoSection />


      {/* 3. CONTACT: Slides over Founder (z-30) */}
      <ContactSection showSplash={showSplash} />

      {/* 4. FOOTER: Slides over Contact (z-40) */}
      <FAQFooterSection />
    </div>
  );
};

export default AboutContactPage;