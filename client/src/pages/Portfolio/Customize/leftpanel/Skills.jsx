import React from "react";
import { Zap, X } from "lucide-react";
import SearchSuggestion from "../../../../components/SearchSuggestion";

const Skills = ({ portfolioData, toggleSkill, removeSkillByName, skillLevel, setSkillLevel }) => {
  return (
    <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
      <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-500 mb-6">
        <Zap size={16} /> Skills
      </h2>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="sm:w-1/3">
          <select
            value={skillLevel}
            onChange={(e) => setSkillLevel(e.target.value)}
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option>Basic</option>
            <option>Intermediate</option>
            <option>Expert</option>
          </select>
        </div>
        <div className="flex-1">
           <SearchSuggestion
            dataFile="skills.txt"
            multiple={false}
            onSelect={(v) => toggleSkill(v)}
            placeholder="Add a skill (e.g. React)"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {portfolioData.skills?.length > 0 ? (
          portfolioData.skills.map((s, idx) => (
            <div
              key={`${s.name}-${idx}`}
              className="group flex items-center pl-3 pr-2 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 transition-all hover:border-indigo-300 hover:bg-indigo-50 hover:shadow-sm"
            >
              {s.name}
              <span className="mx-1.5 w-1 h-1 rounded-full bg-slate-300 group-hover:bg-indigo-300"></span>
              <span className="text-[10px] text-slate-400 uppercase tracking-wide group-hover:text-indigo-400">{s.level}</span>
              <button
                onClick={() => removeSkillByName(s.name)}
                className="ml-2 p-0.5 rounded-md hover:bg-red-100 hover:text-red-500 text-slate-400 transition-colors"
              >
                <X size={12} />
              </button>
            </div>
          ))
        ) : (
          <div className="w-full text-center py-6 border-2 border-dashed border-slate-100 rounded-xl">
             <p className="text-xs text-slate-400">No skills added yet.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Skills;