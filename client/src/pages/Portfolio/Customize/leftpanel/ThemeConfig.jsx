import React from "react";
import { Palette } from "lucide-react";

const ThemeConfig = ({ portfolioData, themeBg, setThemeBg, themeFont, setThemeFont, setPortfolioData }) => {
  return (
    <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
      <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-500 mb-6">
        <Palette size={16} /> Theme & Colors
      </h2>

      <div className="grid grid-cols-2 gap-6">
        {/* Background Color */}
        <div>
          <label className="text-xs font-bold text-slate-400 mb-2 block uppercase">Background</label>
          <div className="flex items-center gap-3">
             <div className="relative w-10 h-10 rounded-full shadow-inner overflow-hidden border border-slate-200">
               <input
                 type="color"
                 value={themeBg}
                 onChange={(e) => {
                    setThemeBg(e.target.value);
                    setPortfolioData({ ...portfolioData, themeBg: e.target.value });
                 }}
                 className="absolute inset-0 w-[150%] h-[150%] -top-[25%] -left-[25%] cursor-pointer p-0 m-0 border-0"
               />
             </div>
             <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded text-slate-600">{themeBg}</span>
          </div>
        </div>

        {/* Font Color */}
        <div>
          <label className="text-xs font-bold text-slate-400 mb-2 block uppercase">Text Color</label>
          <div className="flex items-center gap-3">
             <div className="relative w-10 h-10 rounded-full shadow-inner overflow-hidden border border-slate-200">
               <input
                 type="color"
                 value={themeFont}
                 onChange={(e) => {
                    setThemeFont(e.target.value);
                    setPortfolioData({ ...portfolioData, themeFont: e.target.value });
                 }}
                 className="absolute inset-0 w-[150%] h-[150%] -top-[25%] -left-[25%] cursor-pointer p-0 m-0 border-0"
               />
             </div>
             <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded text-slate-600">{themeFont}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ThemeConfig;