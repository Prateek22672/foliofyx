import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function HorizontalShowcase() {
  const images = [
    "themes/tc1.jpg",
    "themes/t4.jpg",
    "themes/tc2.jpg",
    "themes/tc3.jpg",
    "themes/tc2.jpg"
  ];

  const { scrollYProgress } = useScroll();

  // Desktop moves 100%, Mobile moves 400% (more natural)
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    ["0%", window.innerWidth < 640 ? "-400%" : "-100%"]
  );

  return (
    <section className="relative w-full py-12 overflow-hidden" aria-label="Portfolio showcase">

      {/* CENTER TITLE */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
        <h2 className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tighter text-black font-['Syne'] drop-shadow-[0_4px_24px_rgba(255,255,255,0.9)]">
          Find Talent
        </h2>
      </div>

      {/* HORIZONTAL PARALLAX SCROLLER */}
      <motion.div
        style={{ x }}
        className="flex gap-6 sm:gap-8 px-8 sm:px-16 md:px-20"
      >
        {images.map((img, i) => (
          <div
            key={i}
            className="min-w-[260px] sm:min-w-[360px] md:min-w-[420px] h-[180px] sm:h-[230px] md:h-[260px] rounded-2xl overflow-hidden border border-black/10 shadow-[0_24px_64px_-24px_rgba(0,0,0,0.25)]"
          >
            <img
              src={img}
              alt="Portfolio template preview"
              loading="lazy"
              className="w-full h-full object-cover opacity-70 hover:opacity-100 transition-opacity duration-500"
            />
          </div>
        ))}
      </motion.div>

      {/* GRADIENT LEFT EDGE */}
      <div
        aria-hidden="true"
        className="absolute left-0 top-0 h-full w-20 sm:w-28 bg-gradient-to-r from-white to-transparent pointer-events-none z-10"
      />

      {/* GRADIENT RIGHT EDGE */}
      <div
        aria-hidden="true"
        className="absolute right-0 top-0 h-full w-20 sm:w-28 bg-gradient-to-l from-white to-transparent pointer-events-none z-10"
      />

    </section>
  );
}
