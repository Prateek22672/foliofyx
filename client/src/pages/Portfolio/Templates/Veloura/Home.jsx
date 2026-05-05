import React from "react";
import { usePortfolio } from "../../../../context/PortfolioContext";
import useFadeInOnScroll from "../../../../hooks/useFadeInOnScroll";
import EditableText from "./EditableText"; 
import { FileDown } from "lucide-react";

const Home = ({ portfolioData: propData, isReadOnly = false }) => {
  useFadeInOnScroll();
  const { portfolioData: contextData, setPortfolioData } = usePortfolio();
  
  // Use propData if provided (Editor), otherwise use context (Live View)
  const data = propData || contextData || {};

  // --- Logic: Update and Save to DB ---
  const handleUpdate = (field, val) => {
    if (isReadOnly) return;
    setPortfolioData(prev => ({ ...prev, [field]: val }));
  };

  // --- UI Constraint: Truncate bio for Home layout ---
  const homeBioSnippet = data.bio 
    ? data.bio.length > 160 
      ? data.bio.substring(0, 157) + "..." 
      : data.bio 
    : "";

  const bg = data.themeBg || "#ffffff";
  const fg = data.themeFont || "#111111";
  const accent = data.accentColor || "#2563eb";
  const muted = `${fg}99`; 
  const borderColor = `${fg}20`;

  return (
    <section 
      id="home" 
      className="relative pt-32 pb-20 px-4 md:px-8 min-h-screen"
      style={{ backgroundColor: bg }}
    >
      <div className="max-w-[1800px] mx-auto flex flex-col gap-12">
        
        {/* 1. Typography Section */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 fade-up">
          <div className="text-6xl md:text-8xl lg:text-[7rem] font-bold leading-[0.9] tracking-tighter max-w-4xl" style={{ color: fg }}>
            <EditableText 
                value={data.role || ""} 
                readOnly={isReadOnly}
                onSave={(val) => handleUpdate("role", val)}
                placeholder="Full Stack Developer"
            />
          </div>
          
          <div className="flex flex-col items-start gap-6 mb-2">
              <div className="text-lg md:text-xl max-w-xs leading-snug" style={{ color: muted }}>
                <p>{homeBioSnippet}</p>
                {!isReadOnly && !data.bio && (
                  <span className="text-[10px] text-amber-500 font-bold uppercase block mt-1">
                    * Set Bio in Personal Details
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-4">
                <a href="#projects" className="px-8 py-4 rounded-full font-bold text-sm hover:scale-105 transition-transform" style={{ backgroundColor: fg, color: bg }}>
                  View Selected Work
                </a>
                
                {/* Resume Button */}
                {data.cvLink && (
                  <a href={data.cvLink} target="_blank" rel="noreferrer" className="px-8 py-4 rounded-full font-bold text-sm border flex items-center gap-2 hover:bg-slate-50 transition-all" style={{ borderColor: fg, color: fg }}>
                    <FileDown size={18} /> Resume
                  </a>
                )}
              </div>
          </div>
        </div>

        {/* 2. Hero Card Section */}
        <div className="w-full h-[50vh] md:h-[65vh] rounded-[2rem] overflow-hidden relative fade-up delay-100 group shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-fuchsia-500 to-orange-400 scale-105 group-hover:scale-100 transition-transform duration-1000 ease-out" />
          
          <div className="absolute inset-0 flex flex-col justify-center items-center p-8 text-center">
             <div className="backdrop-blur-xl bg-white/10 border border-white/20 p-8 md:p-16 rounded-3xl shadow-lg">
                <span className="block text-white/80 uppercase tracking-widest text-xs font-bold mb-4">
                  <EditableText 
                    // Initially show "Current Focus" until edited
                    value={data.currentFocus || "Current Focus"} 
                    readOnly={isReadOnly}
                    onSave={(val) => handleUpdate("currentFocus", val)}
                    placeholder="Current Focus"
                  />
                </span>
<h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-tight">
   <EditableText 
    // Fallback logic for when the DB field is an empty string
    value={data.extraText || "Create anything your heart desires."} 
    readOnly={isReadOnly}
    isTextArea={true}
    onSave={(val) => handleUpdate("extraText", val)}
    placeholder="Create anything your heart desires."
  />
</h2>
             </div>
          </div>

          <div className="absolute bottom-6 left-6">
            <span className="bg-white/90 backdrop-blur px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide text-black">
              {data.name || "Portfolio"}
            </span>
          </div>
        </div>

        {/* 3. Tickers */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 mt-4 fade-up" style={{ borderTop: `1px solid ${borderColor}` }}>
           {['Look 10x Bigger', 'Get to Market Faster', 'Stand Out', 'High Conversion'].map((txt, i) => (
             <div key={i} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest" style={{ color: muted }}>
               <span style={{ color: accent }}>→</span> {txt}
             </div>
           ))}
        </div>
      </div>
    </section>
  );
};

export default Home;