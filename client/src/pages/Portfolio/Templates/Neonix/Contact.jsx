import React from "react";
import { usePortfolio } from "../../../../context/PortfolioContext";
import useFadeInOnScroll from "../../../../hooks/useFadeInOnScroll";

const DEFAULT_BG = "#ffffff";
const DEFAULT_FG = "#111827";
const DEFAULT_ACCENT = "#8b5cf6"; // Fallback Purple

const Contact = ({ portfolioData: propData }) => {
  useFadeInOnScroll();
  
  const { portfolioData: contextData } = usePortfolio();
  const data = propData || contextData || {};
  
  // Theme Variables
  const bg = data.themeBg || DEFAULT_BG;
  const fg = data.themeFont || DEFAULT_FG;
  const accent = data.accentColor || DEFAULT_ACCENT;

  return (
    <section 
      id="contact" 
      className="py-32 px-6 sm:px-12 lg:px-24 transition-colors duration-500 font-[Switzer]"
      // Apply Theme Background and Text Color
      style={{ backgroundColor: bg, color: fg }}
    >
      <div className="max-w-6xl mx-auto text-center fade-up">
        
        {/* Huge Heading */}
        <h2 
          className="text-5xl md:text-8xl font-black tracking-tighter mb-8 leading-tight" 
          style={{ color: fg }}
        >
          Let's work <br className="hidden md:block"/>
          <span className="opacity-50">together.</span>
        </h2>
        
        <p className="text-xl md:text-2xl mb-12 max-w-2xl mx-auto opacity-60 leading-relaxed font-medium">
          Always open to discussing product design work or partnership opportunities.
        </p>

        {/* Dynamic Accent Button */}
        <a 
          href={`mailto:${data.email || "hello@example.com"}`}
          className="inline-block px-12 py-6 rounded-full text-lg md:text-xl font-bold transition-all shadow-xl hover:scale-105 hover:shadow-2xl"
          style={{ 
            backgroundColor: accent, 
            color: "#ffffff", // Always white text on accent button for contrast
            boxShadow: `0 10px 30px -10px ${accent}80` // Colored shadow matching accent
          }}
        >
          {data.email ? "Say Hello" : "Get in touch"}
        </a>

        {/* Social Links */}
        <div className="mt-20 flex justify-center gap-10 text-lg font-bold tracking-widest uppercase">
            {data.linkedin && (
              <a 
                href={data.linkedin} 
                target="_blank"
                rel="noreferrer"
                className="opacity-40 hover:opacity-100 transition-all hover:-translate-y-1"
                style={{ color: fg }} // Uses theme font color
              >
                LinkedIn
              </a>
            )}
            {data.github && (
              <a 
                href={data.github} 
                target="_blank"
                rel="noreferrer"
                className="opacity-40 hover:opacity-100 transition-all hover:-translate-y-1"
                style={{ color: fg }}
              >
                GitHub
              </a>
            )}
             {data.cvLink && (
              <a 
                href={data.cvLink} 
                target="_blank"
                rel="noreferrer"
                className="opacity-40 hover:opacity-100 transition-all hover:-translate-y-1"
                style={{ color: fg }}
              >
                Resume
              </a>
            )}
        </div>

        {/* Footer Credit 
        <div className="mt-24 pt-10 border-t opacity-30 text-sm" style={{ borderColor: fg }}>
           © {new Date().getFullYear()} {data.name || "Portfolio"}. All rights reserved.
        </div>*/}

      </div>
    </section>
  );
};

export default Contact;