import React from "react";
import { usePortfolio } from "../../../../context/PortfolioContext";
import useFadeInOnScroll from "../../../../hooks/useFadeInOnScroll";

const Contact = ({ portfolioData: propData }) => {
  useFadeInOnScroll();
  const { portfolioData: contextData } = usePortfolio();
  const data = propData || contextData || {};
  const fg = data.themeFont || "#111827";

  return (
    <section id="contact" className="py-32 px-6 sm:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto text-center fade-up">
        
        <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8" style={{ color: fg }}>
          Let's work together.
        </h2>
        
        <p className="text-xl text-gray-500 mb-12 max-w-2xl mx-auto">
          Always open to discussing product design work or partnership opportunities.
        </p>

        <a 
          href={`mailto:${data.email || "hello@example.com"}`}
          className="inline-block px-10 py-5 rounded-full bg-black text-white text-lg font-bold hover:scale-105 hover:bg-purple-600 transition-all shadow-xl"
        >
          {data.email ? "Say Hello" : "Get in touch"}
        </a>

        <div className="mt-16 flex justify-center gap-8">
            {data.linkedin && <a href={data.linkedin} className="text-gray-400 hover:text-black transition">LinkedIn</a>}
            {data.github && <a href={data.github} className="text-gray-400 hover:text-black transition">GitHub</a>}
        </div>

      </div>
    </section>
  );
};

export default Contact;