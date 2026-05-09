import React from "react";
import { motion } from "framer-motion";
import { usePortfolio } from "../../../../context/PortfolioContext";
import linkedinLogo from "../../../../assets/linkedin.png";
import githubLogo from "../../../../assets/github.png";
import { ArrowDown, Sparkles, ExternalLink, FileText, MapPin } from "lucide-react";
import EditableText from "../EditableText";
import EditableImage from "../EditableImage";

const DEFAULT_AVATAR = "/themes\\image_landing.jpg";


const Home = ({ portfolioData: propData, isReadOnly }) => {
  const { portfolioData: contextData, setPortfolioData } = usePortfolio();
  const data = propData && Object.keys(propData).length > 0 ? propData : contextData || {};

  const bg     = data.themeBg     || "#0c0c0e";
  const fg     = data.themeFont     || "#f2f2f0";
  const accent = data.accentColor   || "#c8ff57";
  const font   = data.themeFontFamily || "Switzer, sans-serif";

  const nameParts  = (data.name || "Creative Studio").split(" ");
  const firstName  = nameParts[0];
  const lastName   = nameParts.slice(1).join(" ");

  const handleNameChange = (part, val) => {
    if (part === "first") {
      setPortfolioData({ ...data, name: lastName ? `${val} ${lastName}` : val });
    } else {
      setPortfolioData({ ...data, name: firstName ? `${firstName} ${val}` : val });
    }
  };

  const stagger = {
    hidden:  { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.25 } },
  };
  const rise = {
    hidden:  { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
  };
  const fadeIn = {
    hidden:  { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1.2 } },
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col overflow-hidden"
      style={{ backgroundColor: bg, color: fg, fontFamily: font }}
    >
      {/* NOISE TEXTURE */}
      <div
        className="absolute inset-0 pointer-events-none select-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          opacity: 0.035,
          mixBlendMode: "overlay",
        }}
      />

      {/* LARGE BG LETTERFORM */}
      <motion.div
        initial={{ opacity: 0, x: 120 }}
        animate={{ opacity: 0.03, x: 0 }}
        transition={{ duration: 2.5, ease: "easeOut" }}
        className="absolute right-0 top-0 bottom-0 flex items-center pointer-events-none select-none overflow-hidden"
        style={{ color: fg }}
      >
        <span
          className="font-black uppercase italic leading-none"
          style={{ fontSize: "52vw", letterSpacing: "-0.06em" }}
        >
          {firstName[0]}
        </span>
      </motion.div>

      {/* ACCENT GLOW */}
      <div
        className="absolute top-1/4 right-1/4 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${accent}18 0%, transparent 65%)`,
          filter: "blur(80px)",
        }}
      />

      <div className="relative z-10 flex-1 flex flex-col">
        {/* TOP META BAR */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="flex items-center justify-between px-8 md:px-14 pt-10 pb-0"
        >
          <div
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.35em]"
            style={{
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ backgroundColor: accent }}
            />
            Available for projects
          </div>

          <div
            className="hidden md:flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest"
            style={{ opacity: 0.35 }}
          >
            <MapPin size={11} />
            <EditableText
              value={data.location || "Worldwide · Remote"}
              onChange={(val) => setPortfolioData({ ...data, location: val })}
              readOnly={isReadOnly}
            />
          </div>
        </motion.div>

        {/* HERO GRID */}
        <div className="flex-1 grid lg:grid-cols-12 gap-0 items-center px-8 md:px-14 py-12 lg:py-0 min-h-[85vh]">
          {/* LEFT COLUMN */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 xl:col-span-6 space-y-8 order-2 lg:order-1 py-8"
          >
            <motion.div variants={rise} className="space-y-1 overflow-hidden">
              <h1
                className="font-black uppercase leading-[0.82] tracking-tighter"
                style={{ fontSize: "clamp(4rem, 9vw, 10rem)" }}
              >
                <span className="block">
                  <EditableText
                    value={firstName}
                    onChange={(val) => handleNameChange("first", val)}
                    readOnly={isReadOnly}
                  />
                </span>
                {lastName && (
                  <span className="block" style={{ WebkitTextStroke: `1.5px ${fg}`, color: "transparent" }}>
                    <EditableText
                      value={lastName}
                      onChange={(val) => handleNameChange("last", val)}
                      readOnly={isReadOnly}
                    />
                  </span>
                )}
              </h1>
            </motion.div>

            <motion.div variants={rise} className="flex items-center gap-5">
              <div
                className="w-12 h-[2px] rounded-full flex-shrink-0"
                style={{ backgroundColor: accent }}
              />
              <p
                className="text-xl md:text-2xl font-light tracking-tight italic"
                style={{ opacity: 0.7 }}
              >
                <EditableText
                  value={data.role || "Creative Developer & Designer"}
                  onChange={(val) => setPortfolioData({ ...data, role: val })}
                  readOnly={isReadOnly}
                />
              </p>
            </motion.div>

            <motion.div
              variants={rise}
              className="text-base md:text-lg font-light leading-relaxed max-w-lg"
              style={{ opacity: 0.5 }}
            >
              <EditableText
                value={data.bio || "Crafting high-fidelity digital experiences through intentional design and clean, purposeful code."}
                onChange={(val) => setPortfolioData({ ...data, bio: val })}
                readOnly={isReadOnly}
                multiline
              />
            </motion.div>

            <motion.div variants={rise} className="flex flex-wrap gap-4 pt-2">
              <a
                href="#projects"
                className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full font-bold text-[11px] uppercase tracking-[0.2em] transition-all duration-300 hover:-translate-y-0.5 active:scale-95 overflow-hidden"
                style={{ backgroundColor: fg, color: bg }}
              >
                <span className="relative z-10">Explore Work</span>
                <ExternalLink
                  size={14}
                  className="relative z-10 transition-transform duration-500 group-hover:rotate-45"
                />
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: `linear-gradient(135deg, ${accent}, ${fg})` }}
                />
              </a>

              {data.cvLink && (
                <a
                  href={data.cvLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-bold text-[11px] uppercase tracking-[0.2em] transition-all duration-300 hover:-translate-y-0.5 active:scale-95 backdrop-blur-sm"
                  style={{
                    border: `1px solid ${fg}25`,
                    color: fg,
                    background: `${fg}06`,
                  }}
                >
                  Resume <FileText size={14} style={{ opacity: 0.5 }} />
                </a>
              )}
            </motion.div>
            
            {/* STATS ROW REMOVED */}
          </motion.div>

          {/* RIGHT COLUMN: PORTRAIT */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            className="lg:col-span-5 xl:col-span-6 order-1 lg:order-2 flex justify-center lg:justify-end items-center py-8 lg:py-0"
          >
            <div className="relative group">
              {/* DECORATIVE RINGS */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-6 rounded-[2.5rem] border border-dashed pointer-events-none"
                style={{ borderColor: `${fg}10` }}
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-12 rounded-[3rem] border pointer-events-none"
                style={{ borderColor: `${accent}15` }}
              />

              <div
                className="absolute -bottom-4 -right-4 w-full h-full rounded-[2.5rem] -z-10"
                style={{ background: `linear-gradient(135deg, ${accent}30, transparent)` }}
              />

              <div
                className="relative w-64 h-80 sm:w-80 sm:h-[420px] md:w-[360px] md:h-[480px] rounded-[2.5rem] overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.6)]"
                style={{ border: `1px solid ${fg}12` }}
              >
                <EditableImage
                  src={data?.image || DEFAULT_AVATAR}
                  fallbackSrc={DEFAULT_AVATAR}
                  onImageUpload={(url) => setPortfolioData({ ...data, image: url })}
                  isReadOnly={isReadOnly}
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />

                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `linear-gradient(180deg, transparent 50%, ${bg}cc 100%)`,
                  }}
                />

                <div
                  className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-5 px-6 py-3 rounded-full backdrop-blur-2xl transition-all duration-500 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
                  style={{
                    background: `${bg}80`,
                    border: `1px solid ${fg}18`,
                  }}
                >
                  {data?.linkedin && (
                    <a href={data.linkedin} target="_blank" rel="noreferrer" className="hover:scale-125 transition-transform duration-200">
                      <img src={linkedinLogo} className="w-5 h-5" style={{ filter: "invert(1)" }} alt="LinkedIn" />
                    </a>
                  )}
                  <div className="w-px h-4" style={{ background: `${fg}25` }} />
                  {data?.github && (
                    <a href={data.github} target="_blank" rel="noreferrer" className="hover:scale-125 transition-transform duration-200">
                      <img src={githubLogo} className="w-5 h-5" style={{ filter: "invert(1)" }} alt="GitHub" />
                    </a>
                  )}
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
                className="absolute -left-6 top-1/3 flex items-center gap-2.5 px-4 py-2.5 rounded-xl backdrop-blur-2xl shadow-xl"
                style={{
                  background: `${bg}cc`,
                  border: `1px solid ${fg}18`,
                }}
              >
                <span className="text-[9px] font-black uppercase tracking-widest whitespace-nowrap" style={{ opacity: 0.8 }}>
                  Open to work
                </span>
              </motion.div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.35 }}
          transition={{ delay: 2, duration: 1 }}
          className="hidden md:flex items-center justify-center gap-3 pb-10"
        >
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
            <ArrowDown size={16} strokeWidth={1.5} />
          </motion.div>
          <span className="text-[9px] font-bold uppercase tracking-[0.5em]">Scroll to explore</span>
        </motion.div>
      </div>
    </section>
  );
};

export default Home;