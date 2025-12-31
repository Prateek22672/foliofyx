import React, { useEffect, useRef, useState } from "react";
import "./CustomCursor.css";

const CustomCursor = () => {
  const cursorRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const cursor = cursorRef.current;

    // Current position of the ball
    let currentX = -100;
    let currentY = -100;
    
    // Mouse position (Target)
    let mouseX = -100;
    let mouseY = -100;

    // Lag factor: Lower = slower/more lag. Higher = faster/less lag.
    // 0.1 to 0.15 is the sweet spot for a smooth 0.1s feel.
    const lagFactor = 0.12; 

    const animate = () => {
      // 1. Calculate distance to target
      const distX = mouseX - currentX;
      const distY = mouseY - currentY;

      // 2. Move a percentage of the distance (Lerp)
      // This guarantees no overshooting/bounciness, just smooth following
      currentX = currentX + distX * lagFactor;
      currentY = currentY + distY * lagFactor;

      // 3. Calculate "Velocity" based on how much we moved this frame
      // We use this purely for the stretch/squash effect
      const velocityX = distX * lagFactor;
      const velocityY = distY * lagFactor;

      // 4. Calculate Angle and Stretch
      const angle = Math.atan2(velocityY, velocityX);
      
      // Cap the stretch so it doesn't get too thin
      const speed = Math.sqrt(velocityX ** 2 + velocityY ** 2);
      const stretch = Math.min(speed / 15, 0.35);

      if (cursor) {
        cursor.style.transform = `
          translate3d(${currentX}px, ${currentY}px, 0)
          translateX(-50%) translateY(-50%)
          rotate(${angle}rad)
          scaleX(${1 + stretch})
          scaleY(${1 - stretch})
        `;
      }

      requestAnimationFrame(animate);
    };

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      // Initialize position on first move to prevent cursor flying in from corner
      if (currentX === -100) {
        currentX = e.clientX;
        currentY = e.clientY;
      }
    };

    const handleMouseOver = (e) => {
      if (
        e.target.tagName === "A" ||
        e.target.tagName === "BUTTON" ||
        e.target.closest("a") ||
        e.target.closest("button")
      ) {
        setIsHovering(true);
      }
    };

    const handleMouseOut = () => setIsHovering(false);

    // Start loop
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

  return (
    <div
      ref={cursorRef}
      className={`custom-cursor ${isHovering ? "hovered" : ""}`}
    />
  );
};

export default CustomCursor;