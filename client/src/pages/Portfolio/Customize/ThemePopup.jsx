// src/pages/Customize/ThemePopup.jsx
import React, { useState, useEffect, useRef } from "react";
import { TEMPLATE_LIST } from "../Templates";
import { Crown, X, Sparkles, Search, ChevronRight,Zap,Layers } from "lucide-react";

const PREMIUM_TEMPLATES = ["neo-brutalism", "3d-portfolio", "agency-grid", "artist-gallery"];

const CATEGORIES = {
  all: "All Templates",
  free: "Free",
  premium: "Premium",
};

export default function ThemePopup({ onSelect, onClose }) {
  const [search, setSearch]   = useState("");
  const [category, setCategory] = useState("all");
  const [hovered, setHovered]   = useState(null);

  // Lock body scroll when popup is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const allTemplates = TEMPLATE_LIST ? Object.entries(TEMPLATE_LIST) : [];
  const filtered = allTemplates.filter(([key, item]) => {
    const matchSearch = !search || item.label?.toLowerCase().includes(search.toLowerCase());
    const matchCat =
      category === "all" ||
      (category === "premium" && PREMIUM_TEMPLATES.includes(key)) ||
      (category === "free" && !PREMIUM_TEMPLATES.includes(key));
    return matchSearch && matchCat;
  });

  const freeCount    = allTemplates.filter(([k]) => !PREMIUM_TEMPLATES.includes(k)).length;
  const premiumCount = allTemplates.filter(([k]) =>  PREMIUM_TEMPLATES.includes(k)).length;

  return (
    /*
      Overlay: covers full viewport, flex-centered.
      We stop wheel events on the overlay so the page behind can't scroll.
      The modal itself is a fixed-height flex column — only the grid scrolls.
    */
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 md:p-6"
      style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      onWheel={(e) => e.stopPropagation()}
    >
      {/*
        Modal container:
        - flex column with a hard max-height so it never overflows the viewport
        - overflow-hidden on the card itself; only the inner grid div scrolls
      */}
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl flex flex-col"
        style={{ maxHeight: "min(92vh, 800px)", overflow: "hidden" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header (non-scrolling) ── */}
        <div className="flex items-center justify-between px-4 sm:px-5 py-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-gray-900 flex items-center justify-center shrink-0">
              <Layers size={16} className="text-white" />
            </div>
            <div>
              <h2 className="text-[15px] font-bold text-gray-900 leading-tight">Choose a Template</h2>
              <p className="text-[11px] text-gray-400 mt-0.5">{freeCount} free · {premiumCount} premium</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-all shrink-0"
            aria-label="Close"
          >
            <X size={15} />
          </button>
        </div>

        {/* ── Filters (non-scrolling) ── */}
        <div className="flex flex-wrap items-center gap-2 px-4 sm:px-5 py-3 border-b border-gray-100 bg-gray-50/50 shrink-0">
          <div className="relative">
            <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search…"
              className="pl-8 pr-3 py-1.5 text-[12px] bg-white border border-gray-200 rounded-xl outline-none focus:border-gray-400 w-36"
            />
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {Object.entries(CATEGORIES).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setCategory(key)}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all ${
                  category === key
                    ? "bg-gray-900 text-white"
                    : "bg-white border border-gray-200 text-gray-500 hover:border-gray-300"
                }`}
              >
                {label}
                {key === "premium" && <Crown size={9} className="inline ml-1 text-amber-400 fill-amber-400" />}
              </button>
            ))}
          </div>
          <span className="ml-auto text-[10px] text-gray-400 font-medium">
            {filtered.length} template{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* ── Scrollable grid (ONLY this section scrolls) ── */}
        <div
          className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-5"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <Search size={28} className="mb-3 opacity-40" />
              <p className="text-[13px] font-medium">No templates match "{search}"</p>
              <button
                type="button"
                onClick={() => setSearch("")}
                className="mt-2 text-[11px] text-violet-500 hover:underline"
              >
                Clear search
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map(([key, item]) => {
                const isPremium = PREMIUM_TEMPLATES.includes(key);
                const isHov = hovered === key;

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => { onSelect(key); onClose(); }}
                    onMouseEnter={() => setHovered(key)}
                    onMouseLeave={() => setHovered(null)}
                    className={`group flex flex-col text-left rounded-2xl border overflow-hidden transition-all duration-200 ${
                      isPremium
                        ? "border-amber-200 hover:border-amber-400 hover:shadow-lg"
                        : "border-gray-200 hover:border-gray-400 hover:shadow-lg"
                    }`}
                  >
                    {/* 16:9 thumbnail */}
                    <div style={{
                      position: "relative",
                      width: "100%",
                      paddingBottom: "56.25%",
                      backgroundColor: "#f3f4f6",
                      overflow: "hidden",
                    }}>
                      {item.preview ? (
                        <img
                          src={item.preview}
                          alt={item.label}
                          style={{
                            position: "absolute",
                            inset: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            objectPosition: "top center",
                            transform: isHov ? "scale(1.04)" : "scale(1)",
                            transition: "transform 0.4s ease",
                          }}
                        />
                      ) : (
                        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <span style={{ fontSize: 10, color: "#9ca3af", fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.15em" }}>
                            No Preview
                          </span>
                        </div>
                      )}

                      {/* Premium badge */}
                      {isPremium && (
                        <div style={{ position: "absolute", top: 8, left: 8, zIndex: 2 }}
                          className="flex items-center gap-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[9px] font-black px-2 py-1 rounded-full shadow uppercase tracking-wider"
                        >
                          <Crown size={8} className="fill-white" /> Premium
                        </div>
                      )}

                      {/* Hover overlay */}
                      <div style={{
                        position: "absolute",
                        inset: 0,
                        zIndex: 3,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "rgba(0,0,0,0.42)",
                        backdropFilter: "blur(2px)",
                        opacity: isHov ? 1 : 0,
                        transition: "opacity 0.2s ease",
                      }}>
                        <div className="flex items-center gap-2 bg-white text-gray-900 px-4 py-2 rounded-full text-[12px] font-bold shadow-lg">
                          {isPremium ? "Try Premium" : "Use Template"}
                          <ChevronRight size={13} />
                        </div>
                      </div>
                    </div>

                    {/* Info row */}
                    <div className={`flex items-center justify-between px-3.5 py-2.5 ${isPremium ? "bg-amber-50/60" : "bg-white"}`}>
                      <div>
                        <p className="text-[12px] font-bold text-gray-900">{item.label}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">{isPremium ? "Premium" : "Free"}</p>
                      </div>
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${isHov ? (isPremium ? "bg-amber-500" : "bg-gray-900") : "bg-gray-100"}`}>
                        <ChevronRight size={12} className={isHov ? "text-white" : "text-gray-400"} />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Footer (non-scrolling) ── */}
        <div className="shrink-0 px-4 sm:px-5 py-3 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
          <p className="text-[10px] text-gray-400 hidden sm:block">
            Switching templates keeps your content — only the design changes.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="text-[11px] font-semibold text-gray-500 hover:text-gray-800 transition-colors ml-auto"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}