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

  // Handle screen resizing
  useEffect(() => {
    if (propIsMobile !== undefined) return;
    const onResize = () => setIsMobileView(window.innerWidth <= 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [propIsMobile]);

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [menuOpen]);

  const navItems = ["home", "about", "experience", "projects", "contact"];

  return (
    <>
      {/* Standard Header Bar */}
      <header
        className={`${
          isCustomizePage ? "absolute pt-6" : "fixed left-0 top-6"
        } w-full flex justify-center pointer-events-none px-4 z-50 transition-transform duration-300 ${menuOpen ? "-translate-y-full" : "translate-y-0"}`}
        style={{ color: fg }}
      >
        <div
          className="
        pointer-events-auto 
        w-full max-w-5xl 
        px-6 sm:px-8 py-4 
        flex items-center justify-between
        bg-white/10 backdrop-blur-xl border border-white/20 rounded-full shadow-lg transition-all duration-300 hover:bg-white/20"
        >
          {/* Logo / Name */}
          <div className="font-bold text-lg tracking-tight">
            {data?.name || "FolioFYX"}
          </div>

          {/* Desktop Navigation */}
          {!isMobileView ? (
            <nav className="hidden sm:flex gap-8 items-center text-sm font-medium">
              {navItems.map((n) => (
                <a
                  key={n}
                  href={`#${n}`}
                  className="hover:opacity-60 transition-opacity relative group"
                  style={{ color: fg }}
                >
                  {n[0].toUpperCase() + n.slice(1)}
                  <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-current transition-all duration-300 group-hover:w-full"></span>
                </a>
              ))}
            </nav>
          ) : (
            /* Mobile Trigger Button */
            <button
              onClick={() => setMenuOpen(true)}
              style={{ color: fg }}
              className="p-2 rounded-full hover:bg-black/5 transition"
            >
               <div className="flex flex-col gap-[5px] items-end">
                  <span className="block h-[2px] bg-current w-6"></span>
                  <span className="block h-[2px] bg-current w-4"></span>
                  <span className="block h-[2px] bg-current w-6"></span>
              </div>
            </button>
          )}
        </div>
      </header>

      {/* Full Screen Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center transition-opacity duration-300 ${
          menuOpen && isMobileView
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Close Button (X) */}
        <button
          onClick={() => setMenuOpen(false)}
          className="absolute top-8 right-8 text-white p-2 hover:text-gray-300 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-8 h-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Main Navigation Links */}
        <nav className="flex flex-col items-center gap-8 mb-16">
          {navItems.map((item) => (
            <a
              key={item}
              href={`#${item}`}
              onClick={() => setMenuOpen(false)}
              className="text-4xl font-bold text-white tracking-wide hover:text-gray-400 transition-colors"
            >
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </a>
          ))}
        </nav>

        {/* Social Links Footer */}
        <div className="absolute bottom-16 flex gap-8 text-gray-500 text-sm font-bold tracking-widest uppercase">
          {/* Replace hash links with actual social URLs from portfolioData if available */}
          <a href={data?.linkedin || "#"} className="hover:text-white transition">
            Linkedin
          </a>
          <a href={data?.github || "#"} className="hover:text-white transition">
            Github
          </a>
        </div>
      </div>
    </>
  );
}

export default Header;