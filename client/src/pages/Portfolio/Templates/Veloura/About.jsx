import React from "react";
import { usePortfolio } from "../../../../context/PortfolioContext";
import useFadeInOnScroll from "../../../../hooks/useFadeInOnScroll";

const About = ({ portfolioData: propData }) => {
  const { portfolioData: contextData } = usePortfolio();
  const data = propData || contextData || {}; // ✅ Handle null data
  useFadeInOnScroll();

  // --- Theme ---
  const bg = data.themeBg || "#ffffff";
  const fg = data.themeFont || "#111111";
  const muted = `${fg}99`;
  const borderColor = `${fg}20`; 

  // =========================================================
  // 🛡️ DATA SAFETY ZONE (Prevents Crashes)
  // =========================================================

  // 1. Safe Bio: Ensure it is a string
  const safeBio = typeof data.bio === "string" 
    ? data.bio 
    : "I am a multidisciplinary developer focused on creating fluid, interactive web experiences.";

  // 2. Safe Education: Ensure it is a string
  const safeEducation = typeof data.education === "string" 
    ? data.education 
    : "University of Technology";

  // 3. Safe Experience Summary:
  // Since 'data.experience' is now an Array of Objects (Jobs), we cannot render it directly.
  // We calculate a summary string instead.
  let safeExperience = "5+ Years Professional";
  
  if (typeof data.experience === "string") {
     // If user has old string data, use it
     safeExperience = data.experience;
  } else if (Array.isArray(data.experience)) {
     // If user has new Array data, count the jobs
     safeExperience = `${data.experience.length} Roles Recorded`;
  }

  // =========================================================

  return (
    <section 
      id="about" 
      className="py-20 px-4 md:px-8 transition-colors duration-500"
      style={{ backgroundColor: bg, color: fg, borderTop: `1px solid ${borderColor}` }}
    >
      <div className="max-w-[1800px] mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between mb-20 fade-up">
           <h2 className="text-5xl md:text-7xl font-bold tracking-tighter">About</h2>
           <span 
            className="text-sm font-bold uppercase rounded-full px-4 py-2 h-fit mt-4 md:mt-0"
            style={{ border: `1px solid ${fg}` }}
           >
             01 / Profile
           </span>
        </div>

        <div className="grid md:grid-cols-12 gap-12">
          {/* Big Intro */}
          <div className="md:col-span-8 fade-up">
            <p className="text-3xl md:text-5xl leading-tight font-medium tracking-tight">
              {/* ✅ Render the Safe String */}
              {safeBio}
            </p>
          </div>

          {/* Details Column */}
          <div className="md:col-span-4 flex flex-col gap-8 fade-up delay-100">
             
             {/* Education Card */}
             <div className="p-8 rounded-2xl" style={{ backgroundColor: `${fg}08` }}> {/* 8% opacity bg */}
               <h3 className="text-sm font-bold uppercase mb-4" style={{ color: muted }}>Education</h3>
               {/* ✅ Render the Safe String */}
               <p className="text-xl font-bold">{safeEducation}</p>
             </div>
             
             {/* Experience Card */}
             <div className="p-8 rounded-2xl" style={{ backgroundColor: `${fg}08` }}>
               <h3 className="text-sm font-bold uppercase mb-4" style={{ color: muted }}>Experience</h3>
               {/* ✅ Render the Safe String (Prevents the crash) */}
               <p className="text-xl font-bold">{safeExperience}</p>
             </div>
             
             {/* Download CV */}
             {data.cvLink && (
               <a 
                 href={data.cvLink} 
                 target="_blank"
                 rel="noopener noreferrer"
                 className="group flex items-center justify-between p-8 rounded-2xl cursor-pointer transition"
                 style={{ backgroundColor: fg, color: bg }}
               >
                 <span className="text-xl font-bold">Download CV</span>
                 <span className="group-hover:translate-x-1 transition-transform">→</span>
               </a>
             )}
          </div>
        </div>

      </div>
    </section>
  );
};

export default About;