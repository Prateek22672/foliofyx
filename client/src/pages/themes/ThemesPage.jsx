import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useSplash } from "../../context/SplashContext"; // Adjust path as needed
import Footer from "../../components/Footer";
import ThemesLandingHero from "./components/ThemesLandingHero";
import ThemeCard from "./components/ThemeCard";
import ThemePreviewModal from "./components/ThemePreviewModal";
import ThemeCardCTA from "./components/ThemeCardCTA";

// ✅ CENTRALIZED DATA (Matches your list)
const themes = [
  // --- PREMIUM / DARK ---
  { id: "thegrandera", name: "The Grand Era", image: "/preview/theEra/grandEra.jpg", available: true, themeKey: "thegrandera", tags: ["Cinematic", "Bold", "Premium"] },
  { id: "luxe", name: "Luxe", image: "/preview/luxe/luxe.jpg", available: true, themeKey: "luxe", tags: ["Premium", "Animation", "Dark"] },
  { id: "veloura", name: "Veloura", image: "/preview/veloura/whiteDesktop.png", available: true, themeKey: "veloura", tags: ["Creative", "Gradient", "Modern"] },
  { id: "plexis", name: "Plexis", image: "/preview/plexis/plexis.jpg", available: true, themeKey: "plexis", tags: ["Grid", "Developer", "Dark"] },
  { id: "nexus", name: "Nexus", image: "/preview/nexus/nexus.jpg", available: true, themeKey: "nexus", tags: ["Professional", "Clean", "Minimal"] },
  { id: "pulse", name: "Pulse", image: "/preview/pulse/pulse1.png", available: true, themeKey: "pulse", tags: ["Developer", "Creative", "Hero"] },
  // --- CLASSIC / LIGHT ---
  { id: "neonix", name: "Neonix", image: "/preview/neonix/whiteDesktop.png", available: true, themeKey: "neonix", tags: ["Creative", "Bright", "Personal"] },
  { id: "modern", name: "Modern", image: "/preview/modern/blackDesktop.png", available: true, themeKey: "modern", tags: ["Professional", "Portfolio", "Smooth"] },
  { id: "minimal", name: "Minimal", image: "/preview/minimal/minimal.png", available: true, themeKey: "minimal", tags: ["Clean", "Resume", "Fast", "Student"] }, // Added Student tag
  { id: "studentbright", name: "Student Bright", image: "/themes/p2.png", available: true, themeKey: "studentbright", tags: ["Student", "Beginner", "Simple"] },
  { id: "business", name: "Business", image: "/themes/talentbg.jpg", available: true, themeKey: "business", tags: ["Corporate", "Clean", "Formal"] },
  { id: "art", name: "Creative Art", image: "/themes/p4.png", available: false, themeKey: "art", tags: ["Art", "Creative", "Colorful"] },
];

const CATEGORIES = [
  { id: "all", label: "All Themes" },
  { id: "student", label: "Students & CS" },
  { id: "creative", label: "Creative & Design" },
  { id: "professional", label: "Business & Pro" },
];

const ThemesPage = () => {
  const navigate = useNavigate();
  const { showSplash } = useSplash();
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTheme, setSelectedTheme] = useState(null);

  const handleStart = (themeKey) => {
    showSplash(2000, () => navigate("/create", { state: { selectedTheme: themeKey } }), "Setting up your workspace...");
  };

  // ✅ Filtering Logic
  const filteredThemes = useMemo(() => {
    let data = themes;

    // 1. Category Filter
    if (activeCategory === "student") {
      data = data.filter(t => t.tags.includes("Student") || t.tags.includes("Developer") || t.tags.includes("Resume"));
    } else if (activeCategory === "creative") {
      data = data.filter(t => t.tags.includes("Creative") || t.tags.includes("Art") || t.tags.includes("Cinematic"));
    } else if (activeCategory === "professional") {
      data = data.filter(t => t.tags.includes("Professional") || t.tags.includes("Corporate") || t.tags.includes("Minimal"));
    }

    // 2. Search Filter
    if (searchTerm) {
      const lowerQ = searchTerm.toLowerCase();
      data = data.filter(t => 
        t.name.toLowerCase().includes(lowerQ) || 
        t.tags.some(tag => tag.toLowerCase().includes(lowerQ))
      );
    }
    return data;
  }, [activeCategory, searchTerm]);

  return (
    <>
      <div className="bg-[#FDFCF8] min-h-screen pb-20">
        
        {/* 1. HERO SECTION */}
        <ThemesLandingHero 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
          activeCategory={activeCategory} // Pass down to clear search if changing cat
        />

        <div className="max-w-7xl mx-auto px-6 md:px-12 -mt-10 relative z-10">
          
          {/* 2. CATEGORY TABS (Pill Design) */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex bg-white p-1.5 rounded-full shadow-lg border border-gray-100">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => { setActiveCategory(cat.id); setSearchTerm(""); }}
                  className={`
                    px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300
                    ${activeCategory === cat.id 
                      ? "bg-black text-white shadow-md" 
                      : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"}
                  `}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* 3. DYNAMIC CONTEXT BANNER (Addresses the "CSE Student" request) */}
          <AnimatePresence mode="wait">
            {activeCategory === "student" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-3xl p-8 mb-12 text-center max-w-4xl mx-auto"
              >
                <span className="text-blue-600 font-bold tracking-widest text-xs uppercase mb-2 block">Placement Ready</span>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Prepaying for Placements?</h3>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Are you a CSE student confused about how to showcase your projects? 
                  FolioFYX has handpicked these themes to highlight your <strong>GitHub stats, LeetCode, and Projects</strong>.
                  Just relax, pick a theme, and get hired.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 4. THEME GRID */}
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
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
                <div className="col-span-full py-20 text-center text-gray-400">
                  No themes found. Try a different search.
                </div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* 5. CTA SECTION */}
          <div className="mt-20">
             <ThemeCardCTA handleStart={handleStart} />
          </div>
        </div>
      </div>

      <Footer />
      <ThemePreviewModal theme={selectedTheme} onClose={() => setSelectedTheme(null)} onStart={handleStart} />
    </>
  );
};

export default ThemesPage;