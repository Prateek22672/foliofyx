// FeaturedHeader.jsx
import React from "react";
import { motion } from "framer-motion";

export default function FeaturedHeader({ items = [] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45 }}
      className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6"
    >
      <div className="flex items-center gap-4">
        {/* avatars */}
        <div className="flex -space-x-3">
          {items.slice(0, 5).map((t, i) => (
            <img
              key={i}
              src={t.image || "/default-profile.jpg"}
              alt={t.name}
              className="w-12 h-12 rounded-full border-2 border-white shadow-sm object-cover"
              style={{ boxShadow: "0 6px 18px rgba(16,24,40,0.08)" }}
            />
          ))}
        </div>

        <div>
          <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900">Featured Talent</h3>
          <p className="text-gray-500 text-sm mt-1">Handpicked profiles based on recent activity & quality</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm text-sm hover:shadow-md transition">
          View All
        </button>
        <button className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-semibold shadow-md hover:opacity-95 transition">
          Invite Talent
        </button>
      </div>
    </motion.div>
  );
}
