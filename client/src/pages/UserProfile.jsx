import React, { useState, useRef } from "react";
import { useAuth } from "../context/AuthContext"; // Ensure this path is correct
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  User, Mail, CreditCard, LogOut, Crown, ChevronLeft, ShieldAlert, 
  CheckCircle2, ArrowUpCircle, Share2, Download, X, AlertTriangle 
} from "lucide-react";
import QRCode from "react-qr-code";
import { cancelSubscription } from "../api/paymentAPI";
import { motion, AnimatePresence } from "framer-motion";

const UserProfile = () => {
  const { user, logout, refreshUser } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: "", type: "success" });

  // 🔗 Dynamic Links
  const portfolioLink = `${window.location.origin}/u/${user?.id}`;
  const userRole = user?.isStudent ? "Student Developer" : (user?.plan === 'max' ? "Pro Creator" : "Folio Creator");

  // 🎨 Plan UI Config
  const planConfig = {
    free: {
        label: "Free Tier",
        color: "text-neutral-400",
        glow: "bg-neutral-500/5",
        badge: "bg-neutral-800 text-neutral-400 border-neutral-700",
        desc: "Basic features active."
    },
    max: {
        label: "Max Tier",
        color: "text-[#D4AF37]", // Gold
        glow: "bg-[#D4AF37]/20",
        badge: "bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/30",
        desc: "All premium features unlocked."
    }
  };

  const activePlan = planConfig[user?.plan] || planConfig.free;

  // ⚡ HANDLERS
  const handleCancelSubscription = async () => {
    setLoading(true);
    try {
        // ✅ Use the new API function
        await cancelSubscription(); 

        // 1. Refresh Context (Updates UI Instantly)
        await refreshUser();
        
        // 2. Close Modal & Show Success
        setShowCancelModal(false);
        setToast({ show: true, msg: "Plan downgraded to Free.", type: "neutral" });
        setTimeout(() => setToast({ ...toast, show: false }), 3000);

    } catch (err) {
        console.error("Cancel Failed:", err);
        setToast({ show: true, msg: "Failed to cancel. Try again.", type: "error" });
    } finally {
        setLoading(false);
    }
  };

  const handleShare = () => {
      navigator.clipboard.writeText(portfolioLink);
      setToast({ show: true, msg: "Link copied to clipboard!", type: "success" });
      setTimeout(() => setToast({ ...toast, show: false }), 2000);
  };

  if (!user) return <div className="bg-black min-h-screen text-white flex items-center justify-center">Loading Studio...</div>;

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-24 px-6 pb-20 font-sans flex flex-col items-center relative overflow-x-hidden">
       
       {/* Toast Notification */}
       <AnimatePresence>
         {toast.show && (
            <motion.div 
                initial={{ y: -50, opacity: 0 }} animate={{ y: 20, opacity: 1 }} exit={{ y: -50, opacity: 0 }}
                className={`fixed top-4 z-50 px-6 py-3 rounded-full shadow-2xl border flex items-center gap-3 ${toast.type === 'error' ? 'bg-red-500/10 border-red-500/50 text-red-400' : 'bg-[#1a1a1a] border-white/10 text-white'}`}
            >
                {toast.type === 'error' ? <ShieldAlert size={16}/> : <CheckCircle2 size={16} className="text-green-400"/>}
                <span className="text-sm font-medium">{toast.msg}</span>
            </motion.div>
         )}
       </AnimatePresence>

       {/* Cancel Confirmation Modal */}
       <AnimatePresence>
            {showCancelModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={() => setShowCancelModal(false)}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />
                    <motion.div 
                        initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                        className="relative w-full max-w-md bg-[#111] border border-white/10 rounded-[2rem] p-8 overflow-hidden shadow-2xl"
                    >
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-500" />
                        
                        <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center mb-6 mx-auto">
                            <AlertTriangle className="text-red-500" size={28} />
                        </div>
                        
                        <h2 className="text-2xl font-bold text-center mb-2">Downgrade to Free?</h2>
                        <p className="text-neutral-400 text-center text-sm mb-8 leading-relaxed">
                            You will immediately lose access to premium themes, analytics, and your Pro badge. This action cannot be undone.
                        </p>

                        <div className="flex gap-3">
                            <button 
                                onClick={() => setShowCancelModal(false)}
                                className="flex-1 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold text-sm transition-colors"
                            >
                                Keep Pro
                            </button>
                            <button 
                                onClick={handleCancelSubscription}
                                disabled={loading}
                                className="flex-1 py-3.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 font-semibold text-sm transition-colors flex items-center justify-center gap-2"
                            >
                                {loading ? "Processing..." : "Yes, Cancel"}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
       </AnimatePresence>


       <div className="max-w-2xl w-full relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
             <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors group">
                <div className="p-2 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors">
                    <ChevronLeft size={18} /> 
                </div>
                <span className="font-medium">Settings</span>
             </button>
             <div className="h-8 w-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                 <User size={14} className="text-neutral-400"/>
             </div>
          </div>

          <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-white to-neutral-500 bg-clip-text text-transparent">My Account</h1>

          {/* User Profile Card */}
          <div className="bg-[#0f0f0f] border border-white/5 rounded-[2rem] p-6 mb-6 flex items-center gap-5 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-neutral-800 to-black border border-white/10 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                 {user.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                 <h2 className="text-lg font-bold text-white truncate">{user.name}</h2>
                 <div className="flex items-center gap-2 text-neutral-500 text-sm mt-1 truncate">
                    <Mail size={12} /> {user.email}
                 </div>
              </div>
              {user.isStudent && (
                 <div className="hidden sm:flex px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold items-center gap-1">
                     <CheckCircle2 size={10} /> Student
                 </div>
              )}
          </div>

          {/* Subscription Card */}
          <div className="bg-[#0f0f0f] border border-white/5 rounded-[2rem] p-8 relative overflow-hidden mb-12 transition-all hover:border-white/10">
             {/* Glow Effect */}
             <div className={`absolute -top-20 -right-20 w-64 h-64 blur-[100px] rounded-full pointer-events-none opacity-50 ${activePlan.glow}`}></div>

             <div className="flex items-center justify-between mb-6 relative z-10">
                 <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-2">
                    <CreditCard size={12} /> Current Plan
                 </h3>
                 <span className={`text-[10px] px-2.5 py-1 rounded-full border font-bold uppercase tracking-wider flex items-center gap-1.5 ${activePlan.badge}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${user.plan === 'max' ? 'bg-[#D4AF37]' : 'bg-neutral-400'} animate-pulse`} />
                    {user.plan === 'free' ? 'Basic' : 'Active'}
                 </span>
             </div>

             <div className="flex flex-col md:flex-row md:items-end justify-between relative z-10 gap-6">
                <div>
                    <div className={`text-4xl font-bold mb-2 ${activePlan.color} tracking-tight`}>
                        {activePlan.label}
                    </div>
                    <p className="text-neutral-500 text-sm font-medium">
                        {activePlan.desc}
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    {user.plan === 'free' ? (
                        <button
                            onClick={() => navigate('/benefits')} // Changed to your Offers page
                            className="px-6 py-3 rounded-xl bg-white text-black font-bold text-sm hover:scale-105 transition-all shadow-lg shadow-white/10 flex items-center gap-2"
                        >
                            <Crown size={16} /> Upgrade
                        </button>
                    ) : (
                        <button
                            onClick={() => setShowCancelModal(true)}
                            disabled={loading}
                            className="px-5 py-3 border border-red-500/20 text-red-500/80 hover:text-red-500 hover:bg-red-500/10 hover:border-red-500/30 rounded-xl font-bold text-sm transition-all flex items-center gap-2"
                        >
                            <ShieldAlert size={16} /> Cancel Plan
                        </button>
                    )}
                </div>
             </div>
          </div>

          {/* ================= FYX CARD SECTION ================= */}
          <div className="mb-16 flex flex-col items-center">
              <div className="flex items-center gap-4 mb-8 w-full">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10"></div>
                  <span className="text-neutral-500 text-xs font-bold uppercase tracking-widest">Your Digital ID</span>
                  <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10"></div>
              </div>

              {/* The Physical Card Look */}
              <div className="relative group perspective-1000">
                  <div className={`relative w-[300px] aspect-[3/4.5] bg-[#0a0a0a] rounded-[2rem] border border-white/10 shadow-2xl overflow-hidden p-6 flex flex-col items-center text-center transition-transform duration-500 hover:scale-[1.02] hover:rotate-1`}>
                      
                      {/* Top Gradient Mesh */}
                      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
                      {user.plan === 'max' && <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/20 blur-[60px] pointer-events-none" />}

                      {/* Name & Role */}
                      <div className="relative z-10 mt-4">
                          <h2 className="text-2xl font-black tracking-tight text-white mb-1">{user.name}</h2>
                          <div className={`text-[10px] font-bold uppercase tracking-[0.2em] py-1 px-3 rounded-full inline-block border ${user.plan === 'max' ? 'text-[#D4AF37] border-[#D4AF37]/30 bg-[#D4AF37]/5' : 'text-neutral-500 border-white/5 bg-white/5'}`}>
                              {userRole}
                          </div>
                      </div>

                      {/* QR Code Container */}
                      <div className="bg-white p-3 rounded-2xl shadow-xl my-auto relative group-hover:scale-105 transition-transform duration-500">
                           <QRCode
                               value={portfolioLink}
                               size={160}
                               style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                               viewBox={`0 0 256 256`}
                           />
                           {/* Center Icon Overlay */}
                           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-black rounded-full flex items-center justify-center border-2 border-white">
                                <span className="font-bold text-white text-[10px]">FYX</span>
                           </div>
                      </div>

                      {/* Bottom Branding */}
                      <div className="mt-auto pt-6 w-full flex justify-between items-end opacity-50">
                          <div className="text-left">
                              <div className="text-[8px] text-neutral-500 uppercase tracking-wider">Member Since</div>
                              <div className="text-[10px] font-mono text-neutral-300">{new Date(user.createdAt).getFullYear() || '2025'}</div>
                          </div>
                          <img src="/fyxlogow.png" alt="Logo" className="h-4 opacity-80" />
                      </div>
                  </div>
              </div>

              {/* Card Actions */}
              <div className="flex items-center gap-3 mt-8">
                  <button onClick={handleShare} className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#1a1a1a] hover:bg-[#222] border border-white/5 text-sm font-bold transition-all hover:text-white text-neutral-400">
                      <Share2 size={16} /> Copy Link
                  </button>
                  <button className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#1a1a1a] hover:bg-[#222] border border-white/5 text-sm font-bold transition-all hover:text-white text-neutral-400">
                      <Download size={16} /> Save Image
                  </button>
              </div>
          </div>

          {/* Logout */}
          <button 
            onClick={() => { logout(); navigate('/'); }} 
            className="w-full py-4 rounded-2xl border border-white/5 text-neutral-500 hover:text-red-400 hover:bg-red-500/5 hover:border-red-500/10 transition-all flex items-center justify-center gap-2 font-bold text-sm"
          >
             <LogOut size={16} /> Sign Out
          </button>

       </div>
    </div>
  );
};

export default UserProfile;