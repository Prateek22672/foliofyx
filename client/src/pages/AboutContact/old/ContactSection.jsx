import React, { useState } from "react";

const IconFlash = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
);
const IconSteps = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
);

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
      },"📨 Sending your message..."
    );
  };

  return (
    <div
      className="fixed inset-0 z-40 overflow-hidden"
      // SCROLL LOGIC: Index 4
      style={{
        transform: `translateY(calc(max(0px, (4 - var(--scroll, 0)) * 100vh)))`,
      }}
    >
      {/* Wrapper to handle rounded top */}
      <div className="w-full h-full bg-black relative pb-10 rounded-t-[40px] lg:rounded-t-[60px] overflow-hidden shadow-[0_-50px_100px_rgba(0,0,0,0.5)]">
        
        {/* --- VIDEO BACKGROUND --- */}
        <div className="absolute inset-0 w-full h-full">
            <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-40">
            <source src="/v10.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
        </div>

        {/* --- MAIN CONTENT --- */}
        <div className="relative z-10 w-full h-full overflow-y-auto">
            <div className="max-w-5xl mx-auto px-6 py-12 lg:py-20 min-h-full flex items-center justify-center">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 w-full items-start">
                    {/* Form */}
                    <div className="bg-white text-gray-900 rounded-4xl p-8 sm:-mt-5 lg:p-10  shadow-2xl">
                        <div className="mb-8">
                            <h3 className="text-2xl font-bold mb-2">Have a project in mind?</h3>
                            <p className="text-gray-500 text-sm">Fill out the form below.</p>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <input type="text" name="name" placeholder="John Doe" value={formData.name} onChange={handleChange} required className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 outline-none" />
                            <input type="email" name="email" placeholder="hello@site.com" value={formData.email} onChange={handleChange} required className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 outline-none" />
                            <textarea name="message" rows="4" placeholder="Your message" value={formData.message} onChange={handleChange} required className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 outline-none resize-none"></textarea>
                            <button type="submit" className="w-full bg-black text-white font-medium py-4 rounded-4xl hover:bg-gray-800 transition-colors shadow-lg">Send Message</button>
                        </form>
                    </div>

                    {/* Right Info */}
                    <div className="flex flex-col h-full justify-between text-white pt-4">
                        <div>
                            <h2 className="text-6xl lg:text-8xl font-bold tracking-tighter mb-8 leading-[0.9]">Let's Colab.</h2>
                            <p className="text-xl lg:text-2xl text-gray-300 font-light mb-12 max-w-md">Tell us about your project.</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
                                <div><div className="flex items-center gap-2 mb-2 font-semibold"><IconFlash /> <span>Quick response.</span></div><p className="text-sm text-gray-400">Ready to create.</p></div>
                                <div><div className="flex items-center gap-2 mb-2 font-semibold"><IconSteps /> <span>Clear next steps.</span></div><p className="text-sm text-gray-400">Detailed plans.</p></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;