import React from "react";
import { usePortfolio } from "../../../../context/PortfolioContext";
import useFadeInOnScroll from "../../../../hooks/useFadeInOnScroll";
import EditableText from "../EditableText";
// ✅ Added Icons
import { MapPin, GraduationCap, Briefcase, Globe, Fingerprint } from "lucide-react";

const About = ({ portfolioData: propData, isReadOnly }) => {
  const { portfolioData: contextData, setPortfolioData } = usePortfolio();
  const data = propData || contextData || {};
  useFadeInOnScroll();

  const bg = data.themeBg || "#0a0a0a";
  const fg = data.themeFont || "#f0f0f0";
  const accent = data.accentColor || "#e8ff47";
  const muted = `${fg}60`;

  return (
    <section id="about" className="relative min-h-screen flex transition-colors duration-500" style={{ background: bg }}>
      {/* Left Sidebar UI Mimic */}
      <div className="hidden lg:flex w-20 flex-col items-center py-8 gap-10 border-r" style={{ borderColor: `${fg}15`, background: `${fg}05` }}>
        <div className="w-10 h-10 rounded-xl flex flex-col items-center justify-center bg-white/10 border border-white/20 shadow-xl transition-transform hover:scale-110 cursor-none">
           <Fingerprint size={18} color={fg} className="opacity-80" />
        </div>
        
        {/* Decorative Sidebar Icons */}
        <div className="flex flex-col gap-8 opacity-20">
          <Globe size={16} color={fg} />
          <div className="w-4 h-4 rounded-sm border border-current" />
          <div className="w-1 h-8 rounded-full bg-current" />
        </div>
      </div>

      <div className="flex-1 py-20 px-8 md:px-16 lg:px-24">
        <div className="max-w-5xl">
          
          {/* Tagline Header */}
          <div className="flex items-center gap-3 mb-12 fade-up">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: accent }} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: muted }}>
              01 / Identity & Background
            </span>
          </div>

          {/* Main Headline Bio */}
          <div className="fade-up mb-20">
            <h2 className="text-lg md:text-2xl font-medium leading-[1.15] tracking-tight max-w-4xl" style={{ color: fg }}>
              <EditableText 
                value={data.aboutBio || data.bio || "Building high-end digital experiences."}
                onChange={(v) => setPortfolioData({ ...data, aboutBio: v })}
                readOnly={isReadOnly}
                multiline
              />
            </h2>
          </div>

          {/* Data Grid with Icons */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 fade-up border-t pt-12" style={{ borderColor: `${fg}15` }}>
            
            {/* Location Item */}
            <div className="group">
              <div className="flex items-center gap-2 mb-3 opacity-30 group-hover:opacity-100 transition-opacity" style={{ color: fg }}>
                <MapPin size={14} strokeWidth={3} />
                <label className="text-[10px] uppercase font-black tracking-widest">Location</label>
              </div>
              <div className="text-xl font-medium" style={{ color: fg }}>
                <EditableText 
                  value={data.location || "Remote / Global"}
                  onChange={(v) => setPortfolioData({ ...data, location: v })}
                  readOnly={isReadOnly}
                />
              </div>
            </div>

            {/* Education Item */}
            <div className="group">
              <div className="flex items-center gap-2 mb-3 opacity-30 group-hover:opacity-100 transition-opacity" style={{ color: fg }}>
                <GraduationCap size={14} strokeWidth={3} />
                <label className="text-[10px] uppercase font-black tracking-widest">Education</label>
              </div>
              <div className="text-xl font-medium" style={{ color: fg }}>
                <EditableText 
                  value={data.education || "B.S. Computer Science"}
                  onChange={(v) => setPortfolioData({ ...data, education: v })}
                  readOnly={isReadOnly}
                />
              </div>
            </div>

            {/* Experience Item */}
            <div className="group">
              <div className="flex items-center gap-2 mb-3 opacity-30 group-hover:opacity-100 transition-opacity" style={{ color: fg }}>
                <Briefcase size={14} strokeWidth={3} />
                <label className="text-[10px] uppercase font-black tracking-widest">Experience</label>
              </div>
              <p className="text-xl font-medium" style={{ color: fg }}>
                {Array.isArray(data.experience) ? `${data.experience.length} Projects` : "Senior Dev"}
              </p>
            </div>

          </div>

          {/* Floating Aesthetic Detail */}
          <div className="mt-24 opacity-[0.03] pointer-events-none select-none hidden md:block">
            <h3 className="text-[12vw] font-black leading-none uppercase tracking-tighter">
              About Me
            </h3>
          </div>

        </div>
      </div>

      {/* Right Dock UI Decor */}
      <div className="hidden xl:flex flex-col justify-center px-6 gap-6 border-l" style={{ borderColor: `${fg}15` }}>
          {[1, 2].map(i => (
            <div key={i} className="w-10 h-10 rounded-full border flex items-center justify-center opacity-10 hover:opacity-100 transition-all cursor-none" style={{ borderColor: fg }}>
              <div className="w-1 h-1 bg-current rounded-full" />
            </div>
          ))}
      </div>
    </section>
  );
};

export default About;