import React from "react";
import { motion } from "framer-motion";

export default function StatsSection({ talents }) {
  const totalProfiles = talents.length;
  const totalSkills = talents.reduce((acc, t) => acc + (t.skills?.length || 0), 0);

  // Calculate top skill
  const skillMap = {};
  talents.forEach(t => t.skills?.forEach(s => skillMap[s.name] = (skillMap[s.name] || 0) + 1));
  const topSkill = Object.entries(skillMap).sort((a, b) => b[1] - a[1])[0]?.[0] || "Design";

  const stats = [
    { label: "Active Profiles", value: totalProfiles },
    { label: "Skills Indexed", value: totalSkills },
    { label: "Top Skill", value: topSkill },
    { label: "Hires this month", value: "142" }, // Static for demo
  ];

  return (
    <div className="w-full py-8 px-4 sm:px-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className={`text-center flex flex-col items-center px-4 ${
              i > 0 ? "md:border-l md:border-black/10" : ""
            }`}
          >
            <span className="text-3xl md:text-4xl font-black text-black tracking-tighter mb-2 font-['Syne'] truncate max-w-full">
              {stat.value}
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-medium">
              {stat.label}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
