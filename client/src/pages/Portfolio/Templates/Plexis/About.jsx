import React from "react";
import { usePortfolio } from "../../../../context/PortfolioContext";
import DownArrow from "../../../../components/DownArrow";
import useFadeInOnScroll from "../../../../hooks/useFadeInOnScroll";

const About = ({ portfolioData: propData }) => {
  const { portfolioData: contextData } = usePortfolio();
  const data = propData || contextData || {};
  useFadeInOnScroll();

  const bg = data.themeBg || "#ffffff";
  const fg = data.themeFont || "#111827";
  const borderColor = `${fg}20`;

  // --- SAFE DATA ---
  const safeBio = typeof data.bio === "string" ? data.bio : "I am a creative developer focusing on digital products.";
  const safeEducation = typeof data.education === "string" ? data.education : "University";
  
  // Safe Skills (for the mini preview)
  const rawSkills = Array.isArray(data.skills) ? data.skills : [];
  const safeSkills = rawSkills.map(s => (typeof s === 'string' ? s : s?.name)).filter(Boolean);

  // Safe Experience Summary (Prevents Object Crash)
  let experienceSummary = "Fresher / Available";
  if (Array.isArray(data.experience) && data.experience.length > 0) {
      experienceSummary = `${data.experience.length} Roles Recorded`;
  } else if (typeof data.experience === 'string' && data.experience.trim() !== "") {
      experienceSummary = data.experience;
  }

  return (
    <section
      id="about"
      className="relative min-h-screen flex flex-col"
      style={{ backgroundColor: bg, color: fg, borderBottom: `1px solid ${borderColor}` }} 
    >
      <div className="flex-grow grid md:grid-cols-2 h-full">
        
        {/* LEFT COL: Sticky Title */}
        <div className="p-8 md:p-16 border-b md:border-b-0 md:border-r border-gray-100" style={{ borderColor: borderColor }}>
           <div className="sticky top-32 fade-up">
              <span className="text-sm font-bold uppercase tracking-widest opacity-50 mb-4 block">01 / Profile</span>
              <h2 className="text-5xl md:text-7xl font-bold uppercase leading-none">
                About<br/>Me.
              </h2>
           </div>
        </div>

        {/* RIGHT COL: Content */}
        <div className="p-8 md:p-16 flex flex-col justify-center">
          
          {/* Bio */}
          <div className="mb-16 fade-up">
            <h3 className="text-xl font-bold mb-6 uppercase tracking-wide opacity-50">Biography</h3>
            <p className="text-xl md:text-2xl leading-relaxed font-light">
              {safeBio}
            </p>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 gap-12 fade-up">
            
            {/* Experience Summary */}
            <div className="pt-8 border-t" style={{ borderColor: borderColor }}>
               <h4 className="text-lg font-bold mb-2">Experience</h4>
               <p className="opacity-70 text-lg">{experienceSummary}</p>
            </div>

            {/* Education Block */}
            <div className="pt-8 border-t" style={{ borderColor: borderColor }}>
               <h4 className="text-lg font-bold mb-2">Education</h4>
               <p className="opacity-70 text-lg">{safeEducation}</p>
            </div>

            {/* Quick Skills Block */}
            <div className="pt-8 border-t" style={{ borderColor: borderColor }}>
               <h4 className="text-lg font-bold mb-4">Skills Overview</h4>
               <div className="flex flex-wrap gap-2">
                  {safeSkills.length > 0
                    ? safeSkills.slice(0, 8).map((name, i) => (
                        <span key={i} className="px-3 py-1 border rounded-full text-sm font-medium" style={{ borderColor: fg }}>
                          {name}
                        </span>
                      ))
                    : <span className="opacity-50">No skills added yet</span> }
               </div>
            </div>
            
          </div>

          <div className="mt-16 fade-up">
             <DownArrow targetId="experience" />
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;