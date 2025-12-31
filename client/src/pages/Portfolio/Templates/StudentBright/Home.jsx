import React, { useState, useEffect } from "react";
import useScrollY from "../../../../hooks/useScrollY";
import DownArrow from "../../../../components/DownArrow";
import linkedinLogo from "../../../../assets/linkedinB.png";
import githubLogo from "../../../../assets/githubB.png";
import useFadeInOnScroll from "../../../../hooks/useFadeInOnScroll";

export default function Home({ portfolioData }) {
  useFadeInOnScroll();

  const y = useScrollY();
  const [mobile, setMobile] = useState(window.innerWidth < 768);
  // 1. New state to track when to trigger the blur
  const [isBlurred, setIsBlurred] = useState(false);

  useEffect(() => {
    const handle = () => setMobile(window.innerWidth < 768);
    window.addEventListener("resize", handle);
    
    // 2. Timer to set blur to true after 1 second (1000ms)
    const timer = setTimeout(() => {
      setIsBlurred(true);
    }, 1000);

    return () => {
      window.removeEventListener("resize", handle);
      clearTimeout(timer);
    };
  }, []);

  // FIXED PATHS
  const desktopBg = "/parallaximg/bg-home.JPG"; 
  const mobileBg = "/parallaximg/bg-home.png";

  return (
    <section
      id="home"
      // Removed bg styling from here to prevent text blurring
      className="relative min-h-screen flex items-center overflow-hidden" 
    >
      {/* 3. SEPARATE BACKGROUND LAYER 
        This div handles the image and the blur independently of the text.
      */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${mobile ? mobileBg : desktopBg})`,
          backgroundSize: "cover",
          backgroundPosition: mobile ? "top" : `center ${y * 0.5}px`, 
          backgroundAttachment: mobile ? "scroll" : "fixed",
          // The Logic:
          filter: isBlurred ? "blur(4px)" : "none", // Adjust '4px' for more/less blur
          transform: isBlurred ? "scale(1.05)" : "scale(1)", // Slight scale prevents white edges when blurring
          transition: "filter 1.5s ease-out, transform 1.5s ease-out" // Smooth transition duration
        }}
      />

      {/* Top divider (z-index ensures it sits above the blurred bg) */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[88%] rounded-2xl border-t-[3px] border-black/60 z-10"></div>

      <div
        className={`relative z-10 w-full ${
          mobile
            ? "px-6 pt-32 flex flex-col items-center text-center"
            : "px-20 flex items-center justify-between"
        }`}
      >
        {/* LEFT TEXT CONTENT */}
        <div className={`${mobile ? "max-w-lg" : "max-w-xl"} stagger`}>
          <h2 className="text-xl font-bold text-black fade-up">Hi, I’m</h2>

          <h1 className="text-5xl font-extrabold text-black mt-2 fade-up">
            {portfolioData?.name || "Your Name"}
          </h1>

          <h3 className="text-2xl mt-4 text-black/80 font-semibold fade-up">
            {portfolioData?.role || "Your Role"}
          </h3>

          {/* BUTTONS */}
          <div
            className={`flex gap-4 mt-8 fade-up ${
              mobile ? "justify-center" : ""
            }`}
          >
            {portfolioData?.cvLink && (
              <a
                href={portfolioData.cvLink}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3 rounded-full bg-white/30 backdrop-blur-md text-black font-semibold 
                  hover:bg-white/50 transition shadow"
              >
                Download CV
              </a>
            )}

            <button
              onClick={() =>
                document.getElementById("contact")?.scrollIntoView({
                  behavior: "smooth",
                })
              }
              className="px-6 py-3 rounded-full border border-white/60 text-black font-semibold 
                bg-white/20 backdrop-blur-md hover:bg-white hover:text-black transition shadow"
            >
              Contact
            </button>
          </div>

          {/* MOBILE SOCIAL ICONS */}
          {mobile && (
            <div
              className="
                flex gap-6 justify-center mt-8 fade-up 
                bg-white/20 backdrop-blur-md px-6 py-3 rounded-full
                shadow border border-white/30
              "
            >
              {portfolioData.linkedin && (
                <a href={portfolioData.linkedin} target="_blank" rel="noreferrer">
                  <img src={linkedinLogo} className="w-10 h-10 rounded-full shadow" alt="LinkedIn" />
                </a>
              )}
              {portfolioData.github && (
                <a href={portfolioData.github} target="_blank" rel="noreferrer">
                  <img src={githubLogo} className="w-10 h-10 rounded-full shadow" alt="GitHub" />
                </a>
              )}
            </div>
          )}
        </div>

        {/* DESKTOP SOCIAL ICONS */}
        {!mobile && (
          <div
            className="
              flex flex-col gap-6 fade-up 
              bg-white/20 backdrop-blur-lg p-5 rounded-3xl 
              shadow-[0_8px_25px_rgba(0,0,0,0.15)] border border-white/30
            "
          >
            {portfolioData.linkedin && (
              <a href={portfolioData.linkedin} target="_blank" rel="noreferrer">
                <img src={linkedinLogo} className="w-12 h-12 rounded-full shadow" alt="LinkedIn" />
              </a>
            )}
            {portfolioData.github && (
              <a href={portfolioData.github} target="_blank" rel="noreferrer">
                <img src={githubLogo} className="w-12 h-12 rounded-full shadow" alt="GitHub" />
              </a>
            )}
          </div>
        )}
      </div>

      {/* DOWN ARROW */}
      {!mobile && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 fade-up">
          <DownArrow targetId="about" />
        </div>
      )}
    </section>
  );
}