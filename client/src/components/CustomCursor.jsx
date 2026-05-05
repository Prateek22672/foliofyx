import React, { useEffect, useRef, useState } from "react";
import "./CustomCursor.css";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const isDarkColor = (r, g, b) => {
  // Perceived luminance — matches human eye weighting
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
  return luminance < 128;
};

const parseRGB = (cssColor) => {
  const m = cssColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!m) return null;
  return { r: +m[1], g: +m[2], b: +m[3] };
};

const getBackgroundAtPoint = (x, y) => {
  // Walk up from the element under the cursor to find a real background
  let el = document.elementFromPoint(x, y);
  while (el && el !== document.documentElement) {
    const style = window.getComputedStyle(el);
    const bg = style.backgroundColor;
    if (bg && bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent") {
      return bg;
    }
    el = el.parentElement;
  }
  // Fallback: body background
  return window.getComputedStyle(document.body).backgroundColor;
};

// ─── Component ────────────────────────────────────────────────────────────────

const CustomCursor = () => {
  const cursorRef = useRef(null);
  const [cursorSrc, setCursorSrc] = useState("/cursor/navigateBlack.png");

  const position = useRef({ x: -100, y: -100 });
  const mouse    = useRef({ x: -100, y: -100 });
  const isHovering = useRef(false);

  // Track last detected theme to avoid unnecessary state updates
  const lastTheme = useRef("light");

  useEffect(() => {
    const cursor = cursorRef.current;
    const friction = 0.12;
    let animationId;

    const detectTheme = () => {
      const { x, y } = mouse.current;
      if (x === -100) return;

      const bgColor = getBackgroundAtPoint(x, y);
      const parsed  = parseRGB(bgColor);
      if (!parsed) return;

      const dark   = isDarkColor(parsed.r, parsed.g, parsed.b);
      const theme  = dark ? "dark" : "light";

      if (theme !== lastTheme.current) {
        lastTheme.current = theme;
        setCursorSrc(dark ? "/cursor/cursorWhite.png" : "/cursor/navigateBlack.png");
      }
    };

    const animate = () => {
      if (!cursor) return;

      const distX = mouse.current.x - position.current.x;
      const distY = mouse.current.y - position.current.y;

      position.current.x += distX * friction;
      position.current.y += distY * friction;

      const scale = isHovering.current ? 1.2 : 1;

      cursor.style.transform = `
        translate3d(${position.current.x}px, ${position.current.y}px, 0)
        scale(${scale})
      `;

      animationId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;

      if (position.current.x === -100) {
        position.current.x = e.clientX;
        position.current.y = e.clientY;
      }

      detectTheme();
    };

    const handleMouseOver = (e) => {
      const interactive = e.target.closest("a, button, [role='button'], .clickable");
      if (interactive) isHovering.current = true;
    };

    const handleMouseOut = () => {
      isHovering.current = false;
    };

    animationId = requestAnimationFrame(animate);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mouseout",  handleMouseOut);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mouseout",  handleMouseOut);
    };
  }, []);

  return (
    <div ref={cursorRef} className="custom-cursor">
      <img src={cursorSrc} alt="cursor" className="cursor-img" />
    </div>
  );
};

export default CustomCursor;