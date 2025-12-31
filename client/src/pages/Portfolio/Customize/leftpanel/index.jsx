import React from "react";
import PersonalInfo from "./PersonalInfo";
import ProfileImage from "./ProfileImage";
import Skills from "./Skills";
import Experience from "./Experience"; // ✅ IMPORT THIS
import Bio from "./Bio";
import Projects from "./Projects";
import SocialLinks from "./SocialLinks";
import ThemeConfig from "./ThemeConfig";
import ActionButtons from "./ActionButtons";

const LeftPanel = (props) => {
  return (
    <div className="bg-white relative rounded-2xl"> 
      <div className="max-w-4xl mx-auto p-6 sm:p-8 space-y-8 pb-32">
        
        <div className="mb-2">
          <h1 className="text-2xl w-3xl font-bold text-slate-900 tracking-tight">Editor</h1>
          <p className="text-slate-500 text-sm">Customize your portfolio content and style.</p>
        </div>

        {/* Sections */}
        <PersonalInfo {...props} />
        <ProfileImage {...props} />
        
        {/* ✅ ADDED EXPERIENCE HERE */}
        <Experience {...props} />

        <Skills {...props} />
        <Bio {...props} />
        <Projects {...props} 
        setPortfolioData={props.setPortfolioData}
        />
        <SocialLinks {...props} />
        <ThemeConfig {...props} />
        
        {/* Floating Actions */}
        <ActionButtons {...props} />
      </div>
    </div>
  );
};

export default LeftPanel;