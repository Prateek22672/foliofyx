import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Check, Loader2, Sparkles, GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const UpgradePopup = ({ isOpen, onClose, reason = "limit" }) => {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  
  const [step, setStep] = useState("intro"); // intro | verify | success
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [collegeName, setCollegeName] = useState("");

  // Swiss Typography Classes
  const fontHeading = "font-sans font-medium tracking-tight";
  const fontBody = "font-sans font-light text-neutral-400";

  // Content configuration based on trigger
  const content = {
    limit: {
      label: "LIMIT REACHED",
      title: "Expand your potential.",
      desc: "You have reached the project limit. Unlock unlimited space.",
    },
    premium_template: {
      label: "PREMIUM DESIGN",
      title: "Uncompromising style.",
      desc: "This template is reserved for Pro members.",
    },
    premium_feature: {
      label: "PRO FEATURE",
      title: "Refine your aesthetic.",
      desc: "Custom fonts and advanced colors are locked.",
    },
    ai_chatbot: {
      label: "AI INTELLIGENCE",
      title: "Smarter interactions.",
      desc: "Enable the AI assistant to guide your visitors.",
    }
  };

  const currentData = content[reason] || content.limit;

  // --- Logic: Verify Student Email ---
  const handleVerify = () => {
    setLoading(true);
    setError("");

    setTimeout(() => {
      const lowerEmail = email.toLowerCase();
      const validDomains = ['gitam', 'srm', 'vit', 'iit', 'nit', 'bits', 'edu', 'ac.in', 'college', 'university'];
      const domainPart = lowerEmail.split('@')[1] || "";
      
      if (validDomains.some(d => domainPart.includes(d)) && email.includes('@')) {
         let detected = domainPart.split('.')[0].toUpperCase();
         if(detected === 'AC') detected = "UNIVERSITY";
         setCollegeName(detected);
         handleActivateParams(); // Auto-proceed to activation
      } else {
         setLoading(false);
         setError("Institutional email required.");
      }
    }, 1200);
  };

  // --- Logic: Instant Activation (Mock Backend) ---
  const handleActivateParams = async () => {
      // Simulating Backend Activation
      try {
          const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
          const updatedUser = { 
              ...currentUser, 
              plan: "max", 
              isStudent: true,
              planExpiry: new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString() 
          };
          
          localStorage.setItem("user", JSON.stringify(updatedUser));
          
          if (refreshUser) await refreshUser();
          
          setLoading(false);
          setStep("success");

          // Auto-close after success
          setTimeout(() => {
              onClose();
          }, 2500);

      } catch (e) {
          console.error(e);
          setLoading(false);
      }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Minimal Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#000000]/80 backdrop-blur-sm z-[100]"
          />

          {/* Swiss Style Modal */}
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-[101] w-full md:w-[420px] h-auto"
          >
            <div className="bg-[#080808] border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative">
              
              {/* Close Icon (Top Right) */}
              <button 
                onClick={onClose} 
                className="absolute top-5 right-5 text-neutral-600 hover:text-white transition-colors z-20"
              >
                <X size={18} strokeWidth={1.5} />
              </button>

              {/* ================= STEP: INTRO & INPUT ================= */}
              {step === "intro" && (
                  <div className="p-8 md:p-10 flex flex-col">
                      
                      {/* Label */}
                      <span className="text-[10px] font-bold tracking-[0.2em] text-[#D4AF37] uppercase mb-4 flex items-center gap-2">
                        <Sparkles size={10} /> {currentData.label}
                      </span>

                      {/* Heading */}
                      <h2 className={`text-3xl text-white mb-3 ${fontHeading}`}>
                        {currentData.title}
                      </h2>
                      
                      {/* Description */}
                      <p className={`text-sm leading-relaxed mb-8 ${fontBody}`}>
                        {currentData.desc} <br/>
                        Unlock immediately with a student ID.
                      </p>

                      {/* Input Field */}
                      <div className="group relative mb-2">
                        <input 
                            type="email" 
                            placeholder="university email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-transparent border-b border-neutral-800 py-3 text-white text-base font-light placeholder:text-neutral-700 focus:outline-none focus:border-white transition-colors"
                        />
                        <div className="absolute right-0 top-3 text-neutral-700">
                            <GraduationCap size={18} strokeWidth={1.5}/>
                        </div>
                      </div>
                      
                      {/* Error Message */}
                      <div className="h-6 flex items-start">
                         {error && <span className="text-[10px] text-red-500 font-medium tracking-wide">{error}</span>}
                      </div>

                      {/* Action Button */}
                      <button 
                        onClick={handleVerify}
                        disabled={!email || loading}
                        className="w-full mt-4 bg-white text-black h-12 rounded-lg font-medium text-sm hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                         {loading ? <Loader2 className="animate-spin" size={16}/> : "Unlock Access"} 
                      </button>

                      {/* Alternative Link */}
                      <button 
                        onClick={() => navigate('/pricing')}
                        className="mt-6 text-[11px] text-neutral-600 hover:text-neutral-400 uppercase tracking-widest text-center transition-colors"
                      >
                        Not a student? View Plans
                      </button>
                  </div>
              )}

              {/* ================= STEP: SUCCESS ================= */}
              {step === "success" && (
                  <div className="p-10 flex flex-col items-center justify-center text-center min-h-[400px]">
                      <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-16 h-16 rounded-full border border-[#D4AF37]/30 flex items-center justify-center mb-6"
                      >
                        <Check size={24} className="text-[#D4AF37]" strokeWidth={1.5} />
                      </motion.div>

                      <h3 className={`text-2xl text-white mb-2 ${fontHeading}`}>
                        Unlocked.
                      </h3>
                      
                      <p className={`text-sm mb-6 ${fontBody}`}>
                        Welcome to Folio Max, <span className="text-white font-normal">{collegeName}</span>. <br/>
                        Your premium features are now active.
                      </p>

                      <div className="h-1 w-12 bg-neutral-800 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ x: "-100%" }}
                            animate={{ x: "0%" }}
                            transition={{ duration: 2, ease: "linear" }}
                            className="h-full w-full bg-white"
                          />
                      </div>
                  </div>
              )}

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default UpgradePopup;