import React, { useEffect, useState } from "react";
import { usePortfolio } from "../../../../context/PortfolioContext";
import linkedinLogo from "../../../../assets/link.png";
import githubLogo from "../../../../assets/git.webp";
import DownArrow from "../../../../components/DownArrow";
import useFadeInOnScroll from "../../../../hooks/useFadeInOnScroll";
import EditableText from "../EditableText";
import EditableImage from "../EditableImage";

const FALLBACK_IMAGE = "/themes/scene-john-wick-3-parabellum.webp"; 

const Home = ({ portfolioData: propData, isMobileView, isReadOnly }) => {
  useFadeInOnScroll();
  const { portfolioData: contextData, setPortfolioData } = usePortfolio();
  
  // Robust data merging: Prioritizes propData (Deployed) over contextData (Editor)
  const data = (propData && Object.keys(propData).length > 0) ? propData : (contextData || {});

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const mobile = isMobile || isMobileView;
  const bg = data.themeBg || "#f8f9fa";
  const fg = data.themeFont || "#111111";

  return (
    <section
      id="home"
      className="relative h-[100dvh] w-full flex items-center justify-center overflow-hidden font-[Switzer] transition-colors duration-500"
      style={{ backgroundColor: bg, color: fg }}
    >
      {/* ── BACKGROUND DECORATION ── */}
      <div className="absolute inset-0 w-full h-full -z-10 pointer-events-none overflow-hidden">
        <div 
          className="absolute top-[20%] right-[-10%] w-[80vw] h-[80vw] rounded-full opacity-60 mix-blend-multiply filter blur-[100px] animate-pulse-slow"
          style={{ 
            background: "radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, rgba(139, 92, 246, 0) 70%)",
            transform: "translateZ(0)"
          }}
        />
      </div>

      <div className="w-full max-w-[1400px] mx-auto px-6 sm:px-12 lg:px-20 h-full flex flex-col justify-center pt-10">
        <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center h-full max-h-[80vh]`}>
          
          {/* ── LEFT COLUMN: CONTENT ── */}
          <div className={`lg:col-span-7 flex flex-col justify-center ${mobile ? "items-center text-center order-2" : "items-start text-left order-1"} slide-left z-10`}>
            
            {/* Status Badge: Boutique scale */}
            <div 
              className="inline-block px-3 py-1 rounded-full border bg-white/10 backdrop-blur-md text-[9px] font-bold uppercase tracking-[0.2em] mb-6 fade-up opacity-60"
              style={{ borderColor: `${fg}30`, color: fg }}
            >
              <EditableText
                value={data?.statusBadge || "Available for work"}
                onChange={(val) => setPortfolioData({ ...data, statusBadge: val })}
                readOnly={isReadOnly}
              />
            </div>

            {/* Headline: Refined scaling */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-8 leading-[1.1] fade-up">
              <span className="block">
                <EditableText
                  value={data?.name?.split(" ")[0] || "Your"}
                  onChange={(val) => {
                    const lastName = data?.name?.split(" ").slice(1).join(" ") || "";
                    setPortfolioData({ ...data, name: `${val} ${lastName}` });
                  }}
                  readOnly={isReadOnly}
                />
              </span>
              <span className="block opacity-40 text-[0.85em]">
                <EditableText
                  value={data?.role || "Creative Dev"}
                  onChange={(val) => setPortfolioData({ ...data, role: val })}
                  readOnly={isReadOnly}
                />
              </span>
            </h1>
            
            <div className="flex flex-col gap-6 fade-up">
              {/* Actions */}
              <div className={`flex flex-wrap gap-3 ${mobile ? "justify-center" : "justify-start"}`}>
                <a href="#projects" className="px-6 py-3 rounded-full text-[11px] font-bold uppercase tracking-wider shadow-lg hover:scale-105 transition-all" style={{ backgroundColor: fg, color: bg }}>
                  View Work
                </a>
                
                {data?.cvLink && (
                  <a href={data.cvLink} target="_blank" rel="noreferrer" className="px-6 py-3 rounded-full border bg-white/10 backdrop-blur-md text-[11px] font-bold uppercase tracking-wider hover:bg-white/20 transition-all" style={{ borderColor: `${fg}30`, color: fg }}>
                    Resume
                  </a>
                )}
              </div>

              {/* Social Icons */}
              <div className={`flex gap-5 opacity-60 ${mobile ? "justify-center" : "justify-start"}`}>
                {data?.linkedin && (
                  <a href={data.linkedin} target="_blank" rel="noreferrer" className="hover:scale-110 hover:opacity-100 transition-all">
                    <img src={linkedinLogo} className="w-5 h-5 invert" alt="LinkedIn" />
                  </a>
                )}
                {data?.github && (
                  <a href={data.github} target="_blank" rel="noreferrer" className="hover:scale-110 hover:opacity-100 transition-all">
                    <img src={githubLogo} className="w-5 h-5 invert" alt="GitHub" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN: PROFILE IMAGE ── */}
          <div className={`lg:col-span-5 relative w-full h-full flex items-center justify-center lg:justify-end ${mobile ? "order-1 max-h-[40vh]" : "order-2"} fade-up slide-right z-20`}>
            <div className="relative w-full max-w-[380px] aspect-[4/5] flex items-center justify-center group">
              {/* Atmospheric Glow */}
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-500 to-blue-500 rounded-[2.5rem] blur-3xl opacity-20 scale-90 translate-y-4"></div>
              
              {/* Image Frame */}
              <div 
                className="relative w-[85%] h-[85%] rounded-[2rem] overflow-hidden border shadow-xl bg-white/5 backdrop-blur-sm transition-all duration-700" 
                style={{ borderColor: `${fg}20` }}
              >
                {/* 
                  HARD LOCK: Passing isReadOnly={isReadOnly} prevents the 
                  EditableImage from showing editing UI or allowing uploads 
                  on the deployed screen.
                */}
                <EditableImage
                  src={data?.image || FALLBACK_IMAGE}
                  onImageUpload={(url) => setPortfolioData({ ...data, image: url })}
                  isReadOnly={isReadOnly} 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

        </div>

        {/* ── FOOTER DETAILS ── */}
        <div className="absolute bottom-8 left-12 hidden lg:block opacity-30 text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: fg }}>
          Based in {data?.location || "India"} • Available Globally
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 fade-up animate-bounce hidden sm:block">
          <DownArrow targetId="about" color={`${fg}40`} />
        </div>
      </div>
    </section>
  );
};

export default Home;