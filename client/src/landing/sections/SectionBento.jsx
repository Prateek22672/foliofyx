import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

// --- SEO OPTIMIZED MOCK DATA ---
const RAW_TEMPLATES = [
  { 
    id: 1, 
    title: "Algo", 
    tag: "SaaS", 
    color: "#E11D48", 
    src: "/preview/veloura/whiteMobile.png",
    // SEO: Include Brand Name + Category + Use Case
    altText: "FolioFYX Algo SaaS Portfolio Template for Developers" 
  },
  { 
    id: 2, 
    title: "Lumina", 
    tag: "Web3", 
    color: "#7C3AED", 
    src: "/preview/luxe/blackMobile.png",
    altText: "FolioFYX Lumina Web3 and Crypto Portfolio Design" 
  },
  { 
    id: 3, 
    title: "Brand", 
    tag: "Identity", 
    color: "#2563EB", 
    src: "/preview/neonix/whiteMobile.png",
    altText: "FolioFYX Brand Identity Portfolio Template for Designers" 
  },
  { 
    id: 4, 
    title: "Data", 
    tag: "AI", 
    color: "#000000", 
    src: "/preview/neonix/whiteMobile.png",
    altText: "FolioFYX Data AI Engineer Resume Website Template" 
  },
  { 
    id: 5, 
    title: "Velour", 
    tag: "Fashion", 
    color: "#DB2777", 
    src: "/preview/theEra/blackMobile.png",
    altText: "FolioFYX Velour Fashion Model Portfolio Website" 
  },
  { 
    id: 6, 
    title: "Haptic", 
    tag: "Mobile", 
    color: "#EA580C", 
    src: "/preview/plexis/blackMobile.png",
    altText: "FolioFYX Haptic Mobile App Developer Portfolio" 
  },
  { 
    id: 7, 
    title: "Sonar", 
    tag: "Audio", 
    color: "#10B981", 
    src: "/preview/pulse/whiteMobile.png",
    altText: "FolioFYX Sonar Audio Engineer and Musician Website" 
  },
  { 
    id: 9, 
    title: "Flow", 
    tag: "Agency", 
    color: "#3B82F6", 
    src: "/preview/theEra/blackMobile3.png",
    altText: "FolioFYX Flow Digital Agency Portfolio Template" 
  },
  { 
    id: 10, 
    title: "Orbit", 
    tag: "Startup", 
    color: "#059669", 
    src: "/preview/plexis/whiteMobile.png",
    altText: "FolioFYX Orbit Startup Founder Personal Website" 
  },
];

// Double the array for seamless looping
const TEMPLATES = [...RAW_TEMPLATES, ...RAW_TEMPLATES];

// --- COMPONENT: SINGLE MOBILE CARD ---
const MobileCard = ({ src, title, subtitle, color, altText }) => (
  <motion.div 
    whileHover={{ scale: 0.98, filter: "brightness(1.1)" }}
    whileTap={{ scale: 0.95 }}
    className="relative group w-full aspect-[9/18] rounded-[24px] md:rounded-[30px] overflow-hidden border-[4px] border-[#121212] bg-[#050505] shadow-lg cursor-pointer will-change-transform"
  >
    
    {/* Image */}
    <div className="absolute inset-0 w-full h-full">
      <img
        src={src}
        alt={altText} // CRITICAL FOR SEO
        title={altText} // Tooltip helpful for accessibility and SEO
        width="300" // Helps Google calculate layout stability (CLS)
        height="600"
        loading="lazy"
        decoding="async"
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      {/* Glossy Overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none mix-blend-overlay" />
    </div>

    {/* Content Overlay */}
    <div className="absolute bottom-0 left-0 w-full p-4 md:p-6 flex flex-col items-center text-center z-20 bg-gradient-to-t from-black/95 via-black/50 to-transparent pointer-events-none">
      <span
        className="px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-widest mb-2 border border-white/10 backdrop-blur-md shadow-sm"
        style={{ backgroundColor: color, color: '#fff' }}
      >
        {subtitle}
      </span>
      <h3 className="text-xl md:text-3xl font-black text-white leading-none drop-shadow-md">
        {title}
      </h3>
    </div>
  </motion.div>
);

