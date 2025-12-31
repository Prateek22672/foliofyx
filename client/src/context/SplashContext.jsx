import React, { createContext, useContext, useState } from "react";
import SplashScreen from "../components/SplashScreen";

const SplashContext = createContext();

export const SplashProvider = ({ children }) => {
  const [isActive, setIsActive] = useState(false);
  const [splashMessage, setSplashMessage] = useState("Loading...");

  const showSplash = (duration = 2500, callback, message = "Loading...") => {
    setSplashMessage(message);
    setIsActive(true);

    setTimeout(() => {
      setIsActive(false);
      if (callback) callback();
    }, duration);
  };

  return (
    <SplashContext.Provider value={{ showSplash }}>
      {children}

      {/* ✅ Always render SplashScreen overlay when active */}
      {isActive && <SplashScreen message={splashMessage} />}
    </SplashContext.Provider>
  );
};

export const useSplash = () => useContext(SplashContext);
