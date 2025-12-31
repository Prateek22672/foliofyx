import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { usePortfolio } from "../../../../context/PortfolioContext";

// --- REUSABLE WORD REVEAL COMPONENT ---
const WordReveal = ({ text, className, style }) => {
  const words = text.split(" ");

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const child = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.33, 1, 0.68, 1] },
    },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10%" }}
      className={className}
      style={style}
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          variants={child}
          className="inline-block mr-[0.25em]"
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
};

// --- MARQUEE COMPONENT ---
const Marquee = ({ text, direction = 1, speed = 15, color }) => {
  return (
    <div className="flex overflow-hidden whitespace-nowrap opacity-10 pointer-events-none absolute top-1/2 -translate-y-1/2 w-full">
      <motion.div
        initial={{ x: direction === 1 ? "-50%" : "0%" }}
        animate={{ x: direction === 1 ? "0%" : "-50%" }}
        transition={{ repeat: Infinity, ease: "linear", duration: speed }}
        className="flex gap-10"
      >
        {[...Array(4)].map((_, i) => (
          <span
            key={i}
            className="text-[15rem] md:text-[25rem] font-black uppercase leading-none"
            style={{ color }}
          >
            {text} —
          </span>
        ))}
      </motion.div>
    </div>
  );
};

const Home = ({ portfolioData: propData }) => {
  const { portfolioData: contextData } = usePortfolio();
  const data = propData || contextData || {};
  const containerRef = useRef(null);

  const bg = data.themeBg || "#ffffff";
  const fg = data.themeFont || "#0f172a";
  const accent = data.accentColor || "#2563eb";

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const yText = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const yImg = useTransform(scrollYProgress, [0, 1], [0, -100]);

  // State to manage mobile touch interaction
  const [isTouched, setIsTouched] = useState(false);

  return (
    <section
      ref={containerRef}
      id="home"
      className="relative min-h-screen flex sm:pt-11 flex-col justify-center overflow-hidden"
      style={{ backgroundColor: bg }}
    >
      {/* Background Kinetic Text */}
      <Marquee text="The Grand Era™" direction={-1} speed={30} color={fg} />

      <div className="relative z-10 w-full max-w-[90%] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Main Typography */}
        <motion.div
          style={{ y: yText }}
          className="lg:col-span-7 flex flex-col z-20 mix-blend-difference text-white lg:mix-blend-normal lg:text-current"
        >
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
          >
            <p className="text-sm md:text-lg font-mono mb-4 uppercase tracking-widest opacity-60">
              // Available for work
            </p>
            <h1
              className="text-[15vw] lg:text-[10vw] leading-[0.85] font-black tracking-tighter uppercase break-words"
              style={{ color: fg }}
            >
              {data.name ? data.name.split(" ")[0] : "JOHN"}
              <br />
              <span
                className="outline-text text-transparent"
                style={{ WebkitTextStroke: `2px ${fg}` }}
              >
                {data.name ? data.name.split(" ")[1] : "WICK"}
              </span>
            </h1>
          </motion.div>

          {/* Word-by-Word Reveal Effect */}
          <div className="mt-8 max-w-lg">
            <WordReveal
              text={data.role || "Creative Developer & UI Designer"}
              className="text-xl md:text-2xl font-light leading-snug"
              style={{ color: fg }}
            />
          </div>
        </motion.div>

        {/* Hero Image / Visual */}
        <motion.div
          style={{ y: yImg }}
          className="lg:col-span-5 relative h-[50vh] rounded-2xl lg:h-[75vh] w-[70vh]"
        >
          <motion.div
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="w-full h-full overflow-hidden rounded-2xl cursor-pointer group"
            // Add touch handlers for mobile interaction
            onTouchStart={() => setIsTouched(true)}
            onTouchEnd={() => setIsTouched(false)}
          >
            <img
              src={
                data.image ||
                "/themes/scene-john-wick-3-parabellum.webp"
              }
              alt="Profile"
              // Use dynamic class based on touch state OR hover state
              className={`w-full h-full object-cover transition-all duration-700 ${
                isTouched ? "grayscale-0" : "grayscale group-hover:grayscale-0"
              }`}
            />
          </motion.div>

          {/* Decorative Elements */}
          <div
            className="absolute -bottom-10 -left-10 w-32 h-32 bg-transparent border-2 rounded-full animate-spin-slow"
            style={{ borderColor: accent }}
          ></div>
          <div
            className="absolute top-10 -right-5 w-20 h-20"
            style={{ backgroundColor: accent }}
          ></div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-6 md:left-12 flex items-center gap-4">
        <div className="w-[2px] h-20 bg-gray-300 overflow-hidden">
          <motion.div
            animate={{ y: ["-100%", "100%"] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            className="w-full h-1/2"
            style={{ backgroundColor: fg }}
          />
        </div>
        <span
          className="text-xs font-bold uppercase writing-v"
          style={{ color: fg }}
        >
          Scroll
        </span>
      </div>
    </section>
  );
};

export default Home;