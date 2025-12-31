import React from "react";
import Footer from "../components/Footer"; // ✅ adjust path if needed

const NewRelease = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#FFFEB3] text-[#0d355c]">
      {/* 🌟 Hero Section */}
      <section className="flex -mt-10 flex-col items-center justify-center flex-grow text-center px-6 py-24 sm:py-32">
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-semibold mb-6 leading-snug">
          New Release — December Update
        </h1>

        <h1>Welcome to FolioFYX</h1>

        <p className="text-base sm:text-lg text-[#0d355c]/80 max-w-2xl mb-10 leading-relaxed">
          Loaded with <span className="font-semibold text-[#0d355c]">new templates</span>, 
          smarter <span className=" text-[#0d355c]">AI features</span>, 
          performance boosts, and creative tools — all crafted to make your 
          <span className="font-semibold"> Foliofy</span> experience smoother, faster, and more powerful than ever.
        </p>

        <button
          onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })}
          className="bg-[#0d355c] text-white px-8 py-3 rounded-full text-base sm:text-lg font-medium hover:scale-105 hover:bg-[#0b2c4e] transition-transform duration-300"
        >
          Coming Soon
        </button>

        <p className="mb-10 mt-15 text-[10px] sm:text-sm text-[#0d355c] uppercase tracking-[0.25em] text-center w-full">
  A Prateek™ Product — Where ideas meet passion.
</p>

      </section>

      {/* 🧭 Footer */}
      <footer className="bg-[#0d355c] text-white mt-auto rounded-t-[40px]">
        <Footer />
        <p className="text-xs text-center py-4 opacity-70">
          A <span className="font-semibold">Prateek™</span> Product — Built with passion.
        </p>
      </footer>
    </div>
  );
};

export default NewRelease;
