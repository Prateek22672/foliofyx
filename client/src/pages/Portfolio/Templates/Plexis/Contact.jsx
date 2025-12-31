import React from "react";
import { usePortfolio } from "../../../../context/PortfolioContext";
import useFadeInOnScroll from "../../../../hooks/useFadeInOnScroll";

const DEFAULT_BG = "#ffffff";
const DEFAULT_FG = "#111827";

const Contact = ({ portfolioData: propData }) => {
  useFadeInOnScroll();

  const { portfolioData: contextData } = usePortfolio();
  const data = propData || contextData || {};

  const bg = data.themeBg || DEFAULT_BG;
  const fg = data.themeFont || DEFAULT_FG;
  const muted = data.themeFont ? `${data.themeFont}99` : "#6b728099";
  const borderColor = `${fg}20`;

return (
    <section
      id="contact"
      className="relative flex flex-col min-h-[80vh]"
      style={{ background: bg, color: fg }}
    >
      <div className="flex-grow grid md:grid-cols-2 h-full">
         
         {/* LEFT: Sticky Title */}
         <div className="p-8 md:p-16 border-b md:border-b-0 md:border-r border-gray-100" style={{ borderColor: borderColor }}>
            <div className="sticky top-32 fade-up">
               <span className="text-sm font-bold uppercase tracking-widest opacity-50 mb-4 block">04 / Contact</span>
               <h2 className="text-5xl md:text-7xl font-bold uppercase leading-none">
                 Get in<br/>Touch.
               </h2>
            </div>
         </div>

         {/* RIGHT: Content */}
         <div className="p-8 md:p-16 flex flex-col justify-center">
            
            {/* Removed the hardcoded "Currently available..." text */}

            {/* Huge Email Link */}
            <div className="mb-12 fade-up">
              {data.email ? (
                <a 
                  href={`mailto:${data.email}`}
                  className="text-3xl md:text-5xl font-bold underline decoration-2 underline-offset-8 hover:opacity-50 transition break-all"
                  style={{ textDecorationColor: borderColor }}
                >
                  {data.email}
                </a>
              ) : (
                <span className="text-2xl opacity-50">Add your email</span>
              )}
            </div>

            {/* Social Links List */}
            <div className="flex flex-col gap-4 fade-up">
               <span className="uppercase tracking-widest text-sm opacity-50 font-bold">Socials</span>
               <div className="flex gap-8">
                  {data.linkedin && (
                    <a href={data.linkedin} target="_blank" rel="noreferrer" className="text-lg font-bold hover:underline">
                      LinkedIn
                    </a>
                  )}
                  {data.github && (
                    <a href={data.github} target="_blank" rel="noreferrer" className="text-lg font-bold hover:underline">
                      GitHub
                    </a>
                  )}
               </div>
            </div>

         </div>
      </div>
    </section>
  );
};

export default Contact;