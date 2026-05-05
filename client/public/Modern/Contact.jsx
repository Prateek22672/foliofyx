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

  return (
    <section id="contact" className="py-40 px-6 font-[Switzer]" style={{ background: bg, color: fg }}>
      <div className="max-w-4xl mx-auto text-center fade-up">
        <h2 className="text-5xl md:text-8xl font-bold mb-10 tracking-tighter">
            Let's work <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">together.</span>
        </h2>
        
        <p className="text-xl opacity-70 mb-12 max-w-2xl mx-auto">
            Ready to start your next project? Drop me a line and let's create something amazing.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
             {data.email ? (
                <a 
                    href={`mailto:${data.email}`}
                    className="px-10 py-5 rounded-full bg-black text-white text-lg font-bold shadow-xl hover:scale-105 transition-transform duration-300"
                >
                    {data.email}
                </a>
             ) : (
                <span className="opacity-50">Add email in settings</span>
             )}

             {data.linkedin && (
                <a 
                    href={data.linkedin} 
                    target="_blank" 
                    rel="noreferrer"
                    className="px-10 py-5 rounded-full border border-current/20 text-lg font-bold hover:bg-black/5 transition-colors"
                >
                    LinkedIn Profile
                </a>
             )}
        </div>
      </div>
    </section>
  );
};

export default Contact;