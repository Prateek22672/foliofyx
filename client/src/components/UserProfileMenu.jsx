import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSplash } from "../context/SplashContext";
import { ChevronRight } from "lucide-react";

const UserProfileMenu = () => {
  const { user, logout } = useAuth();
  const { showSplash } = useSplash();
  const [menuOpen, setMenuOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const navigate = useNavigate();
  const buttonRef = useRef(null);

  // === MOCK PLAN STATUS (Replace with actual user.plan from your DB) ===
  // Logic: If user.plan exists check if it is free, otherwise assume max
  const userPlan = user?.plan || "free"; 
  const isFree = userPlan.toLowerCase() === "free";

  // === SMART POSITIONING ===
  const updatePosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const screenW = window.innerWidth;
      const menuWidth = 230; // Reduced width slightly

      let calculatedLeft = rect.left;

      // Adjust if going off-screen to the right
      if (rect.left + menuWidth > screenW) {
        calculatedLeft = rect.right - menuWidth;
      }

      // Final safety check
      if (calculatedLeft + menuWidth > screenW - 16) {
        calculatedLeft = screenW - menuWidth - 16;
      }

      setCoords({
        top: rect.bottom + window.scrollY + 6, // Tighter gap
        left: calculatedLeft
      });
    }
  };

  const toggleMenu = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!menuOpen) updatePosition();
    setMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleResize = () => setMenuOpen(false);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!user) return null;

  const handleNavigate = (route) => {
    setMenuOpen(false);
    navigate(route);
  };

  const handleLogout = () => {
    setMenuOpen(false);
    showSplash(1500, () => {
      logout();
      navigate("/");
    }, "Logging out...");
  };

  return (
    <>
      {/* 🧑 TRIGGER AVATAR */}
      <button
        ref={buttonRef}
        onClick={toggleMenu}
        className={`
          relative w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200
          ${menuOpen ? "bg-[#1e1e1e] ring-2 ring-[#333]" : "bg-[#1e1e1e] hover:bg-[#2a2a2a]"}
        `}
      >
        <span className="text-white font-semibold text-xs">
          {user.name?.charAt(0).toUpperCase()}
        </span>
      </button>

      {/* 🛡️ PORTAL MENU */}
      {createPortal(
        <AnimatePresence>
          {menuOpen && (
            <>
              {/* CLICK BACKDROP */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="fixed inset-0 z-[99998] bg-black/10 backdrop-blur-[1px]"
                onClick={() => setMenuOpen(false)}
              />

              {/* MENU DROPDOWN - COMPACT */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -5, transition: { duration: 0.1 } }}
                transition={{ duration: 0.1 }}
                style={{
                  position: "absolute",
                  top: coords.top,
                  left: coords.left,
                  zIndex: 99999,
                }}
                className="
                  w-[230px] rounded-2xl overflow-hidden
                  bg-[#1e1e1e]/95 backdrop-blur-xl
                  border border-[#333]/60
                  shadow-2xl shadow-black/80
                  text-[#E5E5E5] font-sans
                  p-1.5 flex flex-col
                "
                onClick={(e) => e.stopPropagation()}
              >

                {/* === SECTION 1: PROFILE & PLAN === */}
                <div className="px-3 py-2.5 flex items-center gap-3 rounded-xl bg-[#2a2a2a]/40 mb-1">  
                  {/* Avatar */}
                  <div className="w-8 h-8 rounded-full bg-[#2D3342] flex items-center justify-center shrink-0 border border-white/5">
                    <span className="text-[#60A5FA] font-medium text-xs">
                      {user.name?.slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                  
                  {/* User Info & Plan Badge */}
                  <div className="flex flex-col min-w-0 flex-1">
                    <div className="flex justify-between items-center w-full">
                      <span className="text-[13px] font-semibold text-white leading-tight truncate mr-2">
                        {user.name}
                      </span>
                      {/* PLAN STATUS BADGE */}
                      <span className={`
                        text-[9px] font-bold px-1.5 py-[1px] rounded-[4px] tracking-wide uppercase
                        ${isFree 
                          ? "bg-[#333] text-[#888] border border-[#444]" 
                          : "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-indigo-500/20"}
                      `}>
                        {isFree ? "FREE" : "MAX"}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#777] truncate mt-0.5">
                      @{user.email?.split('@')[0]}
                    </span>
                  </div>
                </div>

                {/* Divider */}
                <div className="h-[1px] bg-[#333]/40 mx-2 my-0.5" /> 

                {/* === SECTION 2: MAIN ACTIONS (COMPACT) === */}
                <div className="py-0.5 space-y-[1px]">  
                  <MenuItem label="Dashboard" onClick={() => handleNavigate("/dashboard")} />
                  <MenuItem label="New Features" onClick={() => handleNavigate("/release")} />
                  <MenuItem label="Templates" onClick={() => handleNavigate("/templates")} />
                  <MenuItem label="Settings" onClick={() => handleNavigate("/profile")} />
                  <MenuItem label="Benefits" onClick={() => handleNavigate("/benefits")} />
                </div>

                {/* Divider */}
                <div className="h-[1px] bg-[#333]/40 mx-2 my-0.5" />

                {/* === SECTION 3: FOOTER (COMPACT) === */}
                <div className="py-0.5 space-y-[1px]">
                  <MenuItem label="Help" hasArrow onClick={() => handleNavigate("/about")} />
                  <MenuItem label="Legal" hasArrow onClick={() => handleNavigate("/legal")} />
                  <MenuItem label="Log out" isDanger onClick={handleLogout} />
                </div>

              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};

// === SUB-COMPONENT: COMPACT ITEM ===
const MenuItem = ({ label, onClick, hasArrow, isDanger }) => (
  <button
    onClick={onClick}
    className={`
      w-full flex items-center justify-between px-3 py-1.5 rounded-lg
      text-[13px] font-medium transition-all duration-150 group text-left
      ${isDanger 
        ? "text-red-400 hover:bg-red-500/10 hover:text-red-300" 
        : "text-[#d4d4d4] hover:bg-white/[0.06] hover:text-white"}
    `}
  >
    <span>{label}</span>
    {hasArrow && (
      <ChevronRight size={14} className="text-[#555] group-hover:text-white transition-colors" />
    )}
  </button>
);

export default UserProfileMenu;