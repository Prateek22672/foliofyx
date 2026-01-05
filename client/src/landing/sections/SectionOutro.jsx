import React from "react";
import Footer from "../../components/Footer"; 

export default function SectionOutro({ handleNavigation }) {
  return (
    // UPDATED: Changed font-['Switzer'] to font-['Syne']
    <section className="sticky top-0 bg-[#0d0d82] text-white pt-32 pb-2 rounded-t-[60px] -mt-10 min-h-[110vh] flex flex-col justify-between z-50 overflow-hidden font-['Syne']">
      
      {/* Background Decor (Optimized: pointer-events-none, will-change) */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <div 
          className="absolute top-[10%] left-[10%] w-[30vw] h-[30vw] bg-purple-500 rounded-full blur-[120px] opacity-20 mix-blend-screen"
          style={{ willChange: "transform" }}
        />
        <div 
          className="absolute bottom-[20%] right-[10%] w-[40vw] h-[40vw] bg-blue-500 rounded-full blur-[120px] opacity-20 mix-blend-screen"
          style={{ willChange: "transform" }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-6 text-center flex-grow flex flex-col justify-center">
        <p className="text-indigo-200 font-bold tracking-[0.2em] uppercase mb-8">
          Ready to launch?
        </p>
        
        <h2 className="text-[12vw] font-black leading-none mb-12 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 drop-shadow-sm">
          FOLIOFYX
        </h2>
        
        <div className="flex justify-center">
            <button 
              onClick={() => handleNavigation('/create')}
              // Syne looks best with heavier weights, used font-extrabold here
              className="bg-white text-[#0d0d82] text-xl md:text-2xl font-extrabold px-12 py-5 rounded-full hover:scale-105 hover:shadow-[0_0_50px_rgba(255,255,255,0.3)] transition-all duration-300 active:scale-95"
            >
              Build Your Portfolio Now
            </button>
        </div>
      </div>

      {/* Footer stays at the bottom */}
      <div className="mt-20 relative z-20">
        <Footer />
      </div>

    </section>
  );
}