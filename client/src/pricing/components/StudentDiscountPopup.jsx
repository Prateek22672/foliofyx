import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Sparkles, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const StudentDiscountPopup = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const { refreshUser } = useAuth();
    
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState("idle"); // idle | verifying | success
    const [error, setError] = useState("");

    const handleVerifyAndActivate = () => {
        if (!email) return;
        setStatus("verifying");
        setError("");

        setTimeout(async () => {
            const lowerEmail = email.toLowerCase();
            const validDomains = ['gitam', 'srm', 'vit', 'iit', 'nit', 'bits', 'edu', 'ac.in', 'college', 'university'];
            const domainPart = lowerEmail.split('@')[1] || "";
            
            // 1. Verify Domain
            if (validDomains.some(d => domainPart.includes(d)) && email.includes('@')) {
                try {
                    // 2. Mock Backend Activation
                    // In a real app, send a POST request here
                    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
                    const updatedUser = { 
                        ...currentUser, 
                        plan: "max", 
                        isStudent: true,
                        planExpiry: new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString() 
                    };
                    
                    localStorage.setItem("user", JSON.stringify(updatedUser));
                    
                    if (refreshUser) await refreshUser();
                    
                    setStatus("success");

                    // 3. Redirect after success
                    setTimeout(() => {
                        onClose();
                        navigate("/dashboard");
                    }, 2000);

                } catch (e) {
                    console.error(e);
                    setStatus("idle");
                }
            } else {
                setStatus("idle");
                setError("Please enter a valid university email address.");
            }
        }, 1500);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
                    />

                    {/* Modal Container */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} // Swiss-like ease
                        className="fixed inset-0 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-[101] w-full md:w-[480px] h-auto rounded-3xl overflow-hidden shadow-2xl"
                    >
                        {/* 1. Header: The Holographic Gradient */}
                        <div className="relative h-48 bg-gradient-to-tr from-indigo-400 via-purple-400 to-pink-300 flex flex-col items-center justify-center text-center p-6">
                            <button 
                                onClick={onClose} 
                                className="absolute top-5 right-5 text-white/70 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                            
                            {status === 'success' ? (
                                <motion.div 
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="flex flex-col items-center"
                                >
                                    <div className="bg-white text-purple-600 rounded-full p-3 mb-2 shadow-lg">
                                        <Check size={32} strokeWidth={3} />
                                    </div>
                                    <h2 className="text-3xl font-semibold text-white tracking-tight">Welcome to Max</h2>
                                </motion.div>
                            ) : (
                                <motion.h2 
                                    initial={{ y: 5, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    className="text-4xl md:text-5xl font-semibold text-white tracking-tight drop-shadow-sm"
                                >
                                    Try Max, Free
                                </motion.h2>
                            )}
                        </div>

                        {/* 2. Body: Dark Minimalist */}
                        <div className="bg-[#18181b] p-8">
                            
                            {status === 'success' ? (
                                <div className="text-center py-4">
                                    <p className="text-neutral-400 text-sm">Your student account has been verified.</p>
                                    <p className="text-white mt-2 text-sm font-medium animate-pulse">Redirecting to Dashboard...</p>
                                </div>
                            ) : (
                                <>
                                    <p className="text-center text-neutral-400 text-[15px] leading-relaxed mb-8 px-4 font-light">
                                        Enter your university email to verify your student status. 
                                        You will instantly receive the <span className="text-white font-medium">Folio Max</span> plan, 
                                        free for the next 6 months.
                                    </p>

                                    {/* Input Field */}
                                    <div className="mb-6 relative">
                                        <input 
                                            type="email" 
                                            placeholder="name@university.edu"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            disabled={status === "verifying"}
                                            className="w-full bg-[#27272a] border border-transparent focus:border-purple-500/50 rounded-xl py-4 px-5 text-white placeholder:text-neutral-500 outline-none transition-all text-sm"
                                        />
                                        {error && (
                                            <motion.p 
                                                initial={{ opacity: 0, y: -5 }} 
                                                animate={{ opacity: 1, y: 0 }} 
                                                className="absolute -bottom-6 left-1 text-xs text-red-400"
                                            >
                                                {error}
                                            </motion.p>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-3 items-center pt-2">
                                        <button 
                                            onClick={onClose}
                                            className="flex-1 py-3.5 rounded-full bg-[#27272a] text-white text-sm font-medium hover:bg-[#3f3f46] transition-colors"
                                        >
                                            Maybe later
                                        </button>
                                        
                                        <button 
                                            onClick={handleVerifyAndActivate}
                                            disabled={status === "verifying" || !email}
                                            className="flex-1 py-3.5 rounded-full bg-white text-black text-sm font-semibold hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                        >
                                            {status === "verifying" ? (
                                                <Loader2 size={16} className="animate-spin" />
                                            ) : (
                                                <>Unlock Max <Sparkles size={14} className="text-purple-600" /></>
                                            )}
                                        </button>
                                    </div>

                                    {/* Footer Text */}
                                    <p className="text-center text-[#52525b] text-[10px] mt-6 tracking-wide uppercase">
                                        No credit card required
                                    </p>
                                </>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default StudentDiscountPopup;