import React, { useState } from "react";
import { FolderGit2, Plus, Github, Trash2, X, Edit2, Check, Undo2, FileText } from "lucide-react";
import SearchSuggestion from "../../../../components/SearchSuggestion";

const Projects = ({ 
  portfolioData, 
  setPortfolioData, 
  projectTitle, setProjectTitle, 
  projectGithub, setProjectGithub, 
  projectDemo, setProjectDemo, 
  projectTechs, toggleProjectTech, 
}) => {
  const [editingIndex, setEditingIndex] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [newDescription, setNewDescription] = useState(""); // State for new project description

  const handleAddProject = () => {
    if (!projectTitle.trim()) return;

    const newProject = {
      title: projectTitle,
      tech: projectTechs.join(", "),
      github: projectGithub || "",
      demo: projectDemo || "",
      description: newDescription || "" //
    };

    setPortfolioData(prev => ({
      ...prev,
      projects: [...(prev.projects || []), newProject]
    }));

    // Reset local states
    setProjectTitle("");
    setProjectGithub("");
    setProjectDemo("");
    setNewDescription("");
  };

  const handleRemoveProject = (index) => {
    const updatedProjects = portfolioData.projects.filter((_, i) => i !== index);
    setPortfolioData({ ...portfolioData, projects: updatedProjects });
  };

  const startEditing = (index, project) => {
    setEditingIndex(index);
    setEditValues({ ...project });
  };

  const saveEdit = (index) => {
    const updatedProjects = [...portfolioData.projects];
    updatedProjects[index] = editValues;
    setPortfolioData({ ...portfolioData, projects: updatedProjects });
    setEditingIndex(null);
  };

  return (
    <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
      <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-500 mb-6">
        <FolderGit2 size={16} /> Projects
      </h2>

      {/* 🟢 NEW PROJECT INPUT AREA */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6 space-y-3">
        <input
          value={projectTitle}
          onChange={(e) => setProjectTitle(e.target.value)}
          placeholder="New Project Title"
          className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 outline-none transition-all shadow-sm"
        />
        
        {/* New Description Input for Creation */}
        <textarea
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          placeholder="Project Description (What did you build?)"
          className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 outline-none transition-all shadow-sm min-h-[80px] resize-none"
        />

        <div className="grid grid-cols-2 gap-3">
          <input
            value={projectGithub}
            onChange={(e) => setProjectGithub(e.target.value)}
            placeholder="GitHub URL"
            className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 outline-none focus:border-indigo-500 shadow-sm"
          />
          <input
            value={projectDemo}
            onChange={(e) => setProjectDemo(e.target.value)}
            placeholder="Demo URL"
            className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 outline-none focus:border-indigo-500 shadow-sm"
          />
        </div>
        
        <SearchSuggestion
          dataFile="technologies.txt"
          multiple={true}
          selected={projectTechs} 
          onToggle={toggleProjectTech}
          placeholder="Search Tech (e.g. React)"
        />

        <button
          onClick={handleAddProject} 
          className="w-full py-3 bg-[#0F172A] text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-lg"
        >
          <Plus size={16} /> Add Project
        </button>
      </div>

      {/* 🟢 PROJECT LIST WITH EDITABLE DESCRIPTIONS */}
      <div className="space-y-4">
        {portfolioData.projects?.map((p, i) => (
          <div key={i} className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm hover:border-indigo-200 transition-all">
            {editingIndex === i ? (
              /* 🛠️ EDIT MODE UI */
              <div className="space-y-3">
                <input
                  value={editValues.title}
                  onChange={(e) => setEditValues({ ...editValues, title: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-indigo-200 rounded-lg text-sm font-bold text-slate-900 outline-none"
                />
                <textarea
                  value={editValues.description}
                  onChange={(e) => setEditValues({ ...editValues, description: e.target.value })}
                  placeholder="Project Description"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 outline-none min-h-[100px]"
                />
                <input
                  value={editValues.tech}
                  onChange={(e) => setEditValues({ ...editValues, tech: e.target.value })}
                  placeholder="Tech Stack"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 outline-none"
                />
                <div className="flex gap-2">
                  <button onClick={() => saveEdit(i)} className="flex-1 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1 hover:bg-indigo-700 font-mono tracking-tighter"><Check size={14}/> SAVE CHANGES</button>
                  <button onClick={() => setEditingIndex(null)} className="flex-1 py-2 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold flex items-center justify-center gap-1 hover:bg-slate-200 font-mono tracking-tighter"><Undo2 size={14}/> CANCEL</button>
                </div>
              </div>
            ) : (
              /* 📄 VIEW MODE UI */
              <>
                <div className="flex justify-between items-start mb-2">
                  <div className="cursor-pointer group/title w-full" onClick={() => startEditing(i, p)}>
                    <h3 className="font-bold text-slate-900 text-sm leading-snug group-hover/title:text-indigo-600 transition-colors">
                      {p.title}
                    </h3>
                  </div>
                  <button onClick={() => handleRemoveProject(i)} className="text-slate-300 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-all ml-2">
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* Visible Description in Sidebar */}
                <p className="text-[11px] text-slate-500 line-clamp-2 mb-3 leading-relaxed">
                  {p.description || "No description provided."}
                </p>

                <div className="text-[10px] text-indigo-600 font-bold bg-indigo-50 px-2 py-1 rounded-md border border-indigo-100 inline-block uppercase tracking-tight">
                  {p.tech || "No tech listed"}
                </div>

                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-50">
                   <button 
                     onClick={() => startEditing(i, p)} 
                     className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 hover:text-indigo-600 transition-colors uppercase tracking-widest"
                   >
                     <Edit2 size={12} /> Edit Details
                   </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Projects;