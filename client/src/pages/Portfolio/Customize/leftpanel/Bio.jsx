import React, { useState } from "react";
import { AlignLeft, Briefcase, Coffee, Zap, Wand2, Loader2 } from "lucide-react";

const Bio = ({ portfolioData, handleChange, handleGenerateBio }) => {
  const [loading, setLoading] = useState(null);

  const generate = (style) => {
    setLoading(style);
    handleGenerateBio(style);
    setTimeout(() => setLoading(null), 1800);
  };

  const aiOptions = [
    { id: "professional", label: "Professional", icon: Briefcase },
    { id: "creative", label: "Creative", icon: Wand2 },
    { id: "casual", label: "Casual", icon: Coffee },
    { id: "concise", label: "Concise", icon: Zap },
  ];

  return (
    <section className="bg-white rounded-2xl p-6 border border-slate-200">

      {/* Header */}
      <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-4">
        <AlignLeft size={16} />
        Biography
      </h2>

      {/* Textarea */}
      <textarea
        name="bio"
        rows={6}
        value={portfolioData.bio || ""}
        onChange={handleChange}
        placeholder="Write a short introduction about yourself..."
        className="w-full p-4 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 text-slate-500 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none resize-none"
      />

      {/* Character count */}
      <div className="text-right mt-1 text-xs text-slate-400">
        {portfolioData.bio?.length || 0} characters
      </div>

      {/* AI Helper */}
      <div className="mt-6 pt-5 border-t border-slate-200">

        {/* AI Header */}
        <div className="flex items-center gap-3 mb-3">
          <img src="/fyxlogow.png" alt="FYX AI" className="h-4 brightness-0" />
          <span className="text-xs font-semibold text-slate-600">
            AI Bio Generator
          </span>
        </div>

        <p className="text-xs text-slate-500 mb-4">
          Choose a tone and let AI help write your bio.
        </p>

        {/* AI Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {aiOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => generate(opt.id)}
              disabled={loading !== null}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-medium border transition
                ${
                  loading === opt.id
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white border-slate-200 text-slate-700 hover:border-indigo-300 hover:bg-indigo-50"
                }
              `}
            >
              {loading === opt.id ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <opt.icon size={14} className="text-indigo-500" />
              )}
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Bio;
