import React, { useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { SearchX } from "lucide-react";
import { useSplash } from "../../context/SplashContext";
import Footer from "../../components/Footer";
import ThemesLandingHero from "./components/ThemesLandingHero";
import ThemeCard from "./components/ThemeCard";
import ThemePreviewModal from "./components/ThemePreviewModal";
import ThemeCardCTA from "./components/ThemeCardCTA";

const themes = [
  { id: "thegrandera",   name: "The Grand Era",   image: "/preview/theEra/grandEra.jpg",         available: true,  themeKey: "thegrandera",   tags: ["Cinematic", "Bold", "Premium"] },
  { id: "luxe",          name: "Luxe",             image: "/preview/luxe/luxe.jpg",               available: true,  themeKey: "luxe",          tags: ["Premium", "Animation", "Dark"] },
  { id: "veloura",       name: "Veloura",          image: "/preview/veloura/whiteDesktop.png",    available: true,  themeKey: "veloura",       tags: ["Creative", "Gradient", "Modern"] },
  { id: "plexis",        name: "Plexis",           image: "/preview/plexis/plexis.jpg",           available: true,  themeKey: "plexis",        tags: ["Grid", "Developer", "Dark"] },
  { id: "nexus",         name: "Nexus",            image: "/preview/nexus/nexus.jpg",             available: true,  themeKey: "nexus",         tags: ["Professional", "Clean", "Minimal"] },
  { id: "pulse",         name: "Pulse",            image: "/preview/pulse/pulse1.png",            available: true,  themeKey: "pulse",         tags: ["Developer", "Creative", "Hero"] },
  { id: "neonix",        name: "Neonix",           image: "/preview/neonix/whiteDesktop.png",     available: true,  themeKey: "neonix",        tags: ["Creative", "Bright", "Personal"] },
  { id: "modern",        name: "Modern",           image: "/preview/modern/blackDesktop.png",     available: true,  themeKey: "modern",        tags: ["Professional", "Portfolio", "Smooth"] },
  { id: "minimal",       name: "Minimal",          image: "/preview/minimal/minimal.png",         available: true,  themeKey: "minimal",       tags: ["Clean", "Resume", "Fast", "Student"] },
  { id: "studentbright", name: "Student Bright",   image: "/themes/p2.png",                       available: true,  themeKey: "studentbright", tags: ["Student", "Beginner", "Simple"] },
  { id: "business",      name: "Business",         image: "/themes/talentbg.jpg",                 available: true,  themeKey: "business",      tags: ["Corporate", "Clean", "Formal"] },
  { id: "art",           name: "Creative Art",     image: "/themes/p4.png",                       available: false, themeKey: "art",           tags: ["Art", "Creative", "Colorful"] },
];

const CATEGORIES = [
  { id: "all",          label: "All Themes" },
  { id: "student",      label: "Students & CS" },
  { id: "creative",     label: "Creative & Design" },
  { id: "professional", label: "Business & Pro" },
];

const ThemesPage = () => {
  const navigate = useNavigate();
  const { showSplash } = useSplash();
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm]         = useState("");
  const [selectedTheme, setSelectedTheme]   = useState(null);

  // ── ref for the theme grid so "Browse Themes" can scroll to it ──
  const gridRef = useRef(null);

  const handleStart = (themeKey) => {
    showSplash(2000, () => navigate("/create", { state: { selectedTheme: themeKey } }), "Setting up your workspace...");
  };

  // Scrolls smoothly to the theme grid
  const handleBrowseThemes = () => {
    gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Opens the preview modal for the first available theme
  const handlePreviewFirst = () => {
    const firstAvailable = themes.find((t) => t.available);
    if (firstAvailable) setSelectedTheme(firstAvailable);
  };

  const filteredThemes = useMemo(() => {
    let data = themes;

    if (activeCategory === "student") {
      data = data.filter(t => t.tags.some(tag => ["Student", "Developer", "Resume"].includes(tag)));
    } else if (activeCategory === "creative") {
      data = data.filter(t => t.tags.some(tag => ["Creative", "Art", "Cinematic"].includes(tag)));
    } else if (activeCategory === "professional") {
      data = data.filter(t => t.tags.some(tag => ["Professional", "Corporate", "Minimal"].includes(tag)));
    }

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      data = data.filter(t =>
        t.name.toLowerCase().includes(q) ||
        t.tags.some(tag => tag.toLowerCase().includes(q))
      );
    }

    return data;
  }, [activeCategory, searchTerm]);

  return (
    <>
      <div className="relative min-h-screen bg-[#FAFAFA] pb-24 text-black selection:bg-black/10">

        {/* Page-level pastel wash so the gallery never reads flat white */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 45% 30% at 0% 45%, rgba(233,213,255,0.28), transparent 70%), radial-gradient(ellipse 45% 30% at 100% 70%, rgba(199,210,254,0.25), transparent 70%)",
          }}
        />

        {/* ── 1. HERO ── */}
        <ThemesLandingHero
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          activeCategory={activeCategory}
          onBrowseThemes={handleBrowseThemes}
          onPreviewFirst={handlePreviewFirst}
        />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* ── 2. CATEGORY FILTER ROW ── */}
          <div className="mt-10 mb-10 flex justify-center sm:mt-12 sm:mb-14">
            <div
              role="group"
              aria-label="Filter themes by category"
              className="flex w-full max-w-full items-center gap-1 overflow-x-auto rounded-full border border-black/10 bg-white p-1.5 shadow-sm sm:w-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => { setActiveCategory(cat.id); setSearchTerm(""); }}
                    className={`shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-xs font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40 sm:px-6 sm:py-2.5 sm:text-sm ${
                      isActive
                        ? "bg-black text-white shadow-md"
                        : "text-black/50 hover:bg-black/5 hover:text-black"
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── 3. STUDENT BANNER ── */}
          <AnimatePresence mode="wait">
            {activeCategory === "student" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                className="mx-auto mb-10 max-w-4xl rounded-2xl border border-black/10 bg-white p-6 text-center shadow-sm sm:mb-14 sm:rounded-3xl sm:p-8"
              >
                <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.2em] text-black/40">
                  Placement Ready
                </span>
                <h3 className="mb-2 text-lg font-semibold tracking-tight text-black sm:text-2xl">
                  Prepping for Placements?
                </h3>
                <p className="mx-auto max-w-2xl text-sm leading-relaxed text-black/60 sm:text-base">
                  Are you a CSE student confused about how to showcase your projects?
                  FolioFYX has handpicked these themes to highlight your{" "}
                  <strong className="font-semibold text-black">GitHub stats, LeetCode, and Projects</strong>.
                  Just relax, pick a theme, and get hired.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── 4. THEME GRID — ref attached here ── */}
          <div ref={gridRef} className="scroll-mt-28">
            <div className="mb-6 flex items-baseline justify-between gap-4">
              <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-black/40">
                {CATEGORIES.find((c) => c.id === activeCategory)?.label ?? "All Themes"}
              </h2>
              <p aria-live="polite" className="text-xs font-medium text-black/35">
                {filteredThemes.length} {filteredThemes.length === 1 ? "template" : "templates"}
              </p>
            </div>

            <motion.div
              layout
              className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 md:gap-y-12 xl:grid-cols-3"
            >
              <AnimatePresence>
                {filteredThemes.length > 0 ? (
                  filteredThemes.map((theme, index) => (
                    <ThemeCard
                      key={theme.id}
                      theme={theme}
                      index={index}
                      variant="light"
                      handleStart={handleStart}
                      openPreview={setSelectedTheme}
                    />
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="col-span-full flex flex-col items-center py-20 text-center sm:py-28"
                  >
                    <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-black/10 bg-black/[0.03]">
                      <SearchX size={22} aria-hidden="true" className="text-black/40" />
                    </div>
                    <p className="text-base font-medium text-black/70 sm:text-lg">
                      No themes found
                    </p>
                    <p className="mt-1 text-sm text-black/40">
                      Try a different search or category.
                    </p>
                    <button
                      type="button"
                      onClick={() => { setSearchTerm(""); setActiveCategory("all"); }}
                      className="mt-6 rounded-full border border-black/15 px-5 py-2.5 text-sm font-semibold text-black/80 transition-colors hover:border-black/30 hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40"
                    >
                      Clear filters
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* ── 5. CTA ── */}
          <div className="mt-16 sm:mt-20">
            <ThemeCardCTA handleStart={handleStart} />
          </div>
        </div>
      </div>

      <Footer />

      <ThemePreviewModal
        theme={selectedTheme}
        onClose={() => setSelectedTheme(null)}
        onStart={handleStart}
      />
    </>
  );
};

export default ThemesPage;