// --- COMPONENT: SCROLLING COLUMN ---
const MarqueeColumn = ({ items, duration, direction = "up", skewStrength = 0 }) => {
    return (
        <div className="relative flex flex-col overflow-hidden h-[100vh] md:h-[150vh] mask-gradient">
            <motion.div
                className="flex flex-col gap-4 md:gap-6 will-change-transform"
                animate={{
                    y: direction === "up" ? [0, `-${50}%`] : [`-${50}%`, 0],
                }}
                transition={{
                    repeat: Infinity,
                    duration: duration,
                    ease: "linear",
                }}
                style={{ 
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    transformStyle: "preserve-3d",
                    skewY: skewStrength 
                }} 
            >
                {[...items, ...items].map((item, idx) => (
                    <MobileCard key={`${item.id}-${idx}`} {...item} subtitle={item.tag} />
                ))}
            </motion.div>
        </div>
    );
};

// --- MAIN SECTION ---
export default function SectionBento({ scrollProgress }) {
  const containerRef = useRef(null);
  
  return (
    <section 
      ref={containerRef}
      className="relative w-full bg-[#080808] z-30 rounded-t-[40px] md:rounded-t-[60px] -mt-[40px] md:-mt-[60px] pb-20 border-t border-white/10 shadow-[0_-50px_100px_rgba(0,0,0,0.8)] will-change-transform font-['Switzer']"
      style={{ minHeight: "60vh" }} 
    >
        {/* 1. HEADER */}
        <div className="pt-20 md:pt-24 pb-12 px-6 text-center">
            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="max-w-3xl mx-auto"
            >
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tighter mb-4 leading-tight">
                    Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Vibe.</span>
                </h2>
                <p className="text-neutral-400 text-sm md:text-lg max-w-xl mx-auto leading-relaxed">
                    Thousands of community-crafted templates. <br className="hidden sm:block"/>
                    From minimalist monochrome to vibrant neons.
                </p>
            </motion.div>
        </div>

        {/* 2. INFINITE SCROLL COLUMNS */}
        <div className="container mx-auto px-4 max-w-[95%] md:max-w-6xl">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 h-[70vh] md:h-[100vh] overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)]">
                
                {/* Column 1 */}
                <div>
                      <MarqueeColumn items={TEMPLATES.slice(0, 6)} duration={45} direction="up" skewStrength={-2} />
                </div>

                {/* Column 2 */}
                <div>
                      <MarqueeColumn items={TEMPLATES.slice(6, 12)} duration={35} direction="down" skewStrength={2} />
                </div>

                {/* Column 3 */}
                <div className="hidden md:block">
                      <MarqueeColumn items={TEMPLATES.slice(12, 18)} duration={50} direction="up" skewStrength={-1} />
                </div>

                {/* Column 4 */}
                <div className="hidden lg:block">
                      <MarqueeColumn items={TEMPLATES.slice(2, 8)} duration={40} direction="down" skewStrength={1} />
                </div>

            </div>
        </div>

        {/* 3. BOTTOM CTA */}
        <div className="absolute bottom-6 md:bottom-10 left-0 w-full flex justify-center z-20 pointer-events-none">
             <div className="bg-gradient-to-t from-[#080808] via-[#080808]/90 to-transparent w-full h-32 md:h-40 absolute bottom-0"></div>
             
             <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="pointer-events-auto relative bg-white text-black font-bold px-6 py-3 md:px-8 md:py-4 rounded-full shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_50px_rgba(255,255,255,0.4)] transition-all flex items-center gap-2 text-sm md:text-base"
             >
                Explore All Templates
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
             </motion.button>
        </div>
    </section>
  );
}