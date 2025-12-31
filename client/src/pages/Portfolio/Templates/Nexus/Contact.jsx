import React from "react";
import { motion } from "framer-motion";
import { usePortfolio } from "../../../../context/PortfolioContext";

const Contact = ({ portfolioData: propData }) => {
  const { portfolioData: contextData } = usePortfolio();
  const data = propData || contextData || {};

  const bg = data.themeBg || "#ffffff";
  const fg = data.themeFont || "#0f172a";
  const accent = data.accentColor || "#2563eb";

  return (
    <section id="contact" className="py-24 px-4" style={{ backgroundColor: bg }}>
       <motion.div 
         initial={{ opacity: 0, scale: 0.95 }}
         whileInView={{ opacity: 1, scale: 1 }}
         viewport={{ once: true }}
         className="max-w-6xl mx-auto rounded-[3rem] px-6 py-24 md:px-20 text-center relative overflow-hidden shadow-2xl"
         style={{ backgroundColor: fg, color: bg }}
       >
          {/* Decorative Glows inside the card */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-[100px] pointer-events-none mix-blend-overlay"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-[80px] pointer-events-none mix-blend-overlay"></div>

          <div className="relative z-10">
             <h2 className="text-4xl md:text-7xl font-bold mb-8 tracking-tight">
               Have an idea?
             </h2>
             <p className="text-lg md:text-2xl opacity-80 mb-12 max-w-2xl mx-auto font-light">
               I'm currently available for freelance projects and open to full-time opportunities.
             </p>
             
             <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
                <motion.a 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href={`mailto:${data.email || "email@example.com"}`} 
                  className="px-10 py-5 rounded-full font-bold text-xl transition-shadow shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]"
                  style={{ backgroundColor: bg, color: fg }}
                >
                   <i className="fa-solid fa-envelope mr-3"></i> Say Hello
                </motion.a>

                {data.linkedin && (
                  <motion.a 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    href={data.linkedin} 
                    target="_blank" 
                    rel="noreferrer"
                    className="px-10 py-5 rounded-full font-bold text-xl border transition-colors hover:bg-white/10"
                    style={{ borderColor: `${bg}40`, color: bg }}
                  >
                     LinkedIn
                  </motion.a>
                )}
             </div>
          </div>
       </motion.div>
    </section>
  );
};

export default Contact;