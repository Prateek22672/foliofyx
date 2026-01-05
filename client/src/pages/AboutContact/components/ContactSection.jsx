import React, { useState, useRef } from "react";
import { Send } from "lucide-react";
import emailjs from '@emailjs/browser';

const ContactSection = ({ showSplash }) => {
  const formRef = useRef();

  const [formData, setFormData] = useState({ 
    user_name: "", 
    user_email: "", 
    message: "" 
  });
  
  const [isSending, setIsSending] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSending(true);

    // 🔴 STEP 1: Paste your Template ID and Public Key below
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    emailjs
      .sendForm(
        SERVICE_ID,
        TEMPLATE_ID,
        formRef.current,
        PUBLIC_KEY
      )
      .then(
        (result) => {
          console.log("SUCCESS!", result.text);
          setIsSending(false);
          
          showSplash(2500, () => {
             alert("📨 Message sent successfully!");
             setFormData({ user_name: "", user_email: "", message: "" });
          }, "📨 Message Sent!");
        },
        (error) => {
          console.log("FAILED...", error.text);
          setIsSending(false);
          alert("❌ Failed to send. Check your Public Key and Template ID.");
        }
      );
  };

  return (
    <div id="contact-section" className="sticky top-0 w-full h-screen z-30 overflow-hidden bg-black rounded-t-[40px] md:rounded-t-[60px]">
      <div className="w-full h-full relative overflow-hidden">
        {/* VIDEO BACKGROUND */}
        <div className="absolute inset-0 w-full h-full">
            <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-60">
                <source src="/v10.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
        </div>

        {/* CONTENT */}
        <div className="relative z-10 w-full h-full overflow-y-auto flex items-center justify-center py-20">
            <div className="max-w-6xl w-full px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                 
                 {/* Left Text Side */}
                 <div className="text-white space-y-6">
                    <h2 className="text-6xl md:text-8xl font-bold tracking-tighter leading-none">
                      Start <br/>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-500">Something New.</span>
                    </h2>
                    <p className="text-white/70 text-lg">
                        Have an idea? Let's build it together. Drop me a note and I'll get back to you shortly.
                    </p>
                 </div>

                 {/* Right Form Side */}
                 <form 
                    ref={formRef} 
                    onSubmit={handleSubmit} 
                    className="bg-white/10 backdrop-blur-xl border border-white/10 p-8 md:p-12 rounded-[40px] shadow-2xl space-y-6"
                 >
                    {/* Name Input */}
                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-white/70 ml-2">Your Name</label>
                        <input 
                            type="text" 
                            name="user_name" // Matches {{user_name}}
                            value={formData.user_name} 
                            onChange={handleChange} 
                            required 
                            className="w-full bg-black/20 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-white/50 transition-colors" 
                            placeholder="Jane Doe"
                        />
                    </div>

                    {/* Email Input */}
                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-white/70 ml-2">Your Email</label>
                        <input 
                            type="email" 
                            name="user_email" // Matches {{user_email}}
                            value={formData.user_email} 
                            onChange={handleChange} 
                            required 
                            className="w-full bg-black/20 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-white/50 transition-colors" 
                            placeholder="jane@example.com"
                        />
                    </div>

                    {/* Message Input */}
                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-white/70 ml-2">Note</label>
                        <textarea 
                            name="message" // Matches {{message}}
                            value={formData.message} 
                            onChange={handleChange} 
                            required 
                            rows="4"
                            className="w-full bg-black/20 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-white/50 transition-colors resize-none" 
                            placeholder="Tell me about your project..."
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={isSending}
                        className="w-full bg-white text-black font-bold py-4 rounded-2xl hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSending ? "Sending..." : "Send Message"} 
                      {!isSending && <Send size={18} className="group-hover:translate-x-1 transition-transform" />}
                    </button>
                 </form>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;