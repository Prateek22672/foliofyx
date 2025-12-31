import React from "react";
import { motion } from "framer-motion";
import { usePortfolio } from "../../../../context/PortfolioContext";

const Testimonials = ({ portfolioData: propData }) => {
  const { portfolioData: contextData } = usePortfolio();
  const data = propData || contextData || {};
  const items = data.testimonials || [
    { name: "Anita Rao", role: "Founder", quote: "They transformed our product." },
    { name: "Samir Patel", role: "CEO", quote: "Professional and results-driven." },
  ];

  return (
    <section className="py-12">
      <div className="max-w-6xl mx-auto px-6">
        <h3 className="text-xl font-semibold text-slate-900">What clients say</h3>
        <div className="mt-6 grid md:grid-cols-2 gap-6">
          {items.map((t, i) => (
            <motion.blockquote key={i} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} className="p-6 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-slate-700">“{t.quote}”</p>
              <footer className="mt-4 text-sm text-slate-500">— {t.name}, {t.role}</footer>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;