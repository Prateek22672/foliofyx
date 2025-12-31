import React from "react";
import { motion, useMotionValue, useMotionTemplate } from "framer-motion";
import { ChevronDown } from "lucide-react";

const StudioHeroSection = ({ navigate }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = ({ currentTarget, clientX, clientY }) => {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  };

  // We combine two gradients using a comma.
  // 1. The first one follows the mouse.
  // 2. The second one is fixed at the "center".
  const maskImage = useMotionTemplate`
    radial-gradient(350px circle at ${mouseX}px ${mouseY}px, black, transparent),
    radial-gradient(500px circle at center, black, transparent)
  `;
  
  const style = { maskImage, WebkitMaskImage: maskImage };

  return (
    <div
      className="sticky top-0 w-full h-screen bg-neutral-950 flex flex-col items-center justify-center overflow-hidden group"
      onMouseMove={handleMouseMove}
      style={{
        opacity: "calc(max(0, 1 - (var(--scroll) * 1.5)))",
        transform: "scale(calc(max(0.9, 1 - (var(--scroll) * 0.2))))",
        willChange: "opacity, transform",
      }}
    >
      {/* Background Grid (Darker Base) */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.2]"
        style={{
          backgroundImage: "radial-gradient(#333 1px, transparent 1px)",
          backgroundSize: "32px 32px"
        }}
      />

      {/* Spotlight Effect (Mouse + Center) */}
      <motion.div
        className="absolute inset-0 z-0 pointer-events-none"
        style={style}
      >
        {/* The revealed brighter grid */}
        <div 
          className="absolute inset-0"
          style={{
             backgroundImage: "radial-gradient(#fff 1px, transparent 1px)",
             backgroundSize: "32px 32px"
          }}
        />
        {/* The revealed gradient color */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-50" />
      </motion.div>

      {/* --- Main Content (Centered) --- */}
      <div className="z-10 flex flex-col items-center gap-6 px-6 text-center w-full max-w-4xl mx-auto">
        
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <img 
            src="/FYX/WhiteClearBG.svg" 
            alt="Studio Logo"
            className="relative w-[280px] md:w-[500px] h-auto object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]"
          />
        </motion.div>

        {/* Tagline */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="absolute bottom-30 text-neutral-400 text-sm md:text-lg tracking-[0.3em] uppercase"
        >
          Engineering Identity
        </motion.p>

      </div>

      {/* --- Scroll Down Indicator --- */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ delay: 1.2, duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 cursor-pointer"
        onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })}
      >
        <span className="text-neutral-500 text-[10px] uppercase tracking-widest">
            Scroll to Explore
        </span>
        <ChevronDown className="text-neutral-500" size={24} />
      </motion.div>

    </div>
  );
};

export default StudioHeroSection;