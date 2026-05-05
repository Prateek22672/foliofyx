import React, { useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
      <div className="bg-[#FDFCF8] min-h-screen pb-20">

        {/* ── 1. HERO ── */}
        <ThemesLandingHero
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          activeCategory={activeCategory}
          onBrowseThemes={handleBrowseThemes}
          onPreviewFirst={handlePreviewFirst}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 lg:px-12 -mt-6 sm:-mt-10 relative z-10">

          {/* ── 2. CATEGORY TABS ── */}
          <div className="flex justify-center mb-8 sm:mb-12">

            {/* Tablet+ — single horizontal strip */}
            <div className="hidden sm:inline-flex bg-white p-1.5 rounded-full shadow-lg border border-gray-100">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => { setActiveCategory(cat.id); setSearchTerm(""); }}
                  className={`
                    px-4 md:px-6 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-medium
                    transition-all duration-300 whitespace-nowrap
                    ${activeCategory === cat.id
                      ? "bg-black text-white shadow-md"
                      : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"}
                  `}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Mobile — 2-column grid of pills */}
            <div className="sm:hidden w-full grid grid-cols-2 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => { setActiveCategory(cat.id); setSearchTerm(""); }}
                  className={`
                    py-2.5 px-3 rounded-2xl text-xs font-semibold
                    transition-all duration-200 text-center border
                    ${activeCategory === cat.id
                      ? "bg-black text-white border-black shadow-md"
                      : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"}
                  `}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* ── 3. STUDENT BANNER ── */}
          <AnimatePresence mode="wait">
            {activeCategory === "student" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                className="
                  bg-gradient-to-r from-blue-50 to-indigo-50
                  border border-blue-100 rounded-2xl sm:rounded-3xl
                  p-5 sm:p-8 mb-8 sm:mb-12
                  text-center max-w-4xl mx-auto
                "
              >
                <span className="text-blue-600 font-bold tracking-widest text-xs uppercase mb-2 block">
                  Placement Ready
                </span>
                <h3 className="text-lg sm:text-2xl font-bold text-gray-900 mb-2">
                  Prepping for Placements?
                </h3>
                <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
                  Are you a CSE student confused about how to showcase your projects?
                  FolioFYX has handpicked these themes to highlight your{" "}
                  <strong>GitHub stats, LeetCode, and Projects</strong>.
                  Just relax, pick a theme, and get hired.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── 4. THEME GRID — ref attached here ── */}
          <div ref={gridRef}>
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 md:gap-x-8 gap-y-8 md:gap-y-12"
            >
              <AnimatePresence>
                {filteredThemes.length > 0 ? (
                  filteredThemes.map((theme, index) => (
                    <ThemeCard
                      key={theme.id}
                      theme={theme}
                      index={index}
                      handleStart={handleStart}
                      openPreview={setSelectedTheme}
                    />
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="col-span-full py-16 sm:py-20 text-center"
                  >
                    <p className="text-gray-400 text-base sm:text-lg">
                      No themes found. Try a different search.
                    </p>
                    <button
                      onClick={() => { setSearchTerm(""); setActiveCategory("all"); }}
                      className="mt-4 text-sm font-semibold text-indigo-500 underline underline-offset-2"
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