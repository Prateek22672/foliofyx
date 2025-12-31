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

  // Desktop moves 40%, Mobile moves only 20% (more natural)
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    ["0%", window.innerWidth < 640 ? "-400%" : "-100%"]
  );

  return (
    <section className="relative w-full py-12 overflow-hidden">

      {/* CENTER TITLE */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
        <h1 className="
          text-5xl 
          sm:text-6xl 
          md:text-8xl 
          font-extrabold 
          tracking-tight 
          text-white 
          drop-shadow-2xl 
          opacity-90
        ">
          FindTalent
        </h1>
      </div>

      {/* HORIZONTAL PARALLAX SCROLLER */}
      <motion.div
        style={{ x }}
        className="flex gap-6 sm:gap-8 px-8 sm:px-16 md:px-20"
      >
        {images.map((img, i) => (
          <div
            key={i}
            className="
              min-w-[260px] 
              sm:min-w-[360px] 
              md:min-w-[420px] 
              h-[180px]
              sm:h-[230px]
              md:h-[260px]
              rounded-3xl 
              overflow-hidden 
              shadow-xl 
              border  
              backdrop-blur-xl
            "
          >
            <img
              src={img}
              className="w-full h-full object-cover opacity-90 hover:opacity-100 transition"
            />
          </div>
        ))}
      </motion.div>

      {/* GRADIENT LEFT EDGE */}
      <div className="
        absolute left-0 top-0 h-full 
        w-20 sm:w-28 
        bg-gradient-to-r from-[#eef1f5] to-transparent 
        pointer-events-none 
      "></div>

      {/* GRADIENT RIGHT EDGE */}
      <div className="
        absolute right-0 top-0 h-full 
        w-20 sm:w-28 
        bg-gradient-to-l from-[#eef1f5] to-transparent 
        pointer-events-none 
      "></div>

    </section>
  );
}