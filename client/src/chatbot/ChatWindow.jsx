import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useChatbot } from "../context/ChatbotContext";
import { Send, X, MoreHorizontal, Smile, Sparkles } from "lucide-react"; 

const ChatWindow = () => {
  const { messages, isTyping, handleUserMessage, closeChat } = useChatbot();
  const [input, setInput] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
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
      transition={{ duration: 0.2, ease: "easeOut" }}
      // ✅ RESIZED: Smaller width (340px) and height (500px) to fit better
      className="w-[380px] h-[460px] flex flex-col bg-white rounded-3xl shadow-2xl overflow-hidden font-sans border border-gray-200"
    >
      {/* --- HEADER (Compact) --- */}
      {/* Reduced height to h-14 (56px) and padding */}
      <div className="h-14 bg-black flex items-center justify-between px-4 shadow-md z-10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-6 rounded-fullflex items-center justify-center">
             <img className="w-10" src="/fyxlogow.png"/>
          </div>
          <div className="flex flex-col">
            <h3 className="text-white font-bold text-sm leading-tight">FYX Ai</h3>
            <span className="text-gray-400 text-[10px]">Ask me anything...</span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-gray-400">
           <button onClick={closeChat} className="p-1.5 hover:bg-white/10 rounded-full transition-colors hover:text-white"><X size={18} /></button>
        </div>
      </div>

      {/* --- MESSAGES AREA --- */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 bg-white scroll-smooth">
        <div className="h-1"></div>

        {messages.map((msg, idx) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={idx} 
            className={`flex flex-col mb-3 ${msg.sender === "user" ? "items-end" : "items-start"}`}
          >
            {/* Bubble - Slightly more compact padding/text */}
            <div
              className={`px-3.5 py-2.5 max-w-[85%] text-[13px] leading-relaxed shadow-sm ${
                msg.sender === "user"
                  ? "bg-black text-white rounded-2xl rounded-tr-sm" 
                  : "bg-[#F3F4F6] text-gray-800 rounded-2xl rounded-tl-sm"
              }`}
            >
              {msg.text}
            </div>

            {/* Suggestion Chips */}
            {msg.options && (
                <div className="flex flex-wrap justify-end gap-1.5 mt-2 max-w-[95%]">
                    {msg.options.map((opt, i) => (
                        <button 
                            key={i}
                            onClick={() => handleUserMessage(opt.label)}
                            className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 px-3 py-1.5 rounded-full text-[11px] font-medium transition-all shadow-sm whitespace-nowrap"
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            )}
          </motion.div>
        ))}

        {isTyping && (
          <div className="flex items-start mb-4">
             <div className="bg-[#F3F4F6] px-3 py-3 rounded-2xl rounded-tl-sm flex gap-1 items-center">
                <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></span>
                <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce delay-150"></span>
             </div>
          </div>
        )}
      </div>

      {/* --- FOOTER AREA (Compact) --- */}
      <div className="bg-white px-4 pb-3 pt-2 z-20 shrink-0">
        
        {/* Powered By */}
        <div className="flex items-center justify-center gap-1 mb-2 opacity-40">
            <div className="w-3 h-3 bg-gray-800 rounded flex items-center justify-center text-[7px] font-bold text-white">F</div>
            <span className="text-[10px] font-medium text-gray-600">Powered by FOLIOFYX</span>
        </div>

        {/* Input Field */}
        <form 
            onSubmit={handleSubmit} 
            className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-1.5 shadow-[0_2px_10px_-5px_rgba(0,0,0,0.05)] focus-within:shadow-md focus-within:border-gray-300 transition-all"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Message..."
            className="flex-1 bg-transparent text-[13px] text-gray-800 placeholder:text-gray-400 outline-none h-8"
          />
          
          <button type="button" className="text-gray-400 hover:text-gray-600 transition-colors">
            <Smile size={16} />
          </button>

          <button
            type="submit"
            disabled={!input.trim()}
            className="text-gray-400 hover:text-black disabled:opacity-30 disabled:hover:text-gray-400 transition-colors"
          >
            <Send size={16} />
          </button>
        </form>
        
        {/* Small Privacy link below input for better spacing */}
        <div className="text-center mt-1.5">
             <span className="text-[9px] text-gray-300 cursor-pointer hover:underline">Privacy Policy</span>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatWindow;