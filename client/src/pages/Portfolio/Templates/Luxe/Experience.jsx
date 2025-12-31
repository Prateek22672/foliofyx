import React from "react";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { usePortfolio } from "../../../../context/PortfolioContext";

const Experience = ({ portfolioData: propData }) => {
  const { portfolioData: contextData } = usePortfolio();
  const data = propData || contextData || {};
  const bg = data.themeBg || "#ffffff";
  const fg = data.themeFont || "#111827";

  // --- 1. SKILLS LIST (Capabilities) ---
  const rawSkills = Array.isArray(data?.skills) ? data.skills : [];
  const skillItems = rawSkills.length > 0 
    ? rawSkills 
    : [
        { name: "Web Development" },
        { name: "UI/UX Design" },
        { name: "System Architecture" },
        { name: "Mobile Apps" }
      ];

  // --- 2. WORK HISTORY (Journey) ---
  const hasRealJobs = data.experience && Array.isArray(data.experience) && data.experience.length > 0;
  const jobList = hasRealJobs ? data.experience : [];

  return (
    <section 
        id="services" 
        className="px-6 md:px-12 py-24 border-t transition-colors duration-300"
        style={{ backgroundColor: bg, color: fg, borderColor: `${fg}10` }}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16">
        
        {/* Label */}
        <div className="lg:col-span-4">
          <motion.div 
            className="sticky top-32"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 0.8, x: 0 }}
            viewport={{ once: true }}
          >
            <span 
                className="text-xs font-bold uppercase tracking-widest block mb-4"
                style={{ color: fg }}
            >
                Expertise
            </span>
          </motion.div>
        </div>

        {/* Content */}
        <div className="lg:col-span-8 flex flex-col">
          
          {/* Header */}
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-2xl md:text-3xl leading-snug mb-16 max-w-2xl" 
            style={{ color: fg }}
          >
            My technical toolset designed to <span style={{ opacity: 0.4 }}> solve complex problems.</span>
          </motion.h3>

          {/* --- SECTION 1: CAPABILITIES (Skills) --- */}
          <div className="border-t mb-24" style={{ borderColor: `${fg}15` }}>
            {skillItems.map((item, index) => (
              <motion.div 
                key={`skill-${index}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-5%" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group py-8 border-b flex justify-between items-center cursor-pointer transition-all hover:pl-4"
                style={{ borderColor: `${fg}15` }}
              >
                <span className="text-2xl md:text-4xl font-light transition-transform duration-500" style={{ color: fg }}>
                  {typeof item === 'string' ? item : item.name}
                </span>
                <ArrowDown 
                    className="transition-transform duration-300 group-hover:rotate-0 -rotate-90" 
                    size={24} 
                    style={{ color: fg, opacity: 0.3 }}
                />
              </motion.div>
            ))}
          </div>

          {/* --- SECTION 2: JOURNEY (Work History) --- */}
          {/* Only show if jobs exist */}
          {jobList.length > 0 && (
            <>
                <motion.h4 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="text-xs font-bold uppercase tracking-widest mb-8"
                    style={{ color: fg, opacity: 0.6 }}
                >
                    Work History
                </motion.h4>

                <div className="border-t" style={{ borderColor: `${fg}15` }}>
                    {jobList.map((job, index) => {
                         if (typeof job !== 'object') return null;
                         return (
                            <motion.div 
                                key={`job-${index}`}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="py-8 border-b grid md:grid-cols-2 gap-4"
                                style={{ borderColor: `${fg}15` }}
                            >
                                <div>
                                    <h5 className="text-xl font-medium">{job.company || "Company"}</h5>
                                    <p className="opacity-50 text-sm mt-1">{job.role || "Role"}</p>
                                </div>
                                <div className="flex flex-col md:items-end justify-center">
                                    <span className="text-sm font-mono opacity-60">{job.period || "Year"}</span>
                                    <p className="text-sm opacity-50 mt-2 max-w-xs md:text-right hidden md:block">
                                        {job.desc && job.desc.substring(0, 60)}...
                                    </p>
                                </div>
                            </motion.div>
                         );
                    })}
                </div>
            </>
          )}

        </div>
      </div>
    </section>
  );
};

export default Experience;