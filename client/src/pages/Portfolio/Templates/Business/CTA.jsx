import React from "react";
import { motion } from "framer-motion";

const CTA = () => {
  return (
    <section className="py-24 px-6 bg-[#111] text-white font-[Switzer] rounded-t-[3rem] mt-20">
      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-end gap-12">
        
        <div>
            <span className="inline-block px-4 py-2 rounded-full border border-white/20 text-xs font-medium bg-white/5 backdrop-blur-sm mb-8 text-[#ccff00]">
                Spots limited for February
            </span>
            <h2 className="text-5xl md:text-8xl font-medium tracking-tighter mb-6">
                Ready to <span className="text-[#ccff00]">sprint?</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-xl">
                Stop overthinking and start building. Get your brand market-ready in record time.
            </p>
        </div>

        <motion.a 
            href="#contact" 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center w-full md:w-auto px-10 py-12 bg-[#ccff00] text-black text-2xl font-bold rounded-[2rem] hover:bg-white transition-colors"
        >
            Reserve your spot →
        </motion.a>

      </div>
    </section>
  );
};

export default CTA;