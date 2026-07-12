import React from "react";
import { motion } from "framer-motion";
import { Code, PenTool, Monitor } from "lucide-react";

export default function WhyTalentSection() {
  const cats = [
    { icon: <Code size={20} aria-hidden="true" />, title: "Development", desc: "React, Node, Python" },
    { icon: <PenTool size={20} aria-hidden="true" />, title: "Design", desc: "UI/UX, Branding" },
    { icon: <Monitor size={20} aria-hidden="true" />, title: "Marketing", desc: "SEO, Content" },
  ];

  return (
    <div>
      <div className="text-center mb-12">
        <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-gray-500">
          Categories
        </span>
        <h2 className="text-3xl md:text-4xl font-black tracking-tighter mt-3 text-black font-['Syne']">
          Browse by category
        </h2>
      </div>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
        {cats.map((c, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
            className="group p-8 rounded-3xl border border-black/10 bg-white hover:border-black/20 hover:-translate-y-1 shadow-sm hover:shadow-lg hover:shadow-black/[0.06] transition-all duration-300"
          >
            <div className="w-12 h-12 bg-black/[0.04] border border-black/10 rounded-xl flex items-center justify-center text-black group-hover:bg-black group-hover:text-white group-hover:border-black transition-colors duration-300 mb-6">
              {c.icon}
            </div>
            <h3 className="text-lg font-semibold text-black mb-1.5">{c.title}</h3>
            <p className="text-gray-500 text-sm">{c.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
