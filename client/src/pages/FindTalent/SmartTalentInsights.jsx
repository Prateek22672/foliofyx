import React from "react";
import { motion } from "framer-motion";
import { Play, MoreHorizontal, Star, Eye, Zap } from "lucide-react";

// --- SUB-COMPONENTS ---

// 1. Skill Demand Heatmap (Insights)
const SkillsHeatmap = () => (
  <div className="bg-white rounded-2xl p-6 border border-black/10 shadow-sm h-full flex flex-col justify-between overflow-hidden relative">
    <div className="flex justify-between items-start mb-2 relative z-10">
      <div>
        <h3 className="font-semibold text-black text-sm">Skill Demand</h3>
        <p className="text-[10px] text-gray-500 mt-0.5">Live search queries</p>
      </div>
      <span className="text-[10px] bg-black/5 text-black px-2 py-1 rounded-full font-semibold flex items-center gap-1">
        <Zap size={10} className="fill-indigo-500 text-indigo-500" aria-hidden="true" /> Hot
      </span>
    </div>

    <div className="space-y-4 mt-2 relative z-10">
      {/* Skill Row 1 */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider w-12">UX/UI</span>
        <div className="flex gap-1.5 flex-1">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0.5 }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, delay: i * 0.1, repeat: Infinity }}
              className={`h-6 flex-1 rounded-sm ${i < 6 ? "bg-black/60" : "bg-black/[0.06]"}`}
            />
          ))}
        </div>
      </div>
      {/* Skill Row 2 */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider w-12">React</span>
        <div className="flex gap-1.5 flex-1">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div
              key={i}
              className={`h-6 flex-1 rounded-sm ${i < 5 ? "bg-black/30" : "bg-black/[0.06]"}`}
            />
          ))}
        </div>
      </div>
    </div>
  </div>
);

