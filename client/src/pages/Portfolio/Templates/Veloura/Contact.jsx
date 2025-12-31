import React from "react";
import { usePortfolio } from "../../../../context/PortfolioContext";
import useFadeInOnScroll from "../../../../hooks/useFadeInOnScroll";

const Contact = ({ portfolioData: propData }) => {
  const { portfolioData: contextData } = usePortfolio();
  const data = propData || contextData || {};
  useFadeInOnScroll();

  // --- Theme: INVERTED for Footer Look ---
  // If the user chooses a light theme, this section will be dark (fg).
  // If the user chooses a dark theme, this section will be light (fg).
  const bg = data.themeBg || "#ffffff";
  const fg = data.themeFont || "#111111";

  // We swap fg and bg here for high contrast footer effect
  const sectionBg = fg; 
  const sectionFg = bg;
  const muted = `${bg}99`; // Muted version of the text color

  return (
    <section 
      id="contact" 
      className="py-32 px-4 md:px-8 transition-colors duration-500"
      style={{ backgroundColor: sectionBg, color: sectionFg }}
    >
      <div className="max-w-[1800px] mx-auto flex flex-col justify-between min-h-[50vh]">
        
        <div className="fade-up">
           <span className="text-sm font-bold uppercase mb-8 block" style={{ color: muted }}>
             04 / Contact
           </span>
           <h2 className="text-5xl md:text-8xl font-bold tracking-tighter mb-12">
             Have an idea?
           </h2>
        </div>

        <div className="flex flex-col gap-8 fade-up">
          {data.email && (
            <a 
              href={`mailto:${data.email}`} 
              className="text-4xl md:text-7xl font-bold tracking-tight underline decoration-2 underline-offset-8 transition-all hover:opacity-80"
              style={{ textDecorationColor: muted }}
            >
              {data.email}
            </a>
          )}

          <div className="flex flex-wrap gap-4 mt-8">
             {data.linkedin && (
               <a 
                 href={data.linkedin} 
                 target="_blank" 
                 rel="noreferrer" 
                 className="px-6 py-3 border rounded-full hover:bg-white hover:text-black transition"
                 style={{ borderColor: `${sectionFg}40` }}
               >
                 LinkedIn
               </a>
             )}
             {data.github && (
               <a 
                 href={data.github} 
                 target="_blank" 
                 rel="noreferrer" 
                 className="px-6 py-3 border rounded-full hover:bg-white hover:text-black transition"
                 style={{ borderColor: `${sectionFg}40` }}
               >
                 GitHub
               </a>
             )}
          </div>
        </div>

      </div>
    </section>
  );
};

export default Contact;