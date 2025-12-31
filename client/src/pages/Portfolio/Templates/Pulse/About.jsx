import React from "react";
import useFadeInOnScroll from "../../../../hooks/useFadeInOnScroll";

const About = ({ portfolioData: propData }) => {
  // ✅ Handle Props vs Context for Editor Support
  const data = propData || {};
  useFadeInOnScroll();

  const bg = data.themeBg || "#0a0a0a";
  const fg = data.themeFont || "#ffffff";
  const accent = data.accentColor || "#ad0000";
  const borderColor = `${fg}15`;

  // ✅ SAFE EXPERIENCE SUMMARY
  let experienceSummary = "5+ Years Professional";
  if (Array.isArray(data.experience)) {
      experienceSummary = `${data.experience.length} Roles Recorded`;
  } else if (typeof data.experience === 'string') {
      experienceSummary = data.experience;
  }

  return (
    <section 
      id="about" 
      className="py-24 px-6 relative transition-colors duration-500"
      style={{ backgroundColor: bg, color: fg, borderTop: `1px solid ${borderColor}` }}
    >
      <div className="max-w-[1800px] mx-auto">
        {/* Label acts as continuation from the Home section's "(01) — Studio" */}
        <h2 className="text-[10px] font-bold uppercase tracking-widest mb-12 opacity-60">
          (02) — Profile
        </h2>

        <div className="grid md:grid-cols-12 gap-12 items-start">
          {/* Left Column: The Main Manifesto */}
          <div className="md:col-span-8 fade-up">
            <p className="text-4xl md:text-6xl font-bold leading-[1.1] tracking-tight">
              {data?.bio || "It's not just about code. It's about execution. I build digital experiences that are visceral, precise, and unforgettable."}
            </p>
            
            {/* Added a subtle connector line or subtext to flow better */}
            <div className="mt-12 pt-12 border-t w-1/3" style={{ borderColor: borderColor }}>
               <span className="text-xs font-mono opacity-50 uppercase tracking-widest">
                 Based in {data.location || "India"}
               </span>
            </div>
          </div>

          {/* Right Column: Key Details Cards */}
          <div className="md:col-span-4 flex flex-col gap-6 fade-up delay-100">
            {/* Education */}
            <div 
              className="p-8 backdrop-blur-md transition-colors duration-500 hover:bg-opacity-10"
              style={{ 
                backgroundColor: `${fg}05`, 
                border: `1px solid ${borderColor}` 
              }}
            >
              <h3 className="text-xs font-bold uppercase mb-4 tracking-widest" style={{ color: accent }}>Education</h3>
              <p className="text-xl font-bold">{data?.education || "University of Technology"}</p>
            </div>
            
            {/* Experience */}
            <div 
              className="p-8 backdrop-blur-md transition-colors duration-500 hover:bg-opacity-10"
              style={{ 
                backgroundColor: `${fg}05`, 
                border: `1px solid ${borderColor}` 
              }}
            >
              <h3 className="text-xs font-bold uppercase mb-4 tracking-widest" style={{ color: accent }}>Experience</h3>
              {/* ✅ Render Safe Summary */}
              <p className="text-xl font-bold">{experienceSummary}</p>
            </div>

            {/* Resume Download */}
            {data?.cvLink && (
              <a 
                href={data.cvLink} 
                className="group flex items-center justify-between p-8 border transition-all duration-300 hover:opacity-80 cursor-pointer"
                style={{ 
                  borderColor: fg,
                  color: fg 
                }}
              >
                <span className="text-xl font-bold uppercase tracking-tighter">Download CV</span>
                <span className="group-hover:translate-x-2 transition-transform text-2xl">→</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;