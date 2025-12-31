import React from "react";
import { motion, useTransform, useMotionValue } from "framer-motion";

// --- Kinetic Background Helper ---
const MarqueeRow = ({ text, direction, speed, opacity = 1, color }) => {
  const moveDir = direction === "left" ? -1 : 1;
  return (
    <div className="relative flex overflow-hidden -rotate-[10deg] py-2 bg-black/0 mix-blend-screen pointer-events-none select-none">
      <motion.div
        className="flex whitespace-nowrap gap-8"
        animate={{ x: [0, moveDir * 1000] }}
        transition={{
          x: { repeat: Infinity, duration: speed, ease: "linear" },
        }}
      >
        {[...Array(8)].map((_, i) => (
          <span
            key={i}
            className="font-inter font-black text-[10vw] leading-[0.85] tracking-tighter uppercase"
            style={{
              color: color,
              opacity: opacity,
              WebkitTextStroke: "1px rgba(255,255,255,0.1)"
            }}
          >
            {text}
          </span>
        ))}
      </motion.div>
    </div>
  );
};

export default function SectionThemes({ localScroll = 0 }) {
  // Turn the raw number into a MotionValue so framer can transform it
  const scrollY = useMotionValue(localScroll);

  // React to prop changes
  React.useEffect(() => {
    scrollY.set(localScroll);
  }, [localScroll, scrollY]);

  // --- ANIMATION MAPPING ---
  
  // 1. Title Fades in (0 to 0.3)
  const titleOpacity = useTransform(scrollY, [0, 0.3], [0, 1]);
  const titleY = useTransform(scrollY, [0, 0.3], [50, 0]);

  // 2. Button Fades in (Slightly after title)
  const btnOpacity = useTransform(scrollY, [0.2, 0.5], [0, 1]);
  const btnY = useTransform(scrollY, [0.2, 0.5], [-20, 0]);

  // 3. Left Card (Large)
  const leftCardY = useTransform(scrollY, [0.2, 1.0], ["110%", "0%"]);

  // 4. Top Right Card (Okalpha)
  const rightTopCardY = useTransform(scrollY, [0.8, 1.6], ["150%", "0%"]);

  // 5. Bottom Right Cards
  const rightBottomCardY = useTransform(scrollY, [1.4, 2.2], ["150%", "0%"]);

  // 6. Background Scaling
  const bgScale = useTransform(scrollY, [0, 3], [1.2, 1]);
  const bgOpacity = useTransform(scrollY, [0, 0.5], [0, 1]);


  return (
    <section className="relative w-full h-full bg-[#e2d8ff] overflow-hidden flex flex-col items-center justify-center">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;800;900&display=swap');
        .font-inter { font-family: 'Inter', sans-serif; }
        .bg-radial-fade { background: radial-gradient(circle, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 90%); }
      `}</style>

      {/* --- BACKGROUND --- */}
      <motion.div
        className="absolute inset-0 flex flex-col justify-center items-center z-0 origin-center"
        style={{ scale: bgScale, opacity: bgOpacity }}
      >
        <div className="absolute inset-0 opacity-20">
          <MarqueeRow text="WE DESIGN" direction="left" speed={60} color="#333" />
          <MarqueeRow text="WE DESIGN" direction="right" speed={70} color="#444" />
          <MarqueeRow text="WE DESIGN" direction="left" speed={50} color="#333" />
          <MarqueeRow text="WE DESIGN" direction="right" speed={80} color="#444" />
        </div>
        <div className="absolute inset-0 bg-radial-fade pointer-events-none" />
      </motion.div>

      {/* --- TOP RIGHT BUTTON (Added Here) --- */}
      <motion.div 
        style={{ opacity: btnOpacity, y: btnY }}
        className="absolute top-8 right-6 md:top-25 md:right-12 z-50"
      >
        <button className="bg-white text-black font-inter font-normal text-sm md:text-base px-8 py-3 rounded-full  tracking-wider hover:scale-105 hover:bg-[#f2c8b8] transition-all duration-300 shadow-lg cursor-pointer">
           Explore Themes
        </button>
      </motion.div>

      {/* --- FOREGROUND CONTENT --- */}
      <div className="relative z-10 w-full max-w-[95%] md:max-w-7xl mx-auto flex flex-col items-center h-[90vh] justify-center">

        {/* TITLE */}
        <motion.div
          style={{ opacity: titleOpacity, y: titleY }}
          className="text-center mb-4 md:mb-8 shrink-0"
        >
          <h2 className=" font-black text-4xl md:text-6xl uppercase leading-[0.9] tracking-tight">
            <span className="text-white block mb-2">DESIGN THAT DEFINES YOU</span>
            <span className="text-black block">Explore Templates</span>
          </h2>
        </motion.div>

        {/* GRID CONTAINER */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full h-[60vh] md:h-[600px]">

          {/* --- LEFT: Wide Portrait Card --- */}
          <motion.div
            style={{ y: leftCardY }}
            className="w-full h-full"
          >
            <ThemeCard
              title="Sonja Art"
              tag="PORTFOLIO"
              img="/themes/newTemp3demo.png" 
              color="bg-zinc-900"
              textColor="text-white"
            />
          </motion.div>

          {/* --- RIGHT COLUMN --- */}
          <div className="flex flex-col gap-4 w-full h-full">

            {/* Top Right: Okalpha */}
            <motion.div
              style={{ y: rightTopCardY }}
              className="flex-[1.2] w-full"
            >
              <GeometricCard tag="AGENCY" />
            </motion.div>

            {/* Bottom Right Row */}
            <motion.div
              style={{ y: rightBottomCardY }}
              className="flex-1 flex gap-4 w-full"
            >
              <div className="flex-[1.5]">
                <ThemeCard
                  title="Minimal Mode"
                  tag="DEV"
                  img="/themes/p8.jpg"
                  color="bg-[#111]"
                  textColor="text-white"
                />
              </div>

              <div className="flex-[1.5]">
                <ThemeCard
                  title="Dark Mode"
                  tag="DEV"
                  img="/themes/p7.png"
                  color="bg-[#111]"
                  textColor="text-white"
                />
              </div>

              <div className="flex-1">
                <ExploreLink />
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}

// --- COMPONENTS ---

const ThemeCard = ({ title, tag, img, color, textColor }) => (
  <div className={`relative group w-full h-full rounded-2xl overflow-hidden ${color} border border-white/10 shadow-2xl transition-all duration-500 hover:scale-[1.01] flex flex-col`}>
    <div className="h-6 w-full bg-black/20 backdrop-blur-md border-b border-white/5 flex items-center px-4 gap-2 z-20 absolute top-0 left-0">
      <div className="w-2 h-2 rounded-full bg-[#FF5F56]"></div>
      <div className="w-2 h-2 rounded-full bg-[#FFBD2E]"></div>
      <div className="w-2 h-2 rounded-full bg-[#27C93F]"></div>
    </div>
    <div className="relative w-full h-full pt-6">
      <div className="w-full h-full relative overflow-hidden">
        <img src={img} alt={title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
      </div>
    </div>
    <div className="absolute bottom-4 left-4 z-20">
      <span className="px-2 py-0.5 text-[9px] font-bold tracking-widest uppercase bg-white text-black rounded-sm mb-1 inline-block">{tag}</span>
      <h3 className={`text-xl font-bold font-inter ${textColor}`}>{title}</h3>
    </div>
  </div>
);

const GeometricCard = ({ tag }) => (
  <div className="relative group w-full h-full rounded-2xl overflow-hidden bg-white border border-white/10 shadow-2xl transition-all duration-500 hover:scale-[1.01] flex flex-col">
    <div className="h-6 w-full bg-gray-100 border-b border-gray-200 flex items-center px-4 gap-2 z-20 absolute top-0 left-0">
      <div className="w-2 h-2 rounded-full bg-[#FF5F56]"></div>
      <div className="w-2 h-2 rounded-full bg-[#FFBD2E]"></div>
      <div className="w-2 h-2 rounded-full bg-[#27C93F]"></div>
    </div>
    <div className="relative w-full h-full pt-6 flex items-center bg-white">
      <div className="w-1/2 h-full p-6 flex flex-col justify-center z-10">
        <div className="w-6 h-1 bg-black mb-3"></div>
        <h3 className="text-black font-inter font-black text-3xl md:text-5xl leading-[0.9] tracking-tight">Hey.<br />We're<br />Live.</h3>
      </div>
      <div className="absolute top-0 right-0 w-3/5 h-full z-0 overflow-hidden">
        <div className="absolute top-[20%] right-[10%] w-[120%] h-[120%] bg-[#FFD700] transform -rotate-12 shadow-2xl group-hover:rotate-0 transition-transform duration-700 origin-bottom-left"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[80%] h-[80%] bg-[#FF3B30] transform rotate-3 z-10 group-hover:rotate-12 transition-transform duration-700"></div>
      </div>
    </div>
  </div>
);

const ExploreLink = () => (
  <div className="h-full w-full rounded-2xl overflow-hidden bg-neutral-900 border border-white/10 flex flex-col items-center justify-center text-center group cursor-pointer hover:bg-[#f2c8b8] transition-colors duration-500 relative">
    <div className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center text-white text-xl mb-2 group-hover:border-black group-hover:text-black transition-colors">→</div>
    <h3 className="text-white text-xs font-bold font-inter group-hover:text-black leading-tight">View All</h3>
  </div>
);