import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Sparkles, Check, GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../api/axiosInstance";

const UpgradePopup = ({ isOpen, onClose, reason = "limit" }) => {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  
  const [step, setStep] = useState("intro"); // intro | success
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerifyAndActivate = async () => {
    if (!email) return;
    setLoading(true);
    setError("");

    try {
        const lowerEmail = email.toLowerCase();
        const domainPart = lowerEmail.split('@')[1] || "";

        // 🚫 Block List: Explicitly block public providers
        const publicProviders = ['gmail.com', 'outlook.com', 'hotmail.com', 'yahoo.com', 'icloud.com'];
        const isPublic = publicProviders.some(p => domainPart.includes(p));

        if (isPublic) {
            setLoading(false);
            setError("Personal emails are not eligible. Please use your university ID.");
            return;
        }
        
        // ✅ Allow List: Only Institutional Domains
        const validDomains = [
            'gitam.in', 'gitam.edu', 
            'srm.edu.in', 'vit.ac.in', 
            'iit', 'nit', 'bits',
            'edu', 'ac.in', 'college', 'university'
        ]; 
        
        // Check if the domain part contains any of the valid institutional strings
        const isValidDomain = validDomains.some(d => domainPart.includes(d));
        
        if (!email.includes('@') || !isValidDomain) {
             setLoading(false);
             setError("Please enter a valid university email address (e.g., .edu, .ac.in).");
             return;
        }

        // 2. Call Backend
        await axiosInstance.post("/payment/claim-offer", { email: lowerEmail });

        // 3. Update UI
        if (refreshUser) await refreshUser();
        
        setLoading(false);
        setStep("success");

        // 4. Auto-Close after 2.5 seconds (Stay on same page)
        setTimeout(() => {
            onClose();
        }, 2500);

    } catch (e) {
        console.error("Verification Error:", e);
        setLoading(false);
        const backendMsg = e.response?.data?.msg || "Verification failed. Please try again.";
        setError(backendMsg);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100]"
          />

          {/* Holographic Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-[101] w-full md:w-[480px] h-auto rounded-[2rem] overflow-hidden shadow-2xl border border-white/10"
          >
            {/* Header: Holographic Gradient */}
            <div className="relative h-48 bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex flex-col items-center justify-center text-center p-6">
                {/* Noise Texture Overlay */}
                <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
                
                <button 
                    onClick={onClose} 
                    className="absolute top-5 right-5 w-8 h-8 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center text-white transition-colors backdrop-blur-sm z-10"
                >
                    <X size={16} />
                </button>
                
                {step === 'success' ? (
                    <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex flex-col items-center relative z-10"
                    >
                        <div className="bg-white text-purple-600 rounded-full p-4 mb-4 shadow-xl shadow-purple-900/20">
                            <Check size={36} strokeWidth={4} />
                        </div>
                        <h2 className="text-3xl font-bold text-white tracking-tight">Unlocked!</h2>
                    </motion.div>
                ) : (
                    <motion.div 
                        initial={{ y: 5, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="relative z-10"
                    >
                        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/20 backdrop-blur-md">
                            <GraduationCap className="text-white" size={24} />
                        </div>
                        <h2 className="text-4xl font-bold text-white tracking-tight drop-shadow-md">
                            Student Verification
                        </h2>
                    </motion.div>
                )}
            </div>

            {/* Body */}
            <div className="bg-[#121212] p-8">
                
                {step === 'success' ? (
                    <div className="text-center py-6">
                        <p className="text-neutral-400 text-sm">Your account has been upgraded to <span className="text-white font-bold">Max Tier</span>.</p>
                        <div className="mt-6 h-1 w-full bg-neutral-800 rounded-full overflow-hidden">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 2 }}
                                className="h-full bg-purple-500"
                            />
                        </div>
                        <p className="text-purple-400 mt-2 text-xs font-mono animate-pulse">Redirecting to Dashboard...</p>
                    </div>
                ) : (
                    <>
                        <p className="text-center text-neutral-400 text-sm leading-relaxed mb-8 px-4 font-light">
                            Enter your university email address to instantly unlock the full <strong>FolioFYX Suite</strong> for free.
                        </p>

                        {/* Input Field */}
                        <div className="mb-6 relative">
                            <input 
                                type="email" 
                                placeholder="name@gitam.in"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                                className="w-full bg-[#1E1E20] border border-white/5 focus:border-purple-500/50 rounded-xl py-4 px-5 text-white placeholder:text-neutral-600 outline-none transition-all text-sm shadow-inner"
                            />
                            {error && (
                                <motion.p 
                                    initial={{ opacity: 0, y: -5 }} 
                                    animate={{ opacity: 1, y: 0 }} 
                                    className="absolute -bottom-6 left-1 text-xs text-red-400 font-medium flex items-center gap-1"
                                >
                                    <span className="w-1 h-1 rounded-full bg-red-400"/> {error}
                                </motion.p>
                            )}
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3 items-center pt-4">
                            <button 
                                onClick={handleVerifyAndActivate}
                                disabled={loading || !email}
                                className="w-full py-4 rounded-xl bg-white text-black text-sm font-bold hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_-5px_rgba(255,255,255,0.2)]"
                            >
                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        <Loader2 size={18} className="animate-spin" />
                                        <span>Checking Database...</span>
                                    </div>
                                ) : (
                                    <>Verify & Unlock <Sparkles size={16} className="text-purple-600" /></>
                                )}
                            </button>
                        </div>
                    </>
                )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default UpgradePopup;