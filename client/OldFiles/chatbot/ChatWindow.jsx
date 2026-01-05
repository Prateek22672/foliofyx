
// src/chatbot/ChatWindow.jsx
import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useChatbot } from "../context/ChatbotContext";

const ChatWindow = () => {
  const { messages, isTyping, handleUserMessage, closeChat } = useChatbot();
  const [input, setInput] = useState("");
  const scrollRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    handleUserMessage(input);
    setInput("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      // ✅ SIZE UPDATE: Reduced width and height for a cleaner, compact look
      // Mobile: 300px wide, 400px tall | Desktop: 320px wide, 450px tall
      className="w-[300px] h-[400px] md:w-[320px] md:h-[450px] flex flex-col bg-neutral-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden font-sans"
    >
      
      {/* --- HEADER --- */}
      <div className="h-12 bg-black/50 border-b border-white/5 flex items-center justify-between px-4 backdrop-blur-md">
        <div className="flex items-center gap-2">
          {/* Gold Status Dot */}
          <div className="w-2 h-2 rounded-full bg-[#D4AF37] shadow-[0_0_8px_#D4AF37]"></div>
          <span className="text-white text-sm font-medium tracking-wide">FYX Ai</span>
        </div>
        {/* Close Button */}
        <button onClick={closeChat} className="text-white/50 hover:text-white transition-colors">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>

      {/* --- MESSAGES AREA --- */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
          >
            {/* Message Bubble */}
            <div
              className={`max-w-[90%] px-3 py-2 rounded-xl text-xs leading-relaxed ${
                msg.sender === "user"
                  ? "bg-white text-black rounded-tr-none font-medium" 
                  : "bg-white/10 text-gray-200 rounded-tl-none border border-white/5"
              }`}
            >
              {msg.text}
            </div>

            {/* Option Buttons */}
            {msg.options && msg.options.length > 0 && (
               <div className="mt-2 flex flex-wrap gap-1.5">
                 {msg.options.map((opt, idx) => (
                   <button
                     key={idx}
                     onClick={() => handleUserMessage(opt.label)}
                     className="text-[10px] bg-black border border-[#D4AF37]/40 text-[#D4AF37] px-2 py-1 rounded-full hover:bg-[#D4AF37] hover:text-black transition-all duration-300"
                   >
                     {opt.label}
                   </button>
                 ))}
               </div>
            )}
            
            <span className="text-[9px] text-white/20 mt-1 px-1">
              {msg.timestamp || "Just now"}
            </span>
          </div>
        ))}

        {/* Typing Animation */}
        {isTyping && (
          <div className="flex items-start">
             <div className="bg-white/10 px-3 py-2 rounded-xl rounded-tl-none flex gap-1 items-center">
               <span className="w-1 h-1 bg-white/40 rounded-full animate-bounce"></span>
               <span className="w-1 h-1 bg-white/40 rounded-full animate-bounce delay-75"></span>
               <span className="w-1 h-1 bg-white/40 rounded-full animate-bounce delay-150"></span>
             </div>
          </div>
        )}
      </div>

      {/* --- INPUT AREA --- */}
      <form 
        onSubmit={handleSubmit}
        className="p-3 bg-black/30 border-t border-white/5 backdrop-blur-sm"
      >
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask AI..."
            className="w-full bg-white/5 text-white text-xs rounded-lg pl-3 pr-10 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/50 placeholder:text-white/20 transition-all"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="absolute right-1.5 p-1 bg-[#D4AF37] rounded-md text-black hover:scale-105 active:scale-95 disabled:opacity-50 transition-transform"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
          </button>
        </div>
        <div className="text-center mt-1.5">
            <span className="text-[9px] text-white/20 uppercase tracking-widest">Powered by FolioFYX</span>
        </div>
      </form>

    </motion.div>
  );
};

export default ChatWindow;