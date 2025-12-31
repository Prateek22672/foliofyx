import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Sparkles, X, CheckCircle, Loader2 } from "lucide-react";
import { usePortfolio } from "../../../context/PortfolioContext";
import { saveOrUpdatePortfolio } from "../../../api/portfolioAPI";

const ChatbotPromoPopup = ({ onClose, onEnable }) => {
  const { portfolioData, setPortfolioData } = usePortfolio();
  const [status, setStatus] = useState("idle"); // idle, saving, success

  const handleEnableClick = async () => {
    setStatus("saving");

    // 1. Prepare Data
    const updatedData = { ...portfolioData, enableChatbot: true };

    // 2. Optimistic UI Update (Update Context Immediately)
    setPortfolioData(updatedData);

    try {
      // 3. Save to Database
      await saveOrUpdatePortfolio(updatedData);
      
      setStatus("success");

      // 4. Trigger Parent Callback (if EditHeader needs to update its internal state)
      if (onEnable) onEnable();

      // 5. Close Popup after delay
      setTimeout(() => {
        onClose();
      }, 1500);

    } catch (err) {
      console.error("Failed to enable AI:", err);
      // Revert if failed
      setPortfolioData({ ...portfolioData, enableChatbot: false });
      setStatus("idle");
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100"
        >
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-gray-50 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors z-10"
          >
            <X size={20} />
          </button>

          {/* Header Graphic */}
          <div className="bg-black text-white p-8 pb-12 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 blur-[50px] rounded-full pointer-events-none" />
             <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/20 blur-[40px] rounded-full pointer-events-none" />
             
             <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4 border border-white/10 shadow-xl ring-1 ring-white/20">
                    <Bot size={32} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight mb-2">FYX Ai Assistant</h2>
                <p className="text-white/60 text-sm max-w-[80%] leading-relaxed">
                   Deploy a trained AI version of yourself to answer visitor questions 24/7.
                </p>
             </div>
          </div>

          {/* Content Body */}
          <div className="p-8 -mt-6 bg-white rounded-t-3xl relative z-20">
            
            {/* Mock Chat UI */}
            <div className="space-y-4 mb-8">
               <motion.div 
                 initial={{ opacity: 0, x: -10 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ delay: 0.2 }}
                 className="flex justify-start"
               >
                  <div className="bg-gray-100 px-4 py-2.5 rounded-2xl rounded-bl-none text-xs text-gray-600 font-medium max-w-[80%]">
                     Is {portfolioData.name?.split(' ')[0] || "the Creator"} available for freelance work?
                  </div>
               </motion.div>

               <motion.div 
                 initial={{ opacity: 0, x: 10 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ delay: 0.5 }}
                 className="flex justify-end"
               >
                  <div className="bg-blue-50 border border-blue-100 px-4 py-2.5 rounded-2xl rounded-br-none text-xs text-blue-800 font-medium max-w-[90%] flex items-start gap-2 shadow-sm">
                     <Sparkles size={12} className="mt-0.5 text-blue-500 shrink-0" />
                     <span>Yes! {portfolioData.name?.split(' ')[0] || "They"} are currently open to new projects.</span>
                  </div>
               </motion.div>
            </div>

            {/* Action Buttons */}
            {status === "success" ? (
                <motion.div 
                   initial={{ scale: 0.8, opacity: 0 }}
                   animate={{ scale: 1, opacity: 1 }}
                   className="w-full py-4 bg-green-50 border border-green-100 text-green-700 rounded-xl flex items-center justify-center gap-2 font-bold"
                >
                   <CheckCircle size={20} className="text-green-600" />
                   AI Assistant Enabled!
                </motion.div>
            ) : (
                <div className="flex flex-col gap-3">
                   <button
                      onClick={handleEnableClick}
                      disabled={status === "saving"}
                      className="w-full py-4 bg-black text-white rounded-xl font-bold text-sm shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                   >
                      {status === "saving" ? (
                        <>
                          <Loader2 size={16} className="animate-spin" /> Enabling...
                        </>
                      ) : (
                        <>
                          <Sparkles size={16} className="text-purple-400 group-hover:text-purple-300 transition-colors" />
                          Enable for My Website
                        </>
                      )}
                   </button>
                   <button
                      onClick={onClose}
                      className="w-full py-3 bg-white text-gray-400 hover:text-gray-600 font-bold text-xs transition-colors"
                   >
                      Maybe Later
                   </button>
                </div>
            )}

            <div className="mt-6 flex justify-center items-center gap-2 opacity-40">
                <span className="text-[10px] font-bold uppercase tracking-widest">Powered by FolioFYX</span>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ChatbotPromoPopup;