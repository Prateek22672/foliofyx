import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

// --- Marquee Background (Optimized & Responsive) ---
const MarqueeRow = ({ direction, speed, isCenter }) => {
  return (
    <div className="flex overflow-hidden w-full relative select-none pointer-events-none">
      <motion.div
        className="flex whitespace-nowrap gap-8 md:gap-32 will-change-transform"
        animate={{
          x: direction === "left" ? [0, -1000] : [-1000, 0],
        }}
        transition={{
          x: { repeat: Infinity, duration: speed, ease: "linear" },
        }}
        style={{ 
            opacity: isCenter ? 0.8 : 0.03,
            color: isCenter ? "rgba(0,0,0,0)" : "rgba(0,0,0,1)",
            WebkitTextStroke: isCenter ? "1px rgba(0,0,0,0.2)" : "none", 
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "translateZ(0)"
        }}
      >
        {[...Array(8)].map((_, i) => (
          <span 
            key={i} 
            className={`text-[10vh] md:text-[18vh] font-extrabold tracking-tight leading-none font-['Syne']`}
          >
            TALENT
          </span>
        ))}
      </motion.div>
    </div>
  );
};

export default function SectionTalent() {
  const sectionRef = useRef(null);
  
  // --- SCROLL HOOKS ---
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // --- ANIMATIONS ---
  const bgRotate = useTransform(smoothProgress, [0, 1], [10, -10]);
  const bgScale = useTransform(smoothProgress, [0, 0.5, 1], [1.2, 0.9, 1.2]);

  const cardY = useTransform(smoothProgress, [0.1, 0.5], [100, 0]);
  const cardOpacity = useTransform(smoothProgress, [0.1, 0.4], [0, 1]);
  const cardScale = useTransform(smoothProgress, [0.1, 0.5], [0.8, 1]);

  const fadeWords = (text) => text.split(" ").map((word, i) => (
    <motion.span 
        key={i} 
        initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: i * 0.05 }}
        className="inline-block font-['Syne']"
    >
        {word}&nbsp;
    </motion.span>
  ));

  return (
    <section 
      ref={sectionRef} 
      className="sticky top-0 h-screen w-full flex flex-col items-center justify-center bg-[#FAFAFA] text-black z-20 overflow-hidden rounded-t-[40px] md:rounded-t-[60px] shadow-[0_-50px_100px_rgba(0,0,0,0.1)] -mt-10 font-['Syne'] will-change-transform"
    >
      
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none" style={{ transform: "translateZ(0)" }}>
          <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-purple-300/20 rounded-full blur-[60px] md:blur-[100px] will-change-transform" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-blue-300/20 rounded-full blur-[60px] md:blur-[100px] will-change-transform" />
      </div>

      {/* Background Kinetic Text */}
      <motion.div 
        className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none z-0" 
        style={{ 
            rotate: bgRotate, 
            scale: bgScale,
            transformOrigin: "center center",
            willChange: "transform"
        }}
      >
          <div className="flex flex-col gap-2 md:gap-8 opacity-50">
            <MarqueeRow direction="left" speed={25} />
            <MarqueeRow direction="right" speed={30} isCenter />
            <MarqueeRow direction="left" speed={25} />
          </div>
      </motion.div>

      {/* --- FOREGROUND CONTENT --- */}
      <motion.div 
        style={{ y: cardY, opacity: cardOpacity, scale: cardScale }}
        className="relative z-20 w-full h-full flex items-center justify-center p-4 md:p-8"
      >
          
          <div className="
            relative w-full max-w-[90%] md:max-w-5xl 
            flex flex-col items-center text-center
            transform-gpu
          ">
            
            {/* 1. Header Group */}
            <div className="flex flex-col items-center gap-3 md:gap-5 mb-6 md:mb-10 shrink-0">
                <div className="px-4 py-1.5 rounded-full bg-black/5 border border-black/10 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase text-black/70 shadow-sm font-['Syne'] backdrop-blur-md">
                   For Professionals
                </div>

                <h2 className="text-3xl sm:text-4xl md:text-6xl font-extrabold leading-[1.1] tracking-tight bg-clip-text bg-gradient-to-br from-black via-neutral-800 to-neutral-500 drop-shadow-sm font-['Syne'] max-w-2xl">
                   {fadeWords("Talent Powered.")}
                </h2>

                <p className="text-neutral-600 text-xs sm:text-sm md:text-lg max-w-xs md:max-w-lg leading-relaxed font-bold px-2 font-['Syne']">
                   Visualize your raw talent. Turn it into an interactive digital identity recruiters can't ignore.
                </p>

                <motion.button 
                   whileHover={{ scale: 1.05 }}
                   whileTap={{ scale: 0.95 }}
                   className="group relative px-6 md:px-8 py-3 rounded-full bg-[#111] text-white font-bold text-xs md:text-sm overflow-hidden shadow-lg shadow-black/20 font-['Syne'] mt-2"
                >
                   <span className="relative z-10 flex items-center gap-2">
                     Explore Talent Tools 
                     <svg className="w-3 h-3 md:w-4 md:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                   </span>
                   <div className="absolute inset-0 bg-gradient-to-r from-neutral-800 to-black opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.button>
            </div>

            {/* 2. Video Slice (Height Adjusted) */}
            <motion.div 
               whileHover={{ scale: 1.02 }}
               transition={{ type: "spring", stiffness: 300, damping: 20 }}
               // UPDATED CLASSNAME:
               // - aspect-video: Keeps mobile 16:9
               // - md:aspect-auto: Removes aspect ratio on desktop so height can take over
               // - md:h-[60vh]: Sets desktop height to 60vh
               className="w-full max-w-5xl relative rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl shadow-black/20 border border-white/20 bg-black aspect-video md:aspect-auto md:h-[40vh] transform-gpu"
            >
               {/* Static background for performance */}
               <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-orange-500/20 blur-lg pointer-events-none"></div>
               
               <div className="relative h-full w-full bg-black rounded-2xl md:rounded-3xl overflow-hidden group">
                   <img className="absolute w-8 md:w-12 top-3 left-4 md:top-5 md:left-6 z-20 opacity-80 drop-shadow-md" src="/logow.png" alt="logo" />
                   
                   <video
                     autoPlay loop muted playsInline preload="metadata"
                     className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-700 will-change-opacity"
                   >
                     <source src="/dbv.mp4" type="video/mp4" />
                   </video>
                   
                   {/* Gradient Overlay for Text Readability */}
                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>
                   
                   <div className="absolute bottom-4 left-4 md:bottom-6 md:left-8 text-white text-left z-20">
                      <h3 className="text-sm md:text-xl font-extrabold uppercase tracking-tighter font-['Syne']">Branding</h3>
                      <p className="text-[9px] md:text-[11px] opacity-70 tracking-widest font-bold font-['Syne']">IDENTITY DESIGN • 2024</p>
                   </div>
               </div>
            </motion.div>

          </div>
      </motion.div>

    </section>
  );
}