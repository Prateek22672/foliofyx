import React from "react";
import { Rocket, Save } from "lucide-react";

const ActionButtons = ({ handlePreview, handleSave }) => {
  return (
    <div className="relative bottom-0 left-0 w-full sm:w-[35%] (or whatever your width prop is) backdrop-blur-md  p-4 z-50">
      <div className="flex gap-3 max-w-3xl mx-auto">
        <button
          onClick={handleSave}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-slate-700 bg-white border border-slate-200 shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all"
        >
          <Save size={16} /> Save
        </button>
        <button
          onClick={handlePreview}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-white bg-slate-900 shadow-lg shadow-slate-900/20 hover:bg-black hover:scale-[1.02] transition-all"
        >
          <Rocket size={16} /> Deploy
        </button>
      </div>
    </div>
  );
};

export default ActionButtons;