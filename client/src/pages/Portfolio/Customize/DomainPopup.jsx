import React, { useState } from "react";
import { X, Check, Globe, Loader2, AlertCircle, ArrowRight } from "lucide-react";
import { saveOrUpdatePortfolio } from "../../../api/portfolioAPI"; 

const DomainPopup = ({ isOpen, onClose, portfolioData, onSaveSuccess }) => {
  // Pre-fill with existing username or empty
  const [slug, setSlug] = useState(portfolioData.username || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const hasExistingName = !!portfolioData.username;

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!slug.trim()) {
      setError("Please enter a valid name.");
      return;
    }
    
    // Validation: Lowercase, numbers, hyphens only
    if (!/^[a-z0-9-]+$/.test(slug)) {
      setError("Only lowercase letters, numbers, and hyphens are allowed.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Merge current portfolio data with the (potentially new) username
      const updatedData = { ...portfolioData, username: slug };
      
      // Save everything to DB
      const saved = await saveOrUpdatePortfolio(updatedData);
      
      // Trigger success callback (redirects user)
      onSaveSuccess(saved); 
    } catch (err) {
      console.error(err);
      if (err.response?.status === 400) {
        setError("This username is already taken. Try another.");
      } else {
        setError("Failed to deploy. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 p-4">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 md:p-8 transform transition-all scale-100">
        
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
          <X size={20} />
        </button>

        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Globe size={28} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            {hasExistingName ? "Ready to Publish?" : "Claim your Link"}
          </h2>
          <p className="text-sm text-gray-500 mt-2 px-4">
            {hasExistingName 
              ? "Confirm your URL below to push changes live." 
              : "Choose a unique address for your portfolio to get started."}
          </p>
        </div>

        {/* Input Field */}
        <div className="mb-8">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">
            Portfolio URL
          </label>
          <div className={`flex items-center bg-gray-50 border rounded-xl px-4 py-3 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all ${error ? "border-red-300 bg-red-50" : "border-gray-200"}`}>
            <span className="text-gray-400 text-sm font-medium mr-1 select-none">foliofyx.in/portfolio/</span>
            <input 
              type="text" 
              value={slug}
              onChange={(e) => {
                  setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
                  setError("");
              }}
              placeholder="your-name"
              className="bg-transparent border-none outline-none text-gray-900 font-bold w-full placeholder:text-gray-300 text-lg"
              autoFocus
            />
          </div>
          {error && (
            <div className="flex items-center gap-1.5 mt-2 text-red-600 text-xs font-bold animate-in slide-in-from-top-1">
              <AlertCircle size={12} /> {error}
            </div>
          )}
        </div>

        {/* Action Button */}
        <button
          onClick={handleSave}
          disabled={loading || !slug}
          className="w-full py-4 bg-black hover:bg-gray-900 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl hover:-translate-y-0.5 active:translate-y-0"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" /> Publishing...
            </>
          ) : (
            <>
              {hasExistingName ? "Confirm & Deploy" : "Claim & Publish"} <ArrowRight size={18} />
            </>
          )}
        </button>

      </div>
    </div>
  );
};

export default DomainPopup;