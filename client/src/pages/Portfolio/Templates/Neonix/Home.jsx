import React, { useEffect, useState } from "react";
import { usePortfolio } from "../../../../context/PortfolioContext";
import linkedinLogo from "../../../../assets/link.png";
import githubLogo from "../../../../assets/git.webp";
import DownArrow from "../../../../components/DownArrow";
import useFadeInOnScroll from "../../../../hooks/useFadeInOnScroll";

const FALLBACK_IMAGE = "/themes/scene-john-wick-3-parabellum.webp"; 
const DEFAULT_BG = "#f8f9fa";
const DEFAULT_FG = "#111111";

const Home = ({ portfolioData: propData, isMobileView }) => {
  useFadeInOnScroll();

  const { portfolioData: contextData } = usePortfolio();
  
  // ROBUST DATA MERGE: 
  // Prioritize propData (Public View), fall back to contextData (Edit View), then empty object.
  // We use Object.keys check to ensure we don't prefer an empty propData object over valid contextData.
  const data = (propData && Object.keys(propData).length > 0) ? propData : (contextData || {});

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const mobile = isMobile || isMobileView;
  
  // 1. Get Dynamic Colors from Data with strict fallbacks
  const bg = data.themeBg || DEFAULT_BG;
  const fg = data.themeFont || DEFAULT_FG;

  return (
    <>
      {/* MAIN SECTION - Applied Background Color directly here for stability */}
      <section
        id="home"
        className="relative h-[100dvh] w-full flex items-center justify-center overflow-hidden font-[Switzer] transition-colors duration-500"
        style={{ backgroundColor: bg, color: fg }}
      >
        
        {/* AURORA BLOBS - Kept absolute, but transparent so they sit on top of the bg color */}
        <div className="absolute inset-0 w-full h-full -z-10 pointer-events-none overflow-hidden">
          <div 
            className="absolute top-[20%] right-[-10%] w-[80vw] h-[80vw] rounded-full opacity-60 mix-blend-multiply filter blur-[100px] animate-pulse-slow"
            style={{ 
              background: "radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, rgba(139, 92, 246, 0) 70%)",
              transform: "translateZ(0)"
            }}
          />
          <div 
            className="absolute bottom-[10%] left-[-10%] w-[60vw] h-[60vw] rounded-full opacity-40 mix-blend-multiply filter blur-[120px]"
            style={{ 
              background: "radial-gradient(circle, rgba(167, 139, 250, 0.3) 0%, rgba(255, 255, 255, 0) 70%)",
            }}
          />
        </div>

        {/* CONTAINER */}
        <div className="w-full max-w-[1400px] mx-auto px-6 sm:px-12 lg:px-20 h-full flex flex-col justify-center pt-20">
          
          <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center h-full max-h-[85vh]`}>
            
            {/* --- LEFT COLUMN: CONTENT --- */}
            <div className={`flex flex-col justify-center ${mobile ? "items-center text-center order-2" : "items-start text-left order-1"} slide-left z-10`}>
              
              {/* Badge */}
              <div 
                className="inline-block px-4 py-1.5 rounded-full border bg-white/10 backdrop-blur-md text-[10px] sm:text-[10px] font-bold uppercase tracking-widest mb-8 fade-up opacity-60"
                style={{ borderColor: fg, color: fg }}
              >
                Available for work
              </div>

              {/* Headline */}
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-10 leading-[0.9] fade-up">
                <span className="block">{data?.name || "Your Name"}</span>
                <span className="block opacity-50" style={{ color: fg }}>
                   {data?.role || "Creative Dev"}
                </span>
              </h1>
              
              {/* Action Group */}
              <div className="flex flex-col gap-8 fade-up">
                
                {/* Buttons */}
                <div className={`flex flex-wrap gap-4 ${mobile ? "justify-center" : "justify-start"}`}>
                  <a
                    href="#projects"
                    className="px-8 py-3.5 rounded-full text-sm font-bold shadow-xl hover:scale-105 transition-transform duration-300 tracking-wide"
                    // PRIMARY BUTTON: Inverts colors
                    style={{ backgroundColor: fg, color: bg }}
                  >
                    View Work
                  </a>
                  
                  {data?.cvLink && (
                    <a
                      href={data.cvLink}
                      target="_blank"
                      rel="noreferrer"
                      className="px-8 py-3.5 rounded-full border bg-white/10 backdrop-blur-md text-sm font-bold hover:bg-white/20 transition-all duration-300"
                      // SECONDARY BUTTON: Uses Theme Color
                      style={{ borderColor: fg, color: fg }}
                    >
                      Resume
                    </a>
                  )}
                </div>

                {/* Social Icons */}
                <div className={`flex gap-6 ml-10 opacity-90 ${mobile ? "justify-center" : "justify-start"}`}>
                  {data?.linkedin && (
                    <a href={data.linkedin} target="_blank" rel="noreferrer" className="hover:scale-110 hover:opacity-100 transition-all">
                      <img src={linkedinLogo} className="w-6 h-6 rounded-4xl" alt="LinkedIn" />
                    </a>
                  )}
                  {data?.github && (
                    <a href={data.github} target="_blank" rel="noreferrer" className="hover:scale-110 hover:opacity-100 transition-all">
                      <img src={githubLogo} className="w-6 h-6 rounded-4xl" alt="GitHub" />
                    </a>
                  )}
                </div>

              </div>
            </div>

            {/* --- RIGHT COLUMN: IMAGE --- */}
            <div className={`relative w-full h-full flex items-center justify-center lg:justify-end ${mobile ? "order-1 max-h-[45vh]" : "order-2"} fade-up slide-right z-20`}>
               
               {/* Image Card */}
               <div className="relative w-full max-w-[420px] aspect-[4/5] flex items-center justify-center group">
                  {/* Glow */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-purple-500 to-blue-500 rounded-[3rem] blur-3xl opacity-30 group-hover:opacity-50 transition-opacity duration-500 scale-90 translate-y-4"></div>
                  
                  {/* Image Frame */}
                  <div 
                    className="relative w-[85%] h-[85%] rounded-[2.5rem] overflow-hidden border shadow-2xl bg-white/10 backdrop-blur-sm transform transition-transform duration-700 hover:scale-[1.02]"
                    style={{ borderColor: `${fg}40` }}
                  >
                    <img
                       src={data?.image || FALLBACK_IMAGE}
                       className="w-full h-full object-cover"
                       alt="Profile"
                    />
                  </div>
               </div>
            </div>

          </div>

          {/* ABSOLUTE FOOTER ELEMENTS */}
          <div 
            className="sm:absolute bottom-1 left-0 sm:left-65 text-[10px] sm:text-xs font-bold uppercase tracking-widest fade-up hidden lg:block opacity-40"
            style={{ color: fg }}
          >
             Based in {data?.location || "India"} <br/>
             Let's work together
          </div>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 fade-up animate-bounce hidden sm:block">
            <DownArrow targetId="about" color={fg} />
          </div>

        </div>
      </section>
    </>
  );
};

export default Home;