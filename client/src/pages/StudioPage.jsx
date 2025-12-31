import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  motion, 
  useScroll, 
  useTransform, 
  useInView,
  useMotionValue, 
  useMotionTemplate,
  useSpring,
  useVelocity,
  useAnimationFrame
} from "framer-motion";
import { 
  Check, 
  ArrowRight, 
  Crown, 
  Sparkles, 
  Gem, 
  Star, 
  ShieldCheck,
  Zap,
  FileText,
  Clock,
  Briefcase,
  CreditCard
} from "lucide-react";

// === LUXURY GOLD CONSTANTS ===
const GOLD_TEXT_GRADIENT = "bg-[linear-gradient(to_right,#BF953F,#FCF6BA,#B38728,#FBF5B7,#AA771C)]";
const GOLD_BUTTON_GRADIENT = "bg-[linear-gradient(to_bottom,#BF953F,#AA771C)]";

// === UTILS ===
const wrap = (min, max, v) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

// === 0. ATMOSPHERIC EFFECTS ===

const FloatingParticles = () => {
  const particles = Array.from({ length: 20 });
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            x: Math.random() * window.innerWidth, 
            y: Math.random() * window.innerHeight, 
            opacity: 0 
          }}
          animate={{ 
            y: [null, Math.random() * -100],
            opacity: [0, 0.5, 0] 
          }}
          transition={{ 
            duration: Math.random() * 10 + 10, 
            repeat: Infinity, 
            ease: "linear",
            delay: Math.random() * 5
          }}
          className="absolute w-1 h-1 bg-[#D4AF37] rounded-full blur-[1px]"
        />
      ))}
    </div>
  );
};

const FilmGrain = () => (
  <div className="fixed inset-0 pointer-events-none opacity-[0.05] z-50 mix-blend-overlay"
       style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
  </div>
);

