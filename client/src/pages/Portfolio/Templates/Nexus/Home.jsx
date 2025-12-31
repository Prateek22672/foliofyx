import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { usePortfolio } from "../../../../context/PortfolioContext";
import '@fortawesome/fontawesome-free/css/all.min.css';

const FALLBACK_IMAGE = "/themes/john-wick-3-parabellum-action.avif";

// --- UPDATED: Uses proper Brand Icons for better visibility ---
const getBadgeContent = (roleString, userSkills) => {
  const role = roleString?.toLowerCase() || "";
  
  // 1. If user has skills, show them
  if (Array.isArray(userSkills) && userSkills.length > 0) {
    const skillNames = userSkills.map(s => typeof s === 'string' ? s : s.name);
    return { icon: "fa-layer-group", color: "text-blue-400", label: "Expertise & Stack", skills: skillNames };
  }

  // 2. Role Matching with OFFICIAL BRAND ICONS
  if (role.includes("node")) {
    return { 
      icon: "fa-node-js", // Official Node Icon
      color: "text-green-500", 
      label: "Core Competencies", 
      skills: ["Scalable Systems", "API Architecture", "Database Tuning"] 
    };
  }
  if (role.includes("react") || role.includes("next")) {
    return { 
      icon: "fa-react", // Official React Icon
      color: "text-blue-400", 
      label: "Specializing In", 
      skills: ["Modern React", "Interactive UIs", "Performance"] 
    };
  }
  if (role.includes("js") || role.includes("javascript")) {
    return { 
      icon: "fa-js", // Official JS Icon
      color: "text-yellow-400", 
      label: "Language Focus", 
      skills: ["ES6+", "Async Patterns", "Functional Programming"] 
    };
  }
  if (role.includes("design") || role.includes("ui")) {
    return { 
      icon: "fa-pen-nib", 
      color: "text-pink-400", 
      label: "Design Focus", 
      skills: ["Visual Identity", "User Experience", "Prototyping"] 
    };
  }
  
  // Default
  return { 
    icon: "fa-laptop-code", 
    color: "text-blue-400", 
    label: "Building With", 
    skills: ["Modern Tech", "Clean Code", "Scalable Ops"] 
  };
};

const Home = ({ portfolioData: propData }) => {
  const { portfolioData: contextData } = usePortfolio();
  const data = propData || contextData || {};
  const containerRef = useRef(null);

  const bg = data.themeBg || "#ffffff";
  const fg = data.themeFont || "#0f172a"; 
  const accent = data.accentColor || "#2563eb"; 
  const mutedFg = `${fg}CC`;

  const badgeDetails = getBadgeContent(data.role, data.skills);
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
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, -150]);

  return (
    <section 
      ref={containerRef}
      id="home" 
      className="relative min-h-screen flex items-center overflow-hidden pt-32 pb-20 px-6"
      style={{ backgroundColor: bg }}
    >
      {/* Background Blobs */}
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full blur-[120px] opacity-20 pointer-events-none" style={{ backgroundColor: accent }} />
      <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full blur-[100px] opacity-10 pointer-events-none" style={{ backgroundColor: fg }} />

      <div className="max-w-7xl mx-auto w-full z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Text Content */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center lg:items-start text-center lg:text-left"
          >
            <div className="mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm border backdrop-blur-sm" style={{ borderColor: `${fg}20`, backgroundColor: `${fg}05`, color: fg }}>
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-green-500"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                </span>
                Available for Projects
              </span>
            </div>

            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight mb-6 leading-[1.1]" style={{ color: fg }}>
              {data.name || "Bharat Velineni"}
            </h1>

            {/* --- UPDATED: Solid Color for Maximum Visibility --- */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-500 pb-2">
              {data.role || "Computer Science Student"}
            </h2>

            <p className="text-lg sm:text-xl max-w-2xl leading-relaxed mb-10 font-light" style={{ color: mutedFg }}>
              Building digital experiences that blend
              <span className="mx-2 font-medium" style={{ color: fg }}>performance <i className="fa-solid fa-bolt text-yellow-500 mx-1 text-sm"></i></span>
              with
              <span className="mx-2 font-medium" style={{ color: fg }}>design <i className="fa-solid fa-pen-nib text-pink-500 mx-1 text-sm"></i></span>
              to create scalable applications.
            </p>

            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <a href="#projects" className="group relative px-8 py-4 rounded-full overflow-hidden transition-transform active:scale-95 shadow-md" style={{ backgroundColor: fg, color: bg }}>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                <span className="relative flex items-center gap-2">View Work <i className="fa-solid fa-arrow-right -rotate-45 group-hover:rotate-0 transition-transform duration-300"></i></span>
              </a>
              <a href="#contact" className="group px-8 py-4 rounded-full  border transition-all hover:shadow-lg active:scale-95" style={{ borderColor: `${fg}30`, color: fg }}>Contact Me</a>
            </div>
          </motion.div>

          {/* Right Image Content */}
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }} className="relative flex justify-center lg:justify-end" style={{ y: parallaxY }}>
            <motion.div animate={{ y: [0, -15, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="relative w-full max-w-[420px] aspect-square">
              <div className="absolute inset-4 rounded-[3rem] opacity-20 blur-2xl transform rotate-6" style={{ backgroundColor: accent }}></div>
              <div className="relative w-full h-full rounded-[3rem] overflow-hidden shadow-2xl border border-white/10 z-10 transform transition-transform hover:scale-[1.02] duration-500">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                <img src={data.image || "main.jpeg"} onError={(e) => {e.target.onerror = null; e.target.src = FALLBACK_IMAGE}} alt={data.name} className="w-full h-full object-cover" />
                
                {/* --- GLASS BADGE --- */}
                <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 z-20 shadow-lg">
                    <div className="flex items-center gap-4">
                        {/* Dynamic Brand Icon */}
                        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-white/10 text-white border border-white/20 shrink-0">
                             {/* Check for Brands first (fa-node-js), else Solid */}
                             <i className={`${badgeDetails.icon.includes('fa-') ? 'fa-brands' : 'fa-solid'} ${badgeDetails.icon} text-xl ${badgeDetails.color}`}></i>
                        </div>
                        <div className="flex flex-col min-w-0">
                            <p className="text-white/50 text-[10px] uppercase tracking-wider font-bold mb-0.5">{badgeDetails.label}</p>
                            <p className="text-white font-bold text-base leading-tight truncate">{text}<span className="animate-pulse ml-0.5">|</span></p>
                        </div>
                    </div>
                </div>
              </div>
              
              {/* Floating Icons */}
              <motion.div animate={{ y: [0, 15, 0], rotate: [0, 5, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="absolute -top-6 -right-6 w-14 h-14 bg-white/90 backdrop-blur-md border border-white/40 rounded-2xl shadow-xl flex items-center justify-center z-30"><i className="fa-solid fa-laptop-code text-xl" style={{ color: accent }}></i></motion.div>
              <motion.div animate={{ y: [0, -15, 0], rotate: [0, -5, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }} className="absolute top-1/3 -left-8 w-12 h-12 bg-white/90 backdrop-blur-md border border-white/40 rounded-2xl shadow-xl flex items-center justify-center z-30"><i className="fa-solid fa-rocket text-lg" style={{ color: accent }}></i></motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Home;