// 2. Best Profiles / Top Talent List
const TopTalentRow = ({ name, role, views, score, isLive }) => (
  <motion.div
    whileHover={{ scale: 1.01 }}
    className="flex items-center justify-between py-4 border-b border-black/5 last:border-0 hover:bg-black/[0.02] transition-colors px-3 -mx-3 rounded-xl cursor-pointer"
  >
    <div className="flex items-center gap-3">
      <div className="relative">
        <div className="w-10 h-10 rounded-full bg-black/5 overflow-hidden ring-1 ring-black/10">
          <img
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=f4f4f5&color=18181b`}
            alt={`${name} avatar`}
            className="w-full h-full object-cover"
          />
        </div>
        {isLive && (
          <span className="absolute -bottom-0.5 -right-0.5 bg-white rounded-full p-[2px]" aria-hidden="true">
            <span className="block w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white animate-pulse" />
          </span>
        )}
      </div>
      <div>
        <h4 className="text-sm font-semibold text-black leading-none">{name}</h4>
        <div className="flex items-center gap-1.5 mt-1.5">
          <span className="text-[9px] bg-black/5 text-gray-600 px-1.5 py-0.5 rounded uppercase tracking-wider font-semibold">
            {role}
          </span>
        </div>
      </div>
    </div>

    <div className="flex items-center gap-4 text-right">
      <div className="hidden sm:block text-right">
        <p className="text-[9px] text-gray-400 uppercase font-semibold tracking-wider">Views</p>
        <div className="flex items-center gap-1 justify-end text-gray-600">
          <Eye size={12} aria-hidden="true" />
          <span className="text-xs font-semibold">{views}</span>
        </div>
      </div>

      <div className="bg-black/5 text-black px-2.5 py-1.5 rounded-lg flex items-center gap-1">
        <Star size={10} fill="currentColor" className="text-black" aria-hidden="true" />
        <span className="text-xs font-semibold">{score}</span>
      </div>
    </div>
  </motion.div>
);

const TopTalentList = () => (
  <div className="bg-white rounded-2xl p-6 border border-black/10 shadow-sm h-full flex flex-col">
    <div className="flex justify-between items-center mb-4">
      <div>
        <h3 className="font-semibold text-black text-sm">Best Profiles</h3>
        <p className="text-xs text-gray-500 mt-0.5">Top performers this week</p>
      </div>
      <button
        aria-label="More options"
        className="p-2 hover:bg-black/5 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
      >
        <MoreHorizontal size={16} className="text-gray-400" />
      </button>
    </div>
    <div className="flex flex-col flex-1 justify-center">
      <TopTalentRow name="Neha Verma" role="Product" views="1.2k" score="9.8" isLive={true} />
      <TopTalentRow name="Dev Thinnda" role="Engineering" views="940" score="9.5" isLive={false} />
      <TopTalentRow name="Aanya Sharma" role="Design" views="850" score="9.2" isLive={true} />
    </div>
  </div>
);

// 3. Live Activity Card (Animated Bars) — the single brand contrast tile
const ActivityCard = () => (
  <div className="bg-[#0d0d82] rounded-2xl p-6 text-white relative overflow-hidden border border-black/10 shadow-lg shadow-[#0d0d82]/20 h-full flex flex-col justify-between group">

    <div className="flex justify-between items-start relative z-10">
      <div>
        <h3 className="font-semibold text-lg tracking-tight">Talent Activity</h3>
        <div className="flex items-center gap-1.5 mt-1">
          <span className="relative flex h-2 w-2" aria-hidden="true">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
          <p className="text-white/80 text-xs font-medium">Live engagement</p>
        </div>
      </div>
      <button
        aria-label="Play activity feed"
        className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center backdrop-blur-md border border-white/10 cursor-pointer hover:scale-105 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
      >
        <Play size={14} fill="currentColor" className="ml-0.5" aria-hidden="true" />
      </button>
    </div>

    {/* Live audio-wave visualization */}
    <div className="flex items-end gap-1 h-24 relative z-10 mt-6 mx-1" aria-hidden="true">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            height: [
              `${Math.random() * 40 + 20}%`,
              `${Math.random() * 90 + 10}%`,
              `${Math.random() * 40 + 20}%`
            ]
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.05 // Staggered effect
          }}
          className="flex-1 bg-white/40 rounded-full origin-bottom hover:bg-white/80 transition-colors"
        />
      ))}
    </div>

    <div className="flex justify-between items-center mt-2 relative z-10 opacity-60">
      <span className="text-[10px] font-mono">04:20 PM</span>
      <span className="text-[10px] font-mono">LIVE</span>
    </div>
  </div>
);

// 4. Analytics / Employment Chart
const AnalyticsCard = () => (
  <div className="bg-white rounded-2xl p-6 border border-black/10 shadow-sm h-full flex flex-col justify-between">
    <div className="flex justify-between items-center mb-2">
      <h3 className="font-semibold text-black text-sm">Growth Chart</h3>
      <span className="text-[10px] bg-black/5 text-gray-600 px-2 py-1 rounded-md font-semibold">YTD</span>
    </div>

    <div className="flex items-end gap-4 h-32 mt-4 px-2">
      {/* Bar 1 */}
      <div className="w-full flex flex-col justify-end gap-2 h-full group">
        <motion.div
          initial={{ height: 0 }}
          whileInView={{ height: "40%" }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          className="w-full bg-black/20 rounded-t-lg group-hover:bg-black/30 transition-colors"
        />
        <div className="text-center">
          <p className="text-[10px] font-semibold text-gray-500">Mar</p>
          <p className="text-[9px] text-gray-400">123</p>
        </div>
      </div>

      {/* Bar 2 */}
      <div className="w-full flex flex-col justify-end gap-2 h-full group">
        <motion.div
          initial={{ height: 0 }}
          whileInView={{ height: "65%" }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.4 }}
          className="w-full bg-black/10 rounded-t-lg group-hover:bg-black/15 transition-colors"
        />
        <div className="text-center">
          <p className="text-[10px] font-semibold text-gray-500">Apr</p>
          <p className="text-[9px] text-gray-400">89</p>
        </div>
      </div>

      {/* Bar 3 (Active) */}
      <div className="w-full flex flex-col justify-end gap-2 h-full relative group">
        <motion.div
          initial={{ height: 0 }}
          whileInView={{ height: "85%" }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.6 }}
          className="w-full bg-black rounded-t-lg shadow-[0_8px_32px_-8px_rgba(0,0,0,0.4)] relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/20 to-transparent"></div>
        </motion.div>
        <div className="text-center">
          <p className="text-[10px] font-semibold text-black">May</p>
          <p className="text-[9px] text-gray-600 font-semibold">174</p>
        </div>

        {/* Floating badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1.2 }}
          className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[9px] font-semibold px-2 py-1 rounded shadow-xl whitespace-nowrap"
        >
          +10% Growth
        </motion.div>
      </div>
    </div>
  </div>
);

// --- MAIN SECTION ---

export default function SectionTalent() {
  return (
    <section className="relative text-black overflow-hidden">

      {/* Soft pastel aurora backdrop */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          maskImage:
            "radial-gradient(ellipse 90% 80% at 50% 50%, black 40%, transparent 90%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 90% 80% at 50% 50%, black 40%, transparent 90%)",
        }}
      >
        <div
          className="absolute left-[-6%] top-[10%] w-[40vw] h-[40vw] max-w-[520px] max-h-[520px] rounded-full blur-[110px]"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(233,213,255,0.5) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute right-[-4%] top-[30%] w-[38vw] h-[38vw] max-w-[480px] max-h-[480px] rounded-full blur-[120px]"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(251,207,232,0.4) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute left-[30%] bottom-[-10%] w-[42vw] h-[32vw] max-w-[560px] max-h-[420px] rounded-full blur-[130px]"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(199,210,254,0.4) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="mx-auto max-w-6xl relative z-10">

        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-gray-500 mb-3 block">
              Network Insights
            </span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-black font-['Syne']">
              Real-time
              <br />
              <span className="text-gray-400">talent intelligence</span>
            </h2>
          </motion.div>
        </div>

        {/* --- BENTO GRID LAYOUT --- */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 auto-rows-min">

          {/* LEFT COLUMN (Spans 7) */}
          <div className="md:col-span-7 flex flex-col gap-5">

            {/* Top: Heatmap */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="min-h-[160px]"
            >
              <SkillsHeatmap />
            </motion.div>

            {/* Bottom: Best Profiles list */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex-1 min-h-[300px]"
            >
              <TopTalentList />
            </motion.div>
          </div>

          {/* RIGHT COLUMN (Spans 5) */}
          <div className="md:col-span-5 flex flex-col gap-5">

            {/* Top: Activity */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="h-[240px]"
            >
              <ActivityCard />
            </motion.div>

            {/* Bottom: Analytics */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex-1 min-h-[200px]"
            >
              <AnalyticsCard />
            </motion.div>
          </div>

        </div>

      </div>
    </section>
  );
}
