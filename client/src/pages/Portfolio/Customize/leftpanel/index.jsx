// src/pages/Customize/leftpanel/index.jsx
import React from "react";
import PersonalInfo from "./PersonalInfo";
import ProfileImage from "./ProfileImage";
import Skills from "./Skills";
import Experience from "./Experience";
import Bio from "./Bio";
import Projects from "./Projects";
import SocialLinks from "./SocialLinks";
import ThemeConfig from "./ThemeConfig";
import ActionButtons from "./ActionButtons";

const LeftPanel = (props) => {
  return (
    /*
      Outer wrapper: no overflow here — the parent EditorPanel scroll container handles scrolling.
      We avoid max-w or centering that could cause horizontal bleed in a narrow panel.
    */
    <div className="bg-white w-full min-w-0">
      {/*
        pb-32 on desktop (for ActionButtons breathing room)
        pb-40 on mobile so the last item clears the fixed bottom bar (≈72px tall + safe area)
      */}
      <div className="w-full px-4 sm:px-6 pt-5 pb-40 md:pb-32 space-y-6">

        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight leading-tight">Editor</h1>
          <p className="text-slate-400 text-[12px] mt-0.5">Customize your portfolio content and style.</p>
        </div>

        <PersonalInfo {...props} />
        <ProfileImage {...props} />
        <Experience {...props} />
        <Skills {...props} />
        <Bio {...props} />
        <Projects {...props} setPortfolioData={props.setPortfolioData} />
        <SocialLinks {...props} />
        <ThemeConfig {...props} />
        <ActionButtons {...props} />

      </div>
    </div>
  );
};

export default LeftPanel;