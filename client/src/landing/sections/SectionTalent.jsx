import React, { useEffect, useState, useRef } from "react";
import { motion, useAnimation, useInView } from "framer-motion";

// --- Marquee Background (Optimized) ---
const MarqueeRow = ({ direction, speed, isCenter, animControls }) => {
  return (
    <div className="flex overflow-hidden w-full relative select-none pointer-events-none">
      <motion.div
        className="flex whitespace-nowrap gap-16 md:gap-32"
        animate={{
          x: direction === "left" ? [0, -1000] : [-1000, 0],
        }}
        transition={{
          x: { repeat: Infinity, duration: speed, ease: "linear" },
        }}
        style={{ 
            opacity: isCenter ? 1 : 0.03,
            color: isCenter ? "rgba(0,0,0,0.8)" : "rgba(0,0,0,1)", 
            willChange: "transform"
        }}
      >
        {[...Array(8)].map((_, i) => (
          <span 
            key={i} 
            className={`text-[12vh] md:text-[15vh] font-extrabold tracking-tight leading-none font-['Syne'] ${isCenter ? "hero-text" : ""}`}
          >
            TALENT
          </span>
        ))}
      </motion.div>
    </div>
  );
};

export default function SectionTalent() {
  const [showContent, setShowContent] = useState(false);
  const wrapperControls = useAnimation();
  const centerTextControls = useAnimation();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

  useEffect(() => {
    const sequence = async () => {
      await wrapperControls.set({ scale: 3, rotate: -10 });
      if (isInView) {
        wrapperControls.start({ scale: 1, rotate: 0, transition: { duration: 1.4, ease: [0.16, 1, 0.3, 1] } });
        centerTextControls.start({ scale: 0.5, opacity: 0.05, transition: { duration: 1.6, ease: "easeInOut", delay: 0.1 } });
        setTimeout(() => setShowContent(true), 500);
      }
    };
    sequence();
  }, [isInView, wrapperControls, centerTextControls]);

  const fadeWords = (text) => text.split(" ").map((word, i) => (
    <span key={i} className="inline-block opacity-0 animate-wordFade font-['Syne']" style={{ animationDelay: `${i * 30}ms` }}>{word}&nbsp;</span>
  ));

  const rowFadeVariants = { initial: { opacity: 1 }, animate: { opacity: 0.15, transition: { duration: 1.2, delay: 0.8 } } };

  return (
    <section ref={sectionRef} className="sticky top-0 h-screen w-full flex flex-col items-center justify-center bg-[#FAFAFA] text-black z-20 overflow-hidden rounded-t-[40px] md:rounded-t-[60px] shadow-[0_-50px_100px_rgba(0,0,0,0.1)] -mt-10 font-['Syne']">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none hidden md:block">
          <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-purple-200/30 rounded-full blur-[80px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-blue-200/30 rounded-full blur-[80px]" />
      </div>

      {/* Background Kinetic Text */}
      <motion.div className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none z-0 mix-blend-multiply opacity-30 md:opacity-100" initial="initial" animate="animate">
        <motion.div animate={wrapperControls} className="relative w-full h-full flex flex-col justify-center gap-4 md:gap-12" style={{ willChange: "transform" }}>
          <motion.div variants={rowFadeVariants} className="flex flex-col gap-4 md:gap-8 opacity-50">
            <MarqueeRow direction="left" speed={30} />
            <MarqueeRow direction="right" speed={35} />
            
            {/* Center Static Text (Hidden behind overlay usually) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center">
               <motion.h1 
                 animate={centerTextControls} 
                 className="text-[18vw] font-black text-[#1a1a1a] uppercase leading-[0.8] font-['Syne']"
                 style={{ willChange: "transform, opacity" }}
               >
                 TALENT
               </motion.h1>
            </div>
            
            <MarqueeRow direction="right" speed={35} />
            <MarqueeRow direction="left" speed={30} />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* --- COMPACT FOREGROUND CARD --- */}
      {showContent && (
        <div className="relative z-20 w-full h-full flex items-center justify-center p-4">
          
          <div className="
            relative w-full max-w-5xl 
            bg-white/20 backdrop-blur-2xl  
            rounded-[40px] 
            animate-fadeSoft 
            flex flex-col items-center text-center
            p-6 md:p-8
            overflow-hidden
            shadow-2xl shadow-black/10
            border border-white/20
          ">
            
            {/* 1. Header Group */}
            <div className="flex flex-col items-center gap-3 md:gap-4 mb-6 md:mb-8 shrink-0">
                <div className="px-3 py-1 rounded-full bg-black/5 border border-black/10 text-[10px] font-bold tracking-widest uppercase text-black/60 shadow-sm font-['Syne']">
                   For Professionals
                </div>

                <h2 className="text-2xl md:text-5xl font-extrabold leading-tight tracking-tight bg-clip-text bg-gradient-to-br from-black via-neutral-700 to-neutral-500 drop-shadow-sm font-['Syne']">
                   {fadeWords("Talent Powered.")}
                </h2>

                <p className="text-neutral-500 text-xs md:text-base max-w-md leading-relaxed font-bold px-4 font-['Syne']">
                   {fadeWords("Visualize your raw talent. Turn it into an interactive digital identity recruiters can't ignore.")}
                </p>

                <button className="group relative px-6 py-2.5 rounded-full bg-[#111] text-white font-bold text-xs md:text-sm overflow-hidden hover:scale-105 transition-transform duration-300 shadow-lg shadow-black/20 hover:shadow-xl font-['Syne']">
                   <span className="relative z-10 flex items-center gap-2">
                     Explore Talent Tools 
                     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                   </span>
                   <div className="absolute inset-0 bg-gradient-to-r from-neutral-800 to-black opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
            </div>

            {/* 2. Video Slice */}
            <div className="w-full max-w-4xl relative rounded-3xl overflow-hidden shadow-inner border border-black/5 bg-black flex-1 min-h-[180px] md:min-h-[250px]">
               <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-orange-500/20 blur-lg"></div>
               
               <div className="relative h-full w-full bg-black rounded-3xl overflow-hidden group">
                   <img className="absolute w-10 top-4 left-4 z-20 opacity-80 drop-shadow-md" src="/logow.png" alt="logo" />
                   
                   <video
                     autoPlay loop muted playsInline preload="metadata"
                     className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700"
                   >
                     <source src="/dbv.mp4" type="video/mp4" />
                   </video>
                   
                   <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent pointer-events-none"></div>
                   
                   <div className="absolute bottom-5 left-6 text-white text-left z-20">
                      <h3 className="text-lg font-extrabold uppercase tracking-tighter font-['Syne']">Branding</h3>
                      <p className="text-[10px] opacity-70 tracking-widest font-bold font-['Syne']">IDENTITY DESIGN • 2024</p>
                   </div>
               </div>
            </div>

          </div>
        </div>
      )}

      <style>{`
        @keyframes wordFade {
          0% { opacity: 0; transform: translateY(10px); filter: blur(2px); }
          100% { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        .animate-wordFade {
          animation: wordFade 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
        @keyframes fadeSoft {
          0% { opacity: 0; transform: translateY(30px) scale(0.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fadeSoft {
          animation: fadeSoft 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

    </section>
  );
}