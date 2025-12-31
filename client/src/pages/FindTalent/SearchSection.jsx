import React from "react";
import { Search, RefreshCcw, Filter } from "lucide-react";
import { motion } from "framer-motion";

export default function SearchSection({ search, setSearch, reload }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full max-w-4xl mx-auto pb-10 px-4"
    >
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        
        {/* LEFT: Input + Tags */}
        <div className="flex-1">
          {/* Search Bar */}
          <div className="flex items-center gap-3 bg-white rounded-full px-4 py-3 shadow-sm border border-gray-100">
            <Search size={18} className="text-gray-400" />

            <input
              type="text"
              placeholder="Search talent by skills..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent flex-1 outline-none text-gray-700 placeholder-gray-400 text-sm"
            />

            {/* Desktop icons */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={reload}
                className="p-2 rounded-full bg-gray-50 hover:bg-gray-100 transition"
              >
                <RefreshCcw size={16} />
              </button>
              <button className="p-2 rounded-full bg-gray-50 hover:bg-gray-100 transition">
                <Filter size={16} />
              </button>
            </div>
          </div>

          {/* TAGS */}
          <div className="flex gap-3 flex-wrap mt-3 justify-center md:justify-start">
            {["React", "HTML", "CSS", "Node.js", "UI/UX"].map((tag) => (
              <button
                key={tag}
                onClick={() => setSearch(tag)}
                className="px-3 py-1.5 bg-white border border-gray-100 rounded-full text-xs shadow-sm hover:bg-gray-50 transition"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile icons */}
        <div className="flex items-center gap-3 ml-auto sm:hidden">
          <button
            onClick={reload}
            className="p-2 rounded-full bg-white border border-gray-100 shadow-sm"
          >
            <RefreshCcw size={16} />
          </button>
          <button className="p-2 rounded-full bg-white border border-gray-100 shadow-sm">
            <Filter size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}