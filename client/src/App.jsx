import React, { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

// ✅ Import Guards
import { PublicRoute, ProtectedRoute } from "./components/RouteGuards";

// Pages & Components
import Landing from "./landing/Landing";
import Create from "./pages/create"; 
import Customize from "./pages/Portfolio/Customize/customize-editor/Customize";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import AppHeader from "./components/AppHeader";
import PortfolioView from "./pages/PortfolioView";
import Dashboard from "./pages/Dashboard";
import SplashScreen from "./components/SplashScreen";
import ThemesPage from "./pages/themes/ThemesPage";
import AboutContactPage from "./pages/AboutContact/AboutContactPage";
import NewRelease from "./pages/NewRelease";
import FindTalent from "./pages/FindTalent/FindTalent";
import StudioPage from "./pages/StudioPage";
import Checkout from "./pages/Checkout";
import UserProfile from "./pages/UserProfile";
import Pricing from "./pricing/Pricing";
import Legal from "./Legal";

// Demo View
import DemoView from "./pages/DemoView";

// Contexts
import { ElementProvider } from "./context/ElementContext";
import { ChatbotProvider } from "./context/ChatbotContext";
import { SplashProvider } from "./context/SplashContext";
import { PortfolioProvider } from "./context/PortfolioContext";

// Global UI
import SmoothScroll from "./components/SmoothScroll";
import CustomCursor from "./components/CustomCursor";
import ChatWidget from "./chatbot/ChatWidget"; 
import WixAboutPage from "./pages/WixAbout/WixAboutPage";
import CsStudentTemplates from "./pages/themes/CsStudentTemplates";

function App() {
  const location = useLocation();
  
  // 1. Splash Screen Logic
  const [showSplash, setShowSplash] = useState(location.pathname === "/"); 
  const [isAppReady, setIsAppReady] = useState(!showSplash);

  // 2. Hide Header Logic
  const hideHeader =
    location.pathname.startsWith("/portfolio/") ||
    location.pathname.startsWith("/demo/") || 
    location.pathname.startsWith("/login") ||
    location.pathname.startsWith("/signup") ||
    location.pathname.startsWith("/customize/") ||
    location.pathname.startsWith("/create");

  // 3. Hide Chatbot Logic
  const hideGlobalWidget = 
    location.pathname.startsWith("/portfolio/") || 
    location.pathname.startsWith("/demo/") ||
    location.pathname.startsWith("/customize/") ||
    location.pathname.startsWith("/login") ||
    location.pathname.startsWith("/signup");

  return (
    <PortfolioProvider>
      <SplashProvider>
        <ChatbotProvider>

          {/* SPLASH SCREEN */}
          {showSplash && (
            <SplashScreen 
              onStartExiting={() => setIsAppReady(true)} 
              onFinish={() => setShowSplash(false)} 
            />
          )}

          {/* MAIN CONTENT */}
          {isAppReady && (
            <SmoothScroll>
              <div className="min-h-screen bg-black text-white relative">
                
                {!hideHeader && <AppHeader />}

                <Routes>
                  {/* ==================================================== */}
                  {/* 🔓 OPEN ROUTES (Accessible by everyone)              */}
                  {/* ==================================================== */}
                  <Route path="/" element={<Landing />} />
                  <Route path="/portfolio/:id" element={<PortfolioView />} />
                  <Route path="/demo/:templateKey" element={<DemoView />} />
                  <Route path="/templates" element={<ThemesPage />} />
                  <Route path="/about" element={<AboutContactPage />} />
                  <Route path="/release" element={<NewRelease />} />
                  <Route path="/talent" element={<FindTalent />} />
                  <Route path="/Benefits" element={<Pricing />} />
                  <Route path="/studio" element={<StudioPage />} />
                  <Route path="/legal" element={<Legal />} />
                  <Route path="/testing" element={<WixAboutPage/>}/>
                  <Route path="/templates/cs-students" element={<CsStudentTemplates />} />

                  {/* ==================================================== */}
                  {/* 🚫 PUBLIC ROUTES (Only if NOT logged in)             */}
                  {/* Redirects to /dashboard if user is already logged in */}
                  {/* ==================================================== */}
                  <Route element={<PublicRoute />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                  </Route>

                  {/* ==================================================== */}
                  {/* 🔒 PROTECTED ROUTES (Only if logged in)              */}
                  {/* Redirects to /login if user is not logged in         */}
                  {/* ==================================================== */}
                  <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/create" element={<Create />} />
                    <Route path="/profile" element={<UserProfile />} />
                    <Route path="/checkout/:planId" element={<Checkout />} />
                    
                    {/* Complex Protected Route */}
                    <Route
                      path="/customize/:template" 
                      element={
                        <ElementProvider>
                          <Customize />
                        </ElementProvider>
                      }
                    />
                  </Route>

                </Routes>
              </div>
            </SmoothScroll>
          )}

          {/* GLOBAL ELEMENTS */}
          {isAppReady && <CustomCursor />}
          {isAppReady && !hideGlobalWidget && <ChatWidget />}

        </ChatbotProvider>
      </SplashProvider>
    </PortfolioProvider>
  );
}

export default App;