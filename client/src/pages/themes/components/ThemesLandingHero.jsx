import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, X, ArrowRight, Eye } from "lucide-react";

/* ── Motion variants ── */
const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.08 } },
};

const fadeUp = {
  hidden: { y: 26, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", damping: 22, stiffness: 90 },
  },
};

const themeTags = ["Minimal", "Modern", "Developer", "Dark Mode", "Creative", "Student"];

const stats = [
  { val: "12+", label: "Premium themes" },
  { val: "10k+", label: "Portfolios live" },
  { val: "Free", label: "To get started" },
];

/* ─────────────────────────────────────────────
   Themes Gallery Hero — light, editorial header
   Props:
     searchTerm / setSearchTerm  — search state
     onBrowseThemes              — scroll to grid
     onPreviewFirst              — open first theme modal
───────────────────────────────────────────── */
const ThemesLandingHero = ({
  searchTerm = "",
  setSearchTerm = () => {},
  onBrowseThemes,
  onPreviewFirst,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <section className="relative overflow-hidden">
      {/* ── Designer backdrop: pastel aurora + grid + diagonal watermark ── */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {/* Soft aurora wash (same language as the landing hero's pink tint) */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 55% 45% at 18% 8%, rgba(233,213,255,0.55), transparent 65%), radial-gradient(ellipse 50% 40% at 85% 15%, rgba(251,207,232,0.45), transparent 65%), radial-gradient(ellipse 60% 45% at 50% 95%, rgba(199,210,254,0.35), transparent 70%)",
          }}
        />
        {/* Fine grid, masked to the top */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage: "radial-gradient(ellipse 70% 65% at 50% 0%, black, transparent)",
            WebkitMaskImage: "radial-gradient(ellipse 70% 65% at 50% 0%, black, transparent)",
          }}
        />
        {/* Diagonal brand watermark, like the zoom transition's field */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-6 select-none whitespace-nowrap">
          <span className="block font-black uppercase tracking-tighter leading-[0.85] text-black/[0.035] text-[13vw]">
            WE DESIGN · WE BUILD
          </span>
          <span className="block font-black uppercase tracking-tighter leading-[0.85] text-black/[0.03] text-[13vw] pl-[8vw]">
            ESTHETIC · MOTION
          </span>
        </div>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-auto max-w-7xl px-4 pt-32 pb-14 text-center sm:px-6 sm:pt-40 sm:pb-20 lg:px-8"
      >
        {/* Eyebrow */}
        <motion.p
          variants={fadeUp}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-black/40"
        >
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-black" />
          Template Gallery
        </motion.p>

        {/* Headline */}
        <motion.h1
          variants={fadeUp}
          className="mx-auto max-w-4xl text-4xl font-black leading-[1.02] tracking-tighter text-black sm:text-6xl lg:text-7xl"
        >
          Discover top{" "}
          <span className="bg-gradient-to-r from-black via-gray-500 to-black bg-clip-text text-transparent">
            designs
          </span>{" "}
          for your portfolio
        </motion.h1>

        {/* Subline */}
        <motion.p
          variants={fadeUp}
          className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-gray-500 sm:mt-6 sm:text-lg"
        >
          Handcrafted templates for developers, designers, and students.
          Pick a theme and launch your portfolio in minutes.
        </motion.p>

        {/* Search */}
        <motion.div variants={fadeUp} className="mx-auto mt-10 max-w-xl">
          <div
            className={`flex items-center gap-3 rounded-full border bg-white px-5 py-3 shadow-sm transition-all duration-300 sm:py-3.5 ${
              isFocused
                ? "border-black ring-4 ring-black/10"
                : "border-black/10 hover:border-black/25"
            }`}
          >
            <Search
              size={17}
              aria-hidden="true"
              className={`shrink-0 transition-colors duration-200 ${isFocused ? "text-black" : "text-gray-400"}`}
            />
            <input
              type="text"
              aria-label="Search themes"
              placeholder="Search themes — Minimal, Modern, Student..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="min-w-0 flex-1 bg-transparent text-sm text-black outline-none placeholder:text-gray-400"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                aria-label="Clear search"
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-black/5 hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Quick tags */}
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {themeTags.map((tag) => {
              const isActive = searchTerm === tag;
              return (
                <button
                  key={tag}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setSearchTerm(isActive ? "" : tag)}
                  className={`rounded-full px-3.5 py-1.5 text-[11px] font-semibold tracking-wide transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40 ${
                    isActive
                      ? "bg-black text-white"
                      : "bg-black/5 text-black hover:bg-black/10"
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* CTAs */}
        <motion.div
          variants={fadeUp}
          className="mt-10 flex flex-wrap items-center justify-center gap-3 sm:mt-12"
        >
          <button
            type="button"
            onClick={onBrowseThemes}
            className="group inline-flex items-center gap-2 rounded-full bg-black px-7 py-3 text-sm font-semibold text-white shadow-[0_8px_30px_rgba(0,0,0,0.18)] transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            Browse Themes
            <ArrowRight
              size={15}
              aria-hidden="true"
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </button>
          <button
            type="button"
            onClick={onPreviewFirst}
            className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-7 py-3 text-sm font-semibold text-black transition-colors duration-200 hover:border-black/30 hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            <Eye size={15} aria-hidden="true" />
            See Live Previews
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={fadeUp}
          className="mx-auto mt-14 flex items-center justify-center sm:mt-16"
        >
          {stats.map((s, i) => (
            <React.Fragment key={s.label}>
              {i > 0 && (
                <div
                  aria-hidden="true"
                  className="mx-6 h-9 w-px self-center bg-black/10 sm:mx-10"
                />
              )}
              <div>
                <div className="text-xl font-black tracking-tighter text-black sm:text-2xl">
                  {s.val}
                </div>
                <div className="mt-1 text-[10px] font-medium uppercase tracking-[0.2em] text-black/40 sm:text-[11px]">
                  {s.label}
                </div>
              </div>
            </React.Fragment>
          ))}
        </motion.div>
      </motion.div>

      {/* Thin divider */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          aria-hidden="true"
          className="h-px w-full bg-gradient-to-r from-transparent via-black/10 to-transparent"
        />
      </div>
    </section>
  );
};

export default ThemesLandingHero;
