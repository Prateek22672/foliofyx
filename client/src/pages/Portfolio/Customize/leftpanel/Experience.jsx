import React from "react";
import { Briefcase, Plus, Trash2 } from "lucide-react";

// ✅ FIX 1: Destructure 'setPortfolioData' to update state directly
const Experience = ({ portfolioData, setPortfolioData }) => {
  
  // Safety check
  const experienceList = Array.isArray(portfolioData?.experience) ? portfolioData.experience : [];

  // --- UNIVERSAL UPDATE FUNCTION ---
  // This updates the Global State, which triggers the Right Panel re-render
  const updateExperience = (newExperienceList) => {
    setPortfolioData((prev) => ({
      ...prev,
      experience: newExperienceList,
    }));
  };

  // 1. Handle Typing in Inputs
  const handleInputChange = (index, field, value) => {
    const updatedList = [...experienceList];
    // Ensure the object exists before setting value
    updatedList[index] = { ...updatedList[index], [field]: value };
    updateExperience(updatedList);
  };

  // 2. Add New Job
  const handleAdd = () => {
    const newJob = { company: "New Company", role: "Role", period: "2024", desc: "Description..." };
    updateExperience([...experienceList, newJob]);
  };

  // 3. Remove Job
  const handleRemove = (index) => {
    const updatedList = experienceList.filter((_, i) => i !== index);
    updateExperience(updatedList);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
          <Briefcase size={18} />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-800">Experience</h3>
          <p className="text-xs text-slate-400">Your professional journey</p>
        </div>
      </div>

      <div className="space-y-4">
        {experienceList.map((exp, index) => (
          <div 
            key={index} 
            className="group relative bg-slate-50 border border-slate-200 rounded-xl p-4 transition-all hover:border-blue-400 hover:shadow-sm"
          >
            {/* Remove Button */}
            <button
              onClick={() => handleRemove(index)}
              className="absolute top-2 right-2 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
              title="Remove"
            >
              <Trash2 size={14} />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 ml-1">Company</label>
                <input
                  type="text"
                  value={exp.company || ""}
                  onChange={(e) => handleInputChange(index, "company", e.target.value)}
                  placeholder="Company Name"
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 ml-1">Role</label>
                <input
                  type="text"
                  value={exp.role || ""}
                  onChange={(e) => handleInputChange(index, "role", e.target.value)}
                  placeholder="Job Title"
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1 mb-3">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 ml-1">Period</label>
              <input
                type="text"
                value={exp.period || ""}
                onChange={(e) => handleInputChange(index, "period", e.target.value)}
                placeholder="e.g. Jan 2023 - Present"
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600 focus:outline-none focus:border-blue-500 transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 ml-1">Description</label>
              <textarea
                value={exp.desc || ""}
                onChange={(e) => handleInputChange(index, "desc", e.target.value)}
                placeholder="Briefly describe your responsibilities..."
                rows={2}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600 focus:outline-none focus:border-blue-500 transition-all resize-none"
              />
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleAdd}
        className="w-full py-3 border border-dashed border-slate-300 rounded-xl flex items-center justify-center gap-2 text-slate-500 font-medium hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all group"
      >
        <div className="w-6 h-6 rounded-full bg-slate-100 group-hover:bg-blue-200 flex items-center justify-center transition-colors">
            <Plus size={14} className="text-slate-500 group-hover:text-blue-600" />
        </div>
        <span>Add Experience</span>
      </button>
    </div>
  );
};

export default Experience;