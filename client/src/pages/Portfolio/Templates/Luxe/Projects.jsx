import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Github, ExternalLink } from "lucide-react";
import { usePortfolio } from "../../../../context/PortfolioContext";

// Components
import EditableText from "../EditableText";

const DEMO_IMAGES = [
  "/wallpap.jpg", 
  "/wallpap2.jpg", 
  "/luxe.jpg" 
];

const Projects = ({ portfolioData: propData, isReadOnly }) => {
  const { portfolioData: contextData, setPortfolioData } = usePortfolio();
  const data = propData || contextData || {};
  
  // Theme Config
  const bg = data.themeBg || "#ffffff";
  const fg = data.themeFont || "#111827";
  const accent = data.accentColor || "#D97706";

  const projects = Array.isArray(data.projects) && data.projects.length > 0 
    ? data.projects 
    : [
        { title: "Project Alpha", tech: "React, Tailwind", desc: "A high-performance digital solution.", demo: "#", github: "#" },
        { title: "Project Beta", tech: "Node, MongoDB", desc: "Scalable backend architecture for global systems.", demo: "#", github: "#" }
      ];

  /**
   * Updates a specific field for a project in the array
   */
  const handleUpdateProject = (index, field, value) => {
    const updatedProjects = [...projects];
    updatedProjects[index] = { ...updatedProjects[index], [field]: value };
    setPortfolioData({ ...data, projects: updatedProjects });
  };

  return (
    <section 
      id="projects" 
      className="px-6 md:px-12 py-32 border-t transition-colors duration-300 relative overflow-hidden"
      style={{ backgroundColor: bg, color: fg, borderColor: `${fg}10` }}
    >
      <div className="max-w-7xl mx-auto w-full">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20 border-b pb-6 flex justify-between items-end"
          style={{ borderColor: `${fg}20` }}
        >
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">
              (04) / Selection
            </span>
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">
               Selected <span style={{ color: accent }}>Works.</span>
            </h2>
          </div>
          <span className="text-xs font-black uppercase tracking-widest opacity-20">
            {projects.length} Total
          </span>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-32">
            {projects.map((project, index) => {
              const displayImage = project.image || DEMO_IMAGES[index % 3]; 

              return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-10%" }}
                className="group flex flex-col"
              >
                {/* Visual Card Area */}
                <div 
                  className="relative w-full aspect-[16/10] rounded-[2rem] overflow-hidden mb-8 border transition-all duration-700 hover:shadow-2xl bg-gray-50"
                  style={{ borderColor: `${fg}10` }}
                >
                  <img 
                    src={displayImage} 
                    alt={project.title} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                  />
                  
                  {/* Floating Tech Badge (Static/Visual) */}
                  <div className="absolute top-6 right-6">
                     <span className="px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-xl border"
                           style={{ backgroundColor: `${bg}80`, borderColor: `${fg}10`, color: fg }}>
                        <EditableText 
                          value={project.tech || "Modern Stack"} 
                          onChange={(v) => handleUpdateProject(index, 'tech', v)} 
                          readOnly={isReadOnly} 
                        />
                     </span>
                  </div>
                </div>

                {/* Project Info Area */}
                <div className="px-2">
                  <h3 className="text-3xl font-black uppercase tracking-tighter mb-4">
                    <EditableText 
                      value={project.title || "Untitled Project"} 
                      onChange={(v) => handleUpdateProject(index, 'title', v)} 
                      readOnly={isReadOnly} 
                    />
                  </h3>
                  
                  <div className="text-lg font-light leading-relaxed mb-10 opacity-60 min-h-[3em]">
                    <EditableText 
                      value={project.desc || project.description || "A deep dive into visual and architectural precision."} 
                      onChange={(v) => handleUpdateProject(index, 'desc', v)} 
                      readOnly={isReadOnly} 
                      multiline
                    />
                  </div>

                  {/* Action Buttons Area */}
                  <div className="flex flex-wrap items-center gap-8 pt-8 border-t" style={{ borderColor: `${fg}10` }}>
                    
                    {/* Live Demo Link */}
                    <div className="flex flex-col gap-2">
                      <a 
                        href={project.demo || "#"} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="flex items-center gap-2 text-xs font-black uppercase tracking-widest hover:opacity-50 transition-opacity"
                      >
                        <ExternalLink size={14} style={{ color: accent }} /> [ Live Demo ]
                      </a>
                      {!isReadOnly && (
                        <div className="text-[9px] font-mono opacity-30 lowercase">
                          <EditableText 
                            value={project.demo || "demo.url"} 
                            onChange={(v) => handleUpdateProject(index, 'demo', v)} 
                            readOnly={isReadOnly} 
                          />
                        </div>
                      )}
                    </div>

                    {/* GitHub Link */}
                    <div className="flex flex-col gap-2">
                      <a 
                        href={project.github || "#"} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="flex items-center gap-2 text-xs font-black uppercase tracking-widest hover:opacity-50 transition-opacity"
                      >
                        <Github size={14} style={{ color: accent }} /> [ Source ]
                      </a>
                      {!isReadOnly && (
                        <div className="text-[9px] font-mono opacity-30 lowercase">
                          <EditableText 
                            value={project.github || "repo.url"} 
                            onChange={(v) => handleUpdateProject(index, 'github', v)} 
                            readOnly={isReadOnly} 
                          />
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              </motion.div>
            )})}
        </div>
      </div>
    </section>
  );
};

export default Projects;