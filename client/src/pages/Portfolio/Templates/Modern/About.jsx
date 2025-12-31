import React from "react";
import { usePortfolio } from "../../../../context/PortfolioContext";
import useFadeInOnScroll from "../../../../hooks/useFadeInOnScroll";

const About = ({ portfolioData: propData }) => {
  const { portfolioData: contextData } = usePortfolio();
  const data = propData || contextData || {};
  
  const bg = data.themeBg || "#ffffff";
  const fg = data.themeFont || "#111827";

  // Safe Skills (for the mini preview)
  const skills = Array.isArray(data?.skills) ? data.skills : [];
  
  // Safe Experience Summary (Prevents Object Crash)
  let experienceSummary = "N/A";
  if (Array.isArray(data.experience) && data.experience.length > 0) {
      experienceSummary = `${data.experience.length} Roles Recorded`;
  } else if (typeof data.experience === 'string') {
      experienceSummary = data.experience;
  }

  useFadeInOnScroll();

  return (
    <section
      id="about"
      className="py-32 px-6 transition-all duration-500 relative overflow-hidden font-[Switzer]"
      style={{
        backgroundColor: bg,
        color: fg,
      }}
    >
       {/* Background decorative text */}
       <div className="absolute top-20 right-0 text-[20vw] font-bold opacity-[0.03] pointer-events-none leading-none select-none">
           ABOUT
       </div>

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center fade-up relative z-10">
        
        {/* Left Column: Bio */}
        <div>
            <div className="inline-block px-3 py-1 mb-4 border border-current/20 rounded-full text-xs font-bold uppercase tracking-widest opacity-60">
                Who I Am
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">
                Focused on <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">impact</span> and results.
            </h2>
             <p className="text-lg md:text-xl opacity-80 leading-relaxed font-medium">
                {data?.bio || "I help brands and agencies create User Experiences and No-code Websites that not only stand out but also drive meaningful impact."}
             </p>
        </div>

        {/* Right Column: Cards */}
        <div className="grid gap-6">
            {/* Experience Card */}
            <div className="p-8 border border-current/10 rounded-3xl bg-white/5 backdrop-blur-sm hover:border-current/30 transition-all duration-300 shadow-sm hover:shadow-xl">
                 <h3 className="text-2xl font-bold mb-2">Experience</h3>
                 {/* ✅ Render Safe Summary */}
                 <p className="opacity-70 mb-6 text-lg">{experienceSummary}</p>
                 <div className="flex flex-wrap gap-2">
                    {(skills.length > 0 ? skills.slice(0, 8) : ["Design", "Dev"]).map((s, i) => (
                        <span key={i} className="px-3 py-1 bg-current/5 rounded-full text-xs font-bold uppercase tracking-wider opacity-70">
                            {typeof s === 'string' ? s : s.name}
                        </span>
                    ))}
                 </div>
            </div>

            {/* Education Card */}
            <div className="p-8 border border-current/10 rounded-3xl bg-white/5 backdrop-blur-sm hover:border-current/30 transition-all duration-300 shadow-sm hover:shadow-xl">
                <h3 className="text-2xl font-bold mb-2">Education</h3>
                <p className="opacity-70 text-lg">{data?.education || "Add your education details"}</p>
            </div>
        </div>

      </div>
    </section>
  );
};

export default About;