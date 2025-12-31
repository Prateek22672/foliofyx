import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, MapPin, ExternalLink, Award } from "lucide-react";

export default function TalentModal({ open, talent, onClose }) {
  if (!open || !talent) return null;

  // ✦ Close when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (e.target.id === "modal-bg") onClose();
    };
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, [onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="modal-bg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative w-full max-w-md bg-white rounded-[2rem] overflow-hidden shadow-2xl"
          >
            {/* 🎨 Header Background (Mesh Gradient) - Reduced Height */}
            <div className="h-24 w-full relative overflow-hidden bg-gray-100">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-200 via-gray-100 to-white opacity-80" />
                {/* Decorative Blobs */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-200 rounded-full blur-[50px] opacity-60" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-200 rounded-full blur-[40px] opacity-60" />
                
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-white/50 hover:bg-white backdrop-blur-md rounded-full text-gray-600 hover:text-black transition-all shadow-sm z-20"
                >
                    <X size={20} />
                </button>
            </div>

            {/* 👤 Profile Content - Reduced Padding and Margins */}
            <div className="px-6 pb-6 -mt-10 relative z-10">
                
                {/* Avatar */}
                <div className="flex justify-between items-end">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-[1.5rem] p-1 bg-white shadow-lg">
                            <img
                                src={talent.image || "/default-profile.jpg"}
                                alt={talent.name}
                                className="w-full h-full object-cover rounded-[1.2rem]"
                            />
                        </div>
                        {/* Verified Badge (Optional decoration) */}
                        <div className="absolute -bottom-2 -right-2 bg-black text-white p-1 rounded-full border-4 border-white">
                            <Award size={12} />
                        </div>
                    </div>
                    
                    {/* Quick Action */}
                    {talent.email && (
                        <a 
                            href={`mailto:${talent.email}`}
                            className="mb-2 p-3 rounded-full bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-black transition-colors"
                            title="Send Email"
                        >
                            <Mail size={18} />
                        </a>
                    )}
                </div>

                {/* Name & Role - Reduced Margin */}
                <div className="mt-4">
                    <h2 className="text-3xl font-bold text-gray-900 tracking-tight leading-tight">
                        {talent.name}
                    </h2>
                    <div className="flex items-center gap-2 mt-1 text-gray-500 font-medium text-sm">
                        <span className="text-purple-600">{talent.role}</span>
                        {/* Static location for now, or dynamic if available */}
                        <span className="w-1 h-1 bg-gray-300 rounded-full" />
                        <span className="flex items-center gap-1"><MapPin size={12} /> Available</span>
                    </div>
                </div>

                {/* Bio - Reduced Margin */}
                <p className="mt-4 text-gray-600 text-sm leading-relaxed line-clamp-3">
                    {talent.bio || "This creator prefers to let their work speak for itself."}
                </p>

                {/* Divider - Reduced Margin */}
                <div className="h-px w-full bg-gray-100 my-4" />

                {/* Expertise / Skills */}
                <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Expertise</h4>
                    <div className="flex flex-wrap gap-2">
                        {(talent.skills || []).slice(0, 6).map((s, i) => (
                            <span
                                key={i}
                                className="px-3 py-1.5 bg-gray-50 border border-gray-100 text-gray-700 text-xs font-semibold rounded-lg"
                            >
                                {s.name}
                            </span>
                        ))}
                        {(!talent.skills || talent.skills.length === 0) && (
                            <span className="text-gray-400 text-xs italic">No specific skills listed.</span>
                        )}
                    </div>
                </div>

                {/* Footer Action - Reduced Margin */}
                <div className="mt-6">
                    <Link
                        to={`/portfolio/${talent._id || talent.id}`}
                        className="group w-full flex items-center justify-center gap-2 bg-black text-white py-4 rounded-xl font-bold text-sm hover:bg-gray-800 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-black/10"
                    >
                        View Full Portfolio
                        <ExternalLink size={16} className="text-gray-400 group-hover:text-white transition-colors" />
                    </Link>
                </div>

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}