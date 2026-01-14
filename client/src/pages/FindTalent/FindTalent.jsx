// FindTalent.jsx
import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import { getPublicPortfolios } from "../../api/portfolioAPI";
import debounce from "lodash.debounce";
import { motion } from "framer-motion";

import TalentLandingHero from "./TalentLandingHero";
import SearchSection from "./SearchSection";
import WhyTalentSection from "./WhyTalentSection";
import TalentGrid from "./TalentGrid";
import TalentModal from "./TalentModal";
import HorizontalShowcase from "./HorizontalShowcase";
import StatsSection from "./StatsSection";
import Reveal from "../../components/Reveal";
import SmartTalentInsights from "./SmartTalentInsights";
import Footer from "../../components/Footer";

export default function FindTalent() {
  const navigate = useNavigate();
  const [talents, setTalents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTalent, setSelectedTalent] = useState(null);

  const isSearching = search.trim().length > 0;

  const handleStart = () => {
    navigate("/create"); 
  };

  const load = async () => {
    setLoading(true);
    try {
      const data = await getPublicPortfolios();
      setTalents(data || []);
      setFiltered(data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const doSearch = useMemo(
    () =>
      debounce((q) => {
        const s = q.toLowerCase();
        if (!s) return setFiltered(talents);

        setFiltered(
          talents.filter(
            (t) =>
              t.name?.toLowerCase().includes(s) ||
              t.role?.toLowerCase().includes(s) ||
              (t.skills || []).some((sk) =>
                sk.name?.toLowerCase().includes(s)
              )
          )
        );
      }, 250),
    [talents]
  );

  useEffect(() => {
    doSearch(search);
  }, [search, doSearch]);

  const openCard = (t) => {
    setSelectedTalent(t);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-black selection:text-white">
      
      {/* 1. HERO SECTION */}
      <div className="relative pt-2">
        <TalentLandingHero handleStart={handleStart} />
      </div>

      {/* 2. SEARCH & STATS SECTION (with Background Image) */}
      <div className="relative z-20 -mt-8 px-0 max-w-7xl mx-auto">

        
        <div 
          className="relative rounded-[0rem] overflow-hidden shadow-2xl py-19 "
          style={{ 
             // ✅ Updated path to your public folder image
             backgroundImage: 'url("/cards2.jpeg")', 
             backgroundSize: 'cover', 
             backgroundPosition: 'center' 
          }}
        >
          {/* Dark Overlay for better text readability */}
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>


          {/* Stats Section */}
          <div className="relative z-10 pb-8 pt-4">
             <StatsSection talents={talents} />
          </div>

                    {/* Search Section */}
          <div className="relative z-10 pt-8 pb-4">
             <SearchSection search={search} setSearch={setSearch} reload={load} />
          </div>

        </div>
        
      </div>


      {/* 3. CONTENT AREA */}
      {isSearching ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-7xl mx-auto px-4 mt-12 pb-20 min-h-[50vh]"
        >
          <h3 className="text-xl font-medium mb-6 text-gray-400">Search Results</h3>
          <TalentGrid filtered={filtered} loading={loading} openCard={openCard} />
        </motion.div>
      ) : (
        <div className="relative z-10 space-y-24 pb-24">
          
          {/* A. SHOWCASE */}
          <div className="pt-24">
              <HorizontalShowcase />
          </div>

          {/* B. MAIN TALENT GRID */}
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
               <div>
                 <span className="text-xs font-bold tracking-widest uppercase text-gray-400">Directory</span>
                 <h2 className="text-4xl md:text-5xl text-center font-medium tracking-tight mt-2 text-black">
                   Featured Creatives
                 </h2>
               </div>
               <button onClick={() => setSearch("Re")} className="text-sm font-bold border-b border-black pb-1 hover:opacity-60 transition">
                 View All Categories
               </button>
            </div>
            <TalentGrid filtered={filtered.slice(0, 9)} loading={loading} openCard={openCard} />
          </div>

          {/* C. CATEGORIES & INSIGHTS */}
          <div className="bg-[#FAFAFA] py-24 border-y border-gray-100">
              <div className="max-w-7xl mx-auto px-4">
                <Reveal>
                  <WhyTalentSection />
                </Reveal>
                <div className="mt-20">
                   <SmartTalentInsights talents={filtered} />
                </div>
              </div>
          </div>

          {/* D. CTA SECTION */}
          <div className="max-w-5xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative rounded-[3rem] overflow-hidden bg-black text-white text-center py-24 px-6 md:px-20 shadow-2xl"
            >
               {/* Abstract decorative circles */}
               <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
               <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
               
               <h2 className="relative z-10 text-4xl md:text-6xl font-bold tracking-tighter mb-6">
                 Join the Network.
               </h2>
               <p className="relative z-10 text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-light">
                 Create your portfolio in seconds and get discovered by top companies worldwide.
               </p>
               <button 
                 onClick={handleStart}
                 className="relative z-10 bg-white text-black px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-200 transition-colors"
               >
                 Create Portfolio
               </button>
            </motion.div>
          </div>

        </div>
      )}

      <TalentModal open={modalOpen} talent={selectedTalent} onClose={() => setModalOpen(false)} />
      <Footer />
    </div>
  );
}