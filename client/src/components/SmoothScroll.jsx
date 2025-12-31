import React, { useEffect, useRef } from 'react';
// Changed import to the base Lenis library package for better compatibility.
import Lenis from '@studio-freight/lenis';

/**
 * SmoothScroll component initializes and manages a Lenis smooth scrolling instance
 * to enable inertial, "draggy" smooth scrolling across the entire site.
 */
const SmoothScroll = ({ children }) => {
  // Configuration options for the Lenis instance
  const lenisOptions = {
    // Lower value means more inertia/damping (the "draggy" feel)
    // Try values between 0.05 (very smooth) and 0.15 (subtle smooth)
    lerp: 0.1,
    // Duration of the scroll animation
    duration: 1.5,
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    // Set to true if you want smooth scroll on mobile touch events
    smoothTouch: false,
    // Keeps native scrolling on touch for better performance
    syncTouch: true,
  };

  useEffect(() => {
    // 1. Initialize Lenis instance
    const lenis = new Lenis(lenisOptions);

    // 2. Define the animation loop using requestAnimationFrame (raf)
    function raf(time) {
      // Lenis uses the requestAnimationFrame time argument to synchronize scroll
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    // 3. Start the animation loop
    requestAnimationFrame(raf);

    // 4. Cleanup function: destroy the Lenis instance when the component unmounts
    return () => {
      lenis.destroy();
    };
  }, []); // Run only once on mount

  // Lenis hooks into the global scroll (window/document), so we only need to render the children.
  return <>{children}</>;
};

export default SmoothScroll;