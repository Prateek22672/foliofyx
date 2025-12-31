import React from "react";
import { motion } from "framer-motion";

const Process = () => {
  return (
    <section className="relative py-32 bg-white font-[Switzer] overflow-hidden">
      <div className="relative max-w-[1400px] mx-auto px-6">
        
        <div className="grid lg:grid-cols-12 gap-16 items-start">
            
            {/* Decorative Icons (The squares from the screenshot) */}
            <div className="hidden lg:grid lg:col-span-2 grid-cols-3 gap-2 opacity-20">
                {[...Array(9)].map((_, i) => (
                    <div key={i} className="w-1.5 h-1.5 bg-black rounded-full" />
                ))}
            </div>

            {/* Main Typographic Content */}
            <div className="lg:col-span-10">
                <motion.h2 
                    initial={{ opacity: 0, y: 20 }} 
                    whileInView={{ opacity: 1, y: 0 }} 
                    viewport={{ once: true }}
                    className="text-4xl md:text-6xl lg:text-[5rem] font-medium tracking-tight leading-[1.05] text-[#111] mb-12"
                >
                    At FolioFYX, we believe exceptional branding is possible without the wait. 
                    <br/><br/>
                    <span className="text-gray-400">So we created Brand Sprints: timeless branding in just two weeks.</span>
                </motion.h2>

                {/* Timeline Bar */}
                <div className="mt-24 relative">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
                        <span>Kickoff</span>
                        <span>Strategy</span>
                        <span>Design</span>
                        <span>Full Brand</span>
                    </div>
                    <div className="w-full h-[2px] bg-gray-200 relative">
                        <motion.div 
                            initial={{ width: 0 }} 
                            whileInView={{ width: "100%" }} 
                            transition={{ duration: 1.5, ease: "easeInOut" }}
                            className="absolute top-0 left-0 h-full bg-[#111]"
                        />
                    </div>
                    {/* Dots on timeline */}
                    <div className="absolute top-6 w-full flex justify-between -mt-[29px]">
                        <div className="w-3 h-3 bg-black rounded-full" />
                        <div className="w-3 h-3 bg-white border-2 border-black rounded-full" />
                    </div>
                </div>
            </div>

        </div>
      </div>
    </section>
  );
};

export default Process;