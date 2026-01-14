import React from "react";
import { Mail, ArrowUpRight } from "lucide-react";

export default function TalentCard({ t, onOpen }) {
  // 1. Determine initial image source
  // If t.image exists, use it. Otherwise, generate an avatar based on their name.
  const initialImage = t.image && t.image.trim() !== "" 
    ? t.image 
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(t.name || "User")}&background=random&color=fff&size=128`;

  return (
    <div
      onClick={() => onOpen(t)}
      className="group relative bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 cursor-pointer flex flex-col h-full"
    >
      {/* Top Row: Avatar & Name */}
      <div className="flex items-center gap-4 mb-4">
        <div className="relative">
            <div className="w-16 h-16 rounded-full overflow-hidden border border-gray-100 bg-gray-50">
            <img
                src={initialImage}
                alt={t.name}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                // 2. Safety Fallback: If the user's image URL is broken (404), this switches to the default avatar
                onError={(e) => {
                    e.target.onerror = null; 
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(t.name || "User")}&background=random&color=fff&size=128`;
                }}
            />
            </div>
            {/* Online Status Dot */}
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
        </div>
        
        <div>
          <h3 className="text-lg font-bold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">
            {t.name}
          </h3>
          <p className="text-sm text-gray-500">{t.role || "Creator"}</p>
        </div>
      </div>

      {/* Skills */}
      <div className="flex flex-wrap gap-2 mb-6">
        {(t.skills || []).slice(0, 4).map((s, idx) => (
          <span
            key={idx}
            className="px-3 py-1 text-[10px] uppercase tracking-wider font-semibold bg-gray-50 text-gray-600 rounded-md border border-gray-100"
          >
            {/* Handle case if skill is an object or string */}
            {typeof s === 'string' ? s : s.name}
          </span>
        ))}
        {(t.skills?.length > 4) && (
            <span className="px-2 py-1 text-[10px] text-gray-400">+{t.skills.length - 4}</span>
        )}
      </div>

      {/* Footer / Action */}
      <div className="mt-auto pt-4 border-t border-gray-50 flex justify-between items-center">
        <span className="text-xs font-medium text-gray-400">Available for hire</span>
        <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
            <ArrowUpRight size={16} />
        </div>
      </div>
    </div>
  );
}