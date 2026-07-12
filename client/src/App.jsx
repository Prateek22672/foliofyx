import React, { useState, useEffect, lazy, Suspense } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";

// ✅ Import Guards
import { PublicRoute, ProtectedRoute } from "./components/RouteGuards";

// Eager: the entry page, auth (speed matters), and global chrome.
import Landing from "./landing/Landing";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import AppHeader from "./components/AppHeader";
import SplashScreen from "./components/SplashScreen";

// Lazy: everything else splits into its own chunk so the initial bundle
// only carries the landing page — the editor alone was a huge share of
// the old single 1.6MB chunk that every visitor had to download.
const Create           = lazy(() => import("./pages/create"));
const Customize        = lazy(() => import("./pages/Portfolio/Customize/customize-editor/Customize"));
const ReferenceStudio  = lazy(() => import("./pages/ReferenceStudio"));
const AIBuilder        = lazy(() => import("./pages/AIBuilder"));
const PortfolioView    = lazy(() => import("./pages/PortfolioView"));
const Dashboard        = lazy(() => import("./pages/Dashboard"));
const ThemesPage       = lazy(() => import("./pages/themes/ThemesPage"));
const AboutContactPage = lazy(() => import("./pages/AboutContact/AboutContactPage"));
const NewRelease       = lazy(() => import("./pages/NewRelease"));
const FindTalent       = lazy(() => import("./pages/FindTalent/FindTalent"));
const StudioPage       = lazy(() => import("./pages/StudioPage"));
const Checkout         = lazy(() => import("./pages/Checkout"));
const UserProfile      = lazy(() => import("./pages/UserProfile"));
const Pricing          = lazy(() => import("./pricing/Pricing"));
const Legal            = lazy(() => import("./Legal"));
const DemoView         = lazy(() => import("./pages/DemoView"));

// Contexts
import { ElementProvider } from "./context/ElementContext";
import { ChatbotProvider } from "./context/ChatbotContext";
import { SplashProvider } from "./context/SplashContext";
import { PortfolioProvider } from "./context/PortfolioContext";

// Global UI
import SmoothScroll from "./components/SmoothScroll";
import CustomCursor from "./components/CustomCursor";
import ChatWidget from "./chatbot/ChatWidget";
const CsStudentTemplates = lazy(() => import("./pages/themes/CsStudentTemplates"));
const ResumeToPortfolio  = lazy(() => import("./pages/ResumeToPortfolio"));

// Pages where the lag-dot custom cursor is welcome. Everywhere else keeps the
// native cursor — the custom one hurts UX on dense editor/dashboard screens.
const CURSOR_PAGES = ["/", "/about", "/contact", "/talent", "/Benefits", "/create"];

