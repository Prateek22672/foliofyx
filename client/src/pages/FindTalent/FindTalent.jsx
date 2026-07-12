// FindTalent.jsx
import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getPublicPortfolios } from "../../api/portfolioAPI";
import debounce from "lodash.debounce";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

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
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">

      {/* 1. HERO SECTION */}
      <TalentLandingHero handleStart={handleStart} />

      {/* 2. SEARCH & STATS PANEL */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 -mt-16">
        {/* Soft pastel glow behind the panel */}
        <div
          aria-hidden="true"
          className="absolute inset-x-8 -inset-y-6 pointer-events-none blur-[60px] opacity-70"
          style={{
            background:
              "linear-gradient(100deg, rgba(233,213,255,0.5) 0%, rgba(251,207,232,0.4) 45%, rgba(199,210,254,0.45) 100%)",
          }}
        />

        {/* Gradient 1px edge */}
        <div
          className="relative rounded-3xl p-px shadow-[0_24px_80px_-24px_rgba(0,0,0,0.18)]"
          style={{
            background:
              "linear-gradient(120deg, rgba(216,180,254,0.6), rgba(0,0,0,0.08) 35%, rgba(0,0,0,0.08) 65%, rgba(165,180,252,0.6))",
          }}
        >
          <div className="relative rounded-[calc(1.5rem-1px)] bg-white overflow-hidden">

            {/* Search */}
            <div className="relative z-10 pt-10 pb-6 px-4 sm:px-8">
              <SearchSection search={search} setSearch={setSearch} reload={load} />
            </div>

            {/* Stats */}
            <div className="relative z-10 border-t border-black/10">
              <StatsSection talents={talents} />
            </div>
          </div>
        </div>
      </div>

      {/* 3. CONTENT AREA */}
      {isSearching ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 mt-16 pb-24 min-h-[50vh]"
        >
          <div className="flex items-baseline gap-3 mb-8">
            <h3 className="text-xl font-medium tracking-tight text-black">
              Search results
            </h3>
            {!loading && (
              <span className="text-sm text-gray-500">
                {filtered.length} {filtered.length === 1 ? "profile" : "profiles"}
              </span>
            )}
          </div>
          <TalentGrid filtered={filtered} loading={loading} openCard={openCard} />
        </motion.div>
      ) : (
        <div className="relative z-10 space-y-28 pb-28">

          {/* A. SHOWCASE */}
          <div className="pt-24">
            <HorizontalShowcase />
          </div>

          {/* B. MAIN TALENT GRID */}
          <section className="relative max-w-7xl mx-auto px-4 sm:px-6" aria-labelledby="featured-creatives">
            {/* Diagonal background watermark */}
            <div
              aria-hidden="true"
              className="absolute inset-0 overflow-hidden pointer-events-none select-none"
            >
              <span className="absolute -left-8 top-1/3 -rotate-6 text-[11rem] md:text-[16rem] font-['Syne'] font-black uppercase tracking-tighter leading-none whitespace-nowrap text-black/[0.03]">
                TALENT
              </span>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative z-10 flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6"
            >
              <div>
                <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-gray-500">
                  Directory
                </span>
                <h2
                  id="featured-creatives"
                  className="text-4xl md:text-5xl font-black tracking-tighter mt-3 text-black font-['Syne']"
                >
                  Featured creatives
                </h2>
              </div>
              <button
                onClick={() => setSearch("Re")}
                className="group inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-black border-b border-black/20 hover:border-black pb-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black rounded-sm"
              >
                View all categories
                <ArrowUpRight
                  size={14}
                  className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </button>
            </motion.div>
            <div className="relative z-10">
              <TalentGrid filtered={filtered.slice(0, 9)} loading={loading} openCard={openCard} />
            </div>
          </section>

          {/* C. CATEGORIES & INSIGHTS */}
          <div className="relative border-y border-black/10 bg-[#FAFAFA] py-24 overflow-hidden">
            {/* Diagonal background watermark */}
            <div
              aria-hidden="true"
              className="absolute inset-0 overflow-hidden pointer-events-none select-none"
            >
              <span className="absolute -right-10 top-[8%] -rotate-6 text-[11rem] md:text-[16rem] font-['Syne'] font-black uppercase tracking-tighter leading-none whitespace-nowrap text-black/[0.03]">
                CREATORS
              </span>
            </div>
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
              <Reveal>
                <WhyTalentSection />
              </Reveal>
              <div className="mt-24">
                <SmartTalentInsights talents={filtered} />
              </div>
            </div>
          </div>

          {/* D. CTA SECTION */}
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="relative rounded-3xl overflow-hidden bg-black text-white text-center py-24 px-6 md:px-20"
            >
              {/* Subtle grid texture */}
              <div
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none opacity-40"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
                  backgroundSize: "72px 72px",
                  maskImage:
                    "radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 80%)",
                  WebkitMaskImage:
                    "radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 80%)",
                }}
              />

              <span className="relative z-10 inline-block text-[11px] font-semibold tracking-[0.25em] uppercase text-white/60 mb-6">
                The FolioFYX Network
              </span>
              <h2 className="relative z-10 text-4xl md:text-6xl font-black tracking-tighter mb-6 font-['Syne']">
                Join the network
              </h2>
              <p className="relative z-10 text-white/60 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-light leading-relaxed">
                Create your portfolio in seconds and get discovered by top
                companies worldwide.
              </p>
              <button
                onClick={handleStart}
                className="relative z-10 inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full font-semibold text-base hover:bg-gray-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              >
                Create portfolio
                <ArrowUpRight size={18} />
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
