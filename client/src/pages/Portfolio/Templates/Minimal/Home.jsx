import React, { useEffect, useState } from "react";
import { usePortfolio } from "../../../../context/PortfolioContext";
import linkedinLogo from "../../../../assets/link.png";
import githubLogo from "../../../../assets/git.webp";
import useFadeInOnScroll from "../../../../hooks/useFadeInOnScroll";
import EditableText from "../EditableText";
import EditableImage from "../EditableImage";

const FALLBACK_IMAGE = "/luxe.jpg";
const DEFAULT_BG = "#ffffff";
const DEFAULT_FG = "#111827";

const Home = ({ portfolioData: propData, isMobileView, isReadOnly }) => {
  useFadeInOnScroll();
  const { portfolioData: contextData, setPortfolioData } = usePortfolio();
  
  // Robust data merging: Prioritize propData for public view
  const data = (propData && Object.keys(propData).length > 0) ? propData : (contextData || {});

  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const mobile = isMobile || isMobileView;
  const bg = data.themeBg || DEFAULT_BG;
  const fg = data.themeFont || DEFAULT_FG;

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden font-sans transition-colors duration-500"
      style={{ background: bg, color: fg }}
    >
      {/* ── BACKGROUND DECORATION ── */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-[10%] left-[5%] w-[30vw] h-[30vw] rounded-full blur-[120px]" style={{ background: `${fg}05` }} />
      </div>

      <div className={`relative w-full max-w-[1440px] mx-auto flex z-10 
        ${mobile ? "flex-col gap-12 pt-32 pb-20 px-6 text-center" : "flex-row items-start justify-between px-16 lg:px-24"}`}
      >
        
        {/* ── LEFT COLUMN: REFINED SMALL DP ── */}
        <div className={`fade-up slide-right shrink-0 relative group ${mobile ? "mx-auto" : "w-1/3 pt-12"}`}>
           <div className="relative overflow-hidden rounded-2xl shadow-2xl border transition-all duration-700 hover:rounded-lg" style={{ borderColor: `${fg}15` }}>
              <EditableImage
                src={data?.image}
                fallbackSrc={FALLBACK_IMAGE}
                onImageUpload={(url) => setPortfolioData({ ...data, image: url })}
                isReadOnly={isReadOnly}
                // Reduced size from previous versions for a more "boutique" scale
                className={`${mobile ? "w-48 h-48" : "w-64 h-80"} object-cover transition-transform duration-1000 group-hover:scale-105`}
                alt="Profile Portrait"
              />
           </div>
           
           {/* Boutique Detail: Minimal Vertical text (Desktop Only) */}
           {!mobile && (
             <div className="absolute -left-12 top-24 -rotate-90 origin-center whitespace-nowrap">
               <span className="text-[9px] font-black uppercase tracking-[0.6em] opacity-20">
                 EST. {new Date().getFullYear()} — STUDIO
               </span>
             </div>
           )}
        </div>

        {/* ── RIGHT COLUMN: EDITORIAL CONTENT ── */}
        <div className={`${mobile ? "w-full" : "w-2/3 pl-20 lg:pl-32"} slide-left text-left`}>
          
          {/* Metadata Row */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-8 h-[1px] bg-current opacity-30" />
            <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-50">
              <EditableText 
                value={data.statusTag || "Available for collaboration"}
                onChange={(val) => setPortfolioData({ ...data, statusTag: val })}
                readOnly={isReadOnly}
              />
            </p>
          </div>

          {/* Large Hero Headline */}
          <h1 className="text-5xl md:text-8xl lg:text-9xl font-black leading-[0.82] mb-10 tracking-tighter uppercase italic">
            <EditableText 
              value={data.name || "PRATEEK K."}
              onChange={(val) => setPortfolioData({ ...data, name: val })}
              readOnly={isReadOnly}
            />
          </h1>

          {/* Bio / Role Combo */}
          <div className="max-w-xl mb-12">
            <h2 className="text-xl md:text-2xl font-medium mb-4 tracking-tight">
              <EditableText 
                value={data.role || "Full-Stack Software Engineer"}
                onChange={(val) => setPortfolioData({ ...data, role: val })}
                readOnly={isReadOnly}
              />
            </h2>
            <p className="text-sm md:text-base opacity-60 leading-relaxed font-medium">
              <EditableText 
                value={data.bio || "Architecting digital products with a focus on high-performance logic and minimal design aesthetics."}
                onChange={(val) => setPortfolioData({ ...data, bio: val })}
                readOnly={isReadOnly}
                multiline
              />
            </p>
          </div>

          {/* Actions & Socials */}
          <div className="flex flex-wrap items-center gap-10">
            <a 
              href="#projects" 
              className="px-10 py-4 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-xl transition-all hover:scale-105 active:scale-95" 
              style={{ backgroundColor: fg, color: bg }}
            >
              Selected Works
            </a>

            <div className="flex gap-5">
              {[ { link: data.linkedin, logo: linkedinLogo }, { link: data.github, logo: githubLogo } ].map((social, i) => (
                social.link && (
                  <a 
                    key={i} 
                    href={social.link} 
                    target="_blank" 
                    rel="noreferrer"
                    className="w-10 h-10 flex items-center justify-center rounded-full border border-current/10 transition-all hover:opacity-50"
                  >
                    <img src={social.logo} className="w-4 h-4 opacity-40" alt="Social Icon" />
                  </a>
                )
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Outer Frame */}
      <div className="absolute inset-10 pointer-events-none border border-current/5 rounded-3xl" />
    </section>
  );
};

export default Home;