import React, { useMemo } from "react";
import { motion } from "framer-motion";

export default function SmartTalentInsights({ talents = [] }) {
  const topTalent = talents[0] || {};

  // Skill Heatmap Logic
  const skillMap = useMemo(() => {
    const map = {};
    talents.forEach((t) => {
      (t.skills || []).forEach((s) => {
        if (!map[s.name]) map[s.name] = 0;
        map[s.name] += 1;
      });
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [talents]);

  return (
    <div className="grid md:grid-cols-2 gap-6">
      
      {/* 1. TRENDING SKILLS (Minimalist Bar Chart) */}
      <motion.div 
        whileHover={{ y: -5 }}
        className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)]"
      >
        <h3 className="text-lg font-bold text-gray-900 mb-6">Trending Skills</h3>
        <div className="space-y-4">
          {skillMap.map(([skill, count], i) => (
            <div key={i} className="group">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-gray-700">{skill}</span>
                <span className="text-gray-400">{count} pros</span>
              </div>
              <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: `${Math.min((count / talents.length) * 100 * 3, 100)}%` }}
                  className="h-full bg-black rounded-full"
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* 2. FEATURED TALENT (Glass Style) */}
      <motion.div 
        whileHover={{ y: -5 }}
        className="relative bg-black text-white p-8 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col justify-between"
      >
        <div className="relative z-10">
            <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                Profile of the week
            </span>
            <div className="flex items-center gap-4">
                <img src={topTalent.image || "/default-profile.jpg"} className="w-16 h-16 rounded-full border-2 border-white/20" />
                <div>
                    <h3 className="text-2xl font-bold">{topTalent.name || "Loading..."}</h3>
                    <p className="text-gray-400">{topTalent.role}</p>
                </div>
            </div>
        </div>
        
        {/* Decorative Grid */}
        <div className="absolute inset-0 opacity-20" 
             style={{ backgroundImage: 'radial-gradient(circle, #333 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
        </div>
      </motion.div>

    </div>
  );
}