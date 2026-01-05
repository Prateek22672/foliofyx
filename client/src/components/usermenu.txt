import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSplash } from "../context/SplashContext";
import { 
  LayoutDashboard, 
  LayoutTemplate, 
  Users, 
  Briefcase, 
  Sparkles, 
  Info, 
  LogOut,
  ChevronRight,
  Zap,
  Crown,
  Settings
} from "lucide-react";

const UserProfileMenu = () => {
  const { user, logout } = useAuth();
  const { showSplash } = useSplash();
  const [menuOpen, setMenuOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const [alignment, setAlignment] = useState("left");
  const navigate = useNavigate();
  const buttonRef = useRef(null);

  // === 1. PLAN CONFIGURATION ===
  const userPlan = user?.plan || "free"; 

  const planStyles = {
    free: {
      badge: "bg-white/5 text-neutral-400 border-white/10 ring-0",
      icon: null
    },
    plus: {
      badge: "bg-blue-500/15 text-blue-300 border-blue-500/20 shadow-[0_0_12px_rgba(59,130,246,0.3)]",
      icon: <Zap size={10} className="fill-blue-400 text-blue-400" />
    },
    max: {
      badge: "bg-amber-500/15 text-amber-300 border-amber-500/20 shadow-[0_0_12px_rgba(245,158,11,0.3)]",
      icon: <Crown size={10} className="fill-amber-400 text-amber-400" />
    }
  };

  const currentStyle = planStyles[userPlan] || planStyles.free;

  // === SMART POSITIONING LOGIC ===
  const updatePosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const screenW = window.innerWidth;
      const menuWidth = 290; // Slightly wider for premium feel

      const isLeftSide = rect.left < screenW / 2;
      
      let calculatedLeft = rect.left;
      let align = "left";

      if (isLeftSide) {
         align = "left";
         calculatedLeft = rect.left;
         if (calculatedLeft < 10) calculatedLeft = 10;
      } else {
         align = "right";
         calculatedLeft = rect.right - menuWidth + rect.width; 
      }

      setCoords({
        top: rect.bottom + window.scrollY + 16, 
        left: calculatedLeft
      });
      setAlignment(align);
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
    window.addEventListener("scroll", handleResize, true);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleResize, true);
    };
  }, []);

  if (!user) return null;

  const handleNavigate = (route, message) => {
    setMenuOpen(false);
    showSplash(1200, () => navigate(route), message);
  };

  const handleLogout = () => {
    setMenuOpen(false);
    showSplash(2000, () => {
      logout();
      navigate("/");
    }, "Signing out...");
  };

  return (
    <>
      {/* 🧑 TRIGGER BUTTON */}
      <motion.button
        ref={buttonRef}
        whileTap={{ scale: 0.95 }}
        onClick={toggleMenu}
        className={`
          relative z-40 flex items-center justify-center rounded-full transition-all duration-300
          w-10 h-10 
          bg-[#0a0a0a] 
          border border-white/10
          hover:bg-black hover:border-white/20 hover:shadow-[0_0_15px_rgba(255,255,255,0.15)]
          ${menuOpen ? `ring-2 ring-white/20 border-transparent bg-black` : ""}
        `}
      >
        <span className="text-white font-medium text-sm" style={{ fontFamily: 'Switzer, sans-serif' }}>
          {user.name?.charAt(0).toUpperCase()}
        </span>
        {/* Status Dot */}
        <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 border-2 border-black rounded-full ${userPlan === 'free' ? 'bg-emerald-500' : userPlan === 'plus' ? 'bg-blue-500' : 'bg-amber-400'}`}></span>
      </motion.button>

      {/* 🛡️ PORTAL MENU */}
      {createPortal(
        <AnimatePresence>
          {menuOpen && (
            <>
              {/* Invisible Backdrop */}
              <div 
                className="fixed inset-0 z-[99998] cursor-default bg-transparent" 
                onClick={() => setMenuOpen(false)} 
              />

              {/* MENU DROPDOWN */}
              <motion.div
                key="premium-menu"
                initial={{ opacity: 0, scale: 0.92, y: -8, filter: "blur(4px)" }}
                animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.95, y: -8, filter: "blur(4px)", transition: { duration: 0.15 } }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                style={{
                  position: "absolute",
                  top: coords.top,
                  left: coords.left,
                  zIndex: 99999,
                  transformOrigin: alignment === "left" ? "top left" : "top right",
                  fontFamily: 'Switzer, sans-serif' // ✅ Forces Switzer
                }}
                className="
                  w-[290px] rounded-3xl overflow-hidden
                  bg-[#121212]/85 backdrop-blur-2xl
                  border border-white/10
                  shadow-[0_40px_80px_-15px_rgba(0,0,0,0.8)]
                  ring-1 ring-white/5
                "
                onClick={(e) => e.stopPropagation()}
              >
                {/* Glossy Top Edge Highlight */}
                <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50" />

                {/* === HEADER SECTION === */}
                <div className="relative p-6 border-b border-white/5 overflow-hidden group">
                   {/* Subtle Gradient Glow Background */}
                   <div className="absolute top-0 right-0 w-[80%] h-[100%] bg-gradient-to-b from-white/[0.03] to-transparent blur-xl rounded-full translate-x-10 -translate-y-10 pointer-events-none"></div>

                   <div className="relative z-10 flex items-center gap-4">
                      {/* Avatar */}
                      <div className={`w-12 h-12 shrink-0 rounded-2xl shadow-inner bg-gradient-to-br from-[#2a2a2a] to-[#0a0a0a] border border-white/10 flex items-center justify-center`}>
                         <span className="text-white font-semibold text-lg">
                           {user.name?.charAt(0).toUpperCase()}
                         </span>
                      </div>
                      
                      {/* Text Info */}
                      <div className="flex flex-col min-w-0">
                         <span className="text-white font-medium text-[15px] truncate tracking-wide">
                           {user.name}
                         </span>
                         
                         {/* Plan Badge */}
                         <div className={`mt-1.5 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${currentStyle.badge}`}>
                             {currentStyle.icon}
                             {userPlan} Plan
                         </div>
                      </div>
                   </div>
                </div>

                {/* === NAVIGATION LINKS === */}
                <div className="p-2 flex flex-col gap-1">
                   <MenuItem 
                     icon={<LayoutDashboard size={16} />} 
                     label="Dashboard" 
                     onClick={() => handleNavigate("/dashboard", "Opening Dashboard...")} 
                   />
                   <MenuItem 
                     icon={<LayoutTemplate size={16} />} 
                     label="Templates" 
                     onClick={() => handleNavigate("/Templates", "Loading Templates...")} 
                   />
                   <MenuItem 
                     icon={<Users size={16} />} 
                     label="Find Talent" 
                     onClick={() => handleNavigate("/talent", "Exploring Talent...")} 
                   />
                   <MenuItem 
                     icon={<Briefcase size={16} />} 
                     label="Pricing" 
                     onClick={() => handleNavigate("/pricing", "Viewing pricing...")} 
                   />
                   
                   <div className="my-2 h-[1px] bg-white/5 mx-3" />
                   
                   <MenuItem 
                     icon={<Sparkles size={16} />} 
                     label="New Features" 
                     highlight
                     onClick={() => handleNavigate("/release", "Checking Updates...")} 
                   />
                   <MenuItem 
                     icon={<Settings size={16} />} 
                     label="Account Settings" 
                     onClick={() => handleNavigate("/profile", "Opening Settings...")} 
                   />
                   <MenuItem 
                     icon={<Info size={16} />} 
                     label="About FolioFYX" 
                     onClick={() => handleNavigate("/about", "Going to About...")} 
                   />
                </div>

                {/* === FOOTER === */}
                <div className="p-2 border-t border-white/5 bg-white/[0.02]">
                   <button 
                     onClick={handleLogout} 
                     className="
                       w-full flex items-center justify-between px-4 py-3 rounded-2xl
                       text-[13px] font-medium text-neutral-400 
                       hover:text-red-300 hover:bg-red-500/10 
                       transition-all duration-200 group
                     "
                   >
                     <span className="flex items-center gap-3">
                       <LogOut size={16} className="group-hover:-translate-x-0.5 transition-transform" /> 
                       Sign Out
                     </span>
                   </button>
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

// === SUB-COMPONENT: MENU ITEM ===
const MenuItem = ({ icon, label, onClick, highlight }) => (
  <button 
    onClick={onClick} 
    className={`
      group w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl 
      text-[13px] font-medium tracking-wide transition-all duration-300
      relative overflow-hidden
      ${highlight 
        ? "text-white bg-white/5 border border-white/5 hover:bg-white/10" 
        : "text-neutral-400 hover:text-white hover:bg-white/[0.06]"
      }
    `}
  >
    <div className="flex items-center gap-3 relative z-10">
      <span className={`transition-colors duration-200 ${highlight ? "text-purple-300" : "text-neutral-500 group-hover:text-white"}`}>
        {icon}
      </span>
      {label}
    </div>
    
    <ChevronRight 
      size={14} 
      className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-neutral-500 group-hover:text-white" 
    />
  </button>
);

export default UserProfileMenu;