import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePortfolio } from "../../../../context/PortfolioContext";

const Home = ({ portfolioData }) => {
  const { portfolioData: contextData } = usePortfolio();
  const data = portfolioData || contextData || {};

  // --- Theme Integration ---
  // We default to the "Dark Mode" look of the Home section if no theme is set
  // fg = Foreground (Text), bg = Background
  const fg = data.themeFont || "#ffffff"; 
  const bg = data.themeBg || "#0a0a0a"; 

  // Track hover state for the badge animation
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section 
      id="home" 
      className="relative pt-40 pb-20 min-h-[90vh] flex flex-col justify-center overflow-hidden font-[Switzer] transition-colors duration-500"
      style={{ backgroundColor: bg }}
    >
      <div className="max-w-[1400px] mx-auto px-6 w-full relative z-10">
        
        {/* --- ANIMATED BADGE --- */}
        <motion.div 
            initial={{ y: 20, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            transition={{ duration: 0.6 }}
            className="mb-12 inline-block"
        >
            <motion.button
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
                layout
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                // Dynamic Border Color handling here via inline styles for the default state
                style={{ 
                    borderColor: isHovered ? "#ccff00" : fg, 
                    backgroundColor: isHovered ? "#ccff00" : "transparent"
                }}
                className={`
                    group relative flex items-center gap-4 px-2 py-2 pr-2 rounded-full border transition-all duration-300
                    ${isHovered 
                        ? "pl-8" // Hover: Padding shifts for icon on right
                        : "pr-8" // Default: Padding shifts for icon on left
                    }
                `}
            >
                <AnimatePresence mode="popLayout" initial={false}>
                    
                    {/* ICON CIRCLE */}
                    <motion.div 
                        layout="position" 
                        key="icon-circle"
                        className={`
                            w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-300
                            ${isHovered ? "bg-white text-black order-2" : "bg-[#ccff00] text-black order-1"}
                        `}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                        </svg>
                    </motion.div>

                    {/* TEXT */}
                    <motion.span 
                        layout="position"
                        key="badge-text"
                        style={{ color: isHovered ? "#000000" : fg }}
                        className={`
                           text-2xl md:text-3xl font-medium tracking-tight whitespace-nowrap transition-colors duration-300
                           ${isHovered ? "order-1 ml-2" : "order-2 ml-4"}
                        `}
                    >
                        Sprint past the competition
                    </motion.span>

                </AnimatePresence>
            </motion.button>
        </motion.div>
        {/* --- END ANIMATED BADGE --- */}


        {/* Massive Headline */}
        <motion.h1 
          initial={{ y: 30, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          transition={{ delay: 0.2, duration: 0.8 }}
          style={{ color: fg }}
          className="text-6xl md:text-8xl lg:text-[7.5rem] leading-[0.9] font-medium tracking-tighter mb-12 max-w-6xl"
        >
          {data.title || "Blazing fast brand sprints for startups."}
        </motion.h1>

        {/* Subtext & CTA Grid */}
        <div 
            className="grid md:grid-cols-12 gap-8 border-t pt-10 transition-colors duration-500"
            style={{ borderColor: fg, opacity: 0.9 }} // Using opacity to soften the border
        >
            <div className="md:col-span-5">
                <p 
                    className="text-xl leading-relaxed font-normal opacity-60"
                    style={{ color: fg }}
                >
                   {data.bio || "Zero to full brand in two weeks. No fluff, just high-impact design that converts."}
                </p>
            </div>
            <div className="md:col-span-7 flex justify-start md:justify-end">
                 <a 
                    href="#contact" 
                    className="group flex items-center gap-2 text-lg font-medium border-b pb-1 hover:opacity-100 opacity-90 transition-all"
                    style={{ color: fg, borderColor: fg }}
                 >
                    <span className="group-hover:text-[#ccff00] transition-colors">Start your sprint</span>
                    <span className="group-hover:translate-x-1 group-hover:text-[#ccff00] transition-all">→</span>
                 </a>
            </div>
        </div>

      </div>
    </section>
  );
};

export default Home;