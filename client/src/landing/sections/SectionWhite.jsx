import React from "react";
import { motion } from "framer-motion";

// --- Custom Cursor ---
const Cursor = () => {
  const [position, setPosition] = React.useState({ x: 0, y: 0 });

  React.useEffect(() => {
    const updatePosition = (e) => setPosition({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", updatePosition);
    return () => window.removeEventListener("mousemove", updatePosition);
  }, []);

  return (
    <div
      className="fixed w-4 h-4 bg-black rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
      style={{ left: position.x, top: position.y }}
    />
  );
};

export default function SectionWhite({ message, handleNavigation }) {
  
  const contentVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } 
    }
  };

  // --- CONFIGURATION ---
  // MATCH THIS WITH LANDING.JSX (See step 2 below)
  // We start this section at scroll index 9.5
  const SECTION_START_INDEX = 9.5; 

  return (
    <>
      <Cursor />

      <section
        id="section-white"
        className="
          fixed inset-0 
          flex flex-col items-center justify-start 
          text-black bg-[#f5f5f5] 
          z-[4] 
          rounded-t-[40px] md:rounded-t-[60px]
          overflow-hidden
        "
        style={{
          height: "100vh",
          // Only show this section once we are near its start point to prevent glitches
          opacity: `calc(var(--scroll) > 7.5 ? 1 : 0)`, 
          pointerEvents: `calc(var(--scroll) > 7.5 ? 'auto' : 'none')` 
        }}
      >
        {/* CONTAINER */}
        <div className="relative w-full h-full flex flex-col pt-10 max-w-[100vw] mx-auto">
          
          {/* ================= HEADER ================= */}
          <div className="px-6 md:px-16 flex flex-col md:flex-row justify-between items-end max-w-[1400px] mx-auto w-full z-10 shrink-0">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              variants={contentVariants}
            >
              <h2 className="text-[3.5rem] md:text-[5.5rem] leading-[0.9] font-medium tracking-tight">
                What About
              </h2>
              <div className="mt-2 pb-10 md:mt-4 relative h-[60px] w-[200px]">
                <img 
                  className="h-[50px] sm:h-[75px] absolute top-0 left-0 object-contain" 
                  src="/fyx3.png" 
                  alt="FolioFyX" 
                />
              </div>
            </motion.div>

            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
              onClick={() => handleNavigation("/create")}
              className="
                hidden md:block bg-black text-white 
                px-8 py-3 rounded-full text-sm font-medium
                hover:scale-105 transition-transform shadow-lg mb-4
              "
            >
              Start Project →
            </motion.button>
          </div>

          {/* ================= CARD TRACK ================= */}
          <div className="flex-1 flex items-center w-full relative">
            <div
              className="flex gap-6 md:gap-10 pl-[5vw] items-center h-full"
              style={{
                // LOGIC: 
                // 1. (SECTION_START_INDEX - var(--scroll)) becomes negative as we scroll down.
                // 2. We multiply by 100vw. This means for every 1 unit of vertical scroll (100vh),
                //    the content moves 1 unit of width (100vw). This is a 1:1 smooth ratio.
                transform: `translateX(calc(min(0px, (${SECTION_START_INDEX} - var(--scroll, 0)) * 100vw)))`,
                willChange: "transform",
              }}
            >

              {/* CARD 1: No-Code */}
              <motion.div
                className="relative min-w-[85vw] sm:min-w-[600px] aspect-[16/10] rounded-[40px] overflow-hidden cursor-pointer group shadow-2xl bg-[#0a0a0a] p-8 md:p-12 shrink-0"
                whileHover={{ scale: 1.02 }}
                onClick={() => handleNavigation("/create")}
                transition={{ type: "spring", stiffness: 120, damping: 20 }}
              >
                <div className="relative z-20 flex flex-col justify-between h-full">
                  <div>
                    <span className="inline-block px-4 py-1.5 rounded-full border border-white/20 text-white/60 text-[10px] md:text-xs tracking-widest uppercase mb-6 bg-white/5 backdrop-blur-sm">
                      Powered by AI
                    </span>
                    <h3 className="text-white text-3xl md:text-5xl font-semibold mb-4 leading-tight tracking-tight">
                      No-Code,<br /> Full Creativity
                    </h3>
                    <p className="text-white/60 text-base md:text-lg font-light leading-relaxed max-w-sm">
                      Simplified by AI. Showcase your work on a world-class portfolio.
                    </p>
                  </div>
                  <div className="mt-6 md:mt-0">
                    <div className="flex flex-wrap items-center gap-3 text-white/40 text-xs md:text-sm mb-6 uppercase tracking-wider font-medium">
                        <span>no code</span>
                        <span className="text-purple-500">•</span>
                        <span>no limits</span>
                        <span className="text-purple-500">•</span>
                        <span>no watermark</span>
                    </div>
                    <div className="group-hover:translate-x-2 transition-transform duration-300 flex items-center gap-2 text-white font-medium text-xl md:text-2xl">
                        Start your journey <span className="text-purple-400">→</span>
                    </div>
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-purple-600/20 blur-[80px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-blue-600/10 blur-[80px] pointer-events-none" />
              </motion.div>


              {/* CARD 2: Fast & Seamless */}
              <motion.div
                className="relative min-w-[85vw] sm:min-w-[600px] aspect-[16/10] rounded-[40px] overflow-hidden cursor-pointer group shadow-2xl bg-black shrink-0"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 120, damping: 20 }}
              >
                <motion.img
                  src="/image1.png"
                  className="w-full h-full object-cover opacity-80"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.8 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                <div className="absolute bottom-8 left-8 right-8 z-20">
                  <h3 className="text-white text-3xl md:text-4xl font-semibold mb-3">
                    Fast & Seamless Portfolios
                  </h3>
                  <p className="text-white/80 text-lg md:text-xl font-light leading-relaxed max-w-md">
                    Your portfolio loads instantly, ensuring your work gets the attention it deserves.
                  </p>
                </div>
              </motion.div>


              {/* CARD 3: Accessible */}
              <motion.div
                className="relative min-w-[85vw] sm:min-w-[600px] aspect-[16/10] rounded-[40px] overflow-hidden cursor-pointer group shadow-2xl bg-black shrink-0"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 120, damping: 20 }}
              >
                <motion.img
                src="/themes/image_landing.jpg"
                  
                  className="w-full h-full object-cover opacity-80"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.8 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                <div className="absolute bottom-8 left-8 right-8 z-20">
                  <h3 className="text-white text-3xl md:text-4xl font-semibold mb-3">
                    Accessible on Every Device
                  </h3>
                  <p className="text-white/80 text-lg md:text-xl font-light leading-relaxed max-w-md">
                    Looks stunning across phones, tablets, and desktops.
                  </p>
                </div>
              </motion.div>


              {/* CARD 4: Free Deployment */}
              <motion.div
                className="relative min-w-[85vw] sm:min-w-[600px] aspect-[16/10] rounded-[40px] overflow-hidden cursor-pointer group shadow-2xl bg-black shrink-0"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 120, damping: 20 }}
              >
                <motion.img
                  src="/image.png"
                  className="w-full h-full object-cover opacity-80"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.8 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                <div className="absolute bottom-8 left-8 right-8 z-20">
                  <h3 className="text-white text-3xl md:text-4xl font-semibold mb-3">
                    Free & Hassle-Free Deployment
                  </h3>
                  <p className="text-white/80 text-lg md:text-xl font-light leading-relaxed max-w-md">
                    Deploy your portfolio in seconds — no setup needed.
                  </p>
                </div>
              </motion.div>


              {/* FINAL CTA - Ensuring it is visible */}
              <div className="relative min-w-[30vw] h-full flex flex-col justify-center pl-8 md:pl-12 shrink-0">
                 <button 
                   onClick={() => handleNavigation("/create")}
                   className="
                     text-4xl md:text-6xl font-medium text-neutral-400 
                     hover:text-black transition-colors duration-300
                     flex items-center gap-4 group whitespace-nowrap
                   "
                 >
                   Start Your <br/> Journey 
                   <span className="transform group-hover:translate-x-4 transition-transform duration-300">→</span>
                 </button>
              </div>

              {/* Spacer to ensure last element clears the screen edge */}
              <div className="min-w-[10vw] shrink-0"></div>

            </div>
          </div>
        </div>

        {/* Top Message */}
        {message && (
          <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md px-6 py-2 rounded-full text-xs font-medium shadow-sm animate-fade-in z-50">
            {message}
          </div>
        )}
      </section>
    </>
  );
}