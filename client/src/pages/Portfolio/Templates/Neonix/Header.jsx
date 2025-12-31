import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const DEFAULT_FG = "#111827";
const DEFAULT_BG = "#ffffff";

function Header({ portfolioData = {}, isMobileView: propIsMobile }) {
  const data = portfolioData || {};
  
  // --- Theme Logic ---
  const fg = data?.themeFont || DEFAULT_FG;
  const bg = data?.themeBg || DEFAULT_BG;
  // Fallback accent if needed, though not strictly used in the simple version provided
  const accent = data.accentColor || "#2563eb";

  const location = useLocation();
  const isCustomizePage = location.pathname.includes("/customize");
  
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(propIsMobile ?? window.innerWidth <= 768);
  
  // --- SCROLL LOGIC ---
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== 'undefined') {
        const currentScrollY = window.scrollY;
        
        // Always show if at the very top or if scrolling UP
        if (currentScrollY < 10 || currentScrollY < lastScrollY) {
          setIsVisible(true);
        } else {
          // Hide if scrolling DOWN and past the top area
          setIsVisible(false);
        }
        setLastScrollY(currentScrollY);
      }
    };

    window.addEventListener('scroll', controlNavbar);
    return () => window.removeEventListener('scroll', controlNavbar);
  }, [lastScrollY]);

  // Handle Mobile View Resize
  useEffect(() => {
    if (propIsMobile !== undefined) return;
    const onResize = () => setIsMobileView(window.innerWidth <= 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [propIsMobile]);

  // Prevent scrolling body when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [menuOpen]);

  const navItems = ["home", "about", "projects", "contact"];

  return (
    <>
      <header
        className={`left-0 w-full z-50 transition-transform duration-300 ease-in-out ${
          // If customize page, always stay at top. Otherwise, hide/show based on scroll.
          isCustomizePage 
            ? "absolute pt-6 translate-y-0" 
            : isVisible 
              ? "fixed translate-y-0 py-6" 
              : "-translate-y-full py-6"
        }`}
      >
        {/* Container aligned with Home section max-width */}
        <div className="w-full max-w-7xl mx-auto px-6 sm:px-12 lg:px-16">
          <div 
            className="w-full backdrop-blur-xl border shadow-sm rounded-full px-6 py-4 flex items-center justify-between transition-colors duration-500"
            style={{ 
              // Adapt to theme background with transparency (CC = 80% opacity)
              backgroundColor: `${bg}CC`, 
              borderColor: `${fg}20` // Subtle border based on text color
            }}
          >
            
            {/* Logo / Name */}
            <a href="#home" className="text-xl font-medium tracking-tight" style={{ color: fg }}>
              {data?.name ? data.name.split(' ')[0] : 'Portfolio'}.
            </a>

            {/* Desktop Nav */}
            {!isMobileView ? (
              <nav className="flex gap-8 items-center text-sm font-medium tracking-wide">
                {navItems.map((n) => (
                  <a
                    key={n}
                    href={`#${n}`}
                    className="relative group opacity-80 hover:opacity-100 transition-opacity"
                    style={{ color: fg }}
                  >
                    {n.charAt(0).toUpperCase() + n.slice(1)}
                    <span 
                        className="absolute -bottom-1 left-0 w-0 h-[1px] transition-all duration-300 group-hover:w-full"
                        style={{ backgroundColor: fg }}
                    ></span>
                  </a>
                ))}
              </nav>
            ) : (
              // Mobile Hamburger Button
              <button 
                onClick={() => setMenuOpen(true)} 
                className="p-1 space-y-1.5 group"
                style={{ color: fg }}
              >
                <div className="w-6 h-0.5 bg-current transition-transform group-hover:rotate-180"></div>
                <div className="w-6 h-0.5 bg-current transition-transform group-hover:-rotate-180"></div>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* FULL SCREEN MOBILE MENU OVERLAY */}
      {menuOpen && isMobileView && (
        <div 
          className="fixed inset-0 z-[60] flex flex-col animate-fadeIn transition-colors duration-500"
          style={{ backgroundColor: bg }} // Adapt to theme background
        >
          
          {/* Mobile Header with Close Button */}
          <div className="px-6 py-10 flex justify-between items-center w-full max-w-7xl mx-auto">
             {/* Logo in Menu */}
             <span className="text-xl font-bold tracking-tight" style={{ color: fg }}>
                {data?.name ? data.name.split(' ')[0] : 'Portfolio'}.
             </span>

             {/* Close (X) Button */}
             <button 
               onClick={() => setMenuOpen(false)}
               className="w-12 h-12 rounded-full border flex items-center justify-center hover:opacity-70 transition-opacity"
               style={{ borderColor: `${fg}30` }}
             >
               <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                 <path d="M1 1L13 13M1 13L13 1" stroke={fg} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
               </svg>
             </button>
          </div>

          {/* Menu Items - Centered Vertical List */}
          <nav className="flex-1 flex flex-col items-center justify-center gap-8 -mt-20">
            {navItems.map((item) => (
              <a
                key={item}
                href={`#${item}`}
                onClick={() => setMenuOpen(false)}
                className="text-4xl font-medium hover:opacity-60 transition-opacity tracking-tight"
                style={{ color: fg }}
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </a>
            ))}
            
            {/* Extra Links */}
            <div className="mt-12 flex gap-8 opacity-60">
               {data?.linkedin && (
                 <a href={data.linkedin} target="_blank" rel="noreferrer" className="text-sm font-semibold uppercase tracking-widest hover:opacity-100 transition-opacity" style={{ color: fg }}>
                   LinkedIn
                 </a>
               )}
               {data?.github && (
                 <a href={data.github} target="_blank" rel="noreferrer" className="text-sm font-semibold uppercase tracking-widest hover:opacity-100 transition-opacity" style={{ color: fg }}>
                   GitHub
                 </a>
               )}
            </div>
          </nav>
        </div>
      )}
    </>
  );
}

export default Header;