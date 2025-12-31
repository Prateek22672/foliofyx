import React from "react";
import { Share2, Linkedin, Github, Mail } from "lucide-react";

const SocialLinks = ({ portfolioData, handleChange }) => {
  const icons = {
    linkedin: <Linkedin size={16} />,
    github: <Github size={16} />,
    email: <Mail size={16} />
  };

  // Helper to get placeholders that match the image style
  const placeholders = {
    linkedin: "https://linkedin.com/in/...",
    github: "https://github.com/...",
    email: "john@example.com"
  };

  return (
    <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
      <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-500 mb-6">
        <Share2 size={16} /> Social Presence
      </h2>
      <div className="space-y-4">
        {["LinkedIn", "GitHub", "Email"].map((label) => {
          const key = label.toLowerCase();
          return (
            <div key={key} className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                {icons[key]}
              </div>
              <input
                name={key}
                value={portfolioData[key] || ""}
                onChange={handleChange}
                placeholder={placeholders[key]}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 font-medium placeholder:text-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
              />
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default SocialLinks;