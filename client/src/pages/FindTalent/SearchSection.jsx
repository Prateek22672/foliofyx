import React from "react";
import { Search, RefreshCcw, Filter, X } from "lucide-react";
import { motion } from "framer-motion";

const QUICK_TAGS = ["React", "HTML", "CSS", "Node.js", "UI/UX"];

export default function SearchSection({ search, setSearch, reload }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full max-w-3xl mx-auto"
    >
      {/* Search bar */}
      <div className="flex items-center gap-3 bg-black/[0.03] rounded-full pl-5 pr-2 py-2 border border-black/10 transition-colors focus-within:border-black focus-within:bg-white focus-within:ring-2 focus-within:ring-black/10">
        <Search size={18} className="text-gray-400 shrink-0" aria-hidden="true" />

        <input
          type="text"
          placeholder="Search by name, role, or skill"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search talent"
          className="bg-transparent flex-1 outline-none text-black placeholder-gray-400 text-sm py-2 min-w-0"
        />

        {search && (
          <button
            onClick={() => setSearch("")}
            aria-label="Clear search"
            className="p-2 rounded-full text-gray-400 hover:text-black hover:bg-black/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
          >
            <X size={14} />
          </button>
        )}

        <div className="flex items-center gap-1.5">
          <button
            onClick={reload}
            aria-label="Refresh talent list"
            className="p-2.5 rounded-full text-gray-500 hover:text-black hover:bg-black/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
          >
            <RefreshCcw size={15} />
          </button>
          <button
            aria-label="Filter results"
            className="p-2.5 rounded-full text-gray-500 hover:text-black hover:bg-black/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
          >
            <Filter size={15} />
          </button>
        </div>
      </div>

      {/* Quick tags */}
      <div className="flex gap-2 flex-wrap mt-4 justify-center">
        {QUICK_TAGS.map((tag) => {
          const isActive = search === tag;
          return (
            <button
              key={tag}
              onClick={() => setSearch(isActive ? "" : tag)}
              aria-pressed={isActive}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black ${
                isActive
                  ? "bg-black text-white border-black"
                  : "bg-black/5 text-gray-600 border-transparent hover:border-black/20 hover:text-black"
              }`}
            >
              {tag}
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
