import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Layers, Server, Code2, PenTool, Sparkles, MapPin, Download } from "lucide-react";
import { usePortfolio } from "../../../../context/PortfolioContext";

const FALLBACK_IMAGE = "/luxe.jpg";

// ✅ Helper to ensure links are absolute (Fixes the localhost issue)
const getSafeUrl = (url) => {
  if (!url) return "#";
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  return `https://${url}`;
};

const getBadgeContent = (roleString, userSkills) => {
  const role = roleString?.toLowerCase() || "";
  if (Array.isArray(userSkills) && userSkills.length > 0) {
    const skillNames = userSkills.map(s => typeof s === 'string' ? s : s.name);
    return { Icon: Layers, label: "Expertise", skills: skillNames };
  }
  if (role.includes("node") || role.includes("backend")) return { Icon: Server, label: "Core Stack", skills: ["System Arch", "API Design", "Database Ops"] };
  if (role.includes("react") || role.includes("frontend")) return { Icon: Code2, label: "Specializing In", skills: ["Modern React", "Interactive UI", "Performance"] };
  if (role.includes("design") || role.includes("ui")) return { Icon: PenTool, label: "Design Focus", skills: ["Visual Systems", "User Journeys", "Prototyping"] };
  return { Icon: Sparkles, label: "Building With", skills: ["Modern Tech", "Clean Code", "Scalable Ops"] };
};

const Home = ({ portfolioData: propData }) => {
  const { portfolioData: contextData } = usePortfolio();
  const data = propData || contextData || {};
  const containerRef = useRef(null);

  const bg = data.themeBg || "#ffffff";
  const fg = data.themeFont || "#111827";

  const name = data?.name || "User Name";
  const firstName = name.split(' ')[0];
  const role = data?.role || "Digital Creator";
  const image = data?.image || FALLBACK_IMAGE;

  const badgeDetails = getBadgeContent(role, data?.skills);
  const BadgeIcon = badgeDetails.Icon;
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);

  useEffect(() => {
    const handleType = () => {
      const i = loopNum % badgeDetails.skills.length;
      const fullText = badgeDetails.skills[i];
      setText(isDeleting ? fullText.substring(0, text.length - 1) : fullText.substring(0, text.length + 1));
      setTypingSpeed(isDeleting ? 50 : 150);
      if (!isDeleting && text === fullText) setTimeout(() => setIsDeleting(true), 2000); 
      else if (isDeleting && text === '') { setIsDeleting(false); setLoopNum(loopNum + 1); }
    };
    const timer = setTimeout(handleType, typingSpeed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, badgeDetails.skills, typingSpeed]);

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, 100]);

  return (
    <section 
      ref={containerRef} 
      id="home" 
      className="min-h-screen flex flex-col justify-center px-6 md:px-12 pt-24 pb-20 overflow-hidden transition-colors duration-300"
      style={{ backgroundColor: bg, color: fg }}
    >
      <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-16 items-center">
        
        {/* --- LEFT: CONTENT --- */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }} 
          className="flex flex-col justify-center"
        >
           {/* Breadcrumbs */}
           <motion.div 
             initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
             className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest mb-8"
           >
              <span style={{ color: fg }}>{role}</span>
              <span className="w-1 h-1 rounded-full" style={{ backgroundColor: fg, opacity: 0.3 }}></span>
              <span className="flex items-center gap-1" style={{ color: fg, opacity: 0.6 }}><MapPin size={10} /> {data?.location || "India"}</span>
           </motion.div>

           {/* Hero Text */}
           <h1 className="text-6xl md:text-8xl lg:text-9xl font-medium leading-[0.9] tracking-tighter mb-8">
              <span className="block" style={{ color: fg }}>I am</span>
              <span className="block" style={{ color: fg, opacity: 0.3 }}>{firstName}.</span>
           </h1>
           
           <motion.p 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8, delay: 0.4 }}
             className="text-xl md:text-2xl font-light max-w-md leading-relaxed"
             style={{ color: fg, opacity: 0.5 }}
           >
             Crafting digital experiences with precision, blending technical expertise with modern aesthetics.
           </motion.p>

           <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ duration: 0.8, delay: 0.6 }}
             className="flex flex-wrap gap-4 mt-10"
           >
                <a 
                  href="#projects" 
                  className="group inline-flex items-center gap-2 px-7 py-4 rounded-full text-[18px] font-medium tracking-tight antialiased transition-all duration-300 hover:scale-105 hover:shadow-lg hover:opacity-90"
                  style={{ backgroundColor: fg, color: bg }}
                >
                  Selected Work 
                  <ArrowUpRight 
                    size={18} 
                    strokeWidth={2}
                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </a>

                {/* --- CV BUTTON WITH URL FIX --- */}
                {data?.cvLink && (
                  <a 
                    href={getSafeUrl(data.cvLink)} // ✅ Wraps the link to ensure https://
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 px-7 py-4 rounded-full text-[18px] font-medium tracking-tight antialiased transition-all duration-300 hover:scale-105 border hover:opacity-70"
                    style={{ borderColor: fg, color: fg }}
                  >
                    Download CV
                    <Download 
                      size={18} 
                      strokeWidth={2}
                      className="transition-transform duration-300 group-hover:translate-y-0.5"
                    />
                  </a>
                )}
                {/* ----------------------------- */}

           </motion.div>
        </motion.div>

        {/* --- RIGHT: IMAGE --- */}
        <motion.div 
            style={{ y: parallaxY }} 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative flex justify-center lg:justify-end"
        >
          <div className="relative w-full max-w-[400px] aspect-[3/4] rounded-[2rem] overflow-hidden shadow-2xl border group" style={{ borderColor: `${fg}10` }}>
            <img 
              src={image} 
              alt={name} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              onError={(e) => {e.target.onerror = null; e.target.src = FALLBACK_IMAGE}} 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent"></div>

            {/* Glass Badge */}
            <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="absolute bottom-6 left-6 right-6 p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg"
            >
                <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-white/20 text-white border border-white/30 shrink-0">
                          <BadgeIcon size={20} />
                    </div>
                    <div className="flex flex-col min-w-0">
                        <p className="text-white/60 text-[10px] uppercase tracking-widest font-bold mb-1">{badgeDetails.label}</p>
                        <p className="text-white font-bold text-lg leading-none truncate">{text}<span className="animate-pulse ml-1 text-blue-400">|</span></p>
                    </div>
                </div>
            </motion.div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default Home;