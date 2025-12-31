import React from "react";

const AboutSection = ({ showSplash, navigate, onScrollToContact }) => {
  return (
    // FIX: Use 'fixed' instead of 'sticky'. 
    // This pins it to the viewport behind everything else.
    <div
      className="fixed inset-0 w-full h-screen bg-white flex items-center justify-center overflow-hidden rounded-t-4xl"
      style={{
        zIndex: 0, // Behind the scrolling content
        // Animation Logic:
        // As you scroll down (var(--scroll) increases), the section scales down and fades out
        transform: "scale(calc(max(0.9, 1 - (var(--scroll) * 0.1))))",
        opacity: "calc(max(0, 1 - (var(--scroll) * 0.8)))",
        willChange: "transform, opacity",
      }}
    >
      <section className="relative w-full max-w-7xl mx-auto px-6 md:px-20 flex flex-col md:flex-row items-center justify-between gap-10 md:gap-16">
        {/* ... Same content as before ... */}
        
        {/* Left Content */}
        <div className="flex-1 text-center md:text-left space-y-4 max-w-xl z-10">
          <h1 className="text-4xl md:text-6xl font-bold text-black leading-tight">
            About FolioFYX
          </h1>
          <p className="text-gray-800 text-base md:text-lg leading-relaxed">
            Welcome to{" "}
            <span className="font-semibold text-[#0d0d82]">FolioFYX Studio</span> — a
            creative workspace where **design meets technology**.
            <br className="hidden md:block" />
            Our mission is to simplify portfolio creation with **elegance and
            precision**.
          </p>
        </div>

        {/* Right Content */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl z-10">
          {/* Studio Card */}
          <div className="relative bg-black p-4 sm:p-6 rounded-3xl shadow-lg hover:scale-[1.02] transition-transform duration-300 mx-auto w-full max-w-sm group">
            <img
              src="/studio.png"
              alt="FolioFYX Studio"
              className="rounded-2xl object-cover w-full h-auto opacity-80 group-hover:opacity-100 transition-opacity"
            />
            <button
              onClick={() => showSplash(2000, () => navigate("/create"), " Setting up...")}
              className="absolute bottom-4 right-4 bg-white text-[#0d0d82] px-4 py-2 rounded-full text-xs font-medium hover:bg-[#0d0d82] hover:text-white transition-all"
            >
              Get Started
            </button>
          </div>

          {/* Themes Card */}
          <div className="bg-[#cfd5ff] p-6 sm:p-8 rounded-3xl shadow-md hover:scale-[1.02] transition-transform duration-300 mx-auto w-full max-w-sm flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-3 text-[#0d0d82]">FolioFYX Themes</h3>
              <p className="text-sm text-gray-700 mb-6">
                Discover AI-curated themes from Minimal to Professional.
              </p>
            </div>
            <button onClick={onScrollToContact} className="self-start border border-[#0d0d82] text-[#0d0d82] px-4 py-2 rounded-full text-sm hover:bg-[#0d0d82] hover:text-white transition-all">
               Contact Us
            </button>
          </div>
        </div>

         {/* Signature */}
         <p className="absolute bottom-10 left-1/2 -translate-x-1/2 text-xs text-[#0d0d82] uppercase tracking-widest">
          A Prateek™ Product
        </p>
      </section>
    </div>
  );
};

export default AboutSection;