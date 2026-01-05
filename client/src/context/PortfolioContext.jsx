// src/context/PortfolioContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { getAllPortfolios } from "../api/portfolioAPI";
import { useAuth } from "./AuthContext"; // Import Auth Context

const PortfolioContext = createContext();

export const PortfolioProvider = ({ children }) => {
  const [portfolioData, setPortfolioData] = useState(null);
  const [loadingPortfolio, setLoadingPortfolio] = useState(true);
  
  // Get user/token status from AuthContext
  const { user } = useAuth(); 

  useEffect(() => {
    async function loadPortfolio() {
      // 👇 FIX: If no user/token in storage, STOP here. 
      // This prevents the 401 error for guests.
      const token = localStorage.getItem("accessToken");
      if (!token) {
          setLoadingPortfolio(false);
          return;
      }

      try {
        const portfolios = await getAllPortfolios();

        if (Array.isArray(portfolios) && portfolios.length > 0) {
          const p = portfolios[0]; 
          setPortfolioData({
            ...p,
            isPublic: p.isPublic ?? false,
            publicProfile: p.publicProfile ?? false,
            template: p.template || "modern",
            themeFontFamily: p.themeFontFamily || "Switzer, sans-serif",
            skills: Array.isArray(p.skills) ? p.skills : [],
            projects: Array.isArray(p.projects) ? p.projects : [],
          });
        } else {
          // User exists but has no portfolio yet
          setPortfolioData({
             // ... your default empty state ...
             name: user?.name || "Your Name", // Pre-fill name if available
             email: user?.email || "you@example.com",
             // ... rest of defaults
          });
        }
      } catch (err) {
        console.error("Error loading portfolio:", err);
      } finally {
        setLoadingPortfolio(false);
      }
    }

    loadPortfolio();
  }, [user]); // Re-run if user logs in/out

  return (
    <PortfolioContext.Provider
      value={{ portfolioData, setPortfolioData, loadingPortfolio }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => useContext(PortfolioContext);