function App() {
  const location = useLocation();
  const showCursor = CURSOR_PAGES.includes(location.pathname);

  // Hide the native cursor only on pages that use the custom one.
  useEffect(() => {
    document.body.classList.toggle("custom-cursor-on", showCursor);
    return () => document.body.classList.remove("custom-cursor-on");
  }, [showCursor]);
  
  /**
   * 1. UNIVERSAL SPLASH LOGIC
   * We set showSplash to true by default so it triggers on ANY route refresh.
   * isAppReady remains false until the splash screen curtain is fully covering the screen.
   */
  // Auth pages skip the splash entirely — a user heading to log in wants the
  // form now, not the intro animation.
  const skipSplash =
    location.pathname.startsWith("/login") || location.pathname.startsWith("/signup");
  const [showSplash, setShowSplash] = useState(!skipSplash);
  const [isAppReady, setIsAppReady] = useState(skipSplash);

  // 2. Hide Header Logic
  const hideHeader =
    location.pathname.startsWith("/portfolio/") ||
    location.pathname.startsWith("/demo/") || 
    location.pathname.startsWith("/login") ||
    location.pathname.startsWith("/signup") ||
    location.pathname.startsWith("/customize/") ||
    location.pathname.startsWith("/create") ||
    location.pathname.startsWith("/ai-builder");

  // 3. Hide Chatbot Logic
  const hideGlobalWidget = 
    location.pathname.startsWith("/portfolio/") || 
    location.pathname.startsWith("/demo/") ||
    location.pathname.startsWith("/customize/") ||
    location.pathname.startsWith("/login") ||
    location.pathname.startsWith("/signup") ||
    location.pathname.startsWith("/ai-builder");

  return (
    <PortfolioProvider>
      <SplashProvider>
        <ChatbotProvider>

          {/* 
              SPLASH SCREEN 
              onStartExiting: Called when loading bar is done. Mounts the app behind the curtain.
              onFinish: Called when sweep-out animation is done. Unmounts the splash component.
          */}
          {showSplash && (
            <SplashScreen 
              onStartExiting={() => setIsAppReady(true)} 
              onFinish={() => setShowSplash(false)} 
            />
          )}

          {/* GLOBAL UI ELEMENTS - Only show when app is ready underneath */}
          {/* Custom cursor only on marketing pages (see CURSOR_PAGES) */}
          {isAppReady && showCursor && <CustomCursor />}
          {isAppReady && !hideGlobalWidget && <ChatWidget />}

          {/* MAIN CONTENT */}
          {isAppReady && (
            <SmoothScroll>
              <div className="min-h-screen bg-black text-white relative">
                
                {!hideHeader && <AppHeader />}

                <Suspense
                  fallback={
                    <div className="min-h-screen bg-black flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                    </div>
                  }
                >
                <Routes>
                  {/* ==================================================== */}
                  {/* 🔓 OPEN ROUTES                                     */}
                  {/* ==================================================== */}
                  <Route path="/" element={<Landing />} />
                  <Route path="/portfolio/:id" element={<PortfolioView />} />
                  <Route path="/demo/:templateKey" element={<DemoView />} />
                  <Route path="/designs" element={<ThemesPage />} />
                  
                  <Route path="/about" element={<AboutContactPage />} />
                  <Route path="/contact" element={<AboutContactPage />} />

                  <Route path="/release" element={<NewRelease />} />
                  <Route path="/talent" element={<FindTalent />} />
                  <Route path="/Benefits" element={<Pricing />} />
                  <Route path="/studio" element={<StudioPage />} />
                  <Route path="/legal" element={<Legal />} />
                  <Route path="/templates/cs-students" element={<CsStudentTemplates />} />
                  <Route path="/templates" element={<Navigate to="/designs" replace />} />

                  {/* SEO ROUTES */}
                  <Route path="/resume-to-portfolio" element={<ResumeToPortfolio />} />
                  <Route path="/portfolio-builder-for-students" element={<ResumeToPortfolio />} />
                  <Route path="/developer-portfolio-builder" element={<ResumeToPortfolio />} />
                  <Route path="/free-portfolio-website" element={<ResumeToPortfolio />} />
                  <Route path="/resume-to-website" element={<ResumeToPortfolio />} />
                  <Route path="/portfolio-templates" element={<ResumeToPortfolio />} />

                  {/* ==================================================== */}
                  {/* 🚫 PUBLIC ROUTES (Only if NOT logged in)            */}
                  {/* ==================================================== */}
                  <Route element={<PublicRoute />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                  </Route>

                  {/* ==================================================== */}
                  {/* 🔒 PROTECTED ROUTES (Only if logged in)               */}
                  {/* ==================================================== */}
                  <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/create" element={<Create />} />
                    <Route path="/profile" element={<UserProfile />} />
                    <Route path="/checkout/:planId" element={<Checkout />} />
                    
                    <Route
                      path="/customize/:template"
                      element={
                        <ElementProvider>
                          <Customize />
                        </ElementProvider>
                      }
                    />
                    <Route path="/studio/reference" element={<ReferenceStudio />} />
                    <Route path="/ai-builder" element={<AIBuilder />} />
                  </Route>

                  {/* Catch-all: unknown paths go home */}
                  <Route path="*" element={<Navigate to="/" replace />} />

                </Routes>
                </Suspense>
              </div>
            </SmoothScroll>
          )}

        </ChatbotProvider>
      </SplashProvider>
    </PortfolioProvider>
  );
}

export default App;