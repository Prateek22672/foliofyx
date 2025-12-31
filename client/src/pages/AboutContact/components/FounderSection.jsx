import React from "react";
import { ArrowUpRight, Linkedin } from "lucide-react";
import { motion } from "framer-motion";

// --- Sub-component for the Word-by-Word Reveal ---
const TypewriterText = ({ text, delay = 0 }) => {
  // Split by words instead of characters for perfect wrapping
  const words = text.split(" ");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: delay },
    },
  };

  const childVariants = {
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { type: "spring", damping: 12, stiffness: 100 },
    },
    hidden: { opacity: 0, y: 15, filter: "blur(4px)" },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      // Use flex-wrap to ensure text wraps to the next line naturally
      className="flex flex-wrap gap-x-[0.25em] gap-y-1 text-2xl md:text-4xl lg:text-5xl font-light leading-snug text-white/90"
    >
      {words.map((word, index) => (
        <motion.span key={index} variants={childVariants} className="relative">
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
};

// --- Main Component ---
const FounderSection = ({ onScrollToContact }) => {
  const quoteText = "I built FolioFYX because I believe everyone deserves a website that feels like a masterpiece, without needing a degree in computer science.";

  return (
    <div
      // 1. Solid Dark Background (No transparency issues)
      // 2. Sticky + Z-Index 30 to stack on top of previous section
      className="sticky top-0 h-screen z-30 w-full bg-[#020205] text-white rounded-t-[40px] md:rounded-t-[60px] shadow-[0_-25px_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col font-['Wix_Madefor_Text']"
    >
      {/* Background Grid (Very subtle) */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none"></div>

      <section className="relative z-10 w-full h-full flex flex-col justify-center py-12 px-6 md:px-12 max-w-7xl mx-auto">
        
        {/* --- Top Decoration --- */}
        <div className="absolute top-12 left-6 md:left-12">
            <motion.div 
                initial={{ opacity: 0, width: 0 }}
                whileInView={{ opacity: 1, width: "3rem" }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="h-[2px] bg-blue-500 mb-4"
            />
            <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-blue-500/80 uppercase tracking-[0.3em] text-[10px] md:text-xs font-bold"
            >
                Est. 2025 // Studio Lead
            </motion.p>
        </div>

        {/* --- GIANT Background Text (Fixed clipping & Opacity) --- */}
        <h2 className="absolute top-[10%] -left-[5%] text-[15vw] md:text-[12rem] font-black text-white/[0.03] select-none pointer-events-none leading-none z-0">
            ARCHITECT
        </h2>

        {/* --- MAIN CONTENT CENTERED --- */}
        <div className="relative z-10 flex flex-col gap-12 md:gap-16 mt-10">
            
            {/* The Quote */}
            <div className="max-w-5xl relative">
                {/* Decorative Quote Mark */}
                <span className="absolute -top-8 -left-4 md:-left-8 text-6xl md:text-8xl text-blue-500/20 font-serif leading-none">
                    “
                </span>
                <TypewriterText text={quoteText} delay={0.2} />
            </div>

            {/* Bottom Info Row */}
            <div className="flex flex-col md:flex-row items-end justify-between gap-8 border-t border-white/10 pt-8">
                
                {/* Name & Title */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 1 }}
                >
                    <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-white">Prateek Koratala</h3>
                    <p className="text-white/40 text-sm md:text-base mt-1">Founder & Lead Engineer</p>
                </motion.div>

                {/* Buttons & Image */}
                <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                    <motion.div 
                         initial={{ opacity: 0, scale: 0.9 }}
                         whileInView={{ opacity: 1, scale: 1 }}
                         transition={{ delay: 1.2 }}
                         className="flex gap-4"
                    >
                        <button 
                            onClick={onScrollToContact}
                            className="bg-white text-black px-6 md:px-8 py-3 rounded-full font-bold hover:bg-blue-500 hover:text-white transition-all duration-300 flex items-center gap-2 text-sm md:text-base"
                        >
                            Let's Collaborate <ArrowUpRight size={18} />
                        </button>
                        <a 
                            href="https://linkedin.com" 
                            target="_blank" 
                            rel="noreferrer"
                            className="w-12 h-12 flex items-center justify-center rounded-full border border-white/20 hover:bg-white hover:text-black transition-all"
                        >
                            <Linkedin size={18} />
                        </a>
                    </motion.div>

                    {/* Small Image Tile */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.4 }}
                        className="hidden md:block w-30 h-10 rounded-2xl overflow-hidden border border-white/10 grayscale hover:grayscale-0 transition-all duration-500"
                    >
                         <img src="/fyxw.png" alt="Profile" className="w-30 object-cover" />
                    </motion.div>
                </div>
            </div>
        </div>

      </section>
    </div>
  );
};

export default FounderSection;