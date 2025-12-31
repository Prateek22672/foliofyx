import React from "react";
import { motion } from "framer-motion";
import { usePortfolio } from "../../../../context/PortfolioContext";
import { ArrowDown } from "lucide-react";

const About = ({ portfolioData: propData }) => {
  const { portfolioData: contextData } = usePortfolio();
  const data = propData || contextData || {};
  
  // Safe Data Extraction
  const skills = Array.isArray(data?.skills) ? data.skills : [];
  
  // Safe Experience Summary (Prevents Object Crash)
  let experienceSummary = "N/A";
  if (Array.isArray(data.experience) && data.experience.length > 0) {
      experienceSummary = `${data.experience.length} Roles`;
  } else if (typeof data.experience === 'string') {
      experienceSummary = data.experience;
  }

  const bg = data.themeBg || "#ffffff";
  const fg = data.themeFont || "#111827";

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
             <span className="text-xs font-bold uppercase tracking-widest" style={{ color: fg, opacity: 0.4 }}>
               Biography
             </span>
             <h2 className="text-4xl md:text-6xl font-medium mt-4 leading-[1.1] tracking-tight">
               Beyond <br/> the code.
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
               <p className="text-2xl md:text-3xl leading-relaxed font-light" style={{ color: fg, opacity: 0.9 }}>
                  {data?.bio || "Write something about yourself…"}
               </p>
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
               {/* Experience */}
               <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-widest mb-6" style={{ color: fg, opacity: 0.4 }}>
                    Experience
                  </h3>
                  <p className="text-xl font-medium mb-3">
                    {experienceSummary}
                  </p>
                  <p className="text-sm leading-relaxed" style={{ opacity: 0.6 }}>
                    {skills.length > 0
                        ? skills.slice(0, 6).map((s) => typeof s === 'string' ? s : s.name).join(" • ")
                        : "Add skills to display here"
                    }
                  </p>
               </div>

               {/* Education */}
               <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-widest mb-6" style={{ color: fg, opacity: 0.4 }}>
                    Education
                  </h3>
                  <p className="text-xl font-medium">
                    {data?.education || "Add education"}
                  </p>
               </div>
            </motion.div>
            
            {/* Scroll Indicator */}
            <motion.a 
                href="#services" 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-opacity hover:opacity-60"
                style={{ color: fg }}
            >
               Scroll for Services <ArrowDown size={14} />
            </motion.a>
        </div>
      </div>
    </section>
  );
};

export default About;