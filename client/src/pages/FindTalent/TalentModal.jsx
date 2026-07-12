import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, MapPin, ExternalLink, Award } from "lucide-react";

export default function TalentModal({ open, talent, onClose }) {
  // Close when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (e.target.id === "modal-bg") onClose();
    };
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, [onClose]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!open || !talent) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="modal-bg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            role="dialog"
            aria-modal="true"
            aria-label={`Profile of ${talent.name || "talent"}`}
            className="relative w-full max-w-md bg-white border border-black/10 rounded-3xl overflow-hidden shadow-[0_32px_96px_-24px_rgba(0,0,0,0.35)]"
          >
            {/* Header background */}
            <div className="h-24 w-full relative overflow-hidden bg-[#FAFAFA] border-b border-black/5">
              {/* Fine grid texture */}
              <div
                aria-hidden="true"
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)",
                  backgroundSize: "28px 28px",
                }}
              />

              {/* Close button */}
              <button
                onClick={onClose}
                aria-label="Close profile"
                className="absolute top-4 right-4 p-2 bg-black/5 hover:bg-black/10 rounded-full text-gray-500 hover:text-black transition-colors z-20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
              >
                <X size={18} />
              </button>
            </div>

            {/* Profile content */}
            <div className="px-6 pb-6 -mt-10 relative z-10">

              {/* Avatar */}
              <div className="flex justify-between items-end">
                <div className="relative">
                  <div className="w-24 h-24 rounded-2xl p-1 bg-white border border-black/10 shadow-lg">
                    <img
                      src={talent.image || "/default-profile.jpg"}
                      alt={talent.name ? `${talent.name} avatar` : "Talent avatar"}
                      className="w-full h-full object-cover rounded-[0.85rem]"
                    />
                  </div>
                  {/* Verified badge */}
                  <div className="absolute -bottom-2 -right-2 bg-black text-white p-1.5 rounded-full border-4 border-white">
                    <Award size={11} aria-hidden="true" />
                  </div>
                </div>

                {/* Quick action */}
                {talent.email && (
                  <a
                    href={`mailto:${talent.email}`}
                    aria-label={`Email ${talent.name || "talent"}`}
                    title="Send email"
                    className="mb-2 p-3 rounded-full bg-black/5 text-gray-600 hover:bg-black hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
                  >
                    <Mail size={17} />
                  </a>
                )}
              </div>

              {/* Name & role */}
              <div className="mt-4">
                <h2 className="text-2xl font-black text-black tracking-tighter leading-tight font-['Syne']">
                  {talent.name}
                </h2>
                <div className="flex items-center gap-2 mt-1.5 text-gray-500 font-medium text-sm">
                  <span className="text-black">{talent.role}</span>
                  <span aria-hidden="true" className="w-1 h-1 bg-black/25 rounded-full" />
                  <span className="flex items-center gap-1">
                    <MapPin size={12} aria-hidden="true" /> Available
                  </span>
                </div>
              </div>

              {/* Bio */}
              <p className="mt-4 text-gray-600 text-sm leading-relaxed line-clamp-3">
                {talent.bio || "This creator prefers to let their work speak for itself."}
              </p>

              {/* Divider */}
              <div className="h-px w-full bg-black/10 my-5" />

              {/* Expertise / skills */}
              <div>
                <h4 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500 mb-3">
                  Expertise
                </h4>
                <div className="flex flex-wrap gap-2">
                  {(talent.skills || []).slice(0, 6).map((s, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-black/5 text-black text-xs font-medium rounded-full"
                    >
                      {s.name}
                    </span>
                  ))}
                  {(!talent.skills || talent.skills.length === 0) && (
                    <span className="text-gray-400 text-xs italic">
                      No specific skills listed.
                    </span>
                  )}
                </div>
              </div>

              {/* Footer action */}
              <div className="mt-6">
                <Link
                  to={`/portfolio/${talent._id || talent.id}`}
                  className="group w-full flex items-center justify-center gap-2 bg-black text-white py-4 rounded-full font-semibold text-sm hover:bg-gray-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                >
                  View full portfolio
                  <ExternalLink
                    size={15}
                    className="text-white/60 group-hover:text-white transition-colors"
                  />
                </Link>
              </div>

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
