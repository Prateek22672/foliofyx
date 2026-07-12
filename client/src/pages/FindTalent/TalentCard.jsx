import React from "react";
import { ArrowUpRight } from "lucide-react";

export default function TalentCard({ t, onOpen }) {
  // Determine initial image source.
  // If t.image exists, use it. Otherwise, generate an avatar based on their name.
  const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    t.name || "User"
  )}&background=f4f4f5&color=18181b&size=128`;

  const initialImage =
    t.image && t.image.trim() !== "" ? t.image : fallbackAvatar;

  return (
    <button
      type="button"
      onClick={() => onOpen(t)}
      aria-label={`View profile of ${t.name || "talent"}`}
      className="group relative w-full text-left bg-white rounded-3xl p-6 border border-black/5 shadow-lg shadow-black/[0.04] transition-all duration-300 flex flex-col h-full cursor-pointer hover:-translate-y-1 hover:border-black/10 hover:shadow-xl hover:shadow-black/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:ring-offset-white"
    >
      {/* Top Row: Avatar & Name */}
      <div className="flex items-center gap-4 mb-5">
        <div className="relative shrink-0">
          <div className="w-14 h-14 rounded-full overflow-hidden ring-1 ring-black/10 bg-black/5">
            <img
              src={initialImage}
              alt={t.name ? `${t.name} avatar` : "Talent avatar"}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              // Safety fallback: if the user's image URL is broken (404), switch to the default avatar
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = fallbackAvatar;
              }}
            />
          </div>
          {/* Online status dot */}
          <span
            aria-hidden="true"
            className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"
          />
        </div>

        <div className="min-w-0">
          <h3 className="text-base font-semibold text-black leading-tight truncate">
            {t.name}
          </h3>
          <p className="text-sm text-gray-500 truncate mt-0.5">
            {t.role || "Creator"}
          </p>
        </div>
      </div>

      {/* Skills */}
      <div className="flex flex-wrap gap-2 mb-6">
        {(t.skills || []).slice(0, 4).map((s, idx) => (
          <span
            key={idx}
            className="px-2.5 py-1 text-[10px] uppercase tracking-wider font-medium bg-black/5 text-black rounded-full"
          >
            {/* Handle case if skill is an object or string */}
            {typeof s === "string" ? s : s.name}
          </span>
        ))}
        {t.skills?.length > 4 && (
          <span className="px-2 py-1 text-[10px] text-gray-400">
            +{t.skills.length - 4}
          </span>
        )}
      </div>

      {/* Footer / Action */}
      <div className="mt-auto pt-4 border-t border-black/10 flex justify-between items-center">
        <span className="text-xs font-medium text-gray-500">
          Available for hire
        </span>
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 group-hover:text-black transition-colors">
          View profile
          <ArrowUpRight
            size={14}
            className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </span>
      </div>
    </button>
  );
}
