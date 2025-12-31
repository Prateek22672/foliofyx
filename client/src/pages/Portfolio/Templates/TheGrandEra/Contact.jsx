import React from "react";
import { motion } from "framer-motion";
import { usePortfolio } from "../../../../context/PortfolioContext";

const Contact = ({ portfolioData: propData }) => {
  const { portfolioData: contextData } = usePortfolio();
  const data = propData || contextData || {};

  const bg = data.themeBg || "#ffffff";
  const fg = data.themeFont || "#000000";
  const accent = data.accentColor || "#2563eb";

  return (
    <section id="contact" className="min-h-screen flex flex-col justify-between pt-32 pb-10 px-6" style={{ backgroundColor: bg, color: fg }}>
      
      <div>
        <p className="text-sm font-mono uppercase mb-4">// Next Steps</p>
        <h2 className="text-[10vw] leading-[0.8] font-black uppercase tracking-tighter mb-10">
          Let's Build <br/> Something <br/> 
          <span className="text-transparent" style={{ WebkitTextStroke: `2px ${accent}` }}>Iconic</span>
        </h2>
      </div>

      <div className="border-t-2 pt-10" style={{ borderColor: fg }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-20">
            <a 
              href={`mailto:${data.email}`}
              className="text-3xl md:text-5xl font-bold underline decoration-4 underline-offset-8 hover:bg-black hover:text-white transition-colors p-4 inline-block"
              style={{ decorationColor: accent }}
            >
              {data.email || "hello@foliofyx.com"}
            </a>
            
            <div className="flex gap-4 items-center md:justify-end">
               {data.linkedin && <a href={data.linkedin} className="px-8 py-4 border-2 rounded-full font-bold uppercase hover:bg-black hover:text-white transition-all" style={{ borderColor: fg }}>LinkedIn</a>}
               {data.github && <a href={data.github} className="px-8 py-4 border-2 rounded-full font-bold uppercase hover:bg-black hover:text-white transition-all" style={{ borderColor: fg }}>Github</a>}
            </div>
        </div>


      </div>
    </section>
  );
};

export default Contact;