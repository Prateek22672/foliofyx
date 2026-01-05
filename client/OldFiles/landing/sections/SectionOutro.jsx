import React, { useEffect } from "react";
import Footer from "../../components/Footer";
import "./SectionOutro.css";

const FOLIOFYX_LOGO_PATH = "/fyxw.png";

export default function SectionOutro({ handleNavigation }) {

  useEffect(() => {
    const elements = document.querySelectorAll(".textScroll");

    const handleScroll = () => {
      const scrollY = window.scrollY * 0.25; // speed control (0.25 = smooth slow)
      elements.forEach((el, index) => {
        const direction = index % 2 === 0 ? 1 : -1; 
        el.style.transform = `translateX(${scrollY * direction}px)`;
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      className="relative flex flex-col bg-[#0d0d82] rounded-t-4xl text-white items-center overflow-hidden w-full"
      style={{ minHeight: "100vh" }}
    >
      {/* 🔥 BACKGROUND MOVING TEXT LAYER (WE BUILD) */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none opacity-10"
        style={{ transform: "rotate(-15deg)" }}
      >
        <div className="flex whitespace-nowrap text-[18vw] font-black text-[#fcd5c5] textScroll">
          WE BUILD • WE BUILD • WE BUILD • WE BUILD •
        </div>

        <div className="flex whitespace-nowrap text-[18vw] font-black text-[#c9b0a7] textScroll mt-[-5vw]">
          WE BUILD • WE BUILD • WE BUILD • WE BUILD •
        </div>

        <div className="flex whitespace-nowrap text-[18vw] font-black text-[#e2c1b7] textScroll mt-[-5vw]">
          WE BUILD • WE BUILD • WE BUILD • WE BUILD •
        </div>
      </div>

      {/* === FOREGROUND CONTENT === */}
      <div
        className="relative z-10 flex-grow w-full flex flex-col items-center justify-center text-center p-8"
        style={{ animation: "fadeIn 1.5s ease-out 0.5s forwards", opacity: 0 }}
      >
        <p className="text-xl md:text-2xl font-normal opacity-80 mb-4">
          Don't just show your work.
        </p>

        <h2 className="text-[10vw] md:text-[80px] font-black leading-none tracking-tighter max-w-4xl">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-400 to-indigo-300">
            Show Your work.✨
          </span>
        </h2>

        <div className="flex items-center justify-center mt-6 space-x-3">
          <span className="text-xl md:text-2xl font-semibold text-white">By</span>
          <img
            src={FOLIOFYX_LOGO_PATH}
            alt="FolioFYX Logo"
            className="h-8 md:h-10 w-auto"
          />
        </div>

        <button
          onClick={() => handleNavigation("/create")}
          className="bg-white text-[#0d0d82] px-12 py-4 rounded-full mt-10 text-xl font-bold tracking-wide hover:scale-105 transition-all shadow-lg"
        >
          Build Now
        </button>
      </div>

      <div className="relative z-20 w-full bg-[#0d0d82]">
        <Footer />
      </div>
    </section>
  );
}
