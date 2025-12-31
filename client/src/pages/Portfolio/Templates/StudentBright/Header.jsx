import React, { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

export default function Header({ portfolioData = {} }) {
  const name = (portfolioData?.name || "Student").split(" ")[0];

  const [hidden, setHidden] = useState(false);
  const [lastScroll, setLastScroll] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);

  // scroll hide/show
  useEffect(() => {
    const onScroll = () => {
      const current = window.scrollY;
      if (current > lastScroll && current > 60) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      setLastScroll(current);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [lastScroll]);

  const sections = ["home", "about", "experience", "projects", "contact"];

  const scrollTo = (sec) => {
    document.getElementById(sec)?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  return (
    <>
      <header
        className={`top-0 absolute left-0 w-full z-50 transition-all duration-300
        ${hidden ? "-translate-y-full" : "translate-y-0"}`}
      >
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold text-black">{name}'s Portfolio</h1>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-6 text-black font-medium">
            {sections.map((sec) => (
              <button
                key={sec}
                onClick={() => scrollTo(sec)}
                className="hover:text-yellow-400 transition"
              >
                {sec.charAt(0).toUpperCase() + sec.slice(1)}
              </button>
            ))}
          </nav>

          {/* Mobile Menu Icon */}
          <button
            className="md:hidden p-2 text-black"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </header>

      {/* Mobile Dropdown GLASS UI */}
      {mobileOpen && (
        <div
          className="
            absolute top-16 left-0 w-full 
            bg-white/20 backdrop-blur-xl 
            border-b border-white/30 shadow-lg
            md:hidden z-40 px-6 py-5 animate-slide-down 
            rounded-b-3xl
          "
        >
          <div className="flex flex-col gap-4 text-black font-medium">
            {sections.map((sec) => (
              <button
                key={sec}
                onClick={() => scrollTo(sec)}
                className="text-left py-3 px-2 rounded-xl
                hover:bg-white/30 transition"
              >
                {sec.charAt(0).toUpperCase() + sec.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Animation */}
      <style>{`
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-down {
          animation: slide-down 0.25s ease-out;
        }
      `}</style>
    </>
  );
}
