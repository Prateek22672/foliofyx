import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPortfolio } from "../api/portfolioAPI";
import { TEMPLATE_LIST } from "./Portfolio/Templates";
import { ThemeContext } from "../context/ThemeContext";
import { ChatbotProvider } from "../context/ChatbotContext";
import ChatWidget from "../chatbot/ChatWidget";
import { QrCode, Home, AlertCircle } from "lucide-react";
import FyxCardPopup from "./Portfolio/Customize/FyxCardPopup";
import CustomSiteRenderer from "./Templates/Custom/CustomSiteRenderer";

// ─────────────────────────────────────────────
// Utility: get luminance of a hex color (0–1)
// ─────────────────────────────────────────────
function getLuminance(hex) {
  if (!hex) return 0;
  const clean = hex.replace("#", "");
  const full = clean.length === 3
    ? clean.split("").map(c => c + c).join("")
    : clean;
  const r = parseInt(full.slice(0, 2), 16) / 255;
  const g = parseInt(full.slice(2, 4), 16) / 255;
  const b = parseInt(full.slice(4, 6), 16) / 255;
  const toLinear = (v) => v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

// Returns true if the bg is "light" (needs dark text/ui)
function isLightColor(hex) {
  return getLuminance(hex) > 0.35;
}

// Given a bg hex, return a safe foreground color
function getContrastColor(hex) {
  return isLightColor(hex) ? "#0f172a" : "#ffffff";
}

// Build a full adaptive theme object from the portfolio's bg
function buildAdaptiveTheme(themeBg, accentColor) {
  const bg = themeBg || "#0a0a0a";
  const isLight = isLightColor(bg);

  return {
    bg,
    fg: getContrastColor(bg),
    accent: accentColor || (isLight ? "#2563eb" : "#7c3aed"),
    // card surface — slightly offset from bg
    cardBg: isLight ? "#ffffff" : "#18181b",
    cardBorder: isLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.08)",
    mutedFg: isLight ? "rgba(0,0,0,0.45)" : "rgba(255,255,255,0.45)",
    isLight,
  };
}

const PortfolioView = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCard, setShowCard] = useState(false);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const data = await getPortfolio(id);
        if (isMounted) {
          if (data) setPortfolioData(data);
          setLoading(false);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        if (isMounted) setLoading(false);
      }
    })();
    return () => { isMounted = false; };
  }, [id]);

  // --- LOADING ---
  if (loading) return (
    <div className="flex justify-center items-center min-h-screen bg-black text-white text-lg">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        <span className="opacity-50 text-sm font-medium uppercase tracking-widest">Loading Portfolio...</span>
      </div>
    </div>
  );

  // --- 404 ---
  if (!portfolioData) return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-black text-white px-6 text-center">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
      </div>
      <div className="relative z-10 w-24 h-24 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mb-8 backdrop-blur-md">
        <AlertCircle size={40} className="text-white/40" />
      </div>
      <h1 className="relative z-10 text-5xl md:text-7xl font-bold mb-4 tracking-tight">Oops!</h1>
      <p className="relative z-10 text-lg md:text-xl text-white/50 mb-10 max-w-md leading-relaxed">
        We couldn't find the portfolio you're looking for. Please check the link or username and try again.
      </p>
      <button
        onClick={() => navigate("/")}
        className="relative z-10 px-8 py-4 bg-white hover:bg-gray-200 text-black rounded-full font-bold text-sm transition-all transform hover:scale-105 shadow-xl flex items-center gap-2 group"
      >
        <Home size={18} className="group-hover:-translate-y-0.5 transition-transform" />
        Go to Home
      </button>
    </div>
  );

  // --- RENDER ---
  const templateName = (portfolioData.template || "modern").toLowerCase();

  // ── CUSTOM BUILDER: render the saved canvas read-only (deploy parity) ──
  // Custom sites don't use the section-component template system; their layout
  // lives in portfolioData.customLayout and is rendered by CustomSiteRenderer.
  if (templateName === "custom") {
    const firstBg = portfolioData.customLayout?.pages?.[0]?.bgColor || "#ffffff";
    return (
      <div style={{ minHeight: "100vh", background: firstBg }}>
        <CustomSiteRenderer layout={portfolioData.customLayout} />
      </div>
    );
  }

  const selected = TEMPLATE_LIST[templateName] || TEMPLATE_LIST.modern;
  const TemplateModule = selected.module;

  const COMPONENT_ORDER = [
    "Header", "Home", "About", "Services", "Features",
    "Experience", "Projects", "Process", "Testimonials",
    "CTA", "Contact", "Footer"
  ];

  // Build adaptive theme — computed once from portfolio bg
  const adaptiveTheme = buildAdaptiveTheme(portfolioData.themeBg, portfolioData.accentColor);

  // QR button colors that always contrast against the portfolio bg
  const qrBtnBg = adaptiveTheme.isLight
    ? "rgba(0,0,0,0.08)"
    : "rgba(255,255,255,0.10)";
  const qrBtnBorder = adaptiveTheme.isLight
    ? "rgba(0,0,0,0.12)"
    : "rgba(255,255,255,0.15)";
  const qrBtnColor = adaptiveTheme.fg;

  return (
    <ThemeContext.Provider value={{
      bg: portfolioData.themeBg,
      fg: portfolioData.themeFont,
      accent: portfolioData.accentColor,
      header: portfolioData.headerColor,
    }}>
      <ChatbotProvider portfolioData={portfolioData}>
        <div
          className="relative min-h-screen overflow-x-hidden"
          style={{
            backgroundColor: portfolioData.themeBg,
            color: portfolioData.themeFont,
            fontFamily: portfolioData.themeFontFamily || "Switzer, sans-serif",
            "--folio-font": portfolioData.themeFontFamily || "Switzer, sans-serif",
          }}
        >
          <div className="fixed inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/90 z-0 pointer-events-none" />

          <div className="relative z-10 w-full">
            {COMPONENT_ORDER.map((key) => {
              const Component = TemplateModule[key];
              if (!Component) return null;
              return (
                <Component
                  key={key}
                  portfolioData={portfolioData}
                  data={portfolioData}
                  isReadOnly={true}
                />
              );
            })}
          </div>

          {/* FLOATING QR BUTTON — adapts to bg */}
          <button
            onClick={() => setShowCard(true)}
            title="Get QR Card"
            className="fixed bottom-6 left-6 z-40 p-3 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 group backdrop-blur-md border"
            style={{
              backgroundColor: qrBtnBg,
              borderColor: qrBtnBorder,
              color: qrBtnColor,
            }}
          >
            <QrCode size={20} className="opacity-80 group-hover:opacity-100" />
          </button>

          {/* QR POPUP — pass adaptive theme so popup can use it */}
          {showCard && (
            <FyxCardPopup
              onClose={() => setShowCard(false)}
              portfolioData={portfolioData}
              adaptiveTheme={adaptiveTheme}
            />
          )}

          {/* AI CHATBOT */}
          {portfolioData.enableChatbot && (
            <ChatWidget
              portfolioId={portfolioData._id}
              ownerName={portfolioData.name}
              themeColor={portfolioData.accentColor}
            />
          )}
        </div>
      </ChatbotProvider>
    </ThemeContext.Provider>
  );
};

export default PortfolioView;