import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, SearchX } from "lucide-react";
import TalentCard from "./TalentCard";

// Skeleton placeholder matching the TalentCard anatomy
function SkeletonCard() {
  return (
    <div className="rounded-3xl p-6 border border-black/5 bg-white shadow-sm flex flex-col h-full animate-pulse" aria-hidden="true">
      <div className="flex items-center gap-4 mb-5">
        <div className="w-14 h-14 rounded-full bg-black/[0.07] shrink-0" />
        <div className="flex-1 space-y-2.5">
          <div className="h-3.5 w-2/3 rounded-full bg-black/[0.07]" />
          <div className="h-3 w-1/3 rounded-full bg-black/5" />
        </div>
      </div>
      <div className="flex gap-2 mb-6">
        <div className="h-6 w-16 rounded-full bg-black/5" />
        <div className="h-6 w-20 rounded-full bg-black/5" />
        <div className="h-6 w-14 rounded-full bg-black/5" />
      </div>
      <div className="mt-auto pt-4 border-t border-black/10 flex justify-between">
        <div className="h-3 w-24 rounded-full bg-black/5" />
        <div className="h-3 w-16 rounded-full bg-black/5" />
      </div>
    </div>
  );
}

export default function TalentGrid({ filtered, loading, openCard }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const INITIAL_LIMIT = 6; // Show 6 cards initially

  // Calculate which items to show
  const displayedTalents = isExpanded
    ? filtered
    : filtered.slice(0, INITIAL_LIMIT);

  // Animation variants for the grid items
  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 8, transition: { duration: 0.2 } },
  };

  if (loading) {
    return (
      <div
        className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        role="status"
        aria-label="Loading talent profiles"
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (filtered.length === 0) {
    return (
      <div className="text-center py-20 px-6 rounded-3xl border border-dashed border-black/15 bg-black/[0.02]">
        <div className="mx-auto w-12 h-12 rounded-full bg-black/5 border border-black/10 flex items-center justify-center mb-5">
          <SearchX size={20} className="text-gray-400" aria-hidden="true" />
        </div>
        <p className="text-black font-medium">No talent found</p>
        <p className="text-gray-500 text-sm mt-1.5">
          Try a different name, role, or skill.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">

      {/* GRID */}
      <motion.div
        layout
        className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
      >
        <AnimatePresence>
          {displayedTalents.map((t, i) => (
            <motion.div
              key={t._id || t.id}
              layout
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{
                duration: 0.4,
                ease: "easeOut",
                delay: (i % INITIAL_LIMIT) * 0.06,
              }}
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
            className="group inline-flex items-center gap-2 px-7 py-3 rounded-full border border-black/15 bg-white text-sm font-medium text-gray-600 hover:text-black hover:border-black/30 hover:bg-black/[0.02] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            {isExpanded ? (
              <>
                Show less
                <ChevronUp size={16} className="text-gray-400 group-hover:text-black transition-colors" />
              </>
            ) : (
              <>
                View all ({filtered.length - INITIAL_LIMIT} more)
                <ChevronDown size={16} className="text-gray-400 group-hover:text-black transition-colors" />
              </>
            )}
          </button>
        </div>
      )}

    </div>
  );
}
