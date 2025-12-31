import React, { useEffect, useState } from "react";
import { usePortfolio } from "../../../../context/PortfolioContext";
import linkedinLogo from "../../../../assets/link.png";
import githubLogo from "../../../../assets/git.webp";
import DownArrow from "../../../../components/DownArrow";
import useFadeInOnScroll from "../../../../hooks/useFadeInOnScroll";

// fallback image (uploaded file path)
const FALLBACK_IMAGE = "/luxe.jpg";

const DEFAULT_BG = "#ffffff";
const DEFAULT_FG = "#111827";
const DEFAULT_ACCENT = "#6b46ff";

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

  // Muted text setup
  const muted = data.themeFont ? `${data.themeFont}99` : "#6b728099";

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden font-sans"
      style={{ background: bg, color: fg }}
    >
      {/* Center Content Wrapper */}
      <div
        className={`relative w-full max-w-7xl mx-auto flex z-10
          ${mobile 
            ? "flex-col items-center justify-center gap-6 pt-24 pb-20 px-6 text-center" 
            : "flex-row items-center gap-16 px-12"
          }
        `}
      >
        {/* Profile Image (Rounded Square) */}
        <div className={`fade-up slide-right sm:ml-20 shrink-0 ${mobile ? "order-1" : ""}`}>
          <div className="relative group">
             {/* Subtle shadow decoration behind image */}
             <div className="absolute inset-0 bg-current opacity-10 rounded-[2.5rem] blur-xl transform translate-y-4 translate-x-4"></div>
             
             <img
               src={data?.image || FALLBACK_IMAGE}
               alt="Profile"
               // CHANGED: rounded-[2.5rem] for Rounded Square look
               className={`relative object-cover shadow-2xl transition-transform duration-700 group-hover:scale-[1.02]
                 ${mobile ? "w-48 h-48 rounded-[2rem]" : "w-72 h-72 md:w-[400px] md:h-[450px] rounded-[2.5rem]"}
               `}
               style={{ border: `1px solid ${fg}20` }}
             />
          </div>
        </div>

        {/* Text Section */}
        <div className={`${mobile ? "flex flex-col items-center order-2 w-full" : "flex-grow"} slide-left`}>
          <div className="stagger flex flex-col items-center md:items-start">
            
            <p className="text-sm md:text-xl font-bold tracking-[0.25em] mb-3 md:mb-6 uppercase fade-up" style={{ color: muted }}>
              Hello, I’m
            </p>

            {/* Name Typography */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-[0.9] mb-3 md:mb-6 fade-up tracking-tighter text-center md:text-left">
              {data?.name || "Your Name"}
            </h1>

            <h2 className="text-lg md:text-3xl font-light mb-8 fade-up opacity-80" style={{ color: fg }}>
              {data?.role || "Creative Developer"}
            </h2>

            {/* Action Buttons (Decreased Size) */}
            <div className={`flex flex-wrap gap-4 fade-up mb-8 ${mobile ? "justify-center" : "justify-start"}`}>
              {data?.cvLink && (
                <a
                  href={data.cvLink}
                  target="_blank"
                  rel="noreferrer"
                  // CHANGED: Smaller padding (px-6 py-3), smaller text (text-xs)
                  className="px-6 py-3 rounded-full bg-black text-white text-xs md:text-sm font-bold uppercase tracking-widest shadow-lg hover:scale-105 transition-transform"
                  style={{ backgroundColor: fg, color: bg }}
                >
                  Download CV
                </a>
              )}

              <a
                href="#contact"
                // CHANGED: Smaller padding and text
                className="px-6 py-3 rounded-full border text-xs md:text-sm font-bold uppercase tracking-widest hover:bg-black/5 transition-colors"
                style={{ borderColor: fg, color: fg }}
              >
                Contact
              </a>
            </div>

            {/* Social Buttons (Rounded Style) */}
            <div className={`flex gap-4 fade-up ${mobile ? "justify-center" : "justify-start"}`}>
                {data?.linkedin && (
                  <a 
                    href={data.linkedin} 
                    target="_blank" 
                    rel="noreferrer"
                    className="w-12 h-12 flex items-center justify-center rounded-full border transition-all hover:-translate-y-1 hover:bg-black hover:border-black group"
                    style={{ borderColor: `${fg}30` }}
                  >
                    <img 
                      src={linkedinLogo} 
                      className="w-5 h-5 opacity-60 group-hover:opacity-100 rounded-2xl group-hover:invert transition-all" 
                      style={{ filter: mobile ? "none" : "" }}
                      alt="LinkedIn" 
                    />
                  </a>
                )}

                {data?.github && (
                  <a 
                    href={data.github} 
                    target="_blank" 
                    rel="noreferrer"
                    className="w-12 h-12 flex items-center justify-center rounded-full border transition-all hover:-translate-y-1 hover:bg-black hover:border-black group"
                    style={{ borderColor: `${fg}30` }}
                  >
                    <img 
                      src={githubLogo} 
                      className="w-5 h-5 opacity-60 group-hover:opacity-100 rounded-2xl group-hover:invert transition-all" 
                      alt="GitHub" 
                    />
                  </a>
                )}
            </div>

          </div>
        </div>
      </div>

      {/* Scroll Arrow (fade-up) */}
      <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 fade-up flex flex-col items-center gap-2 ${mobile ? "scale-75 bottom-6" : ""}`}>
        <span className="text-[10px] uppercase font-bold tracking-widest opacity-50">Scroll</span>
        <DownArrow targetId="about" />
      </div>

      {/* --- CORNER DECORATIONS (PHOTOGRAPH STYLE) --- */}
      {/* Kept exact borders, just adjusted positioning for mobile to not overlap text */}
      <div className="pointer-events-none z-0">
        <div className={`absolute left-6 top-6 md:left-8 md:top-8 w-16 h-16 md:w-24 md:h-24 rounded-tl-3xl border-t-4 border-l-4`} style={{ borderColor: fg }} />
        <div className={`absolute right-6 top-6 md:right-8 md:top-8 w-16 h-16 md:w-24 md:h-24 rounded-tr-3xl border-t-4 border-r-4`} style={{ borderColor: fg }} />
        <div className={`absolute left-6 bottom-6 md:left-8 md:bottom-8 w-16 h-16 md:w-24 md:h-24 rounded-bl-3xl border-b-4 border-l-4`} style={{ borderColor: fg }} />
        <div className={`absolute right-6 bottom-6 md:right-8 md:bottom-8 w-16 h-16 md:w-24 md:h-24 rounded-br-3xl border-b-4 border-r-4`} style={{ borderColor: fg }} />
      </div>

      {/* Vertical Left Name (Desktop Only) */}
      <p className="absolute rotate-90 writing-vertical-lr sm:-left-12  top-1/2 -translate-y-1/2 text-xs font-bold uppercase tracking-[0.2em] fade-up hidden md:block" style={{ color: muted }}>
        {data?.name ? `${data.name} — Portfolio` : "Portfolio"}
      </p>
    </section>
  );
};

export default Home;