// src/landing/sections/SectionTalent.jsx
import React, { useEffect, useState, useRef } from "react";
import { motion, useAnimation, useInView } from "framer-motion";

// --- Helper Component (No changes here) ---
const MarqueeRow = ({ direction, speed, isCenter, animControls, verticalDir = 0 }) => {
  const moveDir = direction === "left" ? -1 : 1;
  return (
    <motion.div
      style={{
        display: "flex",
        whiteSpace: "nowrap",
        gap: "2rem",
        opacity: isCenter ? 1 : 0.2,
        fontWeight: 900,
        fontSize: "8vw",
        textTransform: "uppercase",
        lineHeight: 1,
        color: isCenter ? "rgba(0,0,0,0.8)" : "rgba(0,0,0,0.05)",
        rotate: isCenter ? 0 : moveDir * 2,
      }}
      animate={
        isCenter
          ? animControls
          : {
            x: [0, moveDir * 1000],
            y: [0, verticalDir * 200]
          }
      }
      transition={{
        x: { repeat: Infinity, duration: speed, ease: "linear" },
        y: { repeat: Infinity, duration: speed, ease: "linear" }
      }}
    >
      {[...Array(10)].map((_, i) => (
        <span key={i} className={isCenter ? "hero-text" : ""}>
          TALENT
        </span>
      ))}
    </motion.div>
  );
};

export default function SectionTalent() {
  const [showContent, setShowContent] = useState(false);
  const wrapperControls = useAnimation();
  const centerTextControls = useAnimation();

  const sectionRef = useRef(null);

  // ⚡ SPEED TWEAK 1: Trigger animation sooner (at 10% visibility instead of 30%)
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

  useEffect(() => {
    const sequence = async () => {
      // Set initial state immediately
      await wrapperControls.set({ scale: 6, rotate: -15, x: 0, y: 0 });

      if (isInView) {
        // ⚡ SPEED TWEAK 2: Zoom duration reduced (1.8s -> 1.2s)
        wrapperControls.start({
          scale: 1,
          rotate: 0,
          transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] },
        });

        centerTextControls.start({
          x: "35vw",
          y: "35vh",
          scale: 0.5,
          opacity: 0.08,
          // ⚡ SPEED TWEAK 3: Text moves faster (2s -> 1.4s)
          transition: { duration: 1.4, ease: "easeInOut", delay: 0.1 }
        });

        // ⚡ SPEED TWEAK 4: Reveal content much sooner (1000ms -> 400ms)
        setTimeout(() => {
          setShowContent(true);
        }, 400);
      }
    };

    sequence();
  }, [isInView, wrapperControls, centerTextControls]);

  const fadeWords = (text) =>
    text.split(" ").map((word, index) => (
      <span
        key={index}
        className="inline-block opacity-0 animate-wordFade"
        style={{ animationDelay: `${index * 80}ms` }}
      >
        {word}&nbsp;
      </span>
    ));

  // ⚡ SPEED TWEAK 5: Chaos fades out faster
  const rowFadeVariants = {
    initial: { opacity: 1 },
    animate: {
      opacity: 0,
      transition: { duration: 0.8, delay: 0.6 }
    },
  };

  return (
    <section
      ref={sectionRef}
      className="
        fixed inset-0 
        flex flex-col items-center justify-center
        bg-white text-black
        z-[2]
        rounded-t-[40px]
        md:rounded-t-[60px]
        px-6
        pt-7
        overflow-hidden
      "
      style={{
        transform: `
          translateY(
            calc(
              max(0px, (1 - var(--scroll, 0)) * 100vh)
            )
          )
        `,
        opacity: `calc(var(--scroll) >= 0.9 ? 1 : 0)`,
        transition: "opacity 0.8s ease"
      }}
    >

      {/* BACKGROUND SWARM */}
      <motion.div
        className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none z-0"
        initial="initial"
        animate="animate"
      >
        <motion.div animate={wrapperControls}>
          <motion.div variants={rowFadeVariants}>
            <MarqueeRow direction="left" verticalDir={-1} speed={20} />
            <MarqueeRow direction="right" verticalDir={1} speed={25} />
          </motion.div>
          <img className="w-40 absolute right-5 top-5" src="/fyx3.png" />


          <div className="relative z-10 ">
            <motion.h1
              animate={centerTextControls}
              style={{
                fontSize: "10vw",
                fontWeight: 900,
                textTransform: "uppercase",
                margin: 0,
                lineHeight: 1,
                whiteSpace: "nowrap"
              }}
            >
              TALENT
            </motion.h1>
          </div>

          <motion.div variants={rowFadeVariants}>
            <MarqueeRow direction="right" verticalDir={-1} speed={25} />
            <MarqueeRow direction="left" verticalDir={1} speed={20} />
          </motion.div>
        </motion.div>
      </motion.div>


      {/* FOREGROUND CONTENT */}
      {showContent && (
        <div className="relative z-10 flex flex-col items-center w-full max-w-4xl">

          <h1 className="text-4xl md:text-6xl font-semibold leading-tight mb-6 mt-10 text-center">
            {fadeWords("Talent Powered Portfolio")}
          </h1>

          <p
            className="
              text-gray-600 max-w-xl text-center 
              opacity-0 animate-fadeSoft
              leading-relaxed mb-10
            "
          >
            {fadeWords(
              "Connect your skills with a professional portfolio experience — highlight your achievements, projects, and personal brand effortlessly."
            )}
          </p>

          <button
            className="
              px-7 py-3 rounded-full bg-black text-white
              hover:bg-neutral-900 transition-all 
              opacity-0 animate-fadeSoft2
              hover:scale-105
            "
          >
            Explore Talent Tools →
          </button>

          <div
            className="
              relative w-full mt-12 mb-6 rounded-3xl overflow-hidden
              opacity-0 animate-fadeVideo
              shadow-2xl
            "
          >
            <img className="absolute w-20 top-5 left-5" src="/fyxw.png" />
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-40 md:h-56 object-cover rounded-3xl"
            >
              <source src="/dbv.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      )}

      {/* ⚡ SPEED TWEAK 6: CSS Animation Delays significantly reduced
         - fadeSoft: 1.0s -> 0.5s
         - fadeSoft2: 1.6s -> 0.8s
         - fadeVideo: 2.1s -> 1.0s
      */}
      <style>{`
        @keyframes wordFade {
          0% { opacity: 0; transform: translateY(12px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-wordFade {
          animation: wordFade 0.55s ease-out forwards;
        }

        @keyframes fadeSoft {
          0% { opacity: 0; transform: translateY(8px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeSoft {
          animation: fadeSoft 1.0s ease forwards;
          animation-delay: 0.5s; 
        }
        .animate-fadeSoft2 {
          animation: fadeSoft 1.0s ease forwards;
          animation-delay: 0.5s;
        }

        @keyframes fadeVideo {
          0% { opacity: 0; transform: translateY(20px) scale(0.97); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fadeVideo {
          animation: fadeVideo 1.2s ease forwards;
          animation-delay: 1.0s;
        }
      `}</style>
    </section>
  );
}