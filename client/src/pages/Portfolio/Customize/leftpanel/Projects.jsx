import React from "react";
import { FolderGit2, Plus, Github, ExternalLink, Trash2, X } from "lucide-react";
import SearchSuggestion from "../../../../components/SearchSuggestion";

const Projects = ({ 
  portfolioData, 
  setPortfolioData, 
  projectTitle, setProjectTitle, 
  projectGithub, setProjectGithub, 
  projectDemo, setProjectDemo, 
  projectTechs, toggleProjectTech, 
}) => {

  const handleAddProject = () => {
    if (!projectTitle.trim()) return;

    const newProject = {
      title: projectTitle,
      tech: projectTechs.join(", "),
      github: projectGithub,
      demo: projectDemo
    };

    const updatedProjects = [...(portfolioData.projects || []), newProject];
    setPortfolioData({ ...portfolioData, projects: updatedProjects });

    setProjectTitle("");
    setProjectGithub("");
    setProjectDemo("");
  };

  const handleRemoveProject = (index) => {
    const updatedProjects = portfolioData.projects.filter((_, i) => i !== index);
    setPortfolioData({ ...portfolioData, projects: updatedProjects });
  };

  return (
    <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
      <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-500 mb-6">
        <FolderGit2 size={16} /> Projects
      </h2>

      {/* 🟢 INPUT AREA */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6 space-y-3">
        {/* Project Title Input */}
        <input
          value={projectTitle}
          onChange={(e) => setProjectTitle(e.target.value)}
          placeholder="Project Title"
          className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 outline-none transition-all"
        />
        
        {/* Links Grid */}
        <div className="grid grid-cols-2 gap-3">
          <input
            value={projectGithub}
            onChange={(e) => setProjectGithub(e.target.value)}
            placeholder="GitHub URL"
            className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 outline-none transition-all"
          />
          <input
            value={projectDemo}
            onChange={(e) => setProjectDemo(e.target.value)}
            placeholder="Demo URL"
            className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 outline-none transition-all"
          />
        </div>
        
        {/* Search Component */}
        <div className="relative">
             <SearchSuggestion
              dataFile="technologies.txt"
              multiple={true}
              selected={projectTechs} 
              onToggle={toggleProjectTech}
              placeholder="Search Tech (e.g. React)"
              // Ensure the internal input of SearchSuggestion also has text-slate-900 if you have access to modify it. 
              // Assuming standard styling matches parent, otherwise wrapper helps context.
            />
        </div>

        {/* SELECTED TECH DISPLAY */}
        {projectTechs.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2 p-3 bg-white border border-slate-200 rounded-xl border-dashed">
            <span className="text-[10px] text-slate-400 w-full uppercase font-bold tracking-wider mb-1">
              Selected Stack:
            </span>
            {projectTechs.map((tech) => (
              <button
                key={tech}
                onClick={() => toggleProjectTech(tech)} 
                className="flex items-center gap-1 pl-3 pr-2 py-1.5 bg-white border border-slate-200 rounded-full text-xs font-medium text-slate-700 shadow-sm hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition-all group"
              >
                {tech}
                <X size={12} className="text-slate-400 group-hover:text-red-500" />
              </button>
            ))}
          </div>
        )}

        {/* Add Button */}
        <button
          onClick={handleAddProject} 
          className="w-full py-3 mt-2 bg-[#0F172A] text-white text-xs font-bold uppercase tracking-wide rounded-xl hover:bg-slate-800 hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
        >
          <Plus size={16} /> Add Project
        </button>
      </div>

      {/* 🟢 LIST OF ADDED PROJECTS */}
      <div className="space-y-3">
        {portfolioData.projects?.map((p, i) => (
          <div key={i} className="group bg-white border border-slate-100 p-4 rounded-xl shadow-sm hover:shadow-md hover:border-indigo-100 transition-all relative">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">{p.title}</h3>
                <p className="text-xs text-indigo-500 font-medium mt-1 bg-indigo-50 inline-block px-2 py-0.5 rounded-md border border-indigo-100">{p.tech}</p>
              </div>
              <button onClick={() => handleRemoveProject(i)} className="text-slate-300 hover:text-red-500 transition-colors p-1 rounded-md hover:bg-red-50">
                <Trash2 size={14} />
              </button>
            </div>
            <div className="flex gap-3 mt-3">
               {p.github && <a href={p.github} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 hover:text-slate-900 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200 transition-colors"><Github size={12} /> Code</a>}
               {p.demo && <a href={p.demo} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 hover:text-indigo-600 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200 transition-colors"><ExternalLink size={12} /> Demo</a>}
            </div>
          </div>
        ))}
        {(!portfolioData.projects || portfolioData.projects.length === 0) && (
            <div className="text-center py-8 border-2 border-dashed border-slate-100 rounded-xl">
                <FolderGit2 size={24} className="mx-auto text-slate-200 mb-2" />
                <p className="text-xs text-slate-400 font-medium">No projects added yet.</p>
            </div>
        )}
      </div>
    </section>
  );
};

export default Projects;