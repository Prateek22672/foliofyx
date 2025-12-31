// File: src/pages/themes/CsStudentTemplates.jsx

import React, { useState } from "react";
import { Helmet } from "react-helmet"; 
import { useNavigate } from "react-router-dom";

// ✅ CORRECT IMPORT PATHS FOR THIS LOCATION
import { useSplash } from "../../context/SplashContext";
import ThemeCard from "./components/ThemeCard"; 
import ThemePreviewModal from "./components/ThemePreviewModal";
import Footer from "../../components/Footer";
import { themes } from "./themes"; 

const CsStudentTemplates = () => {
  const navigate = useNavigate();
  const { showSplash } = useSplash();
  const [selectedTheme, setSelectedTheme] = useState(null);

  const handleStart = (themeKey) => {
    showSplash(2500, () => navigate("/create", { state: { selectedTheme: themeKey } }), "Setting up your workspace...");
  };

  // ✅ Filter: Only show "Developer", "Student", or "Minimal" themes
  const studentThemes = themes.filter(t => 
    t.tags.includes("Developer") || 
    t.tags.includes("Student") || 
    t.tags.includes("Minimal")
  );

  return (
    <>
      <Helmet>
        <title>Best Portfolio Templates for CS Students (2025) - FolioFYX</title>
        <meta name="description" content="Free React portfolio templates for Computer Science students. Features GitHub integration, dark mode, and resume downloads. No coding required." />
        <link rel="canonical" href="https://foliofyx.in/templates/cs-students" />
      </Helmet>

      <div className="bg-[#FDFCF8] min-h-screen pb-20 pt-32 px-6 md:px-16">
        
        {/* Header Section */}
        <div className="max-w-4xl mx-auto text-center mb-20">
          <p className="text-blue-600 font-bold tracking-widest text-xs uppercase mb-4">
            For Internships & Placements
          </p>
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6">
            Portfolio Templates for <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              CS Students & Developers
            </span>
          </h1>
          <p className="text-lg text-gray-500 leading-relaxed max-w-2xl mx-auto">
            Stop sending generic PDFs. These templates are designed to showcase your 
            <strong> GitHub repositories, LeetCode stats, and technical projects</strong>. 
            Free to build and host.
          </p>
        </div>

        {/* Theme Grid */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12">
          {studentThemes.map((theme, index) => (
            <ThemeCard
              key={theme.id}
              theme={theme}
              index={index}
              handleStart={handleStart}
              openPreview={setSelectedTheme}
            />
          ))}
        </div>

        {/* SEO Text Block */}
        <div className="max-w-3xl mx-auto mt-32 prose prose-lg">
           <h2 className="text-3xl font-bold mb-4">Why use a Portfolio Website for Internships?</h2>
           <p className="text-gray-600 mb-6">
             In 2025, recruiters at top tech companies spend less than 6 seconds on a resume. 
             A deployed React portfolio demonstrates full-stack skills instantly.
           </p>
           <h3 className="text-xl font-bold mb-2">Features built for Developers:</h3>
           <ul className="list-disc pl-5 text-gray-600 space-y-2">
             <li>Integrated Dark Mode (like VS Code themes).</li>
             <li>Dedicated sections for Hackathon wins.</li>
             <li>Fast load times (99+ Lighthouse score).</li>
           </ul>
        </div>

      </div>

      <Footer />
      <ThemePreviewModal theme={selectedTheme} onClose={() => setSelectedTheme(null)} onStart={handleStart} />
    </>
  );
};

export default CsStudentTemplates;