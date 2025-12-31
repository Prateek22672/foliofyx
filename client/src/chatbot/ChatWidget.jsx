// src/chatbot/ChatWidget.jsx
import React, { Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useChatbot } from "../context/ChatbotContext";
import { useLocation } from "react-router-dom";

// ✅ 1. Lazy Load ChatWindow to prevent page crash on initial load
const ChatWindow = React.lazy(() => import("./ChatWindow"));

const ChatWidget = () => {
  const { isOpen, toggleChat } = useChatbot();
  const location = useLocation();
  const isStudio = location.pathname === "/studio";

  // Determine icon
  const widgetIcon = isStudio ? "/goldfyx.png" : "/fyxlogow.png";

  return (
    <div className="fixed z-[9999] bottom-10 right-10 pointer-events-none">
      
      {/* DRAGGABLE CONTAINER */}
      <motion.div
        drag
        dragMomentum={false}
        // ✅ 2. Added constraints so you can't drag it off-screen accidentally
        dragConstraints={{ left: -1000, right: 0, top: -800, bottom: 0 }}
        whileDrag={{ scale: 1.05, cursor: "grabbing" }}
        className="pointer-events-auto relative flex flex-col items-end gap-4"
      >
        
        {/* THE CHAT WINDOW (Popup) */}
        <AnimatePresence mode="wait">
          {isOpen && (
            // ✅ 3. Suspense wrapper prevents crash if ChatWindow loads slowly
            <Suspense fallback={
              <div className="w-[350px] h-[500px] bg-black border border-white/20 rounded-2xl shadow-2xl flex items-center justify-center text-white/50 text-sm">
                Initializing FYX Ai...
              </div>
            }>
               {/* Make sure ChatWindow.jsx does NOT import ChatWidget. 
                  Circular imports will crash the app immediately.
               */}
               <ChatWindow />
            </Suspense>
          )}
        </AnimatePresence>

        {/* THE FLOATING BUTTON */}
        <motion.button
          onClick={toggleChat}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`
            w-14 h-14 rounded-full shadow-2xl flex items-center justify-center 
            transition-all duration-300 relative z-50
            ${isOpen 
              ? "bg-red-500 hover:bg-red-600 rotate-0" 
              : isStudio 
                ? "bg-black border border-[#D4AF37] shadow-[0_0_20px_-5px_rgba(212,175,55,0.5)]" 
                : "bg-black hover:bg-gray-900 border border-white/20"
            }
          `}
        >
          <AnimatePresence mode="wait" initial={false}>
            {isOpen ? (
              // Close Icon
              <motion.svg 
                key="close"
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
                xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </motion.svg>
            ) : (
              // Logo Icon
              <motion.img 
                key="logo"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                src={widgetIcon} 
                alt="Chat" 
                className="w-7 h-7 object-contain"
              />
            )}
          </AnimatePresence>
        </motion.button>
        
        {/* Pulsing Effect (Only when closed) */}
        {!isOpen && (
           <span className={`absolute bottom-0 right-0 -z-10 w-14 h-14 rounded-full animate-ping ${isStudio ? "bg-[#D4AF37]/50" : "bg-gray-800/50"}`}></span>
        )}

      </motion.div>
    </div>
  );
};

export default ChatWidget;