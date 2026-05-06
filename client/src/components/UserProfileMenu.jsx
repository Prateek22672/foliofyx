import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSplash } from "../context/SplashContext";
import { ChevronRight } from "lucide-react";

const UserProfileMenu = ({ hasScrolled }) => {
  const { user, logout } = useAuth();
  const { showSplash } = useSplash();
  const [menuOpen, setMenuOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const navigate = useNavigate();
  const buttonRef = useRef(null);

  const userPlan = user?.plan || "free";
  const isFree = userPlan.toLowerCase() === "free";

  const updatePosition = () => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const screenW = window.innerWidth;
    const menuWidth = 220;

    let left = rect.left;
    if (left + menuWidth > screenW - 12) {
      left = rect.right - menuWidth;
    }
    if (left < 12) left = 12;

    setCoords({
      top: rect.bottom + window.scrollY + 8,
      left,
    });
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

  const initials = user.name?.slice(0, 2).toUpperCase() || "??";

  return (
    <>
      {/* Trigger Avatar */}
      <button
        ref={buttonRef}
        onClick={toggleMenu}
        aria-label="Open profile menu"
        style={{ fontFamily: "'Switzer', sans-serif" }}
        className={`
          relative w-9 h-9 rounded-full flex items-center justify-center
          transition-all duration-200 select-none
          ${hasScrolled
            ? menuOpen
              ? "bg-black ring-2 ring-black/10"
              : "bg-black hover:bg-neutral-800"
            : menuOpen
              ? "bg-white/15 ring-2 ring-white/20"
              : "bg-white/10 hover:bg-white/15"
          }
        `}
      >
        <span className="text-white text-[11px] tracking-wide">{initials}</span>
      </button>

      {/* Portal Menu */}
      {createPortal(
        <AnimatePresence>
          {menuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.12 }}
                className="fixed inset-0 z-[99998]"
                onClick={() => setMenuOpen(false)}
              />

              {/* Dropdown */}
              <motion.div
                initial={{ opacity: 0, scale: 0.97, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97, y: -4, transition: { duration: 0.1 } }}
                transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  position: "absolute",
                  top: coords.top,
                  left: coords.left,
                  zIndex: 99999,
                  fontFamily: "'Switzer', sans-serif",
                }}
                className="
                  w-[220px] rounded-2xl overflow-hidden
                  bg-[#0a0a0a] border border-white/[0.08]
                  shadow-[0_24px_48px_rgba(0,0,0,0.6)]
                  text-white p-1.5 flex flex-col
                "
                onClick={(e) => e.stopPropagation()}
              >
                {/* Profile Header */}
                <div className="px-3 py-3 flex items-center gap-2.5 mb-1">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/[0.06]">
                    <span className="text-white/80 text-[10px] tracking-wide">{initials}</span>
                  </div>

                  <div className="flex flex-col min-w-0 flex-1">
                    <div className="flex justify-between items-center gap-1">
                      <span className="text-[13px] text-white truncate leading-tight">
                        {user.name}
                      </span>
                      <span className={`
                        text-[9px] px-1.5 py-[2px] rounded-[4px] tracking-widest uppercase shrink-0
                        ${isFree
                          ? "bg-white/[0.06] text-white/40 border border-white/[0.08]"
                          : "bg-white/[0.12] text-white/80 border border-white/[0.12]"
                        }
                      `}>
                        {isFree ? "free" : "max"}
                      </span>
                    </div>
                    <span className="text-[11px] text-white/35 truncate mt-0.5">
                      @{user.email?.split("@")[0]}
                    </span>
                  </div>
                </div>

                {/* Divider */}
                <div className="h-[0.5px] bg-white/[0.06] mx-2 mb-1" />

                {/* Main Nav */}
                <div className="space-y-[1px] py-0.5">
                  <MenuItem label="Settings" onClick={() => handleNavigate("/profile")} />
                  <MenuItem label="Benefits" onClick={() => handleNavigate("/benefits")} />
                </div>

                {/* Divider */}
                <div className="h-[0.5px] bg-white/[0.06] mx-2 my-1" />

                {/* Footer */}
                <div className="space-y-[1px] py-0.5">
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

const MenuItem = ({ label, onClick, hasArrow, isDanger }) => (
  <button
    onClick={onClick}
    style={{ fontFamily: "'Switzer', sans-serif" }}
    className={`
      w-full flex items-center justify-between px-3 py-[7px] rounded-xl
      text-[13px] transition-all duration-150 group text-left
      ${isDanger
        ? "text-red-400/80 hover:bg-red-500/10 hover:text-red-400"
        : "text-white/60 hover:bg-white/[0.05] hover:text-white"
      }
    `}
  >
    <span>{label}</span>
    {hasArrow && (
      <ChevronRight size={13} className="text-white/20 group-hover:text-white/50 transition-colors" />
    )}
  </button>
);

export default UserProfileMenu;