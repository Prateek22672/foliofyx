import React from "react";
import { usePortfolio } from "../../../../context/PortfolioContext";
import DownArrow from "../../../../components/DownArrow";
import useFadeInOnScroll from "../../../../hooks/useFadeInOnScroll";
import EditableText from "../EditableText";

const About = ({ portfolioData: propData, isReadOnly }) => {
  const { portfolioData: contextData, setPortfolioData } = usePortfolio();
  const data = propData || contextData || {};
  useFadeInOnScroll();

  const bg = data.themeBg || "#ffffff";
  const fg = data.themeFont || "#111827";
  const accent = data.accentColor || "#D97706";
  const borderColor = `${fg}15`;

  // Safe Skills logic
  const rawSkills = Array.isArray(data.skills) ? data.skills : [];
  const safeSkills = rawSkills.map(s => (typeof s === 'string' ? s : s?.name)).filter(Boolean);

  return (
    <section
      id="about"
      className="relative min-h-screen flex flex-col overflow-hidden"
      style={{ backgroundColor: bg, color: fg, borderBottom: `1px solid ${borderColor}` }} 
    >
      <div className="flex-grow grid md:grid-cols-12 h-full">
        
        {/* LEFT COL: Sticky Title (Span 5) */}
        <div className="md:col-span-5 p-8 md:p-20 border-b md:border-b-0 md:border-r" style={{ borderColor: borderColor }}>
            <div className="sticky top-40 fade-up">
              <span className="text-xs font-black uppercase tracking-[0.4em] opacity-30 mb-6 block">01 / Profile</span>
              <h2 className="text-6xl md:text-8xl font-black uppercase leading-[0.8] tracking-tighter">
                Self<br/>
                <span style={{ color: accent }}>Taught.</span>
              </h2>
            </div>
        </div>

        {/* RIGHT COL: Content (Span 7) */}
        <div className="md:col-span-7 p-8 md:p-20 flex flex-col justify-center">
          
          {/* Bio */}
          <div className="mb-20 fade-up">
            <h3 className="text-xs font-black mb-8 uppercase tracking-[0.3em] opacity-40">The Narrative</h3>
            <div className="text-2xl md:text-4xl leading-tight font-bold tracking-tight">
              <EditableText
                value={data.bio || "Crafting digital systems with a focus on usability."}
                onChange={(val) => setPortfolioData({ ...data, bio: val })}
                readOnly={isReadOnly}
                multiline
              />
            </div>
          </div>

          {/* Info Blocks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 fade-up">
            
            {/* Education Block */}
            <div className="pt-10 border-t" style={{ borderColor: borderColor }}>
               <h4 className="text-xs font-black uppercase tracking-widest mb-4 opacity-40">Academic Path</h4>
               <div className="text-xl font-bold uppercase">
                 <EditableText
                    value={data.education || "University of Arts"}
                    onChange={(val) => setPortfolioData({ ...data, education: val })}
                    readOnly={isReadOnly}
                 />
               </div>
            </div>

            {/* Experience Block */}
            <div className="pt-10 border-t" style={{ borderColor: borderColor }}>
               <h4 className="text-xs font-black uppercase tracking-widest mb-4 opacity-40">Status</h4>
               <div className="text-xl font-bold uppercase">
                 <EditableText
                    value={data.experienceSummary || "Available for Hire"}
                    onChange={(val) => setPortfolioData({ ...data, experienceSummary: val })}
                    readOnly={isReadOnly}
                 />
               </div>
            </div>

            {/* Skills Block (Dynamic) */}
            <div className="md:col-span-2 pt-10 border-t" style={{ borderColor: borderColor }}>
               <h4 className="text-xs font-black uppercase tracking-widest mb-6 opacity-40">Selected Stack</h4>
               <div className="flex flex-wrap gap-3">
                  {safeSkills.map((name, i) => (
                    <span 
                      key={i} 
                      className="px-6 py-3 border-2 rounded-full text-xs font-black uppercase tracking-widest transition-colors hover:bg-current hover:text-white" 
                      style={{ borderColor: borderColor }}
                    >
                      {name}
                    </span>
                  ))}
               </div>
            </div>
          </div>

          <div className="mt-24">
             <DownArrow targetId="experience" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;