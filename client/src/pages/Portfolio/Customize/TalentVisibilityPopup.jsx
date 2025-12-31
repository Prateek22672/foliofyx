import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Globe, Lock, Search, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const TalentVisibilityPopup = ({ isOpen, onClose, portfolioData, setPortfolioData }) => {
  const navigate = useNavigate(); // Hook for navigation

  if (!isOpen) return null;

  const isPublic = portfolioData?.isPublic || false;

  const handleToggle = (status) => {
    setPortfolioData({ ...portfolioData, isPublic: status });
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex justify-between items-center p-5 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-900">Talent Visibility</h3>
            <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
              <X size={18} className="text-gray-600" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            <p className="text-sm text-gray-500 text-center">
              Control whether your portfolio appears in our public <b>Find Talent</b> directory for recruiters.
            </p>

            {/* Toggle Options */}
            <div className="flex gap-4">
              {/* Public Option */}
              <button
                onClick={() => handleToggle(true)}
                className={`flex-1 p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-3 ${
                  isPublic
                    ? 'border-black bg-black text-white shadow-lg'
                    : 'border-gray-200 bg-white text-gray-400 hover:border-gray-300'
                }`}
              >
                <div className={`p-3 rounded-full ${isPublic ? 'bg-white/20' : 'bg-gray-100'}`}>
                  <Globe size={24} />
                </div>
                <div className="text-center">
                  <span className="block font-bold text-sm">Public</span>
                  <span className="text-[10px] opacity-80">Visible to recruiters</span>
                </div>
              </button>

              {/* Private Option */}
              <button
                onClick={() => handleToggle(false)}
                className={`flex-1 p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-3 ${
                  !isPublic
                    ? 'border-black bg-black text-white shadow-lg'
                    : 'border-gray-200 bg-white text-gray-400 hover:border-gray-300'
                }`}
              >
                <div className={`p-3 rounded-full ${!isPublic ? 'bg-white/20' : 'bg-gray-100'}`}>
                  <Lock size={24} />
                </div>
                <div className="text-center">
                  <span className="block font-bold text-sm">Private</span>
                  <span className="text-[10px] opacity-80">Only you can see</span>
                </div>
              </button>
            </div>

            {/* Status Message */}
            <div className={`p-3 rounded-lg text-xs font-medium text-center ${isPublic ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-500'}`}>
              {isPublic
                ? "Your portfolio is LIVE in the talent pool."
                : "Your portfolio is HIDDEN from search results."}
            </div>

            {/* ✅ EXPLORE TALENT BUTTON */}
            <div className="pt-4 border-t border-gray-100">
               <button 
                 onClick={() => { onClose(); navigate('/talent'); }}
                 className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold text-sm transition-colors border border-gray-200"
               >
                 <Search size={16} /> Explore Talent Pool <ExternalLink size={14} className="opacity-50" />
               </button>
            </div>

          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TalentVisibilityPopup;