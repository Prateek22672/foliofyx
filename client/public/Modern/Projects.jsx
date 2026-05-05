// src/components/Projects.jsx
import React from "react";
import { usePortfolio } from "../../../../context/PortfolioContext";
import VideoBackground from "./VideoBackground";

const Projects = ({ portfolioData: propData }) => {
  const { portfolioData: contextData } = usePortfolio();
  const data = propData || contextData;

  const projects = Array.isArray(data?.projects)
    ? data.projects
    : typeof data?.projects === "string"
    ? data.projects.split(",").map((p) => ({ title: p.trim(), tech: "Tech Stack" }))
    : [];

  return (
    <section
      id="projects"
      className="relative py-24 px-6 min-h-screen flex flex-col justify-center"
      style={{
        backgroundColor: data?.themeBg || "#000",
        color: data?.themeFont || "#fff",
      }}
    >
      <VideoBackground blur="5px" />

      <div className="relative z-10 max-w-6xl mx-auto w-full">
        <div className="text-center mb-16">
          <p className="text-gray-400 text-sm uppercase tracking-wider mb-2">Browse My Recent</p>
          <h2 className="text-4xl md:text-5xl font-bold">Projects</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all duration-300 flex flex-col"
            >
              <div className="h-48 rounded-2xl bg-gradient-to-br from-gray-800 to-black mb-6 overflow-hidden relative group">
                 {/* Placeholder for project image */}
                 <div className="absolute inset-0 flex items-center justify-center text-gray-500 font-bold text-xl group-hover:scale-105 transition-transform duration-500">
                    {project.title.charAt(0)}
                 </div>
              </div>
              
              <h3 className="text-2xl font-bold mb-2">{project.title}</h3>
              <p className="text-gray-400 text-sm mb-6 flex-grow">{project.tech || "Technologies used"}</p>
              
              <div className="flex gap-4 mt-auto">
                <a
                  href={project.github || "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-3 rounded-full border border-white/30 text-center font-semibold hover:bg-white hover:text-black transition-colors"
                >
                  GitHub
                </a>
                <a
                  href={project.demo || "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-3 rounded-full bg-white text-black text-center font-semibold hover:bg-purple-500 hover:text-white transition-colors"
                >
                  Live Demo
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;