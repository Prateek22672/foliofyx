import React from "react";
import { usePortfolio } from "../../../../context/PortfolioContext";
import DownArrow from "../../../../components/DownArrow";

const About = ({ portfolioData: propData }) => {
  const { portfolioData: contextData } = usePortfolio();
  const data = propData || contextData || {};
  const skills = Array.isArray(data?.skills) ? data.skills : [];

  // --- SAFE EXPERIENCE SUMMARY ---
  let experienceSummary = "Highlighting my professional journey...";
  if (Array.isArray(data.experience) && data.experience.length > 0) {
      experienceSummary = `${data.experience.length} Roles Recorded`;
  } else if (typeof data.experience === 'string') {
      experienceSummary = data.experience;
  }

  return (
    <section
      id="about"
      className="py-32 px-6 relative overflow-hidden font-[Switzer]"
      style={{
        backgroundColor: data?.themeBg || "#ffffff",
        color: data?.themeFont || "#111827",
      }}
    >
       {/* Background decorative text */}
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
                   More than just <br/>
                   <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">pixels & code.</span>
                </h2>
             </div>
             <div className="flex-1 flex items-end">
                 <p className="text-xl md:text-2xl opacity-80 leading-relaxed font-medium max-w-xl">
                    {data?.bio || "I'm a multidisciplinary developer focused on crafting accessible, pixel-perfect user experiences that blend form and function."}
                 </p>
             </div>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 fade-up">
            
            {/* Experience Card (Large) */}
            <div className="md:col-span-7 p-10 border border-current/10 rounded-[2.5rem] bg-white/5 backdrop-blur-md hover:border-current/30 transition-all duration-500 group relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:opacity-20 transition-opacity">
                    <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                 </div>
                 <h3 className="text-3xl font-bold mb-4 relative z-10">Experience</h3>
                 {/* ✅ Render Safe Summary */}
                 <p className="opacity-70 text-lg mb-8 relative z-10 leading-relaxed max-w-md">{experienceSummary}</p>
                 
                 <div className="relative z-10 pt-4 border-t border-current/10 flex flex-wrap gap-2">
                    <span className="text-xs font-bold uppercase tracking-widest opacity-50 mb-2 block w-full">Key Competencies</span>
                    {(skills.length > 0 ? skills.slice(0, 5) : ["Strategy", "Design", "Leadership"]).map((s, i) => (
                        <span key={i} className="px-4 py-2 border border-current/10 rounded-full text-sm font-medium hover:bg-current/5 transition-colors cursor-default">
                            {typeof s === 'string' ? s : s.name}
                        </span>
                    ))}
                 </div>
            </div>

            {/* Education Card (Small) */}
            <div className="md:col-span-5 p-10 border border-current/10 rounded-[2.5rem] bg-current/5 backdrop-blur-md hover:bg-current/10 transition-all duration-500 flex flex-col justify-between">
                <div>
                    <h3 className="text-3xl font-bold mb-4">Education</h3>
                    <p className="opacity-70 text-lg">{data?.education || "Your academic background goes here."}</p>
                </div>
                <div className="mt-8 flex items-center justify-between opacity-50">
                    <span className="text-xs uppercase tracking-widest font-bold">Academic Path</span>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                </div>
            </div>

        </div>

      </div>
    </section>
  );
};

export default About;