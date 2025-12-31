import React from "react";

export default function Background() {
  return (
    <>
      <div className="fixed inset-0 bg-[#030303] z-0"></div>
      
      {/* Abstract Smoke/Fluid Effect */}
      <video
        className="fixed top-0 left-0 w-full h-full object-cover z-0 opacity-40 mix-blend-screen blur-3xl scale-125 saturate-0 contrast-125"
        src="/themes/newtempDemo.mp4"
        autoPlay
        loop
        muted
        playsInline
      />
      
      {/* Vignette & Gradients to force focus to center */}
      <div className="fixed inset-0 bg-radial-gradient from-transparent via-black/20 to-black/90 z-0 pointer-events-none"></div>
      
      {/* Subtle Noise Texture for Film Grain look */}
      <div className="fixed inset-0 z-0 opacity-[0.04] pointer-events-none mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
    </>
  );
}