import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import TalentCard from "./TalentCard";

export default function TalentGrid({ filtered, loading, openCard }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const INITIAL_LIMIT = 6; // ✅ Show 6 cards initially

  // Calculate which items to show
  const displayedTalents = isExpanded 
    ? filtered 
    : filtered.slice(0, INITIAL_LIMIT);

  // Animation variants for the grid items
  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } }
  };

  if (loading) {
    return (
        <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-2 border-gray-200 border-t-black rounded-full animate-spin"></div>
        </div>
    );
  }

  if (filtered.length === 0) {
    return (
      <div className="text-center py-20 bg-gray-50 rounded-3xl border border-gray-100">
        <p className="text-gray-400 font-medium">No talent found matching your search.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      
      {/* GRID */}
      <motion.div 
        layout 
        className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
      >
        <AnimatePresence>
          {displayedTalents.map((t) => (
            <motion.div
              key={t._id || t.id}
              layout
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <TalentCard t={t} onOpen={openCard} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* VIEW ALL / CLOSE ALL BUTTON */}
      {filtered.length > INITIAL_LIMIT && (
        <div className="flex justify-center mt-12">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="group flex items-center gap-2 px-8 py-3 rounded-full bg-white border border-gray-200 text-sm font-bold text-gray-700 hover:border-black hover:text-black hover:shadow-lg transition-all"
          >
            {isExpanded ? (
              <>
                Close All <ChevronUp size={16} className="text-gray-400 group-hover:text-black transition-colors" />
              </>
            ) : (
              <>
                View All ({filtered.length - INITIAL_LIMIT} more) <ChevronDown size={16} className="text-gray-400 group-hover:text-black transition-colors" />
              </>
            )}
          </button>
        </div>
      )}
      
    </div>
  );
}