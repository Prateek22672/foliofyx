import React, { useRef, useLayoutEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";

// --- CUSTOM CURSOR ---
const Cursor = () => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const rafRef = useRef();

  React.useEffect(() => {
    const move = (e) => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        setPos({ x: e.clientX, y: e.clientY });
      });
    };
    window.addEventListener("mousemove", move);
    return () => {
      window.removeEventListener("mousemove", move);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      className="fixed w-4 h-4 bg-black rounded-full pointer-events-none z-[9999]
      -translate-x-1/2 -translate-y-1/2 mix-blend-difference hidden md:block transition-transform duration-75 ease-out"
      style={{ left: pos.x, top: pos.y, willChange: "transform" }}
    />
  );
};

const CARDS = [
  { id: 1, title: "The 6-Second Rule", desc: "Recruiters spend an average of 6 seconds on a resume.", bg: "bg-[#111]", text: "text-white", img: "/image.png", tag: "Problem" },
  { id: 2, title: "Show, Don't Just Tell", desc: "Interactive case studies and live demos build trust instantly.", bg: "bg-[#111]", text: "text-white", img: "/image2.jpg", tag: "Solution" },
  { id: 3, title: "Zero-Code Magic", desc: "We handle the code, hosting, and design.", bg: "bg-[#111]", text: "text-white", img: "/image1.png", tag: "Speed" },
  { id: 4, title: "Always Responsive", desc: "Your work looks perfect on every device.", bg: "bg-[#111]", text: "text-white", img: "/themes/image_landing.jpg", tag: "Quality" },
];

export default function SectionWhite({ handleNavigation, scrollProgress }) {
  const trackRef = useRef(null);
  const [maxX, setMaxX] = useState(0);

  const updateMaxX = useCallback(() => {
    if (!trackRef.current) return;
    const total = trackRef.current.scrollWidth;
    const vw = window.innerWidth;
    setMaxX(total - vw);
  }, []);

  useLayoutEffect(() => {
    updateMaxX();
    window.addEventListener("resize", updateMaxX);
    return () => window.removeEventListener("resize", updateMaxX);
  }, [updateMaxX]);

  /**
   * SCROLL LOGIC:
   * Starts at 1.5. 
   * Divisor is 4.
   * Ends at 1.5 + 4 = 5.5.
   */
  const rawProgress = Math.max(0, (scrollProgress - 1.5) / 4);
  const progress = Math.min(rawProgress, 1);

  const x = -(maxX * progress);

  return (
    <>
      <Cursor />
      <section className="relative h-screen bg-white text-black rounded-t-[40px] md:rounded-t-[60px] shadow-[0_-50px_100px_rgba(0,0,0,0.1)] overflow-hidden font-['Switzer']">
        <div className="h-screen flex flex-col justify-center">

          {/* HEADER */}
          <div className="px-6 md:px-16 mb-6 md:mb-8 shrink-0 ">
            <motion.span 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.2 }}
              className="inline-block px-4 py-1 absolute right-7 top-10 rounded-full border border-black/10 bg-black/5 text-[10px] md:text-xs font-bold uppercase mb-4"
            >
              Why FolioFyX?
            </motion.span>

            <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-4xl pt-7 sm:text-5xl md:text-8xl font-medium tracking-tighter leading-[0.9]"
              >
                Stand Out <br />
                <span className="text-gray-400">From The Crowd.</span>
              </motion.h2>

              <div className="hidden md:block text-right">
                <p className="text-gray-500 mb-2 font-medium">Scroll to explore</p>
                <div className="w-40 h-1 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    style={{ scaleX: progress }}
                    className="h-full bg-black origin-left transition-transform duration-100 ease-out"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* HORIZONTAL TRACK - Reduced container height slightly */}
          <div className="pl-6 md:pl-16 pt-2 overflow-hidden h-[60vh] flex items-center">
            <motion.div
              ref={trackRef}
              style={{ 
                transform: `translate3d(${x}px, 0, 0)`, 
                willChange: "transform",
                backfaceVisibility: "hidden"
              }}
              className="flex gap-4 md:gap-5 w-max"
            >
              {/* INTRO CARD (Dimensions Reduced) */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                // UPDATED SIZE: w-[80vw] / md:w-[290px] | h-[50vh] / md:h-[55vh]
                className="w-[80vw] sm:w-[280px] md:w-[290px] h-[50vh] md:h-[55vh] bg-[#111] text-white rounded-[30px] md:rounded-[40px] p-6 md:p-8 shrink-0 flex flex-col justify-center shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <h3 className="text-2xl md:text-3xl font-medium mb-6 leading-tight">The Old Way.</h3>
                <p className="text-sm md:text-base text-gray-300 leading-relaxed font-light">
                  Sending a static PDF resume.<br />
                  Hoping someone reads it.<br />
                  Getting lost in the pile.
                </p>
              </motion.div>

              {/* DYNAMIC CARDS (Dimensions Reduced) */}
              {CARDS.map((card) => (
                <motion.div
                  key={card.id}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  // UPDATED SIZE
                  className={`w-[80vw] sm:w-[280px] md:w-[290px] h-[50vh] md:h-[55vh] ${card.bg} ${card.text}
                  rounded-[30px] md:rounded-[40px] shrink-0 relative overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300`}
                >
                  <img
                    src={card.img}
                    alt={card.title}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent z-0 pointer-events-none" />

                  <div className="relative z-10 p-6 md:p-8 flex flex-col justify-between h-full">
                    <span className="text-[10px] md:text-xs uppercase opacity-90 font-bold tracking-wider border border-white/20 w-fit px-3 py-1 rounded-full backdrop-blur-sm bg-white/10">
                      {card.tag}
                    </span>
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold mb-2 leading-tight drop-shadow-md">
                        {card.title}
                      </h3>
                      <p className="text-xs md:text-sm opacity-90 leading-relaxed text-gray-200 drop-shadow-sm font-medium">
                        {card.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* CTA CARD (Dimensions Reduced) */}
              <motion.div
                onClick={() => handleNavigation("/create")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                // UPDATED SIZE
                className="w-[80vw] sm:w-[280px] md:w-[290px] h-[50vh] md:h-[55vh] bg-[#0d0d82] text-white
                rounded-[30px] md:rounded-[40px] shrink-0 flex flex-col items-center justify-center text-center cursor-pointer
                hover:bg-[#0a0a65] transition-all duration-300 shadow-lg hover:shadow-2xl"
              >
                <h3 className="text-3xl md:text-5xl font-bold mb-4">Ready?</h3>
                <p className="text-white/70 mb-6 max-w-[200px] md:max-w-xs text-xs md:text-sm font-medium">
                  Join thousands of professionals who switched to FolioFyX.
                </p>
                <button className="bg-white text-[#0d0d82] px-6 py-3 md:px-8 md:py-3 rounded-full font-bold text-xs md:text-sm hover:scale-105 transition-transform duration-200 shadow-md">
                  Build My Portfolio
                </button>
              </motion.div>
              <div className="w-[5vw] shrink-0" />
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}