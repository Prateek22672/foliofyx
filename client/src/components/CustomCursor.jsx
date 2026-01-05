import React, { useEffect, useRef } from "react";
import "./CustomCursor.css";

const CustomCursor = () => {
  const cursorRef = useRef(null);
  
  // Use refs for values that change constantly to avoid re-renders
  const position = useRef({ x: -100, y: -100 }); // Current cursor position
  const mouse = useRef({ x: -100, y: -100 });    // Mouse target
  const velocity = useRef({ x: 0, y: 0 });       // For physics

  useEffect(() => {
    const cursor = cursorRef.current;
    
    // Config
    const friction = 0.15; // 0.1 = loose, 0.2 = snappy. 0.15 is "Classic" smooth.
    let isHovering = false; // Internal flag to disable stretch effect on hover

    const animate = () => {
      if (!cursor) return;

      // 1. Smooth Follow (Lerp)
      const distX = mouse.current.x - position.current.x;
      const distY = mouse.current.y - position.current.y;

      position.current.x += distX * friction;
      position.current.y += distY * friction;

      // 2. Velocity Calculation (for stretch effect)
      velocity.current.x = distX;
      velocity.current.y = distY;

      // 3. Calculate Stretch & Rotation
      // We only stretch if we are NOT hovering something (keeps hover shapes clean)
      let scaleX = 1;
      let scaleY = 1;
      let angle = 0;

      if (!isHovering) {
        const speed = Math.sqrt(
          velocity.current.x ** 2 + velocity.current.y ** 2
        );
        const stretch = Math.min(speed / 600, 0.15); // Cap stretch for subtlety
        
        angle = Math.atan2(velocity.current.y, velocity.current.x);
        scaleX = 1 + stretch;
        scaleY = 1 - stretch;
      }

      // 4. Apply Styles
      // using translate3d triggers GPU acceleration
      cursor.style.transform = `
        translate3d(${position.current.x}px, ${position.current.y}px, 0)
        translate(-50%, -50%)
        rotate(${angle}rad)
        scale(${scaleX}, ${scaleY})
      `;

      requestAnimationFrame(animate);
    };

    const handleMouseMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;

      // Instant start on load
      if (position.current.x === -100) {
        position.current.x = e.clientX;
        position.current.y = e.clientY;
      }
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      
      // Check for clickable elements
      const isLink = target.closest("a") || target.closest("button") || target.closest(".clickable");
      
      // Check for specific cursor shapes via data attributes
      // Example: <div data-cursor="text"> or <div data-cursor="video">
      const customShape = target.closest("[data-cursor]")?.getAttribute("data-cursor");

      if (isLink || customShape) {
        isHovering = true;
        cursor.classList.add("is-hovering");
      }

      // Apply specific shape classes
      if (customShape) {
        cursor.classList.add(`shape-${customShape}`);
      }
    };

    const handleMouseOut = (e) => {
      isHovering = false;
      cursor.classList.remove("is-hovering");
      
      // Clean up all possible shape classes
      cursor.classList.remove("shape-text", "shape-video", "shape-hide");
    };

    // Initialize
    const animationId = requestAnimationFrame(animate);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mouseout", handleMouseOut);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mouseout", handleMouseOut);
    };
  }, []);

  return <div ref={cursorRef} className="custom-cursor" />;
};

export default CustomCursor;