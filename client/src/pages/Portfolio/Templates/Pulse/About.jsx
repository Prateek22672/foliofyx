// src/pages/Portfolio/Templates/Pulse/About.jsx

import React from "react";
import useFadeInOnScroll from "../../../../hooks/useFadeInOnScroll";
import { usePortfolio } from "../../../../context/PortfolioContext";
import EditableText from "../EditableText"; 

/**
 * Pulse Template: About Component
 * Refined for boutique studio aesthetics and full editability.
 */
const About = ({ portfolioData: propData, isReadOnly }) => {
  const { portfolioData: contextData, setPortfolioData } = usePortfolio();
  
  // Priority: Prop Data > Context Data > Empty Object
  const data = propData || contextData || {};
  useFadeInOnScroll();

  // Theme & Styles derived from portfolio data
  const bg = data.themeBg || "#0a0a0a";
  const fg = data.themeFont || "#ffffff";
  const accent = data.accentColor || "#ad0000";
  const borderColor = `${fg}15`;

  // Dynamic Experience logic based on schema structure
  let experienceSummary = "5+ Years Professional";
  if (Array.isArray(data.experience) && data.experience.length > 0) {
    experienceSummary = `${data.experience.length} Roles Recorded`;
  }

  return (
    <section 
      id="about" 
      className="py-32 px-6 relative transition-colors duration-500"
      style={{ backgroundColor: bg, color: fg, borderTop: `1px solid ${borderColor}` }}
    >
      <div className="max-w-[1800px] mx-auto">
        {/* Section Label */}
        <div className="flex items-center gap-4 mb-16 opacity-40">
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">(02) Profile</span>
          <div className="h-[1px] w-12 bg-current"></div>
        </div>

        <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 items-start">
          
          {/* LEFT: Main Bio Area */}
          <div className="lg:col-span-7 fade-up">
            <h3 className="text-xl md:text-3xl font-bold leading-[1.1] tracking-tighter mb-12">
              <EditableText
                value={data?.bio || "I build digital experiences that are visceral, precise, and unforgettable."}
                onChange={(val) => setPortfolioData({ ...data, bio: val })}
                readOnly={isReadOnly}
                multiline
              />
            </h3>
            
            <div className="flex items-center gap-6 mt-16 pt-8 border-t border-dashed" style={{ borderColor: borderColor }}>
               <div className="w-2 h-2 rounded-full" style={{ backgroundColor: accent }}></div>
               <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">
                 Location — 
                 <EditableText
                    value={data.location || data.extraText || "India"}
                    onChange={(val) => setPortfolioData({ ...data, location: val })}
                    readOnly={isReadOnly}
                 />
               </span>
            </div>
          </div>

          {/* RIGHT: Info Cards */}
          <div className="lg:col-span-5 flex flex-col gap-4 fade-up delay-100">
            
            {/* Education Card */}
            <div 
              className="group p-10 rounded-2xl transition-all duration-500 hover:scale-[1.02]"
              style={{ 
                backgroundColor: `${fg}03`, 
                border: `1px solid ${borderColor}` 
              }}
            >
              <h4 className="text-[9px] font-black uppercase mb-4 tracking-[0.2em] opacity-40 group-hover:opacity-100 transition-opacity">
                Education
              </h4>
              <p className="text-xl font-bold tracking-tight">
                <EditableText
                  value={data?.education || "University of Technology"}
                  onChange={(val) => setPortfolioData({ ...data, education: val })}
                  readOnly={isReadOnly}
                />
              </p>
            </div>
            
            {/* Experience Summary Card */}
            <div 
              className="group p-10 rounded-2xl transition-all duration-500 hover:scale-[1.02]"
              style={{ 
                backgroundColor: `${fg}03`, 
                border: `1px solid ${borderColor}` 
              }}
            >
              <h4 className="text-[9px] font-black uppercase mb-4 tracking-[0.2em] opacity-40 group-hover:opacity-100 transition-opacity">
                Expertise
              </h4>
              <p className="text-xl font-bold tracking-tight">
                {experienceSummary}
              </p>
            </div>

            {/* ✅ DOWNLOAD RESUME BUTTON */}
            {/* 
               Only renders if cvLink exists. 
               Uses theme colors to stay consistent with the boutique look.
            */}
            {data?.cvLink ? (
              <a 
                href={data.cvLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex items-center justify-between p-10 rounded-2xl border-2 transition-all duration-500 hover:bg-white hover:text-black overflow-hidden relative"
                style={{ 
                  borderColor: fg,
                  color: fg 
                }}
              >
                <span className="text-xs font-black uppercase tracking-widest relative z-10">Download CV</span>
                <span className="relative z-10 group-hover:translate-x-2 transition-transform text-2xl">→</span>
              </a>
            ) : (
              /* Helper for the user during customization if link is missing */
              !isReadOnly && (
                <div className="p-6 rounded-2xl border border-dashed opacity-30 text-[10px] uppercase text-center">
                  Add a Resume URL in settings to show button
                </div>
              )
            )}
            
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;