import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { 
  ArrowRight, Code, Cpu, Palette, Rocket, Crown, CheckCircle2, Globe 
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

// Components (Assuming these exist based on your code)
import BentoItem from "./components/BentoItem";
import PricingCard from "./components/PricingCard";
import StudentDiscountPopup from "./components/StudentDiscountPopup";
import TemplateSelectionModal from "./components/TemplateSelectionModal";

const Pricing = () => {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  
  const [isTemplateModalOpen, setTemplateModalOpen] = useState(false);
  const [isStudentModalOpen, setStudentModalOpen] = useState(false);
  const [isStudent, setIsStudent] = useState(false);

  const { scrollY } = useScroll();
  // Parallax effect for the background blob
  const blobY = useTransform(scrollY, [0, 1000], [0, 400]);
  const textY = useTransform(scrollY, [0, 500], [0, 100]);
  const heroOpacity = useTransform(scrollY, [0, 700], [1, 0]);

  useEffect(() => {
    if (!isStudent && !user) { 
        const timer = setTimeout(() => setStudentModalOpen(true), 7000); 
        return () => clearTimeout(timer);
    }
  }, [isStudent, user]);

  const scrollToPricing = () => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });

  const getCheckoutUrl = (planType) => {
      const baseUrl = `/checkout/${planType}`;
      return isStudent ? `${baseUrl}?discount=student` : baseUrl;
  };

  const isPlanActive = (planName) => user && user.plan === planName;

  const handlePlusClick = () => {
      if (isPlanActive('plus') || isPlanActive('max')) return;
      setTemplateModalOpen(true);
  };
  
  const handleModalConfirm = () => { 
      setTemplateModalOpen(false); 
      navigate(getCheckoutUrl('plus')); 
  };

  const handleMaxClick = () => {
      if (isPlanActive('max')) return;
      navigate(getCheckoutUrl('max'));
  };

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white overflow-x-hidden selection:bg-violet-500/30 font-sans">
      
      <TemplateSelectionModal isOpen={isTemplateModalOpen} onClose={() => setTemplateModalOpen(false)} onConfirm={handleModalConfirm} />
      <StudentDiscountPopup isOpen={isStudentModalOpen} onClose={() => setStudentModalOpen(false)} onVerifySuccess={setIsStudent} />

      {/* =========================================
          HERO SECTION (Refined for Mobile & Style)
      ========================================= */}
      <motion.section 
        style={{ opacity: heroOpacity }}
        className="relative min-h-[115dvh] flex flex-col justify-between pt-32 pb-12 px-6 md:px-12 lg:px-24 bg-[#F2F2F2] text-black rounded-b-[3rem] md:rounded-b-[5rem] overflow-hidden z-20"
      >
         {/* THE BLURRY BLOB (Replicating Image 1) */}
         <motion.div 
            style={{ y: blobY }}
            className="absolute top-[-10%] right-[-20%] md:right-[-5%] w-[120vw] md:w-[60vw] h-[120vw] md:h-[60vw] bg-gradient-to-b from-[#A78BFA] to-[#C4B5FD] rounded-full blur-[80px] md:blur-[120px] opacity-50 mix-blend-multiply pointer-events-none"
         />
         
         {/* GRID DOTS ACCENT (Replicating Image 2) */}
         <div className="absolute top-12 left-6 md:left-12 opacity-40 hidden md:block">
            <div className="grid grid-cols-2 gap-1">
                {[...Array(4)].map((_, i) => <div key={i} className="w-1 h-1 bg-black rounded-full" />)}
            </div>
         </div>

         {/* Sticky Student Badge */}
         <motion.div 
            initial={{ y: -100, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            transition={{ delay: 0.5 }}
            onClick={() => !isStudent && setStudentModalOpen(true)}
            className="absolute top-30 left-0 w-full z-50 flex justify-center md:top-30"
         >
             <div className={`px-5 py-2 rounded-full backdrop-blur-md cursor-pointer transition-all border shadow-sm
                ${isStudent ? 'bg-green-100/90 border-green-200 text-green-800' : 'bg-white/40 border-white/50 hover:bg-white text-neutral-600'}`}>
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                   {isStudent ? <CheckCircle2 size={12}/> : null}
                   {isStudent ? "Student Discount Active" : "Student? Click for 70% Off"}
                </span>
             </div>
         </motion.div>

         {/* HERO CONTENT */}
         <div className="relative z-10 pt-15 w-full max-w-[95rem] mx-auto h-full flex flex-col justify-center">
            
            {/* BIG HEADLINE */}
            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="mb-8 md:mb-12 mt-10 md:mt-0"
            >
                <h1 className="text-[16vw] md:text-[8rem] lg:text-[8rem] font-semibold tracking-[-0.06em] leading-[0.9] text-black text-balance">
                  Work is Our <br />
                  <span className="text-neutral-400">Priority.</span>
                </h1>
            </motion.div>

            {/* DESCRIPTION & BUTTONS */}
            <div className="flex flex-col xl:flex-row items-start xl:items-end justify-between gap-8 md:gap-12 w-full">
                <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-lg md:text-sm font-medium leading-relaxed text-neutral-700 max-w-lg tracking-tight"
                >
                   We help developers and agencies create User Experiences and React Applications that not only stand out but also drive meaningful impact.
                </motion.p>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto"
                >
                    <button 
                        onClick={scrollToPricing}
                        className="group relative overflow-hidden px-8 py-4 bg-black text-white rounded-full font-medium text-lg transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3"
                    >
                        <span>View Plans</span>
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform"/>
                    </button>
                    
                    <button 
                        onClick={() => navigate('/studio')}
                        className="px-8 py-4 bg-transparent border border-neutral-300 text-black rounded-full font-medium text-lg hover:bg-white hover:shadow-lg transition-all text-center"
                    >
                        Agency Services
                    </button>
                </motion.div>
            </div>
         </div>

{/* BOTTOM LOCATION */}
         <div className="md:block absolute bottom-30 sm:bottom-10 left-1/2 -translate-x-1/2 text-center">
            <h4 className="font-bold text-xs uppercase tracking-widest mb-1 text-neutral-900">FolioFYX Studio</h4>
            <p className="text-[10px] font-medium text-neutral-500">Based in India • Global Reach</p>
         </div>
      </motion.section>

      {/* =========================================
          DARK CONTENT WRAPPER
      ========================================= */}
      <div className="bg-[#0a0a0a] relative z-10 pt-12 md:pt-24 -mt-12">
          
          {/* NEW SECTION: "Why Pay?" (Based on Image 2 and User Request) */}
          <section className="py-24 px-6 md:px-12 lg:px-24 border-b border-white/5">
             <div className="max-w-[90rem] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                
                {/* Left: The "Why" Header */}
                <div>
                    <div className="text-violet-400 text-6xl md:text-8xl mb-6">
                        <span className="block w-4 h-4 bg-violet-500 rounded-sm mb-4"></span>
                    </div>
                    <h2 className="text-4xl md:text-6xl lg:text-7xl font-medium tracking-tighter text-white leading-[1.1]">
                        Your journey <br />
                        is short because <br />
                        <span className="text-neutral-500">ours was long.</span>
                    </h2>
                </div>

                {/* Right: The Explanation */}
                <div className="lg:pt-24">
                    <p className="text-xl md:text-2xl text-neutral-300 leading-relaxed font-light mb-8">
                        The money you spend here isn't an expense—it's an investment in your most valuable asset: <span className="text-white font-semibold">Time.</span>
                    </p>
                    <p className="text-lg md:text-xl text-neutral-400 leading-relaxed mb-8">
                        We aren't just selling templates; we are saving you the hundreds of hours it takes to design, code, and optimize a high-performance React portfolio. 
                    </p>
                    
                    <div className="grid gap-6 md:grid-cols-2">
                         <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                            <Rocket className="text-violet-400 mb-4" size={28} />
                            <h3 className="text-white font-semibold mb-2">Deploy Instantly</h3>
                            <p className="text-sm text-neutral-400">Get a live link to send to recruiters, friends, and LinkedIn immediately. No configuration hell.</p>
                         </div>
                         <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                            <Globe className="text-violet-400 mb-4" size={28} />
                            <h3 className="text-white font-semibold mb-2">World Class Performance</h3>
                            <p className="text-sm text-neutral-400">Smooth animations and clean code that shows you understand modern web standards.</p>
                         </div>
                    </div>
                    
                    <div className="mt-8 pt-8 border-t border-white/10">
                        <p className="text-sm font-mono text-neutral-500 uppercase tracking-widest">
                            The world is digital. Change accordingly.
                        </p>
                    </div>
                </div>
             </div>
          </section>

          {/* BENTO GRID */}
          <section className="py-24 px-6 lg:px-12">
            <div className="max-w-[90rem] mx-auto">
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className="mb-20"
              >
                 <h2 className="text-5xl md:text-8xl font-medium tracking-[-0.04em] leading-[0.9] text-white">
                   Blazing fast brand <br />
                   <span className="text-neutral-600">sprints for startups</span>
                 </h2>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-6 h-auto md:h-[700px]">
                <BentoItem colSpan="md:col-span-2" rowSpan="md:row-span-2" title="Clean Architecture" sub="Pure performance React code." icon={Code} tags={["React", "Next.js"]}>
                   <div className="w-full h-full min-h-[200px] bg-neutral-900/50 rounded-xl border border-white/5 flex items-center justify-center group relative overflow-hidden">
                      <div className="absolute inset-0 bg-violet-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <span className="font-mono text-violet-400/50 text-sm">&lt;Performance /&gt;</span>
                   </div>
                </BentoItem>
                <BentoItem title="Rapid Launch" sub="Zero to live." icon={Rocket} tags={["Vercel", "Docker"]} />
                <BentoItem title="Identity" sub="Studio branding." icon={Palette} tags={["Figma", "Tailwind"]} />
                <BentoItem colSpan="md:col-span-2" title="Scalable Strategy" sub="Systems designed to scale." icon={Cpu} tags={["Analytics", "Growth"]} />
              </div>
            </div>
          </section>

          {/* PRICING */}
          <section id="pricing" className="py-32 px-6 bg-gradient-to-b from-[#0a0a0a] to-black">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-20">
                    <h2 className="text-5xl md:text-7xl font-semibold tracking-tighter mb-6 text-white">Choose Your Loadout</h2>
                    <p className="text-neutral-400 text-lg">Simple pricing. No subscriptions. Just build.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center mb-24">
                    <PricingCard 
                        title="Free"
                        price="0"
                        variant="free"
                        isStudent={isStudent}
                        description="Basic portfolio for everyone."
                        buttonText={user ? (user.plan === 'free' ? "Current Plan" : "Basic Tier") : "Get Started"}
                        onButtonClick={user ? null : () => navigate('/auth/signup')}
                        features={["1 Basic Template", "Public Link", "- Remove Branding", "- Premium Templates"]}
                    />
                    <PricingCard 
                        title="Plus"
                        price={isStudent ? "29" : "99"}
                        standardPrice={isStudent ? "99" : null}
                        variant="plus"
                        isStudent={isStudent}
                        description="The smart choice to get hired."
                        period="/ 3 months"
                        buttonText={isPlanActive('plus') ? "Current Active Plan" : isPlanActive('max') ? "Included in Max" : (isStudent ? "Claim Student Offer" : "Select Plus")}
                        onButtonClick={(isPlanActive('plus') || isPlanActive('max')) ? null : handlePlusClick}
                        features={["Unlock ANY 2 Templates", "Remove Branding", "Basic Customization", "3 Months Access", "- AI Assistant"]}
                        className="scale-105 z-10 shadow-2xl shadow-violet-900/20 border-violet-500"
                    />
                    <PricingCard 
                        title="Max"
                        price={isStudent ? "59" : "159"}
                        standardPrice={isStudent ? "159" : null}
                        variant="pro"
                        isStudent={isStudent}
                        description="Full access to the ecosystem."
                        period="/ 6 months"
                        buttonText={isPlanActive('max') ? "Current Active Plan" : (isStudent ? "Claim Max Pass" : "Get Max Pass")}
                        onButtonClick={isPlanActive('max') ? null : handleMaxClick}
                        features={["All Premium Templates", "Future Templates Included", "Remove Branding", "AI Chatbot Assistant", "6 Months Access"]}
                        className="border-yellow-500/50"
                    />
                </div>

                {/* AGENCY BANNER */}
                <div className="rounded-3xl p-[1px] bg-gradient-to-r from-neutral-800 via-neutral-700 to-neutral-800">
                    <div className="rounded-[1.4rem] p-8 md:p-12 bg-[#050505] flex flex-col lg:flex-row items-center justify-between gap-12 overflow-hidden relative">
                         {/* Background Glow */}
                         <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-white/5 blur-[100px] rounded-full pointer-events-none" />

                         <div className="text-center lg:text-left relative z-10">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-[10px] font-bold uppercase tracking-widest mb-4 border border-white/5">
                                <Crown size={12} /> Agency Service
                            </div>
                            <h3 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">Gold Studio.</h3>
                            <p className="text-neutral-400 max-w-md text-lg">Fully custom React applications designed by experts.</p>
                         </div>
                         <div className="bg-white text-black px-10 py-8 rounded-2xl min-w-[280px] text-center relative z-10 shadow-xl">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-2">Starting At</p>
                            <div className="text-5xl font-bold mb-6 tracking-tighter">₹1,999</div>
                            <button onClick={() => navigate('/studio')} className="w-full py-3 bg-black text-white rounded-xl font-bold text-sm hover:scale-105 transition-transform">
                                Book Consultation
                            </button>
                         </div>
                    </div>
                </div>
            </div>
          </section>
      </div>
    </div>
  );
};

export default Pricing;