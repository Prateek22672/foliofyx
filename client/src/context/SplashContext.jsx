import React, { createContext, useContext, useState } from "react";
import BrandZoomTransition from "../components/BrandZoomTransition";

const SplashContext = createContext();

export const SplashProvider = ({ children }) => {
  const [isActive, setIsActive] = useState(false);
  const [splashMessage, setSplashMessage] = useState("Loading...");
  const [splashDuration, setSplashDuration] = useState(2000);

  /**
   * Brand zoom transition. Same signature as before:
   *   showSplash(duration, callback, message)
   * The callback (usually a navigate) fires at ~58% of the duration, while
   * the overlay still covers the screen — the new page mounts behind it and
   * is revealed when the wordmark zooms open. Unmounts at `duration`.
   */
  const showSplash = (duration = 2000, callback, message = "Loading...") => {
    setSplashMessage(message);
    setSplashDuration(duration);
    setIsActive(true);

    setTimeout(() => {
      if (callback) callback();
    }, duration * 0.58);

    setTimeout(() => {
      setIsActive(false);
    }, duration);
  };

  return (
    <SplashContext.Provider value={{ showSplash }}>
      {children}

      {isActive && (
        <BrandZoomTransition message={splashMessage} duration={splashDuration} />
      )}
    </SplashContext.Provider>
  );
};

export const useSplash = () => useContext(SplashContext);
