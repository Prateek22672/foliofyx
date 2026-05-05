import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { usePortfolio } from "../../../../context/PortfolioContext";

// Components
import EditableText from "../EditableText";
import EditableImage from "../EditableImage";

// --- WORD REVEAL COMPONENT ---
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
        <motion.span key={index} variants={child} className="inline-block mr-[0.25em]">
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
};

// --- MARQUEE COMPONENT ---
const Marquee = ({ text, direction = 1, speed = 15, color }) => {
  return (
    <div className="flex overflow-hidden whitespace-nowrap opacity-10 pointer-events-none absolute top-1/2 -translate-y-1/2 w-full select-none">
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

const Home = ({ portfolioData: propData, isReadOnly }) => {
  const { portfolioData: contextData, setPortfolioData } = usePortfolio();
  
  // Merge Data: Prioritizes Deployed Data (propData) over Context Data
  const data = (propData && Object.keys(propData).length > 0) ? propData : (contextData || {});
  
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

  return (
    <section
      ref={containerRef}
      id="home"
      className="relative min-h-screen flex sm:pt-11 flex-col justify-center overflow-hidden transition-colors duration-500"
      style={{ backgroundColor: bg }}
    >
      {/* Background Kinetic Text */}
      <Marquee 
        text={data.name?.split(" ")[0] || "ERA"} 
        direction={-1} 
        speed={30} 
        color={fg} 
      />

      <div className="relative z-10 w-full max-w-[90%] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        
        {/* Main Typography */}
        <motion.div
          style={{ y: yText }}
          className="lg:col-span-7 flex flex-col z-20 text-current"
        >
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
          >
            <p className="text-[10px] md:text-xs font-mono mb-4 uppercase tracking-[0.3em] opacity-60">
              // <EditableText 
                    value={data.status || "Available for work"} 
                    onChange={(v) => setPortfolioData({...data, status: v})} 
                    readOnly={isReadOnly} 
                  />
            </p>
            <h1
              className="text-[15vw] lg:text-[10vw] leading-[0.85] font-black tracking-tighter uppercase break-words"
              style={{ color: fg }}
            >
              <EditableText
                value={data.name?.split(" ")[0] || "JOHN"}
                onChange={(v) => setPortfolioData({ ...data, name: `${v} ${data.name?.split(" ").slice(1).join(" ") || ""}` })}
                readOnly={isReadOnly}
              />
              <br />
              <span
                className="outline-text text-transparent"
                style={{ WebkitTextStroke: `2px ${fg}` }}
              >
                <EditableText
                  value={data.name?.split(" ")[1] || "WICK"}
                  onChange={(v) => setPortfolioData({ ...data, name: `${data.name?.split(" ")[0] || ""} ${v}` })}
                  readOnly={isReadOnly}
                />
              </span>
            </h1>
          </motion.div>

          {/* Word Reveal Role */}
          <div className="mt-8 max-w-lg">
            {isReadOnly ? (
              <WordReveal
                text={data.role || "Creative Developer & UI Designer"}
                className="text-xl md:text-2xl font-light leading-snug"
                style={{ color: fg }}
              />
            ) : (
              <div className="text-xl md:text-2xl font-light leading-snug" style={{ color: fg }}>
                <EditableText
                  value={data.role || "Creative Developer & UI Designer"}
                  onChange={(v) => setPortfolioData({ ...data, role: v })}
                  readOnly={isReadOnly}
                  multiline
                />
              </div>
            )}
          </div>
        </motion.div>

        {/* Hero Visual */}
        <motion.div
          style={{ y: yImg }}
          className="lg:col-span-5 relative aspect-[4/5] lg:h-[75vh]"
        >
          <motion.div
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="w-full h-full relative z-10"
          >
            {/* HARD LOCK: Passing isReadOnly={isReadOnly} ensures no editing in Deployed View */}
            <EditableImage
              src={data.image}
              fallbackSrc="/themes/scene-john-wick-3-parabellum.webp"
              onImageUpload={(url) => setPortfolioData({ ...data, image: url })}
              className="w-full h-full rounded-2xl grayscale hover:grayscale-0 transition-all duration-700 shadow-2xl"
              isReadOnly={isReadOnly}
            />
          </motion.div>

          {/* Decorative Elements */}
          <div
            className="absolute -bottom-10 -left-10 w-32 h-32 bg-transparent border-2 rounded-full animate-spin-slow z-0 opacity-20"
            style={{ borderColor: accent }}
          ></div>
          <div
            className="absolute top-10 -right-5 w-20 h-20 z-0 opacity-20"
            style={{ backgroundColor: accent }}
          ></div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-6 md:left-12 flex items-center gap-4">
        <div className="w-[2px] h-20 bg-gray-300 overflow-hidden opacity-30">
          <motion.div
            animate={{ y: ["-100%", "100%"] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            className="w-full h-1/2"
            style={{ backgroundColor: fg }}
          />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: fg, writingMode: 'vertical-lr' }}>
          Scroll
        </span>
      </div>
    </section>
  );
};

export default Home;