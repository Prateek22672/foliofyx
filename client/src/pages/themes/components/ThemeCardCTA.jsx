import React from "react";
import useOnScreen from "../hooks/useOnScreen";

const ThemeCardCTA = ({ handleStart }) => {
  const [ref, isVisible] = useOnScreen("-100px");

  // Use the generated video URL or your local file path here
  const videoSource = "/themes/newtempDemo.mp4";

  return (
    <div
      ref={ref}
      className={`relative mt-24 overflow-hidden rounded-[2.5rem] py-24 px-4 text-center shadow-2xl transition-all duration-1000 transform group ${
        isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
      }`}
    >
      {/* 1. BACKGROUND VIDEO */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={videoSource} type="video/mp4" />
      </video>

      {/* 2. DARK OVERLAY (Ensures text readability) */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>

      {/* 3. CONTENT (z-10 to sit on top) */}
      <div className="relative z-10 flex flex-col items-center">
        <h2 className="text-4xl md:text-6xl mb-8 font-bold text-white tracking-tight leading-tight max-w-3xl">
          Ready to turn inspiration <br/> into <span className="text-blue-400">reality</span>?
        </h2>
        
        <button
          onClick={() => handleStart("modern")}
          className="bg-white text-slate-900 px-12 py-5 rounded-full text-xl font-bold hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]"
        >
          Get Started with Foliofy
        </button>
      </div>
    </div>
  );
};

export default ThemeCardCTA;