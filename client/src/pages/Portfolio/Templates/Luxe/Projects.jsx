import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { usePortfolio } from "../../../../context/PortfolioContext";

const DEMO_IMAGES = [
  "/wallpap.jpg", 
  "/wallpap2.jpg", 
  "/luxe.jpg" 
];

const Projects = ({ portfolioData: propData }) => {
  const { portfolioData: contextData } = usePortfolio();
  const data = propData || contextData || {};
  const bg = data.themeBg || "#ffffff";
  const fg = data.themeFont || "#111827";

  let projects = Array.isArray(data.projects) && data.projects.length > 0 
    ? data.projects 
    : [
        { title: "E-Commerce Rebrand", tech: "Design, UX", link: "#", desc: "A complete visual overhaul for a major fashion retailer." },
        { title: "Financial Dashboard", tech: "React, D3.js", link: "#", desc: "Real-time data visualization platform for crypto trading." }
      ];

  return (
    <section 
      id="projects" 
      className="px-6 md:px-12 py-32 border-t transition-colors duration-300 sticky top-0 z-0 min-h-screen flex flex-col justify-center overflow-hidden"
      style={{ backgroundColor: bg, color: fg, borderColor: `${fg}10` }}
    >
      <div className="max-w-7xl mx-auto w-full">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20 border-b pb-6 flex justify-between items-end"
          style={{ borderColor: `${fg}20` }}
        >
          <span className="text-xs font-bold uppercase tracking-widest" style={{ opacity: 1 }}>
            Selected Work
          </span>
          <span className="text-xs font-bold uppercase tracking-widest" style={{ opacity: 0.4 }}>
            {projects.length < 10 ? `0${projects.length}` : projects.length} Projects
          </span>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-24">
            {projects.map((project, index) => {
              const displayImage = project.image || DEMO_IMAGES[index % 2]; 

              // --- FIX: Safely get the first tech item ---
              // If it's an Array (New Editor), take index 0. 
              // If it's a String (Old Data), split and take index 0.
              const techLabel = Array.isArray(project.tech) 
                ? (project.tech[0] || "Development")
                : (project.tech ? project.tech.split(',')[0] : "Development");

              return (
              <motion.a
                key={index}
                href={project.demo || project.link || "#"}
                target="_blank"
                rel="noreferrer"
                // ✅ STAGGER EFFECT
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: index * 0.2, ease: "easeOut" }}
                viewport={{ once: true, margin: "-10%" }}
                className="group block cursor-pointer"
              >
                {/* Image Card */}
                <div 
                  className="relative w-full aspect-[4/3] rounded-[2rem] overflow-hidden mb-8 border transition-all duration-700 group-hover:shadow-2xl"
                  style={{ backgroundColor: `${fg}05`, borderColor: `${fg}10` }}
                >
                  <img 
                      src={displayImage} 
                      alt={project.title} 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                      onError={(e) => { e.target.src = "/luxe.jpg"; }} 
                  />
                  
                  <div className="absolute bottom-6 left-6 w-14 h-14 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg border transition-transform duration-300 group-hover:scale-110"
                       style={{ backgroundColor: `${bg}E6`, borderColor: `${fg}10` }}
                  >
                    <ArrowUpRight size={24} style={{ color: fg }} />
                  </div>
                </div>

                {/* Text */}
                <div className="px-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest block mb-3" style={{ color: fg, opacity: 0.4 }}>
                    {/* ✅ FIXED ERROR HERE: Using the calculated techLabel variable */}
                    {techLabel}
                  </span>
                  
                  <h3 className="text-3xl font-medium transition-colors" style={{ color: fg }}>
                    {project.title}
                  </h3>
                  
                  <p className="mt-3 line-clamp-2 font-light text-lg" style={{ color: fg, opacity: 0.6 }}>
                    {project.desc || "A curated digital experience focusing on aesthetic precision."}
                  </p>
                </div>
              </motion.a>
            )})}
        </div>
      </div>
    </section>
  );
};

export default Projects;