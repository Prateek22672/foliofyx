import React, { useState } from "react";
import { X, Globe, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

const PublishModal = ({ isOpen, onClose, currentSlug, onSave }) => {
  const [slug, setSlug] = useState(currentSlug || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  // Helper to format slug (remove spaces, special chars)
  const handleInputChange = (e) => {
    const val = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    setSlug(val);
    setError("");
  };

  const handlePublish = async () => {
    if (slug.length < 3) {
      setError("URL must be at least 3 characters long.");
      return;
    }
    
    setLoading(true);
    try {
      // Pass the slug back to the parent to save to DB
      await onSave(slug);
      onClose();
    } catch (err) {
      setError("This URL is already taken or invalid.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in zoom-in duration-200">
      <div className="bg-white text-black w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Globe className="text-blue-600" />
            Claim Your URL
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-black transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-8">
          <p className="text-gray-600 mb-6">
            Choose a unique link for your portfolio before you go live. This is how the world will find you.
          </p>

          <div className="space-y-4">
            <label className="text-xs font-bold uppercase text-gray-400 tracking-wider">Your Custom URL</label>
            
            <div className={`flex items-center border-2 rounded-xl overflow-hidden transition-colors ${error ? "border-red-500 bg-red-50" : "border-blue-100 focus-within:border-blue-500 bg-blue-50/50"}`}>
              <span className="pl-4 pr-2 text-gray-500 font-medium text-sm select-none">
                foliofyx.com/portfolio/
              </span>
              <input 
                type="text" 
                value={slug}
                onChange={handleInputChange}
                placeholder="your-name"
                className="flex-1 bg-transparent py-4 text-gray-900 font-bold focus:outline-none placeholder:text-gray-300"
                autoFocus
              />
              {slug && !error && !loading && <CheckCircle2 size={20} className="text-green-500 mr-4" />}
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-500 text-sm font-medium animate-pulse">
                <AlertCircle size={16} /> {error}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-200 transition-colors">
            Cancel
          </button>
          <button 
            onClick={handlePublish}
            disabled={loading || !slug}
            className="px-6 py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Save & Go Live 🚀"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default PublishModal;