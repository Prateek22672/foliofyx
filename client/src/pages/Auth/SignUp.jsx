// src/pages/Auth/Signup.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  motion, 
  AnimatePresence, 
  useMotionValue, 
  useMotionTemplate 
} from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react"; // Added Loader2
import axiosInstance from "../../api/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import PopupMessage from "../../components/PopupMessage";
import { GoogleLogin } from "@react-oauth/google";

// === ENGAGING LOADING MESSAGES (Signup Themed) ===
const LOADING_MESSAGES = [
  "Creating your secure account...",
  "Setting up your portfolio space...",
  "Waking up the cloud instance...", 
  "Encrypting your credentials...",
  "Almost ready...",
  "Finalizing your workspace..."
];

const Signup = () => {
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  // === MOUSE TRACKING STATE (For Spotlight) ===
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = ({ currentTarget, clientX, clientY }) => {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  };

  const maskImage = useMotionTemplate`
    radial-gradient(400px circle at ${mouseX}px ${mouseY}px, black, transparent),
    radial-gradient(300px circle at 100px 100px, black, transparent)
  `;

  const style = { maskImage, WebkitMaskImage: maskImage };

  // === FORM STATE ===
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  
  // === UI STATE ===
  const [loading, setLoading] = useState(false);
  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0); // Track message index
  const [googleLoading, setGoogleLoading] = useState(false);
  const [popup, setPopup] = useState({ show: false, message: "", type: "success" });

  // === ROTATING TEXT EFFECT ===
  useEffect(() => {
    let interval;
    if (loading || googleLoading) {
      setLoadingMsgIndex(0);
      interval = setInterval(() => {
        setLoadingMsgIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
      }, 2500); // Change text every 2.5 seconds
    }
    return () => clearInterval(interval);
  }, [loading, googleLoading]);

  const showPopup = (message, type = "success") => {
    setPopup({ show: true, message, type });
    setTimeout(() => setPopup({ show: false, message: "", type: "success" }), 2000);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // === HANDLERS ===
  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true); // Start rotating text
    
    try {
      const res = await axiosInstance.post("/auth/signup", form);
      const { accessToken, refreshToken, user } = res.data;

      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
        if (refreshToken) localStorage.setItem("refreshToken", refreshToken);

        loginUser(user, accessToken);
        showPopup("Signup successful 🎉", "success");
        setTimeout(() => navigate("/dashboard"), 800);
      } else {
        showPopup("Signup failed ❌", "error");
        setLoading(false);
      }
    } catch (error) {
      console.error("Signup error:", error);
      const serverMessage = error.response?.data?.message;
      showPopup(serverMessage || "Signup failed ❌", "error");
      setLoading(false);
    } 
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setGoogleLoading(true);
      const res = await axiosInstance.post("/auth/google-login", {
        token: credentialResponse.credential,
      });

      const { accessToken, refreshToken, user } = res.data || {};
      if (accessToken) {
         localStorage.setItem("accessToken", accessToken);
         if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
         
         loginUser(user, accessToken);
         showPopup("Google login successful 🎉", "success");
         setTimeout(() => navigate("/dashboard"), 400);
      }
    } catch (err) {
      console.error(err);
      showPopup("Google Login Failed ❌", "error");
      setGoogleLoading(false);
    } 
  };

  const handleGoogleError = () => {
    showPopup("Google Login Failed ❌", "error");
  };

  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center relative overflow-hidden px-4 bg-neutral-950 group"
      onMouseMove={handleMouseMove} 
    >
      
      {/* === BACKGROUND: Faint Static Grid === */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.2]"
        style={{
          backgroundImage: "radial-gradient(#333 1px, transparent 1px)",
          backgroundSize: "32px 32px"
        }}
      />
      
      {/* === BACKGROUND: Glowing Stars (Spotlight) === */}
      <motion.div
        className="absolute inset-0 z-0 pointer-events-none"
        style={style}
      >
        <div 
          className="absolute inset-0"
          style={{
             backgroundImage: "radial-gradient(#fff 1px, transparent 1px)",
             backgroundSize: "32px 32px"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-50" />
      </motion.div>

      {/* === LOGO: Top Left Corner === */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="absolute top-6 left-6 md:top-10 md:left-10 z-50 cursor-pointer"
        onClick={() => navigate('/')}
      >
        <motion.img 
          src="/fyx3.png" 
          alt="Foliofy Logo"
          className="w-20 md:w-24 object-contain brightness-0 invert opacity-80 hover:opacity-100 transition-opacity" 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        />
      </motion.div>

      {/* === MAIN CARD === */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-[960px] bg-white shadow-[0_0_50px_-12px_rgba(255,255,255,0.2)] rounded-2xl overflow-hidden flex flex-col md:flex-row min-h-[550px]"
      >
        
        {/* === LEFT SIDE: Signup Form === */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center order-1 relative">
          
          {/* === LOADING OVERLAY (PREMIUM GLASS EFFECT) === */}
          <AnimatePresence>
            {loading && (
              <motion.div 
                initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
                exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                className="absolute inset-0 z-50 bg-white/60 flex flex-col items-center justify-center p-8 text-center"
              >
                {/* Rotating Spinner */}
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  className="mb-6"
                >
                   <Loader2 size={32} className="text-black" />
                </motion.div>
                
                {/* Rotating Text */}
                <div className="h-6 relative w-full overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={loadingMsgIndex}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-sm font-medium text-neutral-800 absolute w-full left-0 right-0"
                    >
                      {LOADING_MESSAGES[loadingMsgIndex]}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="max-w-xs mx-auto w-full">
            
            {/* Heading Section */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-neutral-900 tracking-tight mb-2">
                Sign up
              </h1>
              <p className="text-neutral-500 text-sm">
                Already have an account?{" "}
                <button
                  onClick={() => navigate("/login")}
                  className="text-black font-semibold hover:underline underline-offset-4 transition-all"
                >
                  Log in
                </button>
              </p>
            </div>

            <form onSubmit={handleSignup} className="space-y-5">
              
              {/* Name Input */}
              <div className="group">
                <label className="block text-[10px] font-bold uppercase tracking-wider mb-2 text-neutral-400 group-focus-within:text-black transition-colors">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent border-b border-neutral-200 py-2 text-base text-neutral-900 placeholder-neutral-300 focus:outline-none focus:border-black transition-all duration-200"
                  placeholder="John Doe"
                />
              </div>

              {/* Email Input */}
              <div className="group">
                <label className="block text-[10px] font-bold uppercase tracking-wider mb-2 text-neutral-400 group-focus-within:text-black transition-colors">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent border-b border-neutral-200 py-2 text-base text-neutral-900 placeholder-neutral-300 focus:outline-none focus:border-black transition-all duration-200"
                  placeholder="name@example.com"
                />
              </div>

              {/* Password Input */}
              <div className="group">
                <label className="block text-[10px] font-bold uppercase tracking-wider mb-2 text-neutral-400 group-focus-within:text-black transition-colors">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent border-b border-neutral-200 py-2 text-base text-neutral-900 placeholder-neutral-300 focus:outline-none focus:border-black transition-all duration-200"
                  placeholder="Create a password"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3.5 mt-4 rounded-xl text-sm font-medium transition-all duration-200 flex justify-center items-center gap-2
                  ${loading
                    ? "bg-neutral-100 text-neutral-400 cursor-wait"
                    : "bg-black text-white hover:bg-neutral-800 hover:shadow-md"
                  }`}
              >
                {loading ? "Verifying..." : "Create Account"}
                {!loading && <ArrowRight size={16} className="text-neutral-400" />}
              </button>
            </form>

          </div>
        </div>

        {/* === CENTER DIVIDER (DESKTOP) === */}
        <div className="hidden md:flex flex-col items-center justify-center absolute left-1/2 top-10 bottom-10 -translate-x-1/2 z-20 pointer-events-none">
          <div className="h-full w-[1px] bg-neutral-100" />
          <div className="absolute bg-white py-2">
             <div className="bg-white border border-neutral-100 px-2 py-1 rounded-md text-[9px] font-bold text-neutral-300 uppercase tracking-widest shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
               Or
             </div>
          </div>
        </div>

        {/* === MOBILE DIVIDER === */}
        <div className="md:hidden flex items-center w-full px-8 py-4 order-2 opacity-60">
          <div className="h-[1px] flex-1 bg-neutral-200" />
          <span className="px-3 text-[9px] font-bold text-neutral-300 uppercase tracking-widest">Or</span>
          <div className="h-[1px] flex-1 bg-neutral-200" />
        </div>

        {/* === RIGHT SIDE: Google Login === */}
        <div className="w-full md:w-1/2 bg-neutral-50/30 p-12 flex flex-col justify-center items-center text-center relative order-3 md:order-2">
          
          <div className="w-full max-w-[260px]">
            <h3 className="text-sm font-medium text-neutral-500 mb-6">
              Instant Access
            </h3>

            <div className="flex justify-center transform transition-transform hover:-translate-y-0.5 duration-300">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                theme="outline"
                size="large"
                shape="rectangular"
                width="260"
                text="signup_with"
                logo_alignment="center"
              />
            </div>
             
             {/* Show the rotating text here if Google is loading */}
             {googleLoading && (
                 <div className="mt-6 text-xs text-neutral-500 animate-pulse">
                     {LOADING_MESSAGES[loadingMsgIndex]}
                 </div>
              )}

            <div className="mt-8 flex flex-col items-center gap-2 opacity-60 hover:opacity-100 transition-opacity duration-300">
               <p className="text-[9px] text-neutral-400">
                 Protected by reCAPTCHA Enterprise.
               </p>
               <div className="flex gap-3">
                 <a href="#" className="text-[9px] font-medium text-neutral-400 hover:text-black transition-colors">Privacy</a>
                 <span className="text-[9px] text-neutral-300">•</span>
                 <a href="#" className="text-[9px] font-medium text-neutral-400 hover:text-black transition-colors">Terms</a>
               </div>
            </div>
          </div>
        </div>

      </motion.div>

      {/* Footer */}
      <div className="absolute bottom-6 z-100 text-center w-full">
        <p className="text-neutral-500 text-[9px] font-semibold tracking-[0.2em] uppercase">© 2025 FolioFyx</p>
      </div>

      {/* Notification Popup */}
      <AnimatePresence>
        {popup.show && (
          <div className="fixed top-6 left-0 w-full flex justify-center z-[100]">
             <PopupMessage
               message={popup.message}
               type={popup.type}
               onClose={() => setPopup({ ...popup, show: false })}
             />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Signup;