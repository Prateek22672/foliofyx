import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useSplash } from "../context/SplashContext";
import UserProfileMenu from "./UserProfileMenu"; 
import ElegantButton from "./ElegantButton";
import { X, LogOut, ChevronRight, LayoutDashboard } from "lucide-react"; 

const AppHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { showSplash } = useSplash();

  // === SCROLL STATE ===
  const [isVisible, setIsVisible] = useState(true);
  const [hasScrolled, setHasScrolled] = useState(false);
  const lastScrollY = useRef(0);

  // === INTRO & MENU STATE ===
  const [isExpanded, setIsExpanded] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsExpanded(true), 500);
    return () => clearTimeout(timer);
  }, []);

  // Throttled scroll handler for smoothness
  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    setHasScrolled(currentScrollY > 20);

    // Only hide on scroll if the mobile menu is NOT open
    if (isExpanded && !mobileMenuOpen) {
      if (currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY.current) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    }
    lastScrollY.current = currentScrollY;
  }, [isExpanded, mobileMenuOpen]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const handleNavigate = (path, message) => {
    if (location.pathname === path) {
      setMobileMenuOpen(false);
      return;
    }
    setMobileMenuOpen(false);
    showSplash(1500, () => navigate(path), message || "Loading...");
  };

  const handleSignOut = async () => {
    setMobileMenuOpen(false);
    await logout();
    navigate("/login");
  };

  const isGlass = hasScrolled || mobileMenuOpen;
  const iconColor = isGlass ? "#171717" : "#FFFFFF"; 
  
  const navLinks = ['Home', 'Templates', 'Talent', 'Benefits', 'About'];

  return (
    <>
      {/* Overlay Backdrop when menu is open (Smooth fade) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      <motion.header
        layout 
        initial={{ y: 0, opacity: 0, width: "80px", height: "58px", borderRadius: "99px" }}
        animate={{ 
          y: isVisible ? 0 : -100, 
          opacity: 1,
          // When menu is open, it becomes a wider card (92%) with auto height
          width: isExpanded 
            ? (mobileMenuOpen ? "92%" : "min(92%, 64rem)") 
            : "80px",
          height: mobileMenuOpen ? "auto" : "58px",
          borderRadius: mobileMenuOpen ? "32px" : "99px" // Larger radius for card look
        }}
        transition={{ type: "spring", stiffness: 120, damping: 25 }} // Smoother spring
        className={`
          fixed top-5 left-1/2 -translate-x-1/2 z-50
          flex flex-col overflow-hidden
          ${mobileMenuOpen 
             ? "bg-white text-black shadow-2xl" // Solid white card
             : hasScrolled 
               ? "bg-white/80 backdrop-blur-md border border-white/40 shadow-sm"
               : "bg-black/90 backdrop-blur-md border border-white/10"
          }
        `}
        style={{ willChange: "transform, width, height, border-radius" }} // Optimize for GPU
      >
        {/* ==================== STANDARD HEADER ROW (Hidden when Mobile Menu Open) ==================== */}
        {!mobileMenuOpen && (
          <motion.div
            layout
            className={`
              flex items-center w-full px-6 shrink-0
              ${isExpanded ? "justify-between" : "justify-center"}
              h-[58px]
            `}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
              
            {/* LOGO (Collapsed State) */}
            <div
              onClick={() => handleNavigate("/", "Returning Home...")}
              className="flex items-center cursor-pointer group select-none shrink-0"
            >
              <img
                src="/fyx3.png"
                alt="Foliofy Logo"
                className={`
                  h-5 w-auto object-contain transition-all duration-500 
                  ${isGlass ? "filter-none" : "brightness-0 invert"}
                `}
              />
            </div>

            {/* DESKTOP NAV */}
            <AnimatePresence>
              {isExpanded && (
                 <motion.nav 
                   initial={{ opacity: 0, scale: 0.95 }} 
                   animate={{ opacity: 1, scale: 1 }} 
                   exit={{ opacity: 0, scale: 0.95 }}
                   transition={{ duration: 0.4, ease: "easeOut" }}
                   className="hidden md:flex absolute left-1/2 -translate-x-1/2"
                 >
                   <div className={`
                     flex items-center h-[34px] p-[3px] rounded-full border transition-colors duration-300
                     ${hasScrolled ? "bg-gray-100/80 border-gray-200" : "bg-white/10 border-white/5"}
                   `}>
                     {navLinks.map((item) => {
                       const path = item === 'Home' ? '/' : `/${item.toLowerCase()}`;
                       const isActive = location.pathname === path;

                       return (
                         <div key={item} className="relative h-full flex items-center">
                           {isActive && (
                             <motion.div
                               layoutId="nav-pill"
                               className={`
                                 absolute inset-0 rounded-full shadow-sm
                                 ${hasScrolled ? "bg-white" : "bg-white/20"}
                               `}
                               transition={{ type: "spring", stiffness: 300, damping: 30 }}
                             />
                           )}
                           <button
                             onClick={() => handleNavigate(path)}
                             className={`
                               relative z-10 h-full px-4 flex items-center justify-center text-[13px] font-medium tracking-wide transition-colors duration-200 rounded-full
                               ${hasScrolled 
                                 ? (isActive ? "text-black" : "text-gray-500 hover:text-gray-900")
                                 : (isActive ? "text-white" : "text-white/60 hover:text-white")
                               }
                             `}
                           >
                             {item}
                           </button>
                         </div>
                       );
                     })}
                   </div>
                 </motion.nav>
              )}
            </AnimatePresence>

            {/* RIGHT ACTIONS */}
            {isExpanded && (
              <motion.div 
                layout
                className="flex items-center gap-3"
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                
                {/* Desktop Buttons */}
                <div className="hidden md:flex items-center gap-5">
                  {user ? (
                    <>
                      <button 
                        onClick={() => handleNavigate("/dashboard")} 
                        className={`text-[13px] font-medium tracking-wide transition-colors ${
                          hasScrolled ? "text-neutral-500 hover:text-black" : "text-white/60 hover:text-white"
                        }`}
                      >
                        Dashboard
                      </button>
                      <ElegantButton 
                        label="Create New" 
                        variant="primary" 
                        size="sm"
                        onClick={() => handleNavigate("/templates", "Opening templates...")}
                        className={!hasScrolled ? "!bg-white !text-black hover:!bg-gray-200 border-none" : ""}
                      />
                      <div className={`pl-2 border-l ${hasScrolled ? "border-neutral-200" : "border-white/10"} h-6 flex items-center`}>
                          <UserProfileMenu />
                      </div>
                    </>
                  ) : (
                    <>
                      <button 
                        onClick={() => handleNavigate("/login")} 
                        className={`text-[13px] font-medium tracking-wide px-3 ${hasScrolled ? "text-neutral-800" : "text-white"}`}
                      >
                        Log in
                      </button>
                      <ElegantButton 
                        label="Get Started" 
                        variant="primary" 
                        onClick={() => handleNavigate("/signup")} 
                        className={!hasScrolled ? "!bg-white !text-black hover:!bg-gray-200 border-none" : ""}
                      />
                    </>
                  )}
                </div>

                {/* Mobile Toggle Button (Hamburger) */}
                <button 
                  onClick={(e) => { e.stopPropagation(); setMobileMenuOpen(true); }}
                  className={`md:hidden p-2 -mr-2 rounded-full transition-colors flex items-center justify-center cursor-pointer hover:bg-white/10`}
                >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.5">
                      <line x1="4" y1="8" x2="20" y2="8" strokeLinecap="round" />
                      <line x1="10" y1="16" x2="20" y2="16" strokeLinecap="round" />
                    </svg>
                </button>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* ==================== MOBILE MENU CARD CONTENT (Smooth Animated) ==================== */}
        <AnimatePresence mode="wait">
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="md:hidden flex flex-col w-full h-full p-6"
            >
              {/* 1. Header Row Inside Menu */}
              <div className="flex items-center justify-between mb-8">
                {/* Logo */}
                <div className="flex items-center gap-1">
                   <img src="/fyx3.png" alt="FolioFYX" className="h-6 w-auto" />
                   {/* Optional: If you want text next to it like screenshot */}
                   {/* <span className="font-bold text-xl tracking-tight">FolioFYX</span> */}
                </div>
                
                {/* Close Button */}
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X size={24} className="text-gray-900" />
                </button>
              </div>

              {/* 2. Navigation Links */}
              <div className="flex flex-col space-y-5 mb-8">
                {navLinks.map((item) => (
                  <motion.button
                    key={item}
                    onClick={() => handleNavigate(item === 'Home' ? '/' : `/${item.toLowerCase()}`)}
                    className="text-left text-[18px] font-medium text-gray-600 hover:text-black transition-colors"
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.1 }}
                  >
                    {item}
                  </motion.button>
                ))}
              </div>

              {/* 3. Bottom Actions & Profile Card */}
              <div className="mt-auto pt-4">
                {user ? (
                  <div className="flex flex-col gap-4">
                      {/* Black Primary Button */}
                      <motion.button
                        onClick={() => handleNavigate("/templates", "Opening templates...")}
                        className="w-full bg-black text-white rounded-full py-3.5 text-[15px] font-medium shadow-lg active:scale-[0.98] transition-transform"
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.1 }}
                      >
                        Create New Portfolio
                      </motion.button>

                      {/* User Account Card (Matches Reference) */}
                      <div className="bg-gray-50 rounded-2xl p-3.5 flex items-center justify-between border border-gray-100">
                          {/* Left: Avatar & Text */}
                          <div className="flex items-center gap-3">
                            {/* Reusing existing UserProfileMenu logic or a simple avatar */}
                             <div className="relative">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neutral-800 to-black flex items-center justify-center text-white font-medium text-sm">
                                  {user?.displayName?.charAt(0) || "U"}
                                </div>
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                             </div>
                            <div className="flex flex-col">
                              <span className="text-[14px] font-bold text-gray-900 leading-tight">My Account</span>
                              <span className="text-[11px] text-gray-500">Manage Profile</span>
                            </div>
                          </div>

                          {/* Right: Actions */}
                          <div className="flex items-center gap-2">
                            <motion.button
                              onClick={() => handleNavigate("/dashboard")}
                              className="bg-white text-black px-3 py-1.5 rounded-full text-[11px] font-semibold shadow-sm border border-gray-200 hover:bg-gray-100 transition flex items-center gap-1"
                              whileTap={{ scale: 0.95 }}
                              transition={{ duration: 0.1 }}
                            >
                              Dashboard
                            </motion.button>
                            
                            <motion.button 
                              onClick={handleSignOut}
                              className="w-8 h-8 flex items-center justify-center bg-white rounded-full border border-gray-200 text-red-500 hover:bg-red-50 transition shadow-sm"
                              whileTap={{ scale: 0.95 }}
                              transition={{ duration: 0.1 }}
                            >
                              <LogOut size={14} />
                            </motion.button>
                          </div>
                      </div>
                  </div>
                ) : (
                  // Logged Out State
                  <div className="flex flex-col gap-3">
                    <motion.button
                      onClick={() => handleNavigate("/signup")} 
                      className="w-full bg-black text-white rounded-full py-3.5 text-[15px] font-medium shadow-lg active:scale-[0.98] transition-transform"
                      whileTap={{ scale: 0.95 }}
                      transition={{ duration: 0.1 }}
                    >
                      Get Started
                    </motion.button>
                    <button 
                      onClick={() => handleNavigate("/login")} 
                      className="text-[14px] font-medium text-neutral-500 py-2 hover:text-black transition-colors"
                    >
                      Log in to existing account
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
};

export default AppHeader;