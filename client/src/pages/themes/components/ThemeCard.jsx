import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Eye, Lock } from "lucide-react";

/* ─────────────────────────────────────────────
   ThemeCard
   variant: "light" (default — CsStudentTemplates)
            "dark"  (ThemesPage gallery)
───────────────────────────────────────────── */
const ThemeCard = ({ theme, index, handleStart, openPreview, variant = "light" }) => {
  const dark = variant === "dark";

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.45, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="group flex cursor-pointer flex-col gap-4"
      onClick={() => openPreview(theme)}
    >
      {/* ── Preview image ── */}
      <div
        className={`relative w-full overflow-hidden rounded-xl border aspect-[16/10] transition-all duration-300 ${
          dark
            ? "border-white/10 bg-white/5 shadow-lg shadow-black/20 group-hover:border-white/25 group-hover:shadow-[0_24px_60px_-16px_rgba(85,81,255,0.35)]"
            : "border-gray-100 bg-gray-100 shadow-sm group-hover:shadow-xl"
        }`}
      >
        <img
          src={theme.image}
          alt={`${theme.name} template preview`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />

        {/* Hover / focus overlay with actions */}
        <div
          className="absolute inset-0 flex items-center justify-center gap-3 bg-gradient-to-t from-black/70 via-black/40 to-black/20 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100"
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              openPreview(theme);
            }}
            className="inline-flex translate-y-2 items-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-gray-950 opacity-0 shadow-lg transition-all duration-300 hover:scale-[1.04] group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
          >
            <Eye size={14} aria-hidden="true" />
            Preview
          </button>

          {theme.available && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleStart(theme.themeKey);
              }}
              className="inline-flex translate-y-2 items-center gap-1.5 rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white opacity-0 shadow-lg shadow-black/30 transition-all delay-[40ms] duration-300 hover:scale-[1.04] hover:bg-neutral-800 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Use template
              <ArrowUpRight size={14} aria-hidden="true" />
            </button>
          )}
        </div>

        {/* Badges */}
        <div className="absolute right-3 top-3 flex gap-2">
          {!theme.available && (
            <span className="rounded-md bg-black/80 px-2 py-1 text-[10px] font-bold tracking-wider text-white backdrop-blur">
              PREMIUM
            </span>
          )}
          {theme.themeKey === "studentbright" || theme.themeKey === "plexis" ? (
            <span
              className={`rounded-md px-2 py-1 text-[10px] font-bold tracking-wider text-white ${
                dark ? "bg-indigo-500/90" : "bg-blue-600/90"
              }`}
            >
              STUDENT PICK
            </span>
          ) : null}
        </div>
      </div>

      {/* ── Meta row ── */}
      <div className="flex items-start justify-between gap-3 px-1">
        <div className="min-w-0">
          <h3
            className={`truncate text-lg font-semibold tracking-tight transition-colors duration-200 ${
              dark
                ? "text-white group-hover:text-indigo-300"
                : "text-slate-900 group-hover:text-black/60"
            }`}
          >
            {theme.name}
          </h3>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {theme.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className={`rounded px-1.5 py-0.5 text-[10px] uppercase tracking-wider ${
                  dark
                    ? "border border-white/10 bg-white/[0.04] text-white/50"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <button
          type="button"
          aria-label={
            theme.available
              ? `Use the ${theme.name} template`
              : `${theme.name} is a premium template`
          }
          disabled={!theme.available}
          onClick={(e) => {
            e.stopPropagation();
            if (theme.available) handleStart(theme.themeKey);
          }}
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/70 ${
            theme.available
              ? dark
                ? "border-white/15 text-white/50 hover:border-white hover:bg-white hover:text-gray-950"
                : "border-gray-200 text-gray-400 hover:border-black hover:bg-black hover:text-white"
              : dark
                ? "cursor-not-allowed border-transparent bg-white/[0.06] text-white/25"
                : "cursor-not-allowed border-transparent bg-gray-100 text-gray-300"
          }`}
        >
          {theme.available ? (
            <ArrowUpRight size={16} aria-hidden="true" />
          ) : (
            <Lock size={14} aria-hidden="true" />
          )}
        </button>
      </div>
    </motion.article>
  );
};

export default ThemeCard;
