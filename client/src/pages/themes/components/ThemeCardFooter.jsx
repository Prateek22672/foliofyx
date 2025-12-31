import React from "react";
import useOnScreen from "../hooks/useOnScreen";

const ThemeCardFooter = () => {
  const [ref, isVisible] = useOnScreen();

  return (
    <p
      ref={ref}
      className={`text-center mt-20 text-[15px] text-black uppercase tracking-[0.25em]
      transition-opacity duration-1000 ${isVisible ? "opacity-100" : "opacity-0"}`}
    >
      A <span className="text-[#1A237E] font-semibold">Prateek™</span> Product — Where ideas meet passion.
    </p>
  );
};

export default ThemeCardFooter;
