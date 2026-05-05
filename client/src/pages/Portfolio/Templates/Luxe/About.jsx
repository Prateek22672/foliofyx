import React from "react";
import { motion } from "framer-motion";
import { usePortfolio } from "../../../../context/PortfolioContext";
import { ArrowDown } from "lucide-react";

// Components
import EditableText from "../EditableText";

const About = ({ portfolioData: propData, isReadOnly }) => {
  const { portfolioData: contextData, setPortfolioData } = usePortfolio();
  const data = propData || contextData || {};
  
  // Theme Config
  const bg = data.themeBg || "#ffffff";
  const fg = data.themeFont || "#111827";
  const accent = data.accentColor || "#D97706";

  // Safe Data Extraction
  const skills = Array.isArray(data?.skills) ? data.skills : [];
  
  // Safe Experience Summary
  let experienceSummary = "N/A";
  if (Array.isArray(data.experience) && data.experience.length > 0) {
      experienceSummary = `${data.experience.length} Roles`;
  } else if (typeof data.experience === 'string') {
      experienceSummary = data.experience;
  }

  return (
    <section 
      id="about" 
      className="py-32 px-6 md:px-12 border-t transition-colors duration-300"
      style={{ backgroundColor: bg, color: fg, borderColor: `${fg}10` }}
    >
      <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-16">
        
        {/* --- LEFT: Sticky Label --- */}
        <div className="lg:col-span-4">
           <motion.div 
             className="sticky top-32"
             initial={{ opacity: 0, x: -20 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.6 }}
           >
             <span className="text-xs font-black uppercase tracking-[0.4em] mb-4 block" style={{ color: fg, opacity: 0.3 }}>
               (02) / Biography
             </span>
             <h2 className="text-4xl md:text-6xl font-black mt-4 leading-[1] tracking-tighter uppercase">
                <EditableText
                  value={data.aboutTitle || "Beyond the code."}
                  onChange={(val) => setPortfolioData({ ...data, aboutTitle: val })}
                  readOnly={isReadOnly}
                />
             </h2>
           </motion.div>
        </div>

        {/* --- RIGHT: Content --- */}
        <div className="lg:col-span-8 flex flex-col gap-16">
            
            {/* 1. BIO HERO */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.7 }}
            >
               <div className="text-2xl md:text-4xl leading-tight font-bold tracking-tight" style={{ color: fg }}>
                  <EditableText
                    value={data.bio || "Write something about yourself…"}
                    onChange={(val) => setPortfolioData({ ...data, bio: val })}
                    readOnly={isReadOnly}
                    multiline
                  />
               </div>
            </motion.div>

            {/* 2. Stats Grid */}
            <motion.div 
                className="grid md:grid-cols-2 gap-12 pt-12 border-t"
                style={{ borderColor: `${fg}10` }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.7, delay: 0.2 }}
            >
               {/* Experience Status */}
               <div className="pt-8">
                  <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-6 opacity-40">
                    Status
                  </h3>
                  <div className="text-xl font-bold uppercase mb-3">
                    <EditableText
                      value={data.experienceSummary || experienceSummary}
                      onChange={(val) => setPortfolioData({ ...data, experienceSummary: val })}
                      readOnly={isReadOnly}
                    />
                  </div>
                  <p className="text-sm font-mono leading-relaxed opacity-50">
                    {skills.length > 0
                        ? skills.slice(0, 6).map((s) => typeof s === 'string' ? s : s.name).join(" • ")
                        : "Add skills to display here"
                    }
                  </p>
               </div>

               {/* Education */}
               <div className="pt-8">
                  <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-6 opacity-40">
                    Academic Path
                  </h3>
                  <div className="text-xl font-bold uppercase">
                    <EditableText
                      value={data?.education || "Add education"}
                      onChange={(val) => setPortfolioData({ ...data, education: val })}
                      readOnly={isReadOnly}
                    />
                  </div>
               </div>
            </motion.div>
            
            {/* Scroll Indicator */}
            <motion.a 
                href="#services" 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="inline-flex items-center gap-4 text-xs font-black uppercase tracking-[0.2em] transition-opacity hover:opacity-60"
                style={{ color: fg }}
            >
                Next Section <ArrowDown size={14} style={{ color: accent }} />
            </motion.a>
        </div>
      </div>
    </section>
  );
};

export default About;