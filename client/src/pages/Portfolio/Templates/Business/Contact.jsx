import React from "react";
import { motion } from "framer-motion";
import { usePortfolio } from "../../../../context/PortfolioContext";

const Contact = ({ portfolioData: propData }) => {
  const { portfolioData: contextData } = usePortfolio();
  const data = propData || contextData || {};

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10">
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }}>
          <p className="text-sm font-mono uppercase mb-4">// Next Steps</p>
          <h2 className="text-4xl font-black leading-tight">Let's build something iconic</h2>

          <div className="mt-8">
            <a href={`mailto:${data.email}`} className="text-xl font-bold underline decoration-4 underline-offset-8">{data.email || "hello@foliofyx.com"}</a>
            <p className="mt-4 text-slate-600">{data.address || "City, Country"}</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }}>
          <form className="grid gap-3 bg-slate-50 p-6 rounded-xl border border-slate-100">
            <input className="border border-slate-200 rounded-md px-3 py-2" placeholder="Your name" />
            <input className="border border-slate-200 rounded-md px-3 py-2" placeholder="Email" />
            <textarea className="border border-slate-200 rounded-md px-3 py-2" placeholder="Message" />
            <button className="mt-2 px-4 py-2 rounded-md bg-indigo-600 text-white">Send</button>
          </form>
        </motion.div>
      </div>

      <div className="max-w-6xl mx-auto px-6 mt-12 text-sm text-slate-500 flex justify-between">
        <span>{data.siteName || "FolioFYX"} © {new Date().getFullYear()}</span>
        <span>Local Time: {new Date().toLocaleTimeString()}</span>
      </div>
    </section>
  );
};

export default Contact;