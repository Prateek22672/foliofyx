import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useSplash } from "../context/SplashContext";
import UserProfileMenu from "./UserProfileMenu"; // ✅ Imported
import ElegantButton from "./ElegantButton";
import { X, LogOut } from "lucide-react"; 

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

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setHasScrolled(currentScrollY > 20);

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
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isExpanded, mobileMenuOpen]);

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
  const navLinks = ['Home', 'Talent', 'Templates', 'Pricing', 'Studio' ,'About'];

  return (
    <motion.header
      layout 
      initial={{ y: 0, opacity: 0, width: "80px", height: "58px", borderRadius: "99px" }}
      animate={{ 
        y: isVisible ? 0 : -100, 
        opacity: 1,
        width: isExpanded 
          ? (mobileMenuOpen ? "90%" : "min(92%, 64rem)") 
          : "80px",
        height: mobileMenuOpen ? "auto" : "58px",
        borderRadius: mobileMenuOpen ? "24px" : "99px"
      }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className={`
        fixed top-5 left-1/2 -translate-x-1/2 z-50
        flex flex-col overflow-hidden
        ${mobileMenuOpen 
           ? "bg-white text-black shadow-2xl ring-1 ring-black/5"
           : hasScrolled 
             ? "bg-white/80 backdrop-blur-md border border-white/40 shadow-sm"
             : "bg-black/90 backdrop-blur-md border border-white/10"
        }
      `}
    >
      {/* ==================== HEADER ROW ==================== */}
      <div className={`
          flex items-center w-full px-6 shrink-0
          ${isExpanded ? "justify-between" : "justify-center"}
          h-[58px]
      `}>
          
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
              ${mobileMenuOpen ? "filter-none" : (isGlass ? "filter-none" : "brightness-0 invert")}
            `}
          />
        </div>

        {/* ==================== DESKTOP NAV ==================== */}
        <AnimatePresence>
          {isExpanded && !mobileMenuOpen && (
             <motion.nav 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
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

        {/* ==================== RIGHT ACTIONS ==================== */}
        {isExpanded && (
          <div className="flex items-center gap-3">
{/* Desktop Actions */}
<div className="hidden md:flex items-center gap-3">
  {user ? (
    <>
      <ElegantButton 
        label="Dashboard" 
        variant={hasScrolled ? "secondary" : "glass"} 
        onClick={() => handleNavigate("/dashboard")} 
        size="sm" 
      />
      <div className={`pl-3 border-l ${hasScrolled ? "border-neutral-300" : "border-white/20"} h-4 flex items-center`}>
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
      
      {/* 👇 UPDATED BUTTON CODE HERE 👇 */}
      <ElegantButton 
        label="Get Started" 
        variant="primary" 
        onClick={() => handleNavigate("/signup")} 
        // If NOT scrolled (dark header), force White BG and Black Text.
        // If scrolled (light header), keep default Primary styles.
        className={!hasScrolled ? "!bg-white !text-black hover:!bg-gray-200 border-none" : ""}
      />
      
    </>
  )}
</div>

            {/* Mobile Toggle */}
            <button 
              onClick={(e) => { e.stopPropagation(); setMobileMenuOpen(!mobileMenuOpen); }}
              className={`md:hidden p-2 -mr-2 rounded-full transition-colors flex items-center justify-center z-50 cursor-pointer ${mobileMenuOpen ? "bg-transparent" : "hover:bg-white/10"}`}
            >
               {mobileMenuOpen ? <X size={22} color="#000" /> : (
                 <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.5">
                   <line x1="4" y1="8" x2="20" y2="8" strokeLinecap="round" />
                   <line x1="10" y1="16" x2="20" y2="16" strokeLinecap="round" />
                 </svg>
               )}
            </button>
          </div>
        )}
      </div>

      {/* ==================== MOBILE MENU CONTENT ==================== */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden flex flex-col w-full h-full justify-between"
          >
            <div className="flex flex-col px-6 pt-4">
              <div className="flex flex-col space-y-4">
                {navLinks.map((item) => (
                  <button
                    key={item}
                    onClick={() => handleNavigate(item === 'Home' ? '/' : `/${item.toLowerCase()}`)}
                    className="text-left text-[17px] font-medium text-neutral-800 hover:text-black transition-colors"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Footer / Auth Section */}
            <div className="p-6 mt-8">
              {user ? (
                // ✅ LOGGED IN: Profile Card
                <div className="bg-gray-50 rounded-2xl p-4 flex items-center justify-between border border-gray-100">
                   <div className="flex items-center gap-3">
                      
                      {/* 🔥 HERE IS THE CHANGE: Replaced static div with UserProfileMenu */}
                      {/* Clicking this now triggers the full Premium Dropdown */}
                      <UserProfileMenu /> 

                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-900">My Account</span>
                        <span className="text-[11px] text-gray-500">Manage Profile</span>
                      </div>
                   </div>

                   <div className="flex items-center gap-3">
                     <button
                        onClick={() => handleNavigate("/dashboard")}
                        className="bg-white text-black px-4 py-2 rounded-full text-xs font-semibold shadow-sm border border-gray-200 hover:bg-gray-100 transition"
                      >
                        Dashboard
                      </button>
                      
                      <button 
                        onClick={handleSignOut}
                        className="p-2 bg-white rounded-full border border-gray-200 text-red-500 hover:bg-red-50 transition"
                        title="Sign Out"
                      >
                        <LogOut size={16} />
                      </button>
                   </div>
                </div>
              ) : (
                // LOGGED OUT STATE
                <div className="flex flex-col gap-3">
                  <ElegantButton 
                    label="Get Started" 
                    variant="primary" 
                    onClick={() => handleNavigate("/signup")} 
                    className="w-full justify-center h-12 text-md"
                  />
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
  );
};

export default AppHeader;