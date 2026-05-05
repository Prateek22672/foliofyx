// src/components/Home.jsx
import React, { useEffect, useState } from "react";
import { usePortfolio } from "../../../../context/PortfolioContext";
import linkedinLogo from "../../../../assets/linkedin.png"; 
import githubLogo from "../../../../assets/github.png";
import VideoBackground from "./VideoBackground"; 
import { ArrowDownCircle } from "lucide-react"; 

// ✅ Defined default DP (Display Picture) constant
const dp = "/themes/john-wick-3-parabellum-action.avif";

const Home = ({ portfolioData: propData, isMobileView }) => {
  const { portfolioData: contextData } = usePortfolio();
  const data = propData || contextData;
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ✅ Helper to ensure links are absolute (fixes the "main url/cv link" issue)
  const getSafeLink = (link) => {
    if (!link) return "#";
    if (link.startsWith("http://") || link.startsWith("https://")) {
      return link;
    }
    return `https://${link}`;
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col justify-center items-center text-center overflow-hidden"
      style={{
        backgroundColor: data?.themeBg || "#000",
        color: data?.themeFont || "#fff",
      }}
    >
      <VideoBackground blur="0px" opacity={1} /> 

      <div className="relative z-10 flex flex-col md:flex-row items-center gap-10 md:gap-20 px-6 max-w-6xl mx-auto mt-20">
        
        {/* Profile Image */}
        <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
            <img
                src={
                  data?.image
                    ? data.image.startsWith("/uploads")
                      ? `http://localhost:5000${data.image}`
                      : data.image
                    : dp // ✅ Uses 'dp' constant if no image is found
                }
                alt={data?.name}
                className="relative w-48 h-48 md:w-80 md:h-80 object-cover rounded-full border-4 border-black shadow-2xl"
            />
        </div>

        {/* Text Content */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-4">
          <p className="text-gray-400 font-medium text-lg">Hello, I'm</p>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white">
            {data?.name || "Your Name"}
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-300">
            {data?.role || "Web Developer"}
          </h2>
          
          {/* ✅ UPDATED: Single row with Icons BETWEEN the buttons */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 mt-6">
              
              {/* 1. Download CV Button */}
              {data?.cvLink && (
                <a
                  href={getSafeLink(data.cvLink)} // ✅ Fixed link logic here
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-full bg-white text-black font-bold hover:bg-purple-500 hover:text-white transition-all duration-300 shadow-lg"
                >
                  Download CV
                </a>
              )}
              
              {/* 3. Contact Info Button */}
              <a
                href="#contact"
                className="px-6 py-3 rounded-full border border-white/30 text-white font-bold hover:bg-white hover:text-black transition-all duration-300"
              >
                Contact Info
              </a>
          </div>


          <div className="flex gap-4 mt-6 sm:ml-30">
              {data?.linkedin && (
                <a href={data.linkedin} target="_blank" rel="noreferrer">
                   {/* Added brightness-0 to force white silhouette */}
                   <img src={linkedinLogo} alt="LinkedIn" className="w-8 h-8 brightness-0 invert hover:opacity-80 transition-opacity" />
                </a>
              )}
              {data?.github && (
                <a href={data.github} target="_blank" rel="noreferrer">
                   {/* ✅ UPDATED: Added brightness-0 invert to force pure white */}
                   <img src={githubLogo} alt="GitHub" className="w-8 h-8 brightness-0 invert hover:opacity-80 transition-opacity" />
                </a>
              )}
          </div>

        </div>
      </div>
      
      {/* Scroll Down Indicator */}
      <div className="absolute bottom-10 animate-bounce cursor-pointer" onClick={() => document.getElementById('about').scrollIntoView({ behavior: 'smooth'})}>
         <ArrowDownCircle size={32} className="text-gray-400" />
      </div>
    </section>
  );
};

export default Home;