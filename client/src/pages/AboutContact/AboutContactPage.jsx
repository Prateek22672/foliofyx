import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

// Components
import StudioHeroSection from "./components/StudioHeroSection";
import ManifestoSection from "./components/ManifestoSection";
import FounderSection from "./components/FounderSection";
import ContactSection from "./components/ContactSection";
import FAQFooterSection from "./components/FAQFooterSection";

const AboutContactPage = () => {
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
      {/* Sticky sections stack in DOM order — keep this sequence. */}
      {/* 0. HERO: Base Layer */}
      <StudioHeroSection navigate={navigate} />

      {/* 1. MANIFESTO: slides over the hero */}
      <ManifestoSection />

      {/* 2. FOUNDER: slides over the manifesto */}
      <FounderSection onScrollToContact={handleScrollToContact} />

      {/* 3. CONTACT: slides over the founder */}
      <ContactSection />

      {/* 4. FOOTER: Slides over Contact (z-40) */}
      <FAQFooterSection />
    </div>
  );
};

export default AboutContactPage;