import React from "react";
import { User, Briefcase, FileText, GraduationCap } from "lucide-react";
import SearchSuggestion from "../../../../components/SearchSuggestion";

const PersonalInfo = ({ portfolioData, handleChange, setPortfolioData }) => {
  return (
    <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
      <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-500 mb-6">
        <User size={16} /> Personal Details
      </h2>

      <div className="grid grid-cols-1 gap-5">
        <div className="group">
          <label className="block text-xs font-semibold text-slate-500 mb-1.5 ml-1">Full Name</label>
          <input
            name="name"
            value={portfolioData.name || ""}
            onChange={handleChange}
            placeholder="John Doe"
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm font-medium placeholder:text-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
          />
        </div>

        <div className="group">
          <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-1.5 ml-1">
            <Briefcase size={12} /> Professional Title
          </label>
          <SearchSuggestion
            dataFile="roles.txt"
            multiple={false}
            selected={portfolioData.role}
            onSelect={(v) => setPortfolioData({ ...portfolioData, role: v })}
            placeholder="e.g. Full Stack Developer"
          />
        </div>

        {/* Removed Experience Input to avoid conflict with the dedicated Experience Section */}
        
        <div className="group">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-1.5 ml-1">
              <GraduationCap size={12} /> Education
            </label>
             <SearchSuggestion
                dataFile="qualifications.txt"
                multiple={false}
                selected={portfolioData.education}
                onSelect={(v) => setPortfolioData({ ...portfolioData, education: v })}
                placeholder="Highest Degree"
              />
        </div>

        <div className="group">
           <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-1.5 ml-1">
             <FileText size={12} /> CV / Resume Link
           </label>
           <input
             name="cvLink"
             value={portfolioData.cvLink || ""}
             onChange={handleChange}
             placeholder="https://drive.google.com/..."
             className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm font-medium focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
           />
        </div>
      </div>
    </section>
  );
};

export default PersonalInfo;