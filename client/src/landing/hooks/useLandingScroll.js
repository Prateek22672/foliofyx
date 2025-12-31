import { useEffect, useState } from "react";

export const useLandingScroll = (containerRef) => {
  const [vh, setVh] = useState(window.innerHeight);
  const [showArrows, setShowArrows] = useState(false);

  // Resize listener
  useEffect(() => {
    const onResize = () => setVh(window.innerHeight);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Scroll listener
  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const progress = scrollY / vh;

      if (containerRef.current) {
        containerRef.current.style.setProperty("--scroll", progress);
      }

      setShowArrows(Math.round(progress) >= 1);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [vh]);

  const scrollToSection = (index) => {
    const clamped = Math.max(0, Math.min(index, 4));
    document.documentElement.style.setProperty("--scroll", clamped);

    window.scrollTo({
      top: vh * clamped,
      behavior: "smooth",
    });
  };

  return { vh, showArrows, scrollToSection };
};
