import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useSplash } from "../context/SplashContext";
import UserProfileMenu from "./UserProfileMenu"; 
import ElegantButton from "./ElegantButton";
import { X, LogOut, ChevronRight, LayoutDashboard, Plus } from "lucide-react"; 

const AppHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { showSplash } = useSplash();

  const [isVisible, setIsVisible] = useState(true);
  const [hasScrolled, setHasScrolled] = useState(false);
  const lastScrollY = useRef(0);

  const [isExpanded, setIsExpanded] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsExpanded(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    setHasScrolled(currentScrollY > 20);

    if (isExpanded && !mobileMenuOpen) {
      if (currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY.current + 6) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY.current - 6) {
        setIsVisible(true);
      }
    }
    lastScrollY.current = currentScrollY;
  }, [isExpanded, mobileMenuOpen]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    if (mobileMenuOpen) setIsVisible(true);
  }, [mobileMenuOpen]);

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

  // Nav links — swap Home → MyDashboard when logged in (desktop only)
  const baseNavLinks = ['Home', 'AI Builder', 'Designs', 'Talent', 'Benefits', 'About'];
  const desktopNavLinks = user
    ? ['AI Builder', 'Designs', 'Talent', 'Benefits', 'About', 'MyDashboard']
    : baseNavLinks;

  const getPath = (item) => {
    if (item === 'Home') return '/';
    if (item === 'MyDashboard') return '/dashboard';
    if (item === 'AI Builder') return '/ai-builder';
    return `/${item.toLowerCase()}`;
  };

  return (
    <>
      {/* Overlay Backdrop */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      <motion.header
        layout
        data-native-cursor
        initial={{ y: -20, opacity: 0, width: "80px", height: "58px", borderRadius: "99px" }}
        animate={{ 
          y: isVisible ? 0 : -90,
          opacity: 1,
          width: isExpanded 
            ? (mobileMenuOpen ? "92%" : "min(92%, 64rem)") 
            : "80px",
          height: mobileMenuOpen ? "auto" : "58px",
          borderRadius: mobileMenuOpen ? "32px" : "99px",
        }}
        transition={{
          y:            { type: "spring", stiffness: 200, damping: 30, mass: 0.8 },
          opacity:      { duration: 0.5, ease: "easeOut" },
          width:        { type: "spring", stiffness: 160, damping: 28, mass: 0.9 },
          height:       { type: "spring", stiffness: 160, damping: 28, mass: 0.9 },
          borderRadius: { type: "spring", stiffness: 260, damping: 32 },
        }}
        className={`
          fixed top-5 left-1/2 -translate-x-1/2 z-50
          flex flex-col overflow-hidden
          ${mobileMenuOpen 
             ? "bg-white text-black shadow-2xl"
             : hasScrolled 
               ? "bg-white/80 backdrop-blur-md border border-white/40 shadow-sm"
               : "bg-black/90 backdrop-blur-md border border-white/10"
          }
        `}
        style={{ willChange: "transform, width, height, border-radius" }}
      >
        {/* ==================== STANDARD HEADER ROW ==================== */}
        {!mobileMenuOpen && (
          <motion.div
            layout
            className={`
              flex items-center w-full px-6 shrink-0
              ${isExpanded ? "justify-between" : "justify-center"}
              h-[58px]
            `}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
              
            {/* LOGO */}
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
                  initial={{ opacity: 0, scale: 0.94, y: -4 }} 
                  animate={{ opacity: 1, scale: 1, y: 0 }} 
                  exit={{ opacity: 0, scale: 0.94, y: -4 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="hidden md:flex absolute left-1/2 -translate-x-1/2"
                >
                  <div className={`
                    flex items-center h-[38px] p-[3px] rounded-full border transition-colors duration-300
                    ${hasScrolled ? "bg-gray-100/80 border-gray-200" : "bg-white/10 border-white/5"}
                  `}>
                    {desktopNavLinks.map((item) => {
                      const path = getPath(item);
                      const isActive = location.pathname === path;
                      const isDashboard = item === 'MyDashboard';

                      return (
                        <div key={item} className="relative h-full flex items-center">
                          {isActive && (
                            <motion.div
                              layoutId="nav-pill"
                              className={`
                                absolute inset-0 rounded-full shadow-sm
                                ${hasScrolled ? "bg-white" : "bg-white/20"}
                              `}
                              transition={{ type: "spring", stiffness: 380, damping: 36 }}
                            />
                          )}
                          <button
                            onClick={() => handleNavigate(path)}
                            className={`
                              relative z-10 h-full px-4 flex items-center justify-center gap-1.5
                              text-[13px] font-medium tracking-wide transition-colors duration-200 rounded-full
                              ${hasScrolled 
                                ? (isActive ? "text-black" : "text-gray-500 hover:text-gray-900")
                                : (isActive ? "text-white" : "text-white/60 hover:text-white")
                              }
                            `}
                          >
                            {/* Small grid icon for MyDashboard */}
                            {isDashboard && (
                              <svg
                                width="12" height="12" viewBox="0 0 12 12" fill="none"
                                className="shrink-0 opacity-70"
                              >
                                <rect x="0" y="0" width="5" height="5" rx="1.2" fill="currentColor"/>
                                <rect x="7" y="0" width="5" height="5" rx="1.2" fill="currentColor"/>
                                <rect x="0" y="7" width="5" height="5" rx="1.2" fill="currentColor"/>
                                <rect x="7" y="7" width="5" height="5" rx="1.2" fill="currentColor"/>
                              </svg>
                            )}
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
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-3"
              >
                
                {/* Desktop Right */}
                <div className="hidden md:flex items-center gap-3">
                  {user ? (
                    <>
                      {/* Plus icon button — replaces "Create New" */}
                      <motion.button
                        onClick={() => handleNavigate("/create", "Opening creator...")}
                        whileTap={{ scale: 0.93 }}
                        title="Create new"
                        className={`
                          w-8 h-8 rounded-full flex items-center justify-center
                          transition-all duration-200
                          ${hasScrolled
                            ? "bg-black text-white hover:bg-neutral-800"
                            : "bg-white text-black hover:bg-gray-100"
                          }
                        `}
                      >
                        <Plus size={15} strokeWidth={2.2} />
                      </motion.button>

                      <div className={`border-l ${hasScrolled ? "border-black/80" : "border-white/80"} h-5 flex items-center pl-3`}>
                        <UserProfileMenu hasScrolled={hasScrolled} />
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

                {/* Mobile Hamburger */}
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

        {/* ==================== MOBILE MENU ==================== */}
        <AnimatePresence mode="wait">
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="md:hidden flex flex-col w-full h-full p-6"
            >
              {/* Header Row */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center justify-between mb-8"
              >
                <div className="flex items-center gap-1">
                  <img src="/fyx3.png" alt="FolioFYX" className="h-6 w-auto" />
                </div>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X size={24} className="text-gray-900" />
                </button>
              </motion.div>

              {/* Mobile always uses baseNavLinks (Home, not MyDashboard) */}
              <div className="flex flex-col space-y-5 mb-8">
                {baseNavLinks.map((item, i) => (
                  <motion.button
                    key={item}
                    initial={{ opacity: 0, x: -14 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{
                      duration: 0.3,
                      ease: [0.16, 1, 0.3, 1],
                      delay: 0.04 + i * 0.04,
                    }}
                    onClick={() => handleNavigate(getPath(item))}
                    className="text-left text-[18px] font-medium text-gray-600 hover:text-black transition-colors"
                    whileTap={{ scale: 0.97 }}
                  >
                    {item}
                  </motion.button>
                ))}
              </div>

              {/* Bottom Actions */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1], delay: 0.16 }}
                className="mt-auto pt-4"
              >
                {user ? (
                  <div className="flex flex-col gap-4">
                    <motion.button
                      onClick={() => handleNavigate("/create", "Opening creator...")}
                      className="w-full bg-black text-white rounded-full py-3.5 text-[15px] font-medium shadow-lg active:scale-[0.98] transition-transform"
                      whileTap={{ scale: 0.97 }}
                    >
                      Create New Portfolio
                    </motion.button>

                    <div className="bg-gray-50 rounded-2xl p-3.5 flex items-center justify-between border border-gray-100">
                      <div className="flex items-center gap-3">
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

                      <div className="flex items-center gap-2">
                        <motion.button
                          onClick={() => handleNavigate("/dashboard")}
                          className="bg-white text-black px-3 py-1.5 rounded-full text-[11px] font-semibold shadow-sm border border-gray-200 hover:bg-gray-100 transition flex items-center gap-1"
                          whileTap={{ scale: 0.95 }}
                        >
                          Dashboard
                        </motion.button>
                        
                        <motion.button 
                          onClick={handleSignOut}
                          className="w-8 h-8 flex items-center justify-center bg-white rounded-full border border-gray-200 text-red-500 hover:bg-red-50 transition shadow-sm"
                          whileTap={{ scale: 0.95 }}
                        >
                          <LogOut size={14} />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <motion.button
                      onClick={() => handleNavigate("/signup")} 
                      className="w-full bg-black text-white rounded-full py-3.5 text-[15px] font-medium shadow-lg active:scale-[0.98] transition-transform"
                      whileTap={{ scale: 0.97 }}
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
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
};

export default AppHeader;