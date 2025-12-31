import React from "react";
import { motion } from "framer-motion";
import { usePortfolio } from "../../../../context/PortfolioContext";

const Features = ({ portfolioData: propData }) => {
  const { portfolioData: contextData } = usePortfolio();
  const data = propData || contextData || {};
  const features = data.features || [
    { title: "Fast delivery", desc: "Short iterations and quick validations." },
    { title: "Trusted process", desc: "Clear milestones and communication." },
    { title: "Design-first", desc: "Human-centered design." },
  ];

  return (
    <section id="features" className="py-12 bg-slate-50">
      <div className="max-w-6xl mx-auto px-6">
        <h3 className="text-xl font-semibold text-slate-900">Why we stand out</h3>
        <div className="mt-6 grid md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="p-6 rounded-lg bg-white border border-slate-100">
              <h5 className="font-semibold">{f.title}</h5>
              <p className="mt-2 text-sm text-slate-600">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;