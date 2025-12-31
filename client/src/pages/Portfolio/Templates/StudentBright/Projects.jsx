import React from "react";
import useScrollY from "../../../../hooks/useScrollY";
import useFadeInOnScroll from "../../../../hooks/useFadeInOnScroll";
import { usePortfolio } from "../../../../context/PortfolioContext";

const Projects = ({ portfolioData: propData }) => {
  const { portfolioData: contextData } = usePortfolio();
  const data = propData || contextData || {};

  const projects = Array.isArray(data.projects) ? data.projects : [];
  useFadeInOnScroll([projects.length]);

  const y = useScrollY();
  const bgImage = "/parallaximg/bg-projects.jpg";

  return (
    <section
      id="projects"
      className="relative min-h-screen py-24"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Background blur overlay */}
      <div className="absolute inset-0 backdrop-blur-sm bg-white/10" />

      <div
        className="relative z-10 max-w-6xl mx-auto px-6 text-center"
        style={{ transform: `translateY(${y * 0.04}px)` }}
      >
        <h3 className="text-gray-100 mb-2 text-sm fade-up">
          Browse My Recent
        </h3>

        <h2 className="text-4xl font-extrabold text-white mb-12 fade-up">
          Projects
        </h2>

        {projects.length === 0 ? (
          <p className="text-gray-300 italic fade-up">No projects added yet.</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {projects.map((p, i) => (
              <div
                key={i}
                className="
                  backdrop-blur-xl bg-black/20 border border-white/30
                  p-6 rounded-3xl shadow-xl fade-up
                  transition-transform duration-300 hover:scale-[1.04]
                "
              >
                {/* Title */}
                <h3 className="text-xl font-bold text-white mb-2">{p.title}</h3>

                {/* Tech Stack */}
                <p className="text-gray-200 text-sm mb-4">
                  {p.tech || "Tech not specified"}
                </p>

                {/* Buttons — GLASS BUTTONS */}
                <div className="flex gap-3 justify-center">
                  {p.github && (
                    <a
                      href={p.github}
                      target="_blank"
                      rel="noreferrer"
                      className="
                        text-sm px-4 py-2 rounded-3xl
                        backdrop-blur-lg bg-white/10 text-white
                        border border-white/30
                        hover:bg-white/20 hover:scale-105
                        transition-all duration-300
                      "
                    >
                      GitHub
                    </a>
                  )}

                  {p.demo && (
                    <a
                      href={p.demo}
                      target="_blank"
                      rel="noreferrer"
                      className="
                        text-sm px-4 py-2 rounded-3xl
                        backdrop-blur-lg bg-white/10 text-white
                        border border-white/30
                        hover:bg-white/20 hover:scale-105
                        transition-all duration-300
                      "
                    >
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;
