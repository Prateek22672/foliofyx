import React from "react";
import useScrollY from "../../../../hooks/useScrollY";
import { Mail, Linkedin } from "lucide-react";
import useFadeInOnScroll from "../../../../hooks/useFadeInOnScroll";
import { usePortfolio } from "../../../../context/PortfolioContext";

const Contact = ({ portfolioData: propData }) => {
  useFadeInOnScroll();

  const { portfolioData: contextData } = usePortfolio();
  const data = propData || contextData || {};

  const y = useScrollY();
  const bgImage = "/parallaximg/bg-contact.jpg";

  return (
    <section
      id="contact"
      className="relative min-h-screen py-24"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Background blur layer */}
      <div className="absolute inset-0 backdrop-blur-sm bg-white/10" />

      <div
        className="relative z-10 max-w-3xl mx-auto px-6 text-center"
        style={{ transform: `translateY(${y * 0.04}px)` }}
      >
        {/* Title */}
        <h3 className="text-white text-sm mb-2 fade-up">Get In Touch</h3>
        <h2 className="text-4xl font-extrabold text-white mb-8 fade-up">
          Contact Me
        </h2>

        {/* Contact Box — Glassmorphism */}
        <div
          className="
            backdrop-blur-xl bg-black/20 border border-white/30
            rounded-3xl p-8 flex flex-col md:flex-row
            gap-6 items-center justify-center shadow-xl fade-up
          "
        >
          {/* Email */}
          {data.email ? (
            <a
              className="
                flex items-center gap-3
                backdrop-blur-lg bg-white/10 border border-white/30
                px-5 py-3 rounded-2xl text-white text-sm
                hover:bg-white/20 hover:scale-105 transition-all
              "
              href={`mailto:${data.email}`}
            >
              <Mail className="w-5 h-5 text-white" /> {data.email}
            </a>
          ) : (
            <p className="text-gray-200">Add your email</p>
          )}

          {/* LinkedIn */}
          {data.linkedin ? (
            <a
              className="
                flex items-center gap-3
                backdrop-blur-lg bg-white/10 border border-white/30
                px-5 py-3 rounded-2xl text-white text-sm
                hover:bg-white/20 hover:scale-105 transition-all
              "
              href={data.linkedin}
              target="_blank"
              rel="noreferrer"
            >
              <Linkedin className="w-5 h-5 text-white" /> LinkedIn
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default Contact;
