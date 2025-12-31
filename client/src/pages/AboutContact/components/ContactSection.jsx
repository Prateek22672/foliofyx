import React, { useState } from "react";
import { Send } from "lucide-react";

const ContactSection = ({ showSplash }) => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    showSplash(2500, () => {
        alert("📨 Message sent successfully!");
        setFormData({ name: "", email: "", message: "" });
      },"📨 Sending..."
    );
  };

  return (
    <div
      id="contact-section"
      // KEY CHANGE: Sticky + Z-Index 30
      className="sticky top-0 w-full h-screen z-30 overflow-hidden bg-black rounded-t-[40px] md:rounded-t-[60px]"
    >
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
            {/* Form Content here (same as your original code) ... */}
            <div className="max-w-6xl w-full px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                 <div className="text-white space-y-6">
                    <h2 className="text-6xl md:text-8xl font-bold tracking-tighter leading-none">
                      Start <br/>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-500">Something New.</span>
                    </h2>
                     {/* ... rest of your form content */}
                 </div>
                 <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-xl border border-white/10 p-8 md:p-12 rounded-[40px] shadow-2xl space-y-6">
                     {/* Inputs ... */}
                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-white/70 ml-2">Your Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full bg-black/20 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-white/50 transition-colors" placeholder="Jane Doe"/>
                    </div>
                    {/* ... other inputs ... */}
                    <button type="submit" className="w-full bg-white text-black font-bold py-4 rounded-2xl hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 group">
                      Send Message <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                 </form>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;