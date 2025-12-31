import React from "react";
import { usePortfolio } from "../../../../context/PortfolioContext";

const About = ({ portfolioData: propData }) => {
  const { portfolioData: contextData } = usePortfolio();
  const data = propData || contextData || {};
  
  // 1. Define Dynamic Colors
  const bg = data.themeBg || "#ffffff"; 
  const fg = data.themeFont || "#111827"; 

  // --- SAFE DATA ---
  const safeBio = typeof data.bio === "string" ? data.bio : "I am a creative developer passionate about building digital experiences that matter.";
  const safeEducation = typeof data.education === "string" ? data.education : "University of Design";
  
  // Safe Experience Summary
  let experienceSummary = "Available for hire";
  if (Array.isArray(data.experience) && data.experience.length > 0) {
      experienceSummary = `${data.experience.length} Roles Recorded`;
  } else if (typeof data.experience === 'string' && data.experience.trim() !== "") {
      experienceSummary = data.experience;
  }

  return (
    <section 
      id="about" 
      className="py-24 px-6 sm:px-12 lg:px-24 transition-colors duration-500"
      style={{ background: bg, color: fg }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-12 gap-12">
          
          {/* Left Column: Title */}
          <div className="md:col-span-4 fade-up">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              About
            </h2>
            <div className="h-1 w-12 bg-current opacity-20 rounded-full"></div>
          </div>

          {/* Right Column: Content */}
          <div className="md:col-span-8 flex flex-col gap-10 fade-up">
            
            {/* Bio */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest mb-4 opacity-60">The Story</h3>
              <p className="text-xl md:text-2xl leading-relaxed font-medium opacity-90">
                {safeBio}
              </p>
            </div>

            {/* Stats / Info Grid */}
            <div className="relative pt-8">
                {/* Dynamic Divider Line */}
                <div className="absolute top-0 left-0 w-full h-px opacity-10" style={{ backgroundColor: fg }}></div>

                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-widest mb-2 opacity-60">Education</h3>
                    <p className="text-lg font-medium">{safeEducation}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-widest mb-2 opacity-60">Experience</h3>
                    <p className="text-lg font-medium">{experienceSummary}</p>
                  </div>
                </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default About;