import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06, delayChildren: 0.2 },
  },
};

const wordVariants = {
  hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.2, 0.65, 0.3, 0.9] },
  },
};

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: "easeOut" },
});

export default function TalentLandingHero({ handleStart }) {
  const headline = "Discover world-class creatives";

  return (
    <div className="relative flex flex-col items-center justify-center text-center overflow-hidden min-h-[85vh] pt-24 pb-32 bg-white">

      {/* --- BACKGROUND LAYER --- */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        {/* Soft pastel aurora wash */}
        <div
          className="absolute left-[6%] top-[4%] w-[48vw] h-[48vw] max-w-[640px] max-h-[640px] rounded-full blur-[110px]"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(233,213,255,0.5) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute right-[2%] top-[26%] w-[44vw] h-[44vw] max-w-[560px] max-h-[560px] rounded-full blur-[120px]"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(251,207,232,0.4) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute left-1/2 bottom-[-12%] -translate-x-1/2 w-[56vw] h-[38vw] max-w-[760px] max-h-[500px] rounded-full blur-[130px]"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(199,210,254,0.4) 0%, transparent 70%)",
          }}
        />
        {/* Fine grid */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
            maskImage:
              "radial-gradient(ellipse 80% 60% at 50% 40%, black 30%, transparent 75%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 80% 60% at 50% 40%, black 30%, transparent 75%)",
          }}
        />
        {/* Watermark */}
        <motion.div
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
          className="absolute left-1/2 top-[8%] -translate-x-1/2 -rotate-6 flex flex-col items-center select-none"
        >
          <span className="text-[15vw] font-['Syne'] font-black uppercase tracking-tighter leading-[0.9] whitespace-nowrap text-black/[0.04]">
            Find Talent
          </span>
          <span className="text-[15vw] font-['Syne'] font-black uppercase tracking-tighter leading-[0.9] whitespace-nowrap text-black/[0.04]">
            Find Talent
          </span>
        </motion.div>
      </div>

      {/* --- FOREGROUND CONTENT --- */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-6">

        {/* Badge */}
        <motion.div {...fadeUp(0)} className="mb-8 flex justify-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-black/10 bg-black/[0.03] text-[11px] font-semibold uppercase tracking-[0.25em] text-gray-500">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" aria-hidden="true" />
            The FolioFYX Network
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-5xl md:text-7xl font-black text-black leading-[1.05] mb-6 tracking-tighter font-['Syne']"
        >
          {headline.split(" ").map((word, i) => (
            <motion.span key={i} variants={wordVariants} className="inline-block">
              {word}
              {i < headline.split(" ").length - 1 && <span>&nbsp;</span>}
            </motion.span>
          ))}
        </motion.h1>

        {/* Subline */}
        <motion.p
          {...fadeUp(0.5)}
          className="text-lg md:text-xl text-gray-500 font-light max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Connect with verified developers, designers, and innovators. Build
          your team with the best portfolios on the web.
        </motion.p>

        {/* CTA */}
        <motion.div {...fadeUp(0.7)} className="flex justify-center">
          <button
            onClick={handleStart}
            className="group inline-flex items-center gap-2.5 px-8 py-4 bg-black text-white rounded-full font-semibold text-base shadow-[0_16px_48px_-12px_rgba(0,0,0,0.35)] hover:bg-gray-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            Get hired
            <ArrowRight
              size={18}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </button>
        </motion.div>

      </div>
    </div>
  );
}
