import React from "react";
import { usePortfolio } from "../../../../context/PortfolioContext";
import useFadeInOnScroll from "../../../../hooks/useFadeInOnScroll";
import EditableText from "../EditableText";

const About = ({ portfolioData: propData, isReadOnly }) => {
  const { portfolioData: contextData, setPortfolioData } = usePortfolio();
  const data = propData || contextData || {};
  useFadeInOnScroll();

  const bg = data.themeBg || "#0a0a0a";
  const fg = data.themeFont || "#f0f0f0";
  const accent = data.accentColor || "#e8ff47";
  const border = `${fg}15`;
  const muted = `${fg}60`;

  return (
    <section id="about" className="relative min-h-screen flex transition-colors duration-500" style={{ background: bg }}>
      {/* Sidebar UI Decor */}
      <div className="hidden lg:flex w-20 flex-col items-center py-8 gap-8 border-r" style={{ borderColor: border, background: `${fg}05` }}>
        <div className="w-10 h-10 rounded-xl flex flex-col items-center justify-center bg-white/10 border border-white/20 shadow-xl">
           <div className="w-5 h-0.5 bg-white mb-1" />
           <div className="w-5 h-0.5 bg-white" />
        </div>
      </div>

      <div className="flex-1 py-20 px-8 md:px-16 lg:px-24">
        <div className="max-w-5xl">
          <div className="flex items-center gap-3 mb-12 fade-up">
            <div className="w-2 h-2 rounded-full" style={{ background: accent }} />
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: muted }}>
              01 / Professional Bio
            </span>
          </div>

          <div className="fade-up mb-16">
            <h2 className="text-xl md:text-3xl font-medium leading-[1.1] tracking-tight max-w-4xl" style={{ color: fg }}>
              <EditableText 
                value={data.bio || "Computer Science undergraduate building full-stack applications..."}
                onChange={(val) => setPortfolioData({ ...data, bio: val })}
                readOnly={isReadOnly}
                multiline
              />
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 fade-up border-t pt-12" style={{ borderColor: border }}>
            <div className="space-y-8">
              <div>
                <label className="block text-[10px] uppercase font-black mb-2 opacity-30" style={{ color: fg }}>Location</label>
                <div className="text-xl font-medium" style={{ color: fg }}>
                  <EditableText 
                    value={data.location || "Remote / Global"}
                    onChange={(val) => setPortfolioData({ ...data, location: val })}
                    readOnly={isReadOnly}
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] uppercase font-black mb-2 opacity-30" style={{ color: fg }}>Education</label>
                <div className="text-xl font-medium" style={{ color: fg }}>
                  <EditableText 
                    value={data.education || "B.S. Computer Science"}
                    onChange={(val) => setPortfolioData({ ...data, education: val })}
                    readOnly={isReadOnly}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <label className="block text-[10px] uppercase font-black mb-2 opacity-30" style={{ color: fg }}>Experience</label>
                <div className="text-xl font-medium" style={{ color: fg }}>
                  <EditableText 
                    value={data.experienceLabel || (Array.isArray(data.experience) ? `${data.experience.length} Years` : "Senior Dev")}
                    onChange={(val) => setPortfolioData({ ...data, experienceLabel: val })}
                    readOnly={isReadOnly}
                  />
                </div>
              </div>
              {data.cvLink && (
                <div className="inline-block group" style={{ color: accent }}>
                  <span className="text-[10px] uppercase font-black block mb-2 opacity-30" style={{ color: fg }}>Resume</span>
                  <span className="text-xl font-medium border-b-2 pb-1 transition-all" style={{ borderColor: accent }}>
                    Download PDF →
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;