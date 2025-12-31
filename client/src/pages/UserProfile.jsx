import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { User, Mail, CreditCard, LogOut, Crown, ChevronLeft, ShieldAlert, CheckCircle2, ArrowUpCircle, Share2, Download } from "lucide-react";
// ✅ IMPORT QR CODE PACKAGE
import QRCode from "react-qr-code";

const UserProfile = () => {
  const { user, logout, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Placeholder link - Replace with real user profile link
  const portfolioLink = `https://foliofyx.com/u/${user?.id || 'user'}`;
  // Placeholder role - Replace if present in your user object
  const userRole = user?.role || "Folio Creator";

  if (!user) return <div className="bg-black min-h-screen text-white flex items-center justify-center">Loading...</div>;

  // ✅ PLAN CONFIGURATION (Unchanged)
  const planConfig = {
    free: {
        label: "Free Tier",
        color: "text-neutral-400",
        glow: "bg-gray-500/5",
        badge: "bg-neutral-800 text-neutral-400 border-neutral-700"
    },
    plus: {
        label: "Folio Plus",
        color: "text-blue-400",
        glow: "bg-blue-500/20",
        badge: "bg-blue-500/10 text-blue-400 border-blue-500/30"
    },
    max: {
        label: "Folio Max",
        color: "text-[#D4AF37]",
        glow: "bg-[#D4AF37]/20",
        badge: "bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/30"
    }
  };

  const activePlan = planConfig[user.plan] || planConfig.free;

  const handleCancel = async () => {
    if(!window.confirm("Are you sure? You will lose premium features immediately.")) return;

    setLoading(true);
    try {
        // Simulate API call
        // const res = await fetch(...)
        // if (res.ok) { await refreshUser(); }
        console.log("Cancel logic here");
        alert("Subscription cancelled (simulated).");
    } catch (err) {
        console.error(err);
    } finally {
        setLoading(false);
    }
  };

  // Mock functions for buttons
  const handleShare = () => {
      if (navigator.share) {
          navigator.share({
              title: `${user.name}'s FYX Card`,
              url: portfolioLink
          }).catch(console.error);
      } else {
          alert("Share URL copied: " + portfolioLink);
          navigator.clipboard.writeText(portfolioLink);
      }
  };

  const handleDownload = () => {
      alert("Download functionality would go here (e.g., using html2canvas).");
  };


  return (
    // Added font-swizzer class here as a fallback/base font if you have it configured in tailwind.config.js
    <div className="min-h-screen bg-black text-white pt-24 px-6 pb-20 font-['Wix_Madefor_Text'] flex flex-col items-center">
       <div className="max-w-2xl w-full">
          <button onClick={() => navigate(-1)} className="flex items-center text-gray-400 hover:text-white mb-8 transition-colors">
             <ChevronLeft size={20} /> Back
          </button>

          <h1 className="text-3xl font-bold mb-8">Account Settings</h1>

          {/* User Details Card (Unchanged) */}
          <div className="bg-[#111] border border-white/10 rounded-3xl p-8 mb-6">
             <div className="flex items-center gap-6">
                 <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-700 to-black border border-white/10 flex items-center justify-center text-2xl font-bold">
                    {user.name?.charAt(0).toUpperCase()}
                 </div>
                 <div>
                    <h2 className="text-xl font-bold">{user.name}</h2>
                    <div className="flex items-center gap-2 text-gray-400 text-sm mt-1">
                        <Mail size={14} /> {user.email}
                    </div>
                 </div>
             </div>
          </div>

          {/* Plan Details Card (Unchanged) */}
          <div className="bg-[#111] border border-white/10 rounded-3xl p-8 relative overflow-hidden mb-12">
             <div className={`absolute top-0 right-0 w-64 h-64 blur-[80px] rounded-full pointer-events-none ${activePlan.glow}`}></div>

             <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                <CreditCard size={14} /> Subscription
             </h3>

             <div className="flex flex-col md:flex-row md:items-center justify-between relative z-10 gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <span className={`text-3xl font-bold ${activePlan.color}`}>
                            {activePlan.label}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded border font-bold uppercase tracking-wider flex items-center gap-1 ${activePlan.badge}`}>
                            <CheckCircle2 size={10} /> Active
                        </span>
                    </div>
                    <p className="text-gray-500 text-sm">
                        {user.plan === 'free' ? "Upgrade to unlock premium features." : `Enjoying ${user.plan} features.`}
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    {user.plan !== 'max' && (
                        <button
                            onClick={() => navigate(user.plan === 'plus' ? '/checkout/max' : '/checkout/plus')}
                            className={`px-5 py-2.5 rounded-full font-bold text-sm hover:scale-105 transition-transform flex items-center gap-2 ${user.plan === 'plus' ? 'bg-[#D4AF37] text-black' : 'bg-white text-black'}`}
                        >
                            {user.plan === 'plus' ? <ArrowUpCircle size={16} /> : <Crown size={16} />}
                            {user.plan === 'plus' ? "Upgrade to Max" : "Upgrade"}
                        </button>
                    )}
                    {user.plan !== 'free' && (
                          <button
                            onClick={handleCancel}
                            disabled={loading}
                            className="px-5 py-2.5 border border-red-500/30 text-red-500 hover:bg-red-500/10 rounded-full font-bold text-sm transition-colors flex items-center gap-2"
                        >
                            <ShieldAlert size={16} /> {loading ? "..." : "Cancel Plan"}
                        </button>
                    )}
                </div>
             </div>
          </div>

          {/* ========================================== */}
          {/* ✅ NEW SECTION: FYX CARD */}
          {/* ========================================== */}
          <div className="mb-12 flex flex-col items-center">
              <h3 className="text-xl font-bold mb-6 w-full text-left">Digital FYX Card</h3>

              {/* The Physical Card Container */}
              {/* Assuming 'font-swizzer' is defined in your CSS. Using a classic sans-serif stack feel otherwise. */}
              <div id="fyx-card-downloadable" className="relative w-full max-w-[340px] aspect-[3/4.5] bg-gradient-to-b from-[#222] to-[#111] rounded-[2rem] border border-white/10 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] overflow-hidden p-8 flex flex-col items-center text-center font-swizzer">

                  {/* Subtle top lighting effect */}
                  <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>

                  {/* 1. User Name (Highlighted, Hero) */}
                  {/* Using bg-clip-text for a subtle premium metallic feel */}
                  <h2 className="mt-4 text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-gray-200 to-gray-500">
                      {user.name}
                  </h2>

                  {/* 2. User Role (Secondary) */}
                  <p className="text-sm text-gray-400 font-medium uppercase tracking-[0.15em] mt-2 mb-auto">
                      {userRole}
                  </p>

                  {/* 3. QR Code (Central Focus) */}
                  {/* Needs a white container to ensure contrast for scanning */}
                  <div className="bg-white p-3 rounded-xl shadow-lg my-8">
                       <QRCode
                           value={portfolioLink}
                           size={140}
                           style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                           viewBox={`0 0 256 256`}
                       />
                  </div>

                  {/* 4. Subtle Branding (Bottom, Small) */}
                  <div className="mt-auto opacity-40 flex flex-col items-center">
                      <span className="text-[9px] uppercase font-bold tracking-[0.3em] text-gray-300">
                          FYX CARD
                      </span>
                      <span className="text-[8px] text-gray-500 font-medium">
                          by FolioFYX
                      </span>
                  </div>
              </div>

              {/* Action Buttons beneath card */}
              <div className="flex items-center justify-center gap-4 mt-6 w-full max-w-[340px]">
                  <button onClick={handleShare} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border border-white/10 bg-[#111] hover:bg-white/5 transition-colors text-sm font-bold text-gray-300 hover:text-white">
                      <Share2 size={18} /> Share
                  </button>
                  <button onClick={handleDownload} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border border-white/10 bg-[#111] hover:bg-white/5 transition-colors text-sm font-bold text-gray-300 hover:text-white">
                       <Download size={18} /> Save Image
                  </button>
              </div>
          </div>
          {/* ========================================== */}


          {/* Logout */}
          <button onClick={() => { logout(); navigate('/'); }} className="mt-8 w-full py-4 border border-white/5 rounded-2xl text-gray-400 hover:text-white hover:bg-white/5 transition-all flex items-center justify-center gap-2 font-bold">
             <LogOut size={18} /> Sign Out
          </button>
       </div>

       {/* ✅ BOTTOM LOGO */}
       <div className="mt-20 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
            <img src="/fyxlogow.png" alt="FoliofyX" className="h-8 w-auto" />
       </div>
    </div>
  );
};

export default UserProfile;