import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { 
    ArrowDown, Zap, Crown, Star, Sparkles, Lock, CheckCircle2, ArrowRight, 
    Briefcase, Code, Rocket, Palette, Loader2 
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import StudentDiscountPopup from "./components/StudentDiscountPopup";
import BentoItem from "./components/BentoItem";
import Footer from "../components/Footer";

const Pricing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isUnlockModalOpen, setUnlockModalOpen] = useState(false);
  const { scrollY } = useScroll();
  
  const passSectionRef = useRef(null);

  // Parallax
  const heroOpacity = useTransform(scrollY, [0, 600], [1, 0]);
  const yParallax = useTransform(scrollY, [0, 1000], [0, 300]);

  const scrollToDeal = () => {
    passSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleUnlockClick = (forceOpen = false) => {
    if (!forceOpen && user?.plan === 'max') {
        navigate('/dashboard');
    } else {
        setUnlockModalOpen(true);
    }
  };

  // Determine User Status for UI
  const isPro = user?.plan === 'max';
  const planName = isPro ? "Max Tier Active" : "Free Tier";
  const progressWidth = isPro ? "100%" : "5%";
  const progressColor = isPro ? "bg-gradient-to-r from-green-400 to-emerald-500" : "bg-neutral-800";

  return (
    <div className="bg-[#050505] min-h-screen text-white font-sans selection:bg-purple-500/30 overflow-x-hidden">
      
      <StudentDiscountPopup isOpen={isUnlockModalOpen} onClose={() => setUnlockModalOpen(false)} />

      {/* HERO SECTION */}
      <motion.section 
        style={{ opacity: heroOpacity }}
        className="relative min-h-[90vh] flex flex-col justify-center items-center px-6 pt-32 pb-20 text-center z-10"
      >
        <motion.div style={{ y: yParallax }} className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] md:w-[800px] md:h-[800px] bg-gradient-to-b from-purple-900/20 via-blue-900/10 to-transparent rounded-full blur-[120px] pointer-events-none" />

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 hover:bg-white/10 transition-colors cursor-default">
            <Sparkles size={14} className="text-yellow-400" />
            <span className="text-xs font-medium tracking-widest uppercase text-neutral-300">FolioFYX Studio</span>
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} className="text-6xl md:text-8xl lg:text-9xl font-semibold tracking-tighter leading-[0.9] text-white mb-8">
            Build Like <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/40">A Pro.</span>
        </motion.h1>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed mb-12 font-light">
            Unlock the <strong>Max Tier</strong> completely free. <br className="hidden md:block"/>
            Advanced animations, premium themes, and GitHub integration. <br/>
            <span className="text-white/80">Just verify your status.</span>
        </motion.p>

        <motion.button initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6 }} onClick={scrollToDeal} className="group relative px-10 py-5 bg-white text-black rounded-full font-bold text-lg hover:scale-105 active:scale-95 transition-all shadow-[0_0_50px_-10px_rgba(255,255,255,0.3)] flex items-center gap-3 overflow-hidden">
            <span className="relative z-10 flex items-center gap-2">
                Claim Deal <ArrowDown size={20} className="group-hover:translate-y-1 transition-transform"/>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
        </motion.button>
      </motion.section>

      {/* BENTO GRID */}
      <section className="py-24 px-6 md:px-12 lg:px-24 bg-[#0a0a0a] relative z-20 border-t border-white/5">
        <div className="max-w-[90rem] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-6 h-auto md:h-[800px]">
                <BentoItem colSpan="md:col-span-2" rowSpan="md:row-span-2" title="Recruiter Ready" sub="Recruiters spend 6 seconds scanning a resume. Our layouts are optimized to highlight your skills." icon={Briefcase} tags={["ATS Friendly", "Impactful"]}>
                    <div className="w-full h-full min-h-[200px] bg-neutral-900/50 flex items-center justify-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
                        <div className="w-3/4 h-3/4 bg-[#111] rounded-xl border border-white/10 p-6 shadow-2xl group-hover:scale-105 transition-transform duration-500">
                            <div className="flex gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-neutral-800 animate-pulse"></div>
                                <div className="space-y-2"><div className="w-32 h-2 bg-neutral-800 rounded"></div><div className="w-20 h-2 bg-neutral-800 rounded"></div></div>
                            </div>
                            <div className="w-full h-24 bg-neutral-800/50 rounded-lg mb-2"></div>
                        </div>
                    </div>
                </BentoItem>
                <BentoItem title="Clean Code" sub="Built on React & Tailwind." icon={Code} tags={["React", "Vite"]} />
                <BentoItem title="Rapid Launch" sub="Launch in 60 seconds." icon={Rocket} tags={["Instant", "No-Code"]} />
                <BentoItem colSpan="md:col-span-2" title="Premium Aesthetics" sub="Access our 'Grand Era' and 'Luxe' themes." icon={Palette} tags={["Dark Mode", "Glassmorphism"]}>
                     <div className="w-full h-full min-h-[150px] relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-blue-900/20 to-neutral-900/20 blur-xl"></div>
                        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-[#0a0a0a] to-transparent"></div>
                     </div>
                </BentoItem>
            </div>
        </div>
      </section>

      {/* ================= PRO PASS CARD (Real-Time Status) ================= */}
      <section ref={passSectionRef} className="relative z-20 bg-[#050505] py-24 md:py-32 border-t border-white/5 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                
                {/* Text Side */}
                <div className="space-y-12 order-2 lg:order-1">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-6 text-white">Your Career Investment.</h2>
                        <p className="text-lg text-neutral-400 leading-relaxed max-w-md">
                            Normally $159/year. For students and early career developers, we are waiving the fee entirely.
                        </p>
                    </div>
                    <div className="space-y-6">
                        <FeatureRow icon={Crown} title="Premium Themes" desc="Access 'Luxe', 'Grand Era' and 'Veloura' templates." />
                        <FeatureRow icon={Zap} title="Zero Watermarks" desc="Remove all FolioFYX branding from your site." />
                        <FeatureRow icon={Star} title="Priority Support" desc="Direct access to our design team for help." />
                    </div>
                </div>

                {/* Visual Side (The Digital Pass) */}
                <div className="relative order-1 lg:order-2 perspective-1000">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-purple-500/20 via-blue-500/10 to-transparent rounded-full blur-3xl opacity-50" />
                    
                    <motion.div 
                        initial={{ rotateY: 10, opacity: 0 }}
                        whileInView={{ rotateY: 0, opacity: 1 }}
                        transition={{ duration: 1, type: "spring" }}
                        className="relative bg-[#0F0F10] border border-white/10 rounded-[2.5rem] p-8 md:p-12 overflow-hidden shadow-2xl"
                    >
                        {/* Status Bar Top */}
                        <div className={`absolute top-0 left-0 right-0 h-1.5 ${isPro ? "bg-gradient-to-r from-green-400 to-emerald-500" : "bg-gradient-to-r from-purple-500 via-white to-blue-500 opacity-50"}`} />
                        
                        <div className="flex justify-between items-start mb-12">
                            <div>
                                <h3 className="text-3xl font-bold text-white tracking-tight">Pro Pass</h3>
                                <p className="text-neutral-500 text-sm mt-1 font-mono uppercase tracking-wider">Education License</p>
                            </div>
                            <div className={`w-14 h-14 rounded-full border border-white/10 flex items-center justify-center transition-colors ${isPro ? "bg-green-500/20 text-green-400" : "bg-white/5 text-white"}`}>
                                {isPro ? <CheckCircle2 size={28} /> : <Crown size={28} />}
                            </div>
                        </div>

                        {/* Real-Time Status Section */}
                        <div className="space-y-6 mb-12">
                            <div className="space-y-3">
                                <div className="flex justify-between text-xs font-mono text-neutral-500 uppercase tracking-widest">
                                    <span>Current Status</span>
                                    <span className={isPro ? "text-green-400 font-bold" : "text-white"}>{planName}</span>
                                </div>
                                {/* Progress Bar */}
                                <div className="h-3 w-full bg-neutral-800 rounded-full overflow-hidden border border-white/5 relative">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        whileInView={{ width: progressWidth }}
                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                        className={`h-full rounded-full ${isPro ? "bg-green-500" : "bg-purple-600"}`}
                                    />
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-3 text-sm text-neutral-300">
                                {isPro ? (
                                    <>
                                        <CheckCircle2 size={16} className="text-green-400" />
                                        <span>Verification Complete</span>
                                    </>
                                ) : (
                                    <>
                                        <Lock size={16} className="text-neutral-500" />
                                        <span>Verification Required to Unlock</span>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Action Area (Replaces Cost) */}
                        <div className="pt-8 border-t border-white/5">
                            {isPro ? (
                                <button 
                                    onClick={() => navigate('/dashboard')}
                                    className="w-full py-4 bg-[#1a1a1a] text-white border border-white/10 rounded-2xl font-bold text-sm hover:bg-[#222] transition-colors flex items-center justify-center gap-2"
                                >
                                    Go to Dashboard <ArrowRight size={16} />
                                </button>
                            ) : (
                                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                    <div>
                                        <div className="text-xs text-neutral-500 uppercase tracking-widest mb-1">Cost</div>
                                        <div className="text-4xl font-bold text-white tracking-tighter flex items-baseline gap-3">
                                            $0 
                                            <span className="text-lg font-normal text-neutral-600 line-through decoration-white/20">$159</span>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => handleUnlockClick(true)} 
                                        className="w-full md:w-auto px-8 py-4 bg-white text-black rounded-2xl font-bold text-sm hover:bg-neutral-200 transition-colors shadow-lg shadow-white/10 flex items-center justify-center gap-2"
                                    >
                                        Verify Deal <ArrowRight size={16} />
                                    </button>
                                </div>
                            )}
                        </div>

                    </motion.div>
                </div>
            </div>
        </div>
      </section>


      {/* ================= FOOTER BANNER ================= */}
      <section className="py-24 text-center border-t border-white/5 bg-[#080808]">
            <h2 className="text-[12vw] font-bold text-neutral-900/50 tracking-tighter leading-none select-none hover:text-neutral-800 transition-colors duration-500">
                FOLIOFYX
            </h2>
      </section>

      <Footer />
    </div>
  );
};

const FeatureRow = ({ icon: Icon, title, desc }) => (
    <div className="flex gap-5 items-start group">
        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center shrink-0 group-hover:bg-white/10 group-hover:border-white/20 transition-all">
            <Icon size={24} className="text-white group-hover:scale-110 transition-transform" />
        </div>
        <div>
            <h4 className="text-white font-medium text-lg mb-1">{title}</h4>
            <p className="text-neutral-500 text-sm leading-relaxed group-hover:text-neutral-400 transition-colors">{desc}</p>
        </div>
    </div>
);

export default Pricing;