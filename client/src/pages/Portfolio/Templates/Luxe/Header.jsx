import React, { useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { usePortfolio } from "../../../../context/PortfolioContext";
import { X, Menu } from "lucide-react"; 
import { useLocation } from "react-router-dom"; 

const Header = ({ portfolioData: propData }) => {
  const { portfolioData: contextData } = usePortfolio();
  const data = propData || contextData || {};
  
  const location = useLocation();
  const isEditor = location.pathname.includes("/customize");

  const fg = data.themeFont || "#111827";
  const bg = data.themeBg || "#ffffff";
  
  const [isOpen, setIsOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  
  // ✅ DYNAMIC NAVIGATION LOGIC
  const defaultNav = {
    home: { label: "Home", visible: true },
    about: { label: "About", visible: true },
    services: { label: "Services", visible: true },
    projects: { label: "Projects", visible: true },
    contact: { label: "Contact", visible: true },
  };

  const navConfig = data.navConfig || defaultNav;

  // Create array of valid, visible links with custom labels
  const navLinks = Object.keys(navConfig)
    .filter(key => navConfig[key].visible) // Only show visible
    .map(key => ({
      id: key,
      label: navConfig[key].label // Use custom label
    }));

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();
    if (isEditor || isOpen) {
        setHidden(false);
        return;
    }
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  return (
    <motion.div
      variants={{ 
        visible: { y: 0 }, 
        hidden: { y: "-100%" } 
      }}
      animate={hidden && !isEditor ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className={`${isEditor ? "absolute" : "fixed"} top-0 left-0 w-full z-[60]`}
    >
      <header 
        className="absolute w-full px-6 py-3.5 md:px-12 flex items-center justify-between backdrop-blur-md transition-all duration-300"
        style={{ backgroundColor: `${bg}F2`, borderColor: `${fg}15` }}
      >
        {/* Logo */}
        <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-lg font-bold tracking-tighter uppercase relative z-[70]"
            style={{ color: fg }}
        >
          {data?.name || "Luxe."}
        </motion.h1>

        {/* Desktop Nav - Dynamic */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((item, i) => (
            <motion.a 
              key={item.id} 
              href={`#${item.id}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-[16px] font-normal tracking-tight antialiased transition-opacity hover:opacity-70"
              style={{ color: fg }}
            >
              {item.label}
            </motion.a>
          ))}
        </nav>

        {/* CTA Button - Only shows if Contact is visible in config */}
        {navConfig.contact?.visible && (
            <motion.a 
            href="#contact"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="hidden md:flex px-6 py-3 rounded-full text-[13px] font-normal tracking-tight antialiased transition-transform hover:scale-105"
            style={{ backgroundColor: fg, color: bg }}
            >
            Let's Talk
            </motion.a>
        )}

        {/* Mobile Toggle */}
        {!isOpen && (
            <button 
                onClick={() => setIsOpen(true)} 
                className="md:hidden p-2 relative z-[70] focus:outline-none"
            >
               <Menu size={24} style={{ color: fg }} />
            </button>
        )}
      </header>

      {/* Mobile Menu Dropdown */}
      <motion.div 
        initial={false}
        animate={isOpen ? "open" : "closed"}
        variants={{
            open: { opacity: 1, y: 0, display: "flex" },
            closed: { opacity: 0, y: "-20%", transitionEnd: { display: "none" } }
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="absolute top-0 left-0 w-full h-screen flex-col items-center justify-center gap-8 z-[80]"
        style={{ backgroundColor: bg }}
      >
         <button 
            onClick={() => setIsOpen(false)}
            className="absolute top-6 right-6 p-2 rounded-full border transition-transform active:scale-95"
            style={{ borderColor: `${fg}20` }}
         >
            <X size={24} style={{ color: fg }} />
         </button>

         {navLinks.map((item) => (
            <a 
              key={item.id} 
              href={`#${item.id}`} 
              onClick={() => setIsOpen(false)}
              className="text-3xl font-light tracking-tight"
              style={{ color: fg }}
            >
              {item.label}
            </a>
          ))}
      </motion.div>
    </motion.div>
  );
};

export default Header;