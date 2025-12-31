import React from "react";
import { motion } from "framer-motion";
import { usePortfolio } from "../../../../context/PortfolioContext";

const About = ({ portfolioData: propData }) => {
  const { portfolioData: contextData } = usePortfolio();
  const data = propData || contextData || {};
  const about = data.about || { title: "About Us", paragraphs: ["We are a team of product builders.", "We focus on measurable outcomes."] };

  return (
    <section id="about" className="py-14 bg-white">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div>
          <motion.h3 initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} className="text-2xl font-semibold text-slate-900">{about.title}</motion.h3>
          {about.paragraphs.map((p, i) => (
            <p key={i} className="mt-4 text-slate-600">{p}</p>
          ))}
        </div>
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} className="rounded-xl bg-slate-50 p-6 border border-slate-100">
          <div className="h-56 flex items-center justify-center text-slate-300">[Team / Photo]</div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;