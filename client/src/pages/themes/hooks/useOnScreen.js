// src/hooks/useOnScreen.js
import { useEffect, useState, useRef } from "react";

const useOnScreen = (rootMargin = "0px", threshold = 0.1) => {
  const ref = useRef(null);
  const [isIntersecting, setIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIntersecting(entry.isIntersecting);
        
        // Optimization: Once it has been seen, mark it true forever (good for entry animations)
        if (entry.isIntersecting) {
          setHasIntersected(true);
          // Optional: Unobserve immediately if you only need trigger-once
          // observer.unobserve(element); 
        }
      },
      { rootMargin, threshold }
    );

    observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, [rootMargin, threshold]);

  // Return both current state and "has it ever been visible" state
  return [ref, hasIntersected]; 
};

export default useOnScreen;