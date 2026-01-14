import React from "react";
import { motion } from "framer-motion";
import { Play, MoreHorizontal, TrendingUp, Star, Eye, Zap } from "lucide-react";

// --- SUB-COMPONENTS ---

// 1. Skill Demand Heatmap (Insights)
const SkillsHeatmap = () => (
  <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 h-full flex flex-col justify-between overflow-hidden relative">
    <div className="flex justify-between items-start mb-2 relative z-10">
      <div>
        <h3 className="font-bold text-gray-800">Skill Demand</h3>
        <p className="text-[10px] text-gray-400">Live search queries</p>
      </div>
      <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-bold flex items-center gap-1">
        <Zap size={10} className="fill-yellow-400 text-yellow-400" /> Hot
      </span>
    </div>
    
    <div className="space-y-4 mt-2 relative z-10">
      {/* Skill Row 1 */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold text-gray-500 uppercase w-12">UX/UI</span>
        <div className="flex gap-1.5 flex-1">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0.5 }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, delay: i * 0.1, repeat: Infinity }}
              className={`h-6 flex-1 rounded-sm ${i < 6 ? "bg-[#d9f99d]" : "bg-gray-100"}`} 
            />
          ))}
        </div>
      </div>
      {/* Skill Row 2 */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold text-gray-500 uppercase w-12">React</span>
        <div className="flex gap-1.5 flex-1">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <motion.div 
              key={i} 
              className={`h-6 flex-1 rounded-sm ${i < 5 ? "bg-[#d9f99d]" : "bg-gray-100"}`} 
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
    whileHover={{ scale: 1.02 }}
    className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors px-3 -mx-3 rounded-xl cursor-pointer"
  >
    <div className="flex items-center gap-3">
      <div className="relative">
        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden ring-2 ring-white shadow-sm">
          <img src={`https://ui-avatars.com/api/?name=${name}&background=random&color=fff`} alt={name} className="w-full h-full object-cover" />
        </div>
        {isLive && (
          <div className="absolute -bottom-0.5 -right-0.5 bg-white rounded-full p-[2px]">
            <div className="w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
          </div>
        )}
      </div>
      <div>
        <h4 className="text-sm font-bold text-gray-900 leading-none">{name}</h4>
        <div className="flex items-center gap-1.5 mt-1">
          <span className="text-[9px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded uppercase tracking-wider font-semibold">{role}</span>
        </div>
      </div>
    </div>
    
    <div className="flex items-center gap-4 text-right">
      <div className="hidden sm:block text-right">
        <p className="text-[9px] text-gray-400 uppercase font-bold tracking-wider">Views</p>
        <div className="flex items-center gap-1 justify-end text-blue-600">
          <Eye size={12} />
          <span className="text-xs font-bold">{views}</span>
        </div>
      </div>
      
      <div className="bg-gray-900 text-white px-2.5 py-1.5 rounded-lg flex items-center gap-1 shadow-lg shadow-gray-200">
        <Star size={10} fill="currentColor" className="text-yellow-400" />
        <span className="text-xs font-bold">{score}</span>
      </div>
    </div>
  </motion.div>
);

