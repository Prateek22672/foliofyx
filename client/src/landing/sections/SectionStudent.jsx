import React from "react";
import { motion } from "framer-motion";

export default function SectionStudent({ handleNavigation }) {
  return (
    <section className="relative min-h-[100vh] bg-[#050505] text-white py-20 px-4 md:px-10 rounded-t-[40px] -mt-10 border-t border-white/10 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
      
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12 md:gap-24 items-start">
        
        {/* LEFT: Sticky Text (The Pitch) */}
        <div className="md:w-1/2 md:sticky md:top-32 self-start">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-purple-500 font-bold tracking-widest uppercase mb-4 text-sm">For Students & Creators</h2>
            <h3 className="text-4xl md:text-6xl font-black leading-tight mb-6">
              You are more than just a <span className="line-through text-gray-600 decoration-red-500">PDF Resume</span>.
            </h3>
            <p className="text-gray-400 text-lg md:text-xl leading-relaxed mb-8">
              Recruiters spend <strong>6 seconds</strong> on a resume. Don't be another sheet of paper in the stack. 
              <br/><br/>
              Show them your code, your designs, and your personality. 
              With FolioFyX, you turn your "Recents" into a visual story that demands attention.
            </p>
            
            <button 
              onClick={() => handleNavigation('/create')}
              className="group flex items-center gap-3 text-white font-semibold text-lg border-b border-white/30 pb-1 hover:border-purple-500 transition-colors"
            >
              Start Building for Free 
              <span className="group-hover:translate-x-2 transition-transform">→</span>
            </button>
          </motion.div>
        </div>

        {/* RIGHT: The Visual Proof (Cards) */}
        <div className="md:w-1/2 flex flex-col gap-8 w-full">
          
          <Card 
            title="The 'Old' Way" 
            desc="Generic, boring text resumes that get ignored."
            icon="📄"
            isBad={true}
          />
          
          <Card 
            title="The FolioFyX Way" 
            desc="Interactive, 3D, and responsive. Proof of your skills."
            icon="🚀"
            isBad={false}
          />

          <Card 
            title="Instant Setup" 
            desc="Don't waste time coding the wrapper. Focus on the content."
            icon="⚡"
            isBad={false}
          />

        </div>
      </div>
    </section>
  );
}

const Card = ({ title, desc, icon, isBad }) => (
  <motion.div 
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ margin: "-50px" }}
    transition={{ duration: 0.5 }}
    className={`p-8 rounded-3xl border ${isBad ? 'border-red-500/20 bg-red-900/5' : 'border-purple-500/20 bg-purple-900/5'} backdrop-blur-sm`}
  >
    <div className="text-4xl mb-4">{icon}</div>
    <h4 className={`text-2xl font-bold mb-2 ${isBad ? 'text-red-200' : 'text-white'}`}>{title}</h4>
    <p className="text-gray-400">{desc}</p>
  </motion.div>
);