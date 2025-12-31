import React, { useEffect, useState } from "react";
import { usePortfolio } from "../../../../context/PortfolioContext";
import linkedinLogo from "../../../../assets/link.png";
import githubLogo from "../../../../assets/git.webp";
import DownArrow from "../../../../components/DownArrow";
import useFadeInOnScroll from "../../../../hooks/useFadeInOnScroll";

// A clean, professional default placeholder image (Man in suit from previous request)
const FALLBACK_IMAGE = "/themes/john-wick-4-and-5-confirmed-by-lionsgate-and-will-shoot-back-to-back-next-year-social.webp";

const DEFAULT_BG = "#ffffff";
const DEFAULT_FG = "#111827";
// UPDATED COLOR: A warm, versatile amber/gold that works on light and dark backgrounds.
const DEFAULT_ACCENT = "#D97706"; 

const Home = ({ portfolioData: propData, isMobileView }) => {
  useFadeInOnScroll();

  const { portfolioData: contextData } = usePortfolio();
  const data = propData || contextData || {};

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const mobile = isMobile || isMobileView;

  // THEME COLORS
  const bg = data.themeBg || DEFAULT_BG;
  const fg = data.themeFont || DEFAULT_FG;
  const accent = data.accentColor || DEFAULT_ACCENT;

  // Muted text must adjust to theme font (soft)
  const muted = data.themeFont ? `${data.themeFont}99` : "#6b728099";
  const borderColor = `${fg}20`;

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col pt-16"
      style={{ background: bg, color: fg, borderBottom: `1px solid ${borderColor}` }}
    >
      {/* GRID LAYOUT 
        - Left: Name
        - Right: Role, Image, Details
      */}
      <div className="flex-grow grid md:grid-cols-2 h-full items-center">
        
        {/* LEFT COLUMN: Name */}
        <div className="relative flex flex-col justify-center px-8 md:px-16 mt-0 sm:-mt-100 py-12 md:py-20 fade-up">
           <p className="text-lg md:text-xl font-bold tracking-widest mb-6 uppercase" style={{ color: muted }}>
             Hello, I'am
           </p>
           
           {/* Big, Clean Font */}
           <h1 className="text-7xl md:text-9xl font-extrabold leading-none tracking-tighter">
             {data?.name?.split(" ")[0] || "Your"}
             <br />
             <span style={{ color: accent }}>
                {data?.name?.split(" ").slice(1).join(" ") || "Name"}
             </span>
           </h1>
        </div>

        {/* RIGHT COLUMN: Role & Details */}
        <div 
          className="flex flex-col justify-center px-8 md:px-16 py-12 md:py-20 gap-10"
          style={{ borderLeft: mobile ? "none" : `1px solid ${borderColor}` }}
        >
          {/* Image - SIGNIFICANTLY INCREASED SIZE */}
          <div className="fade-up slide-left">
             <img
               // LOGIC: Uses data.image if available, otherwise uses FALLBACK_IMAGE
               src={data?.image || FALLBACK_IMAGE}
               // Updated size classes for much larger image
               className="w-64 h-64 md:w-[450px] md:h-[450px] object-cover rounded-2xl border-2 shadow-lg"
               style={{ borderColor: accent }}
               alt="Profile"
             />
          </div>

          <div className="stagger slide-left">
            {/* Increased Font Size for Role */}
            <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              {data?.role || "Web Developer"}
            </h2>

            {/* Increased Font Size for Bio */}
            <p className="max-w-xl text-xl md:text-2xl leading-relaxed mb-10" style={{ color: muted }}>
              {data?.bio ? data.bio.slice(0, 120) + "..." : "Crafting digital experiences with focus, precision, and modern aesthetics."}
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap gap-6">
               {data?.cvLink && (
                <a
                  href={data.cvLink}
                  target="_blank"
                  rel="noreferrer"
                  className="px-10 py-4 text-base md:text-lg font-bold hover:opacity-90 transition rounded-md shadow-sm"
                  style={{ backgroundColor: accent, color: bg }} 
                >
                  Download CV
                </a>
              )}
               <a
                href="#contact"
                className="px-10 py-4 border-2 text-base md:text-lg font-bold hover:bg-black/5 transition rounded-md"
                style={{ borderColor: fg, color: fg }}
              >
                Contact Me
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Social Icons (Absolute Bottom Right) */}
      <div className={`absolute bottom-8 right-8 flex gap-6 fade-up ${mobile ? "hidden" : ""}`}>
        {data?.linkedin && (
          <a href={data.linkedin} target="_blank" rel="noreferrer">
             <img src={linkedinLogo} className="w-8 h-8 opacity-60 hover:opacity-100 transition" alt="LI" />
          </a>
        )}
        {data?.github && (
          <a href={data.github} target="_blank" rel="noreferrer">
             <img src={githubLogo} className="w-8 h-8 opacity-60 hover:opacity-100 transition" alt="GH" />
          </a>
        )}
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 fade-up">
        <DownArrow targetId="about" />
      </div>
    </section>
  );
};

export default Home;