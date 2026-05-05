import React from "react";
import { usePortfolio } from "../../../../context/PortfolioContext";
import EditableText from "./EditableText";

const About = ({ portfolioData: propData, isReadOnly = false }) => {
  const { portfolioData: contextData, setPortfolioData } = usePortfolio();
  
  // Use propData if provided (Editor), otherwise use context (Live View)
  const data = propData || contextData || {};

  // --- Theme Logic (Matches Home Page) ---
  const bg = data.themeBg || "#ffffff";
  const fg = data.themeFont || "#111111";
  const borderColor = `${fg}20`; // 12% opacity version of font color for borders
  const cardBg = `${fg}08`; // Very subtle 3% opacity version for the education card

  const handleUpdate = (field, val) => {
    if (isReadOnly) return;
    setPortfolioData(prev => ({ ...prev, [field]: val }));
  };

  return (
    <section 
      id="about" 
      className="py-20 px-8 transition-colors duration-500"
      style={{ 
        backgroundColor: bg, 
        color: fg, 
        borderTop: `1px solid ${borderColor}` 
      }}
    >
      <div className="max-w-[1800px] mx-auto">
        <div className="flex justify-between mb-12">
          <h2 className="text-7xl font-bold tracking-tighter">About</h2>
          <span 
            className="px-4 py-2 rounded-full text-xs font-bold uppercase h-fit"
            style={{ border: `1px solid ${fg}` }}
          >
            01 / Profile
          </span>
        </div>

        <div className="grid md:grid-cols-12 gap-12">
          {/* Bio Section */}
          <div className="md:col-span-8">
            <div className="text-3xl leading-tight font-medium tracking-tight">
              <EditableText 
                value={data.bio || ""} 
                isTextArea={true} 
                readOnly={isReadOnly}
                onSave={(val) => handleUpdate("bio", val)}
                placeholder="Write a brief bio about yourself..."
              />
            </div>
          </div>

          {/* Education Section */}
          <div className="md:col-span-4 space-y-6">
            <div 
              className="p-8 rounded-2xl border transition-all"
              style={{ 
                backgroundColor: cardBg, 
                borderColor: borderColor 
              }}
            >
              <h3 
                className="text-xs font-bold uppercase mb-4 opacity-50"
              >
                Education
              </h3>
              <div className="text-xl font-bold">
                <EditableText 
                  value={data.education || ""} 
                  readOnly={isReadOnly}
                  onSave={(val) => handleUpdate("education", val)}
                  placeholder="Add your degree..."
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;