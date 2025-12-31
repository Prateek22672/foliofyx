import React from "react";
import { motion } from "framer-motion";
import { usePortfolio } from "../../../../context/PortfolioContext";

const Services = () => {
  const { portfolioData } = usePortfolio();
  const data = portfolioData || {};

  const services = data.services || [
    { title: "Brand Identity", desc: "Logo, typography, and visual systems.", bg: "bg-blue-50" },
    { title: "Web Design", desc: "High-converting Framer websites.", bg: "bg-gray-50" },
    { title: "Pitch Decks", desc: "Storytelling that raises capital.", bg: "bg-[#f4f4f5]" },
  ];

  return (
    <section id="services" className="relative py-24 bg-white font-[Switzer]">
      <div className="relative max-w-[1400px] mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 px-2">
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-[#111]">Selected Work</h2>
            <p className="text-gray-400 text-lg mt-4 md:mt-0">Real results for real startups.</p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Card 1: Large Gradient Card (Like "Lovable") */}
            <motion.div 
               className="aspect-[4/3] rounded-[2.5rem] relative overflow-hidden group p-12 flex flex-col justify-end"
               initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            >
               {/* Background Gradient */}
               <div className="absolute inset-0 bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 opacity-90 group-hover:scale-105 transition-transform duration-700" />
               <div className="absolute inset-0 bg-black/10" />
               
               <div className="relative z-10 text-white">
                   <div className="bg-white/20 backdrop-blur-md w-fit px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4">Fintech</div>
                   <h3 className="text-5xl font-medium mb-2 tracking-tight">Lovable</h3>
               </div>
            </motion.div>

            {/* Card 2: Soft Blue Card (Like "Craft") */}
            <motion.div 
               className="aspect-[4/3] rounded-[2.5rem] bg-[#e0f2fe] relative overflow-hidden group p-12 flex flex-col justify-end"
               initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            >
               {/* Decorative Abstract Elements */}
               <div className="absolute top-10 right-10 w-32 h-32 bg-blue-400 rounded-full blur-3xl opacity-50" />
               <div className="absolute bottom-10 left-10 w-40 h-40 bg-purple-300 rounded-full blur-3xl opacity-40" />

               <div className="relative z-10 text-[#1e293b]">
                   <div className="bg-white/60 backdrop-blur-md w-fit px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4">SaaS</div>
                   <h3 className="text-5xl font-medium mb-2 tracking-tight">Craft</h3>
               </div>
            </motion.div>

        </div>

      </div>
    </section>
  );
};

export default Services;