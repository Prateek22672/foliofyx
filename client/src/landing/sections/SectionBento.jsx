import React from "react";
import { motion } from "framer-motion";

// --- MOCK DATA ---
const RAW_TEMPLATES = [
  { id: 1, title: "Algo", tag: "SaaS", color: "#E11D48", src: "/preview/veloura/whiteMobile.png" },
  { id: 2, title: "Lumina", tag: "Web3", color: "#7C3AED", src: "/preview/luxe/blackMobile.png" },
  { id: 3, title: "Brand", tag: "Identity", color: "#2563EB", src: "/preview/neonix/whiteMobile.png" },
  { id: 4, title: "Data", tag: "AI", color: "#000000", src: "/preview/neonix/whiteMobile.png" },
  { id: 5, title: "Velour", tag: "Fashion", color: "#DB2777", src: "/preview/theEra/blackMobile.png" },
  { id: 6, title: "Haptic", tag: "Mobile", color: "#EA580C", src: "/preview/plexis/blackMobile.png" },
  { id: 7, title: "Sonar", tag: "Audio", color: "#10B981", src: "/preview/pulse/whiteMobile.png" },
  { id: 9, title: "Flow", tag: "Agency", color: "#3B82F6", src: "/preview/theEra/blackMobile3.png" },
  { id: 10, title: "Orbit", tag: "Startup", color: "#059669", src: "/preview/plexis/whiteMobile.png" },
];

// Double the array for seamless looping
const TEMPLATES = [...RAW_TEMPLATES, ...RAW_TEMPLATES];

// --- COMPONENT: SINGLE MOBILE CARD ---
const MobileCard = ({ src, title, subtitle, color }) => (
  <div className="relative group w-full aspect-[9/18] rounded-[30px] overflow-hidden border-[4px] md:border-[6px] border-[#121212] bg-[#050505] shadow-lg transform transition-all duration-500 hover:scale-[1.02]">
    
    {/* Image */}
    <div className="absolute inset-0 w-full h-full">
      <img
        src={src}
        alt={title}
        loading="lazy"
        className="w-full h-full object-cover"
      />
      {/* Glossy Overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </div>

    {/* Content Overlay */}
    <div className="absolute bottom-0 left-0 w-full p-4 md:p-6 flex flex-col items-center text-center z-20 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
      <span
        className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-2 border border-white/10 backdrop-blur-md shadow-sm"
        style={{ backgroundColor: color, color: '#fff' }}
      >
        {subtitle}
      </span>
      <h3 className="text-2xl md:text-3xl font-black text-white leading-none drop-shadow-md">
        {title}
      </h3>
    </div>
  </div>
);

// --- COMPONENT: SCROLLING COLUMN ---
const MarqueeColumn = ({ items, duration, direction = "up" }) => {
    // Calculate approximate total height for seamless loop
    const itemHeight = 18 / 9; // aspect ratio height multiplier (assuming width=1)
    const gap = 24; // 6 * 4px gap in rem, but using px for calc
    const totalItems = items.length;
    const totalHeight = totalItems * (itemHeight * 100 + gap) - gap; // rough estimate in vh or px

    return (
        <div className="relative flex flex-col overflow-hidden h-[120vh] md:h-[150vh]">
            <motion.div
                className="flex flex-col gap-6"
                animate={{
                    y: direction === "up" ? [0, `-${totalHeight}px`] : [`-${totalHeight}px`, 0],
                }}
                transition={{
                    repeat: Infinity,
                    duration: duration,
                    ease: "linear",
                }}
                style={{ willChange: "transform" }} // Optimize for smooth animation
            >
                {items.map((item, idx) => (
                    <MobileCard key={`${item.id}-${idx}`} {...item} />
                ))}
            </motion.div>
        </div>
    );
};

// --- MAIN SECTION ---
export default function SectionBento() {
  return (
    <section 
      className="relative w-full bg-[#080808] z-30 rounded-t-[60px] -mt-[60px] pb-20 border-t border-white/10 shadow-[0_-50px_100px_rgba(0,0,0,0.8)]"
      style={{ minHeight: "60vh" }} 
    >
        {/* 1. HEADER */}
        <div className="pt-24 pb-12 px-6 text-center">
            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-3xl mx-auto"
            >
                <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-4">
                    Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Vibe.</span>
                </h2>
                <p className="text-neutral-400 text-sm md:text-lg max-w-xl mx-auto">
                    Thousands of community-crafted templates. <br className="hidden md:block"/>
                    From minimalist monochrome to vibrant neons.
                </p>
            </motion.div>
        </div>

        {/* 2. INFINITE SCROLL COLUMNS */}
        {/* Constrained container width on desktop (max-w-6xl) to keep cards smaller */}
        <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 h-[80vh] md:h-[100vh] overflow-hidden">
                
                {/* Column 1: Slow Up (Hidden on Mobile, Visible Tablet+) */}
                <div className="hidden md:block">
                     <MarqueeColumn items={TEMPLATES.slice(0, 6)} duration={45} direction="up" />
                </div>

                {/* Column 2: Fast Down (Visible Mobile & Desktop) */}
                <div>
                     <MarqueeColumn items={TEMPLATES.slice(6, 12)} duration={35} direction="down" />
                </div>

                {/* Column 3: Slow Up (Visible Mobile & Desktop) */}
                <div>
                     <MarqueeColumn items={TEMPLATES.slice(12, 18)} duration={50} direction="up" />
                </div>

                {/* Column 4: Med Down (Visible Desktop Only) */}
                <div className="hidden lg:block">
                     <MarqueeColumn items={TEMPLATES.slice(2, 8)} duration={40} direction="down" />
                </div>

            </div>
        </div>

        {/* 3. BOTTOM CTA */}
        <div className="absolute bottom-10 left-0 w-full flex justify-center z-20 pointer-events-none">
             <div className="bg-gradient-to-t from-[#080808] via-[#080808]/90 to-transparent w-full h-40 absolute bottom-0"></div>
             <button className="pointer-events-auto relative bg-white text-black font-bold px-8 py-4 rounded-full hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all flex items-center gap-2">
                Explore All Templates
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
             </button>
        </div>
    </section>
  );
}