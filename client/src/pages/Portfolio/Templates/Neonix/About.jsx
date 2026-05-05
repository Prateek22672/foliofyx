import React from "react";
import { usePortfolio } from "../../../../context/PortfolioContext";
import EditableText from "../EditableText";

const About = ({ portfolioData: propData, isReadOnly }) => {
  const { portfolioData: contextData, setPortfolioData } = usePortfolio();
  const data = (propData && Object.keys(propData).length > 0) ? propData : (contextData || {});
  const skills = Array.isArray(data?.skills) ? data.skills : [];

  let experienceSummary = "Highlighting my professional journey...";
  if (Array.isArray(data.experience) && data.experience.length > 0) {
      experienceSummary = `${data.experience.length} Roles Recorded`;
  }

  const bg = data?.themeBg || "#ffffff";
  const fg = data?.themeFont || "#111827";
  const borderColor = `${fg}15`;

  return (
    <section
      id="about"
      className="py-32 px-6 relative overflow-hidden font-[Switzer]"
      style={{ backgroundColor: bg, color: fg }}
    >
      <div className="absolute top-20 left-[-5%] text-[25vw] font-bold opacity-[0.02] pointer-events-none leading-none select-none">
        About
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row gap-12 mb-20 fade-up">
             <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 border border-current/20 rounded-full text-xs font-bold uppercase tracking-widest opacity-60">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    Bio & Context
                </div>
                <h2 className="text-5xl md:text-7xl font-bold leading-[0.95] tracking-tight mb-8">
                    <EditableText
                      value={data?.aboutHeadline || "More than just pixels & code."}
                      onChange={(val) => setPortfolioData({ ...data, aboutHeadline: val })}
                      readOnly={isReadOnly}
                      multiline
                    />
                </h2>
             </div>
             <div className="flex-1 flex items-end">
                <div className="text-xl md:text-2xl opacity-80 leading-relaxed font-medium max-w-xl">
                  <EditableText
                    value={data?.bio || "I'm a multidisciplinary developer focused on crafting experiences."}
                    onChange={(val) => setPortfolioData({ ...data, bio: val })}
                    readOnly={isReadOnly}
                    multiline
                  />
                </div>
             </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 fade-up">
            
            <div className="md:col-span-7 p-10 border border-current/10 rounded-[2.5rem] bg-white/5 backdrop-blur-md transition-all duration-500">
                <h3 className="text-3xl font-bold mb-4">Experience</h3>
                <div className="opacity-70 text-lg mb-8 leading-relaxed max-w-md">
                   <EditableText
                      value={data?.expDescription || experienceSummary}
                      onChange={(val) => setPortfolioData({ ...data, expDescription: val })}
                      readOnly={isReadOnly}
                      multiline
                    />
                </div>
                
                <div className="pt-4 border-t border-current/10 flex flex-wrap gap-2">
                   <span className="text-xs font-bold uppercase tracking-widest opacity-50 mb-2 block w-full">Key Competencies</span>
                   {skills.slice(0, 6).map((s, i) => (
                      <span key={i} className="px-4 py-2 border border-current/10 rounded-full text-sm font-medium">
                          {typeof s === 'string' ? s : s.name}
                      </span>
                   ))}
                </div>
            </div>

            <div className="md:col-span-5 p-10 border border-current/10 rounded-[2.5rem] bg-current/5 backdrop-blur-md transition-all duration-500 flex flex-col justify-between">
                <div>
                    <h3 className="text-3xl font-bold mb-4">Education</h3>
                    <div className="opacity-70 text-lg">
                      <EditableText
                        value={data?.education || "Your academic background."}
                        onChange={(val) => setPortfolioData({ ...data, education: val })}
                        readOnly={isReadOnly}
                        multiline
                      />
                    </div>
                </div>
                <div className="mt-8 flex items-center justify-between opacity-50">
                    <span className="text-xs uppercase tracking-widest font-bold">Academic Path</span>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 10l-10-5-10 5 10 5 10-5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                </div>
            </div>

        </div>
      </div>
    </section>
  );
};

export default About;