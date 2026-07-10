import React, { useEffect, useRef, useState } from "react";
import "./CustomCursor.css";

// Use a throttle helper to prevent "Theme Detection" from firing 100 times a second
const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
}

const CustomCursor = () => {
  const cursorRef = useRef(null);
  const [cursorSrc, setCursorSrc] = useState("/cursor/navigateBlack.png");

  // Use refs for values that change constantly to avoid re-renders
  const mouse = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0 });
  const lastTheme = useRef("light");
  const isHovering = useRef(false);

  useEffect(() => {
    // 1. IMPROVED PHYSICS (Friction/Lerp)
    // Higher friction (0.2 - 0.3) makes it feel more "correct" and less "laggy"
    const lerp = (start, end, factor) => start + (end - start) * factor;
    const friction = 0.22; 

    // 2. EFFICIENT THEME DETECTION
    const detectTheme = throttle(() => {
      const el = document.elementFromPoint(mouse.current.x, mouse.current.y);
      if (!el) return;

      // Use mix-blend-mode via CSS as a first layer, 
      // but for specific image swaps, we check computed styles
      const style = window.getComputedStyle(el);
      const bg = style.backgroundColor;
      
      // Parse RGB
      const m = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      if (m) {
        const r = +m[1], g = +m[2], b = +m[3];
        const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
        const theme = luminance < 120 ? "dark" : "light";

        if (theme !== lastTheme.current) {
          lastTheme.current = theme;
          setCursorSrc(theme === "dark" ? "/cursor/cursorWhite.png" : "/cursor/navigateBlack.png");
        }
      }
    }, 150); // Only check color every 150ms (huge performance win)

    const animate = () => {
      if (!cursorRef.current) return;

      // Update position with Lerp
      pos.current.x = lerp(pos.current.x, mouse.current.x, friction);
      pos.current.y = lerp(pos.current.y, mouse.current.y, friction);

      // Apply transform with translate3d for GPU acceleration
      // Offset by 14px (half of width/height) to center the image on the pointer
      const scale = isHovering.current ? 1.4 : 1;
      cursorRef.current.style.transform = `translate3d(${pos.current.x - 14}px, ${pos.current.y - 14}px, 0) scale(${scale})`;

      requestAnimationFrame(animate);
    };

    let overNativeZone = false;
    const onMouseMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;

      // Inside native-cursor zones (the app header) the OS cursor takes over
      // (see CustomCursor.css) — fade the custom dot out so they never overlap.
      const nativeZone = !!e.target.closest("[data-native-cursor]");
      if (nativeZone !== overNativeZone) {
        overNativeZone = nativeZone;
        if (cursorRef.current) cursorRef.current.style.opacity = nativeZone ? "0" : "1";
      }

      detectTheme();
    };

    const onMouseOver = (e) => {
      if (e.target.closest("a, button, [role='button'], .clickable, input, textarea")) {
        isHovering.current = true;
      }
    };

    const onMouseOut = () => {
      isHovering.current = false;
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mouseover", onMouseOver);
    window.addEventListener("mouseout", onMouseOut);
    const animId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseover", onMouseOver);
      window.removeEventListener("mouseout", onMouseOut);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div ref={cursorRef} className="custom-cursor">
      <img 
        src={cursorSrc} 
        alt="" 
        className="cursor-img" 
        loading="eager" 
        draggable="false" 
      />
    </div>
  );
};

export default CustomCursor;