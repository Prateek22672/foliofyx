import { useState, useEffect } from "react";

/**
 * Smooth + Instant scroll hook.
 * 
 * rawY = updates instantly with scroll
 * y = smoothly interpolated to avoid dragging issues
 */
export default function useScrollY(smoothFactor = 0.12) {
  const [rawY, setRawY] = useState(0);
  const [y, setY] = useState(0); // smooth parallax value

  useEffect(() => {
    let raf;

    const onScroll = () => {
      const newY = window.scrollY;
      setRawY(newY); // instant
    };

    const animate = () => {
      // Lerp smoothing — removes drag but stays responsive
      setY(prev => prev + (rawY - prev) * smoothFactor);
      raf = requestAnimationFrame(animate);
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    // Start animation loop
    animate();

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [smoothFactor, rawY]);

  return y; // return SMOOTH value for parallax
}
