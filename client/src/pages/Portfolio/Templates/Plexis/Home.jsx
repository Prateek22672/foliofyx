import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { usePortfolio } from "../../../../context/PortfolioContext";
import '@fortawesome/fontawesome-free/css/all.min.css';

// Components
import EditableText from "../EditableText";
import EditableImage from "../EditableImage";

const FALLBACK_IMAGE = "/themes/john-wick-3-parabellum-action.avif";

const getBadgeContent = (roleString, userSkills) => {
  const role = roleString?.toLowerCase() || "";
  if (Array.isArray(userSkills) && userSkills.length > 0) {
    const skillNames = userSkills.map(s => typeof s === 'string' ? s : s.name);
    return { icon: "fa-layer-group", color: "text-blue-400", label: "Expertise & Stack", skills: skillNames };
  }
  return { icon: "fa-laptop-code", color: "text-blue-400", label: "Building With", skills: ["Modern Tech", "Clean Code", "Scalable Ops"] };
};

const Home = ({ portfolioData: propData, isReadOnly }) => {
  const { portfolioData: contextData, setPortfolioData } = usePortfolio();
  const data = propData || contextData || {};
  const containerRef = useRef(null);

  const bg = data.themeBg || "#ffffff";
  const fg = data.themeFont || "#0f172a"; 
  const accent = data.accentColor || "#2563eb"; 
  const mutedFg = `${fg}CC`; 

  const defaultName = "Your Name";
  const defaultRole = "Software Engineer";
  const defaultCaption = "Transforming complex problems into elegant digital solutions through clean code and purposeful design.";

  const badgeDetails = getBadgeContent(data.role || defaultRole, data.skills);
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);

  useEffect(() => {
    if (!badgeDetails.skills.length) return;
    const handleType = () => {
      const i = loopNum % badgeDetails.skills.length;
      const fullText = badgeDetails.skills[i];
      setText(isDeleting ? fullText.substring(0, text.length - 1) : fullText.substring(0, text.length + 1));
      if (!isDeleting && text === fullText) setTimeout(() => setIsDeleting(true), 2000); 
      else if (isDeleting && text === '') { setIsDeleting(false); setLoopNum(loopNum + 1); }
    };
    const timer = setTimeout(handleType, isDeleting ? 50 : 150);
    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, badgeDetails.skills]);

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, -150]);

  return (
    <section 
      ref={containerRef}
      id="home" 
      className="relative min-h-screen flex items-center overflow-hidden pt-32 pb-20 px-6 transition-colors duration-500"
      style={{ backgroundColor: bg }}
    >
      {/* Background Decor */}
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full blur-[120px] opacity-20 pointer-events-none" style={{ backgroundColor: accent }} />
      
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

            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight mb-4 leading-[1.1]" style={{ color: fg }}>
              <EditableText
                value={data.name || defaultName}
                onChange={(val) => setPortfolioData({ ...data, name: val })}
                readOnly={isReadOnly}
              />
            </h1>

            <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-8 min-h-[1.2em]" style={{ color: accent }}>
              <EditableText
                value={data.role || defaultRole}
                onChange={(val) => setPortfolioData({ ...data, role: val })}
                readOnly={isReadOnly}
              />
            </div>

            <div className="text-lg sm:text-xl max-w-2xl leading-relaxed mb-10 font-light" style={{ color: mutedFg }}>
              <EditableText
                value={data.caption || defaultCaption}
                onChange={(val) => setPortfolioData({ ...data, caption: val })}
                readOnly={isReadOnly}
                multiline
              />
            </div>

            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <a href="#projects" className="group relative px-8 py-4 rounded-full overflow-hidden transition-transform active:scale-95 shadow-md" style={{ backgroundColor: fg, color: bg }}>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                <span className="relative flex items-center gap-2">View Work <i className="fa-solid fa-arrow-right -rotate-45 group-hover:rotate-0 transition-transform duration-300"></i></span>
              </a>
              <a href="#contact" className="group px-8 py-4 rounded-full border transition-all hover:shadow-lg active:scale-95" style={{ borderColor: `${fg}30`, color: fg }}>Contact Me</a>
            </div>
          </motion.div>

          {/* Right Image Content */}
          <motion.div className="relative flex justify-center lg:justify-end" style={{ y: parallaxY }}>
            <motion.div animate={{ y: [0, -15, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="relative w-full max-w-[420px] aspect-square">
              <div className="absolute inset-4 rounded-[3rem] opacity-20 blur-2xl transform rotate-6" style={{ backgroundColor: accent }}></div>
              <div className="relative w-full h-full rounded-[3rem] overflow-hidden shadow-2xl border border-white/10 z-10">
                <EditableImage
                  src={data.image}
                  onImageUpload={(url) => setPortfolioData({ ...data, image: url })}
                  alt={data.name}
                  className="w-full h-full object-cover"
                  isReadOnly={isReadOnly}  
                />
                
                <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 z-20 shadow-lg pointer-events-none">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-white/10 text-white border border-white/20 shrink-0">
                             <i className={`${badgeDetails.icon.includes('fa-') ? 'fa-brands' : 'fa-solid'} ${badgeDetails.icon} text-xl ${badgeDetails.color}`}></i>
                        </div>
                        <div className="flex flex-col min-w-0">
                            <p className="text-white/50 text-[10px] uppercase tracking-wider font-bold mb-0.5">{badgeDetails.label}</p>
                            <p className="text-white font-bold text-base leading-tight truncate">{text}<span className="animate-pulse ml-0.5">|</span></p>
                        </div>
                    </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Home;