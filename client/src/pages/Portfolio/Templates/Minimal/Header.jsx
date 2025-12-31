import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const DEFAULT_FG = "#111827";

function Header({ portfolioData = {}, isMobileView: propIsMobile }) {
  const data = portfolioData || {};
  const fg = data?.themeFont || DEFAULT_FG;

  const location = useLocation();
  const isCustomizePage = location.pathname.includes("/customize");

  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(
    propIsMobile ?? window.innerWidth <= 768
  );

  useEffect(() => {
    if (propIsMobile !== undefined) return;
    const onResize = () => setIsMobileView(window.innerWidth <= 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [propIsMobile]);

  const navItems = ["home", "about", "experience", "projects", "contact"];

  return (
    <header
      className={`${
        isCustomizePage ? "absolute pt-6" : "fixed left-0 top-10"
      } w-full flex justify-center pointer-events-none px-0 z-50`}
      style={{ color: fg }}
    >
      <div
        className="
        pointer-events-auto 
        w-full max-w-6xl 
        px-6 sm:px-10 py-3 
        flex items-center justify-between"
      >
        {/* Desktop Navigation */}
        {!isMobileView ? (
          <nav className="hidden sm:flex gap-10 items-center text-sm font-medium mx-auto">
            {navItems.map((n) => (
              <a
                key={n}
                href={`#${n}`}
                className="hover:opacity-70 transition"
                style={{ color: fg }}
              >
                {n[0].toUpperCase() + n.slice(1)}
              </a>
            ))}
            {/*
            <a
              href="#contact"
              className="bg-black text-white px-5 py-1.5 rounded-full text-sm shadow-md hover:bg-gray-900"
            >
              Contact
            </a>*/}
          </nav>
        ) : (
          <button
            onClick={() => setMenuOpen((s) => !s)}
            style={{ background: "white", color: fg }}
            className="p-2 rounded-md flex flex-col justify-center items-center gap-[3px]"
          >
            <span className="block w-4 h-[2px] bg-black"></span>
            <span className="block w-4 h-[2px] bg-black"></span>
            <span className="block w-4 h-[2px] bg-black"></span>
          </button>
        )}
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && isMobileView && (
        <div
          className="
            absolute top-full right-4 mt-3 
            w-48 
            rounded-2xl 
            shadow-xl 
            p-4 
            flex flex-col gap-3
            animate-fadeIn
          "
          style={{ background: "white", color: fg }}
        >
          {[...navItems, "contact"].map((item) => (
            <a
              key={item}
              href={`#${item}`}
              onClick={() => setMenuOpen(false)}
              className="py-1 px-2 rounded-md hover:bg-black/10 transition"
            >
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}

export default Header;
