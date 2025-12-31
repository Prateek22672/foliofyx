import React, { useEffect, useState, useRef } from "react";

const SplashScreen = ({ onFinish, onStartExiting }) => {
  const [stage, setStage] = useState("pending");

  // TIMING CONFIGURATION
  const TRANSITION_IN = 600;      // Time to enter
  const LOADING_TIME = 2000;      // Time to stay visible
  const APP_LOAD_BUFFER = 200;    // Time to wait AFTER mounting app but BEFORE sliding curtain
  const TRANSITION_OUT = 800;     // Time to slide off screen

  // Refs to prevent re-renders (Fixes the "double load" issue)
  const onStartExitingRef = useRef(onStartExiting);
  const onFinishRef = useRef(onFinish);

  useEffect(() => {
    onStartExitingRef.current = onStartExiting;
    onFinishRef.current = onFinish;
  }, [onStartExiting, onFinish]);

  useEffect(() => {
    // 1. Start Entry Animation (Grow from left)
    const t1 = setTimeout(() => setStage("entering"), 50);
    
    // 2. Fully Visible
    const t2 = setTimeout(() => setStage("visible"), TRANSITION_IN + 50);

    // 3. MOUNT THE APP (Hidden behind the curtain)
    const t3 = setTimeout(() => {
      // This tells App.js to render <Landing /> behind us
      if (onStartExitingRef.current) onStartExitingRef.current(); 
    }, TRANSITION_IN + LOADING_TIME);

    // 4. START THE SLIDE (The "Wipe" Effect)
    // We wait for the BUFFER time to ensure the app underneath is painted and ready
    const t4 = setTimeout(() => {
      setStage("exiting");
    }, TRANSITION_IN + LOADING_TIME + APP_LOAD_BUFFER);

    // 5. Unmount Splash Component (Cleanup)
    const t5 = setTimeout(() => {
      if (onFinishRef.current) onFinishRef.current();
    }, TRANSITION_IN + LOADING_TIME + APP_LOAD_BUFFER + TRANSITION_OUT);

    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); clearTimeout(t5);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none">
      
      {/* THE CURTAIN */}
      <div
        className="absolute inset-0 bg-black shadow-2xl"
        style={{
          // Use 'left' origin so it grows from left, then we slide it right
          transformOrigin: "left center",
          
          // ANIMATION STATES:
          transform:
            stage === "pending" ? "scaleX(0)"        // Start: Thin line on left
            : stage === "exiting" ? "translateX(100%)" // End: Slide fully to right
            : "scaleX(1)",                           // Middle: Full Screen

          transition:
            stage === "exiting"
              ? `transform ${TRANSITION_OUT}ms cubic-bezier(0.76, 0, 0.24, 1)` // Smooth Slide Out
              : `transform ${TRANSITION_IN}ms cubic-bezier(0.22, 1, 0.36, 1)`, // Snappy Entry

          willChange: "transform",
        }}
      >
        {/* CENTER CONTENT */}
        <div
          className={`
            relative w-full h-full flex flex-col items-center justify-center
            transition-all duration-500 ease-in-out
            ${stage === "exiting" ? "opacity-0 scale-95" : "opacity-100 scale-100"} 
            ${stage === "pending" ? "opacity-0" : ""}
          `}
        >
           <img
            src="/logow.png"
            alt="Logo"
            className="w-40 mb-8 drop-shadow-2xl"
          />

          {/* LOADING BAR */}
          <div className="w-64 h-1 bg-white/20 rounded-full overflow-hidden mb-4 backdrop-blur-sm">
            <div
              className="h-full bg-gradient-to-r from-purple-600 via-white to-purple-600"
              style={{
                width: "100%",
                transform:
                  stage === "visible" || stage === "exiting"
                    ? "translateX(0%)"
                    : "translateX(-100%)",
                transition: `transform ${LOADING_TIME}ms cubic-bezier(0.22, 1, 0.36, 1)`,
              }}
            />
          </div>

          <p className="text-gray-400 text-[10px] tracking-[0.4em] uppercase animate-pulse">
            Bringing The Best Experience To You...
          </p>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;