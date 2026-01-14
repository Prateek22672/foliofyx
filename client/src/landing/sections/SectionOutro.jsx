import React from "react";
import Footer from "../../components/Footer"; 

export default function SectionOutro({ handleNavigation }) {
  return (
    <section 
      // Changed to min-h-screen and h-auto to allow growing
      // Removed overflow-hidden so content is never clipped
      className="relative w-full min-h-screen h-auto bg-[#0d0d82] text-white flex flex-col justify-between z-50 font-['Syne'] will-change-transform"
      style={{ 
        transform: "translateZ(0)",
        backfaceVisibility: "hidden"
      }}
    >
      
      {/* Background Decor */}
      <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
        <div 
          className="absolute top-[10%] left-[10%] w-[30vw] h-[30vw] bg-purple-500 rounded-full blur-[120px] opacity-20 mix-blend-screen will-change-transform"
        />
        <div 
          className="absolute bottom-[20%] right-[10%] w-[40vw] h-[40vw] bg-blue-500 rounded-full blur-[120px] opacity-20 mix-blend-screen will-change-transform"
        />
      </div>

      {/* Main CTA Content */}
      <div className="relative z-10 container mx-auto px-6 text-center flex-grow flex flex-col justify-center items-center py-24">
        
        <div className="bg-white text-[#0d0d82] px-8 py-3 rounded-full mb-8 shadow-lg inline-block hover:scale-105 transition-transform duration-300">
             <h2 className="text-xl md:text-2xl font-bold cursor-default">Build Your Portfolio Now</h2>
        </div>

        <h2 className="text-[12vw] font-black leading-none mb-12 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 drop-shadow-sm select-none">
          FOLIOFYX
        </h2>
        
        <p className="text-indigo-200 uppercase tracking-widest text-sm font-bold mb-8">
            Join the revolution
        </p>
      </div>

      {/* Footer */}
      <div className="relative z-20 w-full bg-[#0d0d82] pb-10">
        <Footer />
      </div>

    </section>
  );
}