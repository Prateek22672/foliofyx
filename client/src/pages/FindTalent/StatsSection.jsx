import React from "react";
import { motion } from "framer-motion";

export default function StatsSection({ talents }) {
  const totalProfiles = talents.length;
  const totalSkills = talents.reduce((acc, t) => acc + (t.skills?.length || 0), 0);
  
  // Calculate top skill
  const skillMap = {};
  talents.forEach(t => t.skills?.forEach(s => skillMap[s.name] = (skillMap[s.name] || 0) + 1));
  const topSkill = Object.entries(skillMap).sort((a,b) => b[1] - a[1])[0]?.[0] || "Design";

  const stats = [
    { label: "Active Profiles", value: totalProfiles },
    { label: "Skills Indexed", value: totalSkills },
    { label: "Top Skill", value: topSkill },
    { label: "Hires this month", value: "142" }, // Static for demo
  ];

  return (
    <div className="w-full py-12 border-y border-gray-100 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 justify-items-center">
          {stats.map((stat, i) => (
            <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="text-center flex flex-col items-center" // ✅ Forced Center Alignment
            >
              <h4 className="text-4xl md:text-5xl font-black text-black tracking-tighter mb-2">
                {stat.value}
              </h4>
              <p className="text-xs uppercase tracking-widest text-gray-400 font-medium">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}