// === 1. PARALLAX VELOCITY TEXT COMPONENT ===
function ParallaxText({ children, baseVelocity = 100 }) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false
  });

  const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`);

  const directionFactor = useRef(1);
  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);
    
    // Change direction based on scroll direction
    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get();
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className="parallax overflow-hidden m-0 whitespace-nowrap flex flex-nowrap">
      <motion.div className="scroller font-bold uppercase text-4xl md:text-7xl flex whitespace-nowrap flex-nowrap" style={{ x }}>
        <span className="block mr-12 text-[#4a4a4a] opacity-60 hover:text-[#D4AF37] transition-colors duration-500">{children} </span>
        <span className="block mr-12 text-[#4a4a4a] opacity-60 hover:text-[#D4AF37] transition-colors duration-500">{children} </span>
        <span className="block mr-12 text-[#4a4a4a] opacity-60 hover:text-[#D4AF37] transition-colors duration-500">{children} </span>
        <span className="block mr-12 text-[#4a4a4a] opacity-60 hover:text-[#D4AF37] transition-colors duration-500">{children} </span>
      </motion.div>
    </div>
  );
}

// === 2. 3D TILT CARD COMPONENT ===
const GoldPricingCard = ({ title, price, subtitle, features, tier }) => {
  const navigate = useNavigate();
  const isStandard = tier === "standard";
  
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const xSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const ySpring = useSpring(y, { stiffness: 300, damping: 30 });
  
  const rotateX = useTransform(ySpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(xSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={`relative group perspective-1000 ${isStandard ? 'md:-mt-8 md:mb-8 z-20' : 'z-10'}`}
    >
      <div className={`absolute inset-0 bg-[#D4AF37] blur-[60px] opacity-0 transition-opacity duration-500 group-hover:opacity-10 rounded-3xl ${isStandard ? 'opacity-5' : ''}`} />

      <div className={`relative p-[1px] rounded-3xl overflow-hidden h-full transform-style-3d transition-all duration-300 ${isStandard ? 'shadow-[0_0_50px_-10px_rgba(212,175,55,0.2)]' : ''}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/0 via-[#D4AF37]/40 to-[#D4AF37]/0 opacity-30 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="relative h-full bg-[#0a0a0a]/95 backdrop-blur-xl rounded-[23px] p-8 flex flex-col border border-[#D4AF37]/10">
          <div className="flex justify-between items-start mb-6">
             <div className={`p-3 rounded-xl bg-gradient-to-br from-[#1a160a] to-black border border-[#D4AF37]/30 shadow-inner shadow-[#D4AF37]/10`}>
                {tier === "basic" && <Star className="text-[#D4AF37]" size={24} />}
                {tier === "standard" && <Crown className="text-[#D4AF37]" size={24} />}
                {tier === "premium" && <Gem className="text-[#D4AF37]" size={24} />}
             </div>
             {isStandard && (
               <div className={`px-3 py-1 rounded-full border border-[#D4AF37]/50 bg-[#D4AF37]/10 text-[#D4AF37] text-[10px] font-bold uppercase tracking-widest animate-pulse`}>
                 Most Popular
               </div>
             )}
          </div>

          <div className="mb-8">
            <h3 className={`text-2xl font-bold uppercase tracking-widest mb-2 text-transparent bg-clip-text ${GOLD_TEXT_GRADIENT}`}>
              {title}
            </h3>
            <p className="text-neutral-500 text-sm mb-6 font-light">{subtitle}</p>
            
            <div className="flex items-baseline gap-1">
              <span className={`text-5xl font-bold text-transparent bg-clip-text ${GOLD_TEXT_GRADIENT}`}>
                ₹{price}
              </span>
              <span className="text-neutral-600 text-sm font-medium">/ one-time</span>
            </div>
          </div>

          <div className="w-full h-px bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent mb-8"></div>

          <ul className="space-y-4 mb-8 flex-1">
            {features.map((feat, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-[#e0d0b0]/80 group-hover:text-[#e0d0b0] transition-colors">
                <div className="mt-0.5 min-w-[16px]">
                  <Check size={14} className="text-[#D4AF37]" />
                </div>
                {feat}
              </li>
            ))}
          </ul>

          <button 
            onClick={() => navigate('/contact')}
            className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest transition-all duration-300 border border-[#D4AF37]/50 relative overflow-hidden group/btn translate-z-10
            ${isStandard 
              ? `${GOLD_BUTTON_GRADIENT} text-[#2a200a] shadow-[0_5px_20px_-5px_rgba(212,175,55,0.4)] hover:shadow-[0_10px_30px_-5px_rgba(212,175,55,0.6)]` 
              : "bg-transparent text-[#D4AF37] hover:bg-[#D4AF37]/10"
            }`}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              Select Plan <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
            </span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// === 3. STICKY SCROLL ITEM ===
const StickyItem = ({ title, text, index }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { margin: "-50% 0px -50% 0px" });
  
    return (
      <motion.div 
        ref={ref} 
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: index * 0.1 }}
        className="min-h-[60vh] flex flex-col justify-center py-20 border-b border-[#D4AF37]/10 last:border-0 group"
      >
        <motion.h3 
          className="text-4xl md:text-6xl font-bold mb-6 transition-all duration-500 origin-left"
          animate={{ 
            color: isInView ? "#D4AF37" : "#333333",
            opacity: isInView ? 1 : 0.3,
            scale: isInView ? 1 : 0.95
          }}
        >
          {title}
        </motion.h3>
        <motion.p 
          className="text-xl md:text-2xl max-w-xl transition-colors duration-500 leading-relaxed font-light"
          animate={{ color: isInView ? "#E5E5E5" : "#444444" }}
        >
          {text}
        </motion.p>
      </motion.div>
    );
};

// === 4. TERMS AND CONDITIONS COMPONENT ===
const TermsAndConditions = () => {
    return (
        <section className="relative z-20 py-20 px-6 max-w-5xl mx-auto border-t border-[#D4AF37]/10">
            <div className="text-center mb-12">
                <h3 className="text-2xl md:text-3xl font-bold text-[#D4AF37] mb-4 uppercase tracking-widest">
                    Terms & Conditions
                </h3>
                <p className="text-neutral-500 text-sm">For Gold Studio Plans</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Section 1 */}
                <div className="p-8 rounded-2xl bg-[#0a0a0a] border border-[#D4AF37]/20 hover:border-[#D4AF37]/40 transition-colors duration-300">
                    <div className="flex items-center gap-3 mb-4 text-[#D4AF37]">
                        <Clock size={20} />
                        <h4 className="font-bold uppercase tracking-wider text-sm">1. Development Timeline</h4>
                    </div>
                    <ul className="space-y-3 text-neutral-400 text-sm font-light leading-relaxed list-disc pl-4">
                        <li><strong className="text-neutral-300">Dedicated Sprint:</strong> Includes a 2-Week Dedicated Development Sprint for architecture, UI, and backend integration.</li>
                        <li><strong className="text-neutral-300">Scope Creep:</strong> Features outside the initial agreement or extending beyond 2 weeks are subject to review and extra billing.</li>
                    </ul>
                </div>

                {/* Section 2 */}
                <div className="p-8 rounded-2xl bg-[#0a0a0a] border border-[#D4AF37]/20 hover:border-[#D4AF37]/40 transition-colors duration-300">
                    <div className="flex items-center gap-3 mb-4 text-[#D4AF37]">
                        <ShieldCheck size={20} />
                        <h4 className="font-bold uppercase tracking-wider text-sm">2. Maintenance & Updates</h4>
                    </div>
                    <ul className="space-y-3 text-neutral-400 text-sm font-light leading-relaxed list-disc pl-4">
                        <li><strong className="text-neutral-300">Policy:</strong> Post-launch maintenance is determined subjectively based on complexity.</li>
                        <li><strong className="text-neutral-300">Standard vs. Complex:</strong> Simple text updates may be included. Functional changes (DB structure, new logic) require a separate AMC.</li>
                    </ul>
                </div>

                {/* Section 3 */}
                <div className="p-8 rounded-2xl bg-[#0a0a0a] border border-[#D4AF37]/20 hover:border-[#D4AF37]/40 transition-colors duration-300">
                    <div className="flex items-center gap-3 mb-4 text-[#D4AF37]">
                        <Briefcase size={20} />
                        <h4 className="font-bold uppercase tracking-wider text-sm">3. Client Collaboration</h4>
                    </div>
                    <p className="text-neutral-400 text-sm font-light leading-relaxed">
                        The client must provide all assets (images, text, credentials) <strong className="text-neutral-300">prior</strong> to the start of the 2-week sprint. Delays in providing assets will not pause the 2-week resource allocation window.
                    </p>
                </div>

                {/* Section 4 */}
                <div className="p-8 rounded-2xl bg-[#0a0a0a] border border-[#D4AF37]/20 hover:border-[#D4AF37]/40 transition-colors duration-300">
                    <div className="flex items-center gap-3 mb-4 text-[#D4AF37]">
                        <CreditCard size={20} />
                        <h4 className="font-bold uppercase tracking-wider text-sm">4. Payment Structure</h4>
                    </div>
                    <ul className="space-y-3 text-neutral-400 text-sm font-light leading-relaxed list-disc pl-4">
                        <li><strong className="text-neutral-300">50% Non-refundable Deposit:</strong> Required to book the developer slots.</li>
                        <li><strong className="text-neutral-300">Balance:</strong> Due upon project deployment or at the end of the 2-week sprint, whichever comes first.</li>
                    </ul>
                </div>
            </div>
        </section>
    );
};

// === MAIN PAGE ===
const GoldStudioPage = () => {
  const navigate = useNavigate();
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: targetRef });
  
  // Mouse Spotlight Logic
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const handleMouseMove = ({ clientX, clientY, currentTarget }) => {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  };
  const maskImage = useMotionTemplate`radial-gradient(600px circle at ${mouseX}px ${mouseY}px, black, transparent)`;

  // Scroll Animations
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9]);
  const heroBlur = useTransform(scrollYProgress, [0, 0.2], [0, 10]);

  // Function to scroll to pricing
  const scrollToPricing = () => {
    const element = document.getElementById('pricing-section');
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div 
      className="relative min-h-screen bg-[#050505] pt-15 text-white selection:bg-[#D4AF37] selection:text-black overflow-x-hidden font-sans"
      onMouseMove={handleMouseMove}
    >
      <FilmGrain />
      <FloatingParticles />
      
      {/* Dynamic Background Mesh */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1a1200] via-[#050505] to-[#000000] opacity-80 pointer-events-none"></div>
      
      {/* Interactive Spotlight Effect */}
      <motion.div 
        className="fixed inset-0 pointer-events-none bg-[#D4AF37]/10 z-10 mix-blend-soft-light"
        style={{ maskImage, WebkitMaskImage: maskImage }}
      />

      {/* 1. HERO SECTION */}
      <section className="relative h-screen flex flex-col justify-center px-6 border-b border-[#D4AF37]/10 overflow-hidden">
         <motion.div 
           style={{ opacity: heroOpacity, scale: heroScale, filter: `blur(${heroBlur}px)` }}
           className="relative z-20 max-w-7xl mx-auto w-full"
         >
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              className="flex items-center gap-4 mb-8"
            >
                <div className="w-12 h-[1px] bg-[#D4AF37]"></div>
                <div className="inline-flex items-center gap-2 text-[#D4AF37] font-bold tracking-[0.3em] uppercase text-xs md:text-sm">
                   <Crown size={14} /> The Gold Collection
                </div>
            </motion.div>

            <h1 className="text-6xl md:text-[8rem] font-bold leading-[0.9] tracking-tighter text-white mb-12">
              <span className="block overflow-hidden">
                <motion.span 
                  initial={{ y: "100%" }} 
                  animate={{ y: 0 }} 
                  transition={{ duration: 0.8, ease: "circOut" }}
                  className="block"
                >
                  BUILDING
                </motion.span>
              </span>
              <span className="block overflow-hidden relative">
                <motion.span 
                  initial={{ y: "100%" }} 
                  animate={{ y: 0 }} 
                  transition={{ duration: 0.8, delay: 0.2, ease: "circOut" }}
                  className={`block text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#FFF] to-[#D4AF37] bg-[200%_auto] animate-shine`}
                  style={{ backgroundSize: "200% auto" }}
                >
                   AT SCALE.
                </motion.span>
              </span>
            </h1>

            <div className="flex flex-col md:flex-row gap-12 md:items-end justify-between">
                <div className="flex flex-col gap-8">
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="max-w-xl text-xl text-neutral-400 leading-relaxed font-light"
                  >
                    The enterprise solution for agencies and brands demanding uniqueness. 
                    No templates. Pure engineering.
                  </motion.p>

                  <motion.button 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.4, duration: 0.8 }}
                    onClick={scrollToPricing}
                    className="group flex items-center gap-4 w-fit px-8 py-4 bg-transparent border border-[#D4AF37]/50 rounded-full hover:bg-[#D4AF37]/10 transition-all duration-300"
                  >
                    <span className="text-[#D4AF37] font-bold tracking-widest uppercase text-sm">View Gold Plans</span>
                    <div className="w-8 h-8 rounded-full bg-[#D4AF37] flex items-center justify-center text-black group-hover:scale-110 transition-transform">
                      <ArrowRight size={14} className="group-hover:rotate-90 transition-transform duration-300" />
                    </div>
                  </motion.button>
                </div>

                <motion.div 
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 1.2, type: "spring" }}
                  className="hidden md:block absolute sm:bottom-0 left-1/2 -translate-x-1/2 z-20 animate-bounce"
                >
                    <div 
                      className="w-16 h-16 rounded-full border border-[#D4AF37]/30 flex items-center justify-center backdrop-blur-sm cursor-pointer hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors" 
                      onClick={scrollToPricing}
                    >
                        <ArrowRight className="rotate-90 text-[#D4AF37]" size={24} />
                    </div>
                </motion.div>
            </div>
         </motion.div>
      </section>

      {/* 2. VELOCITY TEXT */}
      <section className="py-20 border-y border-white/10 bg-neutral-900/30 backdrop-blur-sm overflow-hidden z-20 relative">
        <ParallaxText baseVelocity={-5}>PRODUCTIVITY • PERFORMANCE • SPEED •</ParallaxText>
        <ParallaxText baseVelocity={5}>DESIGN • STRATEGY • RESULTS •</ParallaxText>
      </section>

      {/* 3. STICKY SCROLL PROPOSITION */}
      <section className="relative z-20 mt-12" ref={targetRef}>
        <div className="flex flex-col md:flex-row">
            {/* Sticky Left Title */}
            <div className="hidden md:flex w-1/3 h-screen sticky top-0 items-center pl-12 lg:pl-24 border-r border-[#D4AF37]/10 bg-gradient-to-b from-[#050505] to-transparent">
                <h2 className="text-sm font-bold tracking-[0.5em] uppercase text-[#D4AF37] rotate-180 opacity-60" style={{ writingMode: 'vertical-rl' }}>
                    The FolioFYX Gold
                </h2>
            </div>

            {/* Scrolling Right Content */}
            <div className="w-full md:w-2/3 px-6 md:px-24">
                <StickyItem 
                   index={0}
                   title="Bespoke Design" 
                   text="We do not use pre-made kits. Every pixel is placed with intent to match your brand's specific identity." 
                />
                <StickyItem 
                   index={1}
                   title="React Performance" 
                   text="Built on Next.js for instant page loads and superior SEO ranking that standard builders cannot match." 
                />
                <StickyItem 
                   index={2}
                   title="Scalable Architecture" 
                   text="Codebases designed to grow with your business. Add features, pages, and integrations without breaking the core." 
                />
            </div>
        </div>
      </section>

      <div id="pricing-section" className="relative z-20 max-w-7xl mx-auto px-6 py-32">
        
        {/* === HEADER FOR PRICING === */}
        <div className="text-center mb-24 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#D4AF37] opacity-10 blur-[100px] rounded-full pointer-events-none"></div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 border border-[#D4AF37]/30 bg-[#D4AF37]/5 rounded-full px-6 py-2 text-xs font-bold tracking-[0.3em] uppercase mb-8 backdrop-blur-md text-[#D4AF37]"
          >
            <Sparkles size={14} /> Pricing
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-7xl font-bold mb-6"
          >
              Choose Your <span className="text-[#D4AF37] relative inline-block">
                Gold.
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-[#D4AF37]" viewBox="0 0 100 10" preserveAspectRatio="none">
                   <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="2" fill="none" />
                </svg>
              </span>
          </motion.h2>
          <p className="max-w-2xl mx-auto text-[#bfb39b] text-lg leading-relaxed font-light">
              Transparent pricing for premium craftsmanship. No hidden fees.
          </p>
        </div>

        {/* === PRICING TIERS === */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center mb-40 perspective-1000">
          
          {/* 1. GOLD BASIC */}
          <GoldPricingCard 
            tier="basic"
            title="Gold Basic"
            price="2,999"
            subtitle="The essential foundation."
            features={[
              "Single Page Custom Application",
              "Basic UI/UX Design",
              "SEO Optimization",
              "1 Month Maintenance",
              "Same Day Support",
              "One Year Free Domain"
            ]}
          />

          {/* 2. GOLD STANDARD */}
          <GoldPricingCard 
            tier="standard"
            title="Gold Standard"
            price="5,999"
            subtitle="The growth engine."
            features={[
              "3-5 Custom Pages",
              "Premium UI/UX Design",
              "SEO Optimization",
              "1 Month Maintenance",
              "Same Day Support"
            ]}
          />

          {/* 3. GOLD PREMIUM */}
          <GoldPricingCard 
            tier="premium"
            title="Gold Premium"
            price="10,999"
            subtitle="Enterprise grade domination."
            features={[
              "Unlimited Pages",
              "Complex 3D UI & Animations",
              "E-commerce Functionality",
              "SEO Optimization",
              "Lifetime Error Maintenance",
              "Same Day Support"
            ]}
          />

        </div>

        {/* === THE GOLD PROMISE === */}
        <div className="border-t border-[#D4AF37]/10 pt-24 relative overflow-hidden rounded-3xl bg-[#0a0a0a]">
           <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-50"></div>
           
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center p-12">
                {[
                  { icon: ShieldCheck, title: "Lifetime Code Guarantee", text: "Our code is bug-free. If it breaks, we fix it. Forever." },
                  { icon: Zap, title: "99/100 Performance", text: "We don't ship slow websites. Speed is our religion." },
                  { icon: Sparkles, title: "Unique Identity", text: "No templates used here. 100% hand-crafted." }
                ].map((item, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.2 }}
                    className="flex flex-col items-center group"
                  >
                      <div className="w-16 h-16 rounded-2xl bg-[#1a160a] border border-[#D4AF37]/20 flex items-center justify-center mb-6 shadow-[0_0_20px_-5px_rgba(212,175,55,0.1)] group-hover:border-[#D4AF37] group-hover:shadow-[0_0_30px_-5px_rgba(212,175,55,0.4)] transition-all duration-300">
                          <item.icon size={32} className="text-[#D4AF37]" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                      <p className="text-neutral-500 text-sm font-light">{item.text}</p>
                  </motion.div>
                ))}
            </div>
        </div>

      </div>

      {/* === 4. TERMS AND CONDITIONS SECTION === */}
      <TermsAndConditions />
      
      {/* Footer Simple */}
      <footer className="border-t border-[#D4AF37]/10 py-12 text-center text-neutral-600 text-xs uppercase tracking-widest">
         <p>© 2025 FolioFYX Gold Studio. All rights reserved.</p>
      </footer>

      {/* CSS Animation for Text Shimmer */}
      <style>{`
        @keyframes shine {
          to {
            background-position: 200% center;
          }
        }
        .animate-shine {
          animation: shine 4s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default GoldStudioPage;