const TopTalentList = () => (
  <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 h-full flex flex-col">
    <div className="flex justify-between items-center mb-4">
      <div>
        <h3 className="font-bold text-gray-800">Best Profiles</h3>
        <p className="text-xs text-gray-400">Top performers this week</p>
      </div>
      <button className="p-2 hover:bg-gray-50 rounded-full transition-colors">
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

// 3. Live Activity Card (Animated Bars)
const ActivityCard = () => (
  <div className="bg-[#3B82F6] rounded-3xl p-6 text-white relative overflow-hidden shadow-lg shadow-blue-500/30 h-full flex flex-col justify-between group">
    
    {/* Background Glow */}
    <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-400/30 rounded-full blur-3xl group-hover:bg-blue-300/40 transition-colors duration-700" />

    <div className="flex justify-between items-start relative z-10">
      <div>
        <h3 className="font-bold text-lg tracking-tight">Talent Activity</h3>
        <div className="flex items-center gap-1.5 mt-1">
           <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            <p className="text-blue-100 text-xs font-medium opacity-90">Live engagement</p>
        </div>
      </div>
      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md shadow-inner border border-white/10 cursor-pointer hover:scale-105 transition-transform">
        <Play size={14} fill="currentColor" className="ml-0.5" />
      </div>
    </div>
    
    {/* Live Audio-Wave Visualization */}
    <div className="flex items-end gap-1 h-24 relative z-10 mt-6 mx-1">
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
  <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 h-full flex flex-col justify-between">
    <div className="flex justify-between items-center mb-2">
      <h3 className="font-bold text-gray-800">Growth Chart</h3>
      <span className="text-[10px] bg-black text-white px-2 py-1 rounded-md">YTD</span>
    </div>
    
    <div className="flex items-end gap-4 h-32 mt-4 px-2">
        {/* Bar 1 */}
        <div className="w-full flex flex-col justify-end gap-2 h-full group">
             <motion.div 
                initial={{ height: 0 }} 
                whileInView={{ height: "40%" }} 
                transition={{ duration: 1, delay: 0.2 }}
                className="w-full bg-[#d9f99d] rounded-t-xl opacity-80 group-hover:opacity-100 transition-opacity" 
             />
             <div className="text-center">
                <p className="text-[10px] font-bold text-gray-400">Mar</p>
                <p className="text-[9px] text-gray-300">123</p>
             </div>
        </div>
        
        {/* Bar 2 */}
        <div className="w-full flex flex-col justify-end gap-2 h-full group">
             <motion.div 
                initial={{ height: 0 }} 
                whileInView={{ height: "65%" }} 
                transition={{ duration: 1, delay: 0.4 }}
                className="w-full bg-gray-200 rounded-t-xl group-hover:bg-gray-300 transition-colors" 
             />
             <div className="text-center">
                <p className="text-[10px] font-bold text-gray-400">Apr</p>
                <p className="text-[9px] text-gray-300">89</p>
             </div>
        </div>

        {/* Bar 3 (Active) */}
        <div className="w-full flex flex-col justify-end gap-2 h-full relative group">
             <motion.div 
                initial={{ height: 0 }} 
                whileInView={{ height: "85%" }} 
                transition={{ duration: 1, delay: 0.6 }}
                className="w-full bg-[#3B82F6] rounded-t-xl shadow-lg shadow-blue-200 relative overflow-hidden" 
             >
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/20 to-transparent"></div>
             </motion.div>
             <div className="text-center">
                <p className="text-[10px] font-bold text-gray-900">May</p>
                <p className="text-[9px] text-blue-600 font-bold">174</p>
             </div>
             
             {/* Floating Badge */}
             <motion.div 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[9px] px-2 py-1 rounded shadow-xl whitespace-nowrap"
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
    <section className="relative py-24 bg-[#FAFAFA] text-black overflow-hidden font-['Switzer']">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] right-[-5%] w-[500px] h-[500px] bg-purple-200/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[10%] left-[-5%] w-[500px] h-[500px] bg-blue-200/20 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 md:px-6 max-w-6xl relative z-10">
        
        {/* Header Text */}
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-blue-600 mb-3 block">
              Website Insights
            </span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-gray-900 mb-4">
              Real-Time <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Talent Intelligence.
              </span>
            </h2>
          </motion.div>
        </div>

        {/* --- BENTO GRID LAYOUT --- */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-min">
          
          {/* LEFT COLUMN (Spans 7) */}
          <div className="md:col-span-7 flex flex-col gap-6">
            
            {/* Top: Heatmap (Smaller Height) */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="h-[140px]"
            >
              <SkillsHeatmap />
            </motion.div>

            {/* Bottom: Best Profiles List (Larger Height) */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex-1 min-h-[300px]"
            >
              <TopTalentList />
            </motion.div>
          </div>

          {/* RIGHT COLUMN (Spans 5) */}
          <div className="md:col-span-5 flex flex-col gap-6">
            
            {/* Top: Blue Activity (Medium Height) */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="h-[240px]"
            >
              <ActivityCard />
            </motion.div>

            {/* Bottom: Analytics (Flexible Height) */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex-1 min-h-[200px]"
            >
              <AnalyticsCard />
            </motion.div>
          </div>

        </div>

        {/* Floating Action Button */}
        <motion.div 
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          className="fixed bottom-8 right-8 z-50 md:absolute md:bottom-0 md:-right-12"
        >
          <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center shadow-2xl shadow-black/30 border border-white/10 cursor-pointer hover:scale-110 transition-transform">
             <div className="text-white font-black text-xs tracking-tighter">FY<span className="text-purple-500">X</span></div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}