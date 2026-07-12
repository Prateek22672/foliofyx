import React from "react";
import { ArrowRight } from "lucide-react";
import useOnScreen from "../hooks/useOnScreen";

const ThemeCardCTA = ({ handleStart }) => {
  const [ref, isVisible] = useOnScreen("-100px");

  // Use the generated video URL or your local file path here
  const videoSource = "/themes/newtempDemo.mp4";

  return (
    <div
      ref={ref}
      className={`group relative mt-24 transform overflow-hidden rounded-[2rem] border border-white/10 px-6 py-20 text-center shadow-2xl transition-all duration-1000 sm:rounded-[2.5rem] sm:py-24 ${
        isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
      }`}
    >
      {/* 1. BACKGROUND VIDEO */}
      <video
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src={videoSource} type="video/mp4" />
      </video>

      {/* 2. DARK OVERLAY (Ensures text readability) */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-[#0d0d82]/70 backdrop-blur-[2px]" />

      {/* 3. CONTENT (z-10 to sit on top) */}
      <div className="relative z-10 flex flex-col items-center">
        <h2 className="mb-5 max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-white md:text-6xl">
          Ready to turn inspiration <br /> into{" "}
          <span className="bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
            reality
          </span>
          ?
        </h2>

        <p className="mb-10 max-w-md text-sm leading-relaxed text-white/60 sm:text-base">
          Free to start. No code required. Your portfolio can be live today.
        </p>

        <button
          type="button"
          onClick={() => handleStart("modern")}
          className="inline-flex items-center gap-2.5 rounded-full bg-white px-10 py-4 text-base font-semibold text-gray-950 shadow-[0_0_30px_rgba(255,255,255,0.25)] transition-all duration-200 hover:scale-[1.04] hover:shadow-[0_0_45px_rgba(255,255,255,0.4)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black sm:text-lg"
        >
          Get Started with Foliofy
          <ArrowRight size={18} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};

export default ThemeCardCTA;
