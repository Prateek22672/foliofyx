import React from "react";
import { motion } from "framer-motion";

const BentoItem = ({ title, sub, icon: Icon, colSpan, rowSpan, children, tags = [] }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      whileInView={{ opacity: 1, y: 0 }} 
      viewport={{ once: true }} 
      transition={{ duration: 0.5, ease: "easeOut" }} 
      className={`group relative overflow-hidden rounded-3xl bg-[#0a0a0a] border border-white/10 hover:border-[#D4AF37]/40 hover:shadow-2xl hover:shadow-[#D4AF37]/5 transition-all duration-500 flex flex-col justify-between ${colSpan || "col-span-1"} ${rowSpan || "row-span-1"}`}
    >
      <div className="relative z-10 p-8 h-full flex flex-col">
        <div className="flex justify-between items-start mb-6">
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-neutral-400 group-hover:text-[#D4AF37] group-hover:bg-[#D4AF37]/10 transition-all">
            <Icon size={24} />
          </div>
        </div>
        <div className="mb-4">
          <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
          <p className="text-neutral-400 text-sm">{sub}</p>
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {tags.map((tag, i) => (
              <span key={i} className="px-2 py-1 rounded-md bg-white/5 border border-white/5 text-[10px] text-neutral-400">#{tag}</span>
            ))}
          </div>
        )}
        {children && <div className="flex-grow relative mt-2 rounded-xl overflow-hidden border border-white/5 bg-black/20">{children}</div>}
      </div>
    </motion.div>
  );
};

export default BentoItem;