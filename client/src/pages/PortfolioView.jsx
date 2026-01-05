import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // ✅ Import useNavigate
import { getPortfolio } from "../api/portfolioAPI"; 
import { TEMPLATE_LIST } from "./Portfolio/Templates"; 
import { ThemeContext } from "../context/ThemeContext";
import { ChatbotProvider } from "../context/ChatbotContext";
import ChatWidget from "../chatbot/ChatWidget";

// ✅ Import Icons
import { QrCode, Home, AlertCircle } from "lucide-react";
import FyxCardPopup from "./Portfolio/Customize/FyxCardPopup"; 

const PortfolioView = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // ✅ Navigation hook
  
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCard, setShowCard] = useState(false);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const data = await getPortfolio(id); 
        
        if (isMounted) {
          if (data) {
            setPortfolioData(data);
          }
          // Note: If data is null, we just stop loading, triggering the Not Found UI
          setLoading(false);
        }
      } catch (err) {
        console.error("❌ Fetch error:", err);
        if (isMounted) setLoading(false);
      }
    })();

    return () => { isMounted = false; };
  }, [id]);

  // --- LOADING STATE ---
  if (loading) return (
    <div className="flex justify-center items-center min-h-screen bg-black text-white text-lg">
      <div className="flex flex-col items-center gap-4">
         <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
         <span className="opacity-50 text-sm font-medium uppercase tracking-widest">Loading Portfolio...</span>
      </div>
    </div>
  );

  // --- 404 / NOT FOUND STATE ---
  if (!portfolioData) return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-black text-white px-6 text-center">
        {/* Animated Background Blob */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
        </div>

        {/* Icon */}
        <div className="relative z-10 w-24 h-24 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mb-8 backdrop-blur-md">
            <AlertCircle size={40} className="text-white/40" />
        </div>

        {/* Text */}
        <h1 className="relative z-10 text-5xl md:text-7xl font-bold mb-4 tracking-tight">Oops!</h1>
        <p className="relative z-10 text-lg md:text-xl text-white/50 mb-10 max-w-md leading-relaxed">
            We couldn't find the portfolio you're looking for. Please check the link or username and try again.
        </p>

        {/* Home Button */}
        <button 
            onClick={() => navigate('/')}
            className="relative z-10 px-8 py-4 bg-white hover:bg-gray-200 text-black rounded-full font-bold text-sm transition-all transform hover:scale-105 shadow-xl flex items-center gap-2 group"
        >
            <Home size={18} className="group-hover:-translate-y-0.5 transition-transform" />
            Go to Home
        </button>
    </div>
  );

  // --- RENDER PORTFOLIO ---
  const templateName = (portfolioData.template || "modern").toLowerCase();
  const selected = TEMPLATE_LIST[templateName] || TEMPLATE_LIST.modern;
  const TemplateModule = selected.module;

  const COMPONENT_ORDER = [
    'Header', 'Home', 'About', 'Services', 'Features', 
    'Experience', 'Projects', 'Process', 'Testimonials', 
    'CTA', 'Contact', 'Footer'
  ];

  return (
    <ThemeContext.Provider value={{ 
        bg: portfolioData.themeBg, 
        fg: portfolioData.themeFont, 
        accent: portfolioData.accentColor, 
        header: portfolioData.headerColor 
    }}>
      <ChatbotProvider portfolioData={portfolioData}>
<div 
            className="relative bg-black text-white min-h-screen overflow-x-hidden"
            style={{ 
                backgroundColor: portfolioData.themeBg, 
                color: portfolioData.themeFont,
                fontFamily: portfolioData.themeFontFamily || "Switzer, sans-serif", // <--- ADD THIS
                "--folio-font": portfolioData.themeFontFamily || "Switzer, sans-serif"
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
                    />
                );
            })}
            </div>

            {/* FLOATING QR BUTTON */}
            <button
                onClick={() => setShowCard(true)}
                className="fixed bottom-6 left-6 z-40 p-3 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full shadow-2xl hover:scale-110 hover:bg-white/20 transition-all duration-300 group"
                title="Get QR Card"
            >
                <QrCode size={20} className="opacity-80 group-hover:opacity-100" />
            </button>

            {/* QR POPUP */}
            {showCard && (
                <FyxCardPopup 
                    onClose={() => setShowCard(false)} 
                    portfolioData={portfolioData} 
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