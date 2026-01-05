import React, { useRef, useState } from "react";
import { Camera, Image as ImageIcon, Trash2, UploadCloud, Loader2 } from "lucide-react";
// Import API to save deletions immediately
import { saveOrUpdatePortfolio } from "../../../../api/portfolioAPI"; 

const SUGGESTED_AVATARS = [
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&h=200", 
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&h=200", 
  "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=200&h=200", 
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&h=200", 
  "https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&w=200&h=200", 
];

// --- 🔧 HELPER: COMPRESS IMAGE (Fixes 413 Error) ---
const resizeImage = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        // Resize to 500px width (Perfect for profile pics)
        const MAX_WIDTH = 500; 
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleSize;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // Compress to JPEG with 0.8 quality
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        resolve(dataUrl);
      };
    };
  });
};

const ProfileImage = ({ portfolioData, setPortfolioData }) => {
  const fileInputRef = useRef(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // 1. Handle Upload with Compression
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        // Compress before setting state
        const resizedImage = await resizeImage(file);
        setPortfolioData((prev) => ({ ...prev, image: resizedImage }));
      } catch (error) {
        console.error("Image processing error", error);
      }
    }
  };

  const selectSuggestion = (url) => {
    setPortfolioData((prev) => ({ ...prev, image: url }));
  };

  // 2. Immediate Delete from DB
  const removeImage = async () => {
    if (!window.confirm("Are you sure you want to remove your profile photo?")) return;

    setIsDeleting(true);
    
    // Create copy without image
    const updatedData = { ...portfolioData, image: "" };

    try {
      // Update UI immediately
      setPortfolioData(updatedData);

      // Update Database immediately
      if (portfolioData._id) {
         await saveOrUpdatePortfolio(updatedData);
      }
    } catch (error) {
      console.error("Failed to delete image from database:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
          <Camera size={18} />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-800">Profile Photo</h3>
          <p className="text-xs text-slate-400">Personalize your portfolio</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
        {/* Preview Area */}
        <div className="relative group shrink-0">
          <div className={`w-32 h-32 rounded-full border-4 border-slate-50 shadow-lg overflow-hidden flex items-center justify-center bg-slate-100 ${!portfolioData.image ? 'animate-pulse' : ''}`}>
            {portfolioData.image ? (
              <img src={portfolioData.image} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <ImageIcon className="text-slate-300" size={40} />
            )}
          </div>
          
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
             <button onClick={() => fileInputRef.current.click()} className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 shadow-md transition-transform hover:scale-110" title="Upload New">
                <UploadCloud size={14} />
             </button>
             
             {portfolioData.image && (
               <button 
                 onClick={removeImage} 
                 disabled={isDeleting}
                 className="p-2 bg-white text-red-500 border border-slate-200 rounded-full hover:bg-red-50 shadow-md transition-transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed" 
                 title="Remove"
               >
                  {isDeleting ? <Loader2 size={14} className="animate-spin"/> : <Trash2 size={14} />}
               </button>
             )}
          </div>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
        </div>

        {/* Suggestions Area */}
        <div className="flex-1 w-full">
            <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Suggestions</span>
                <span className="h-px flex-1 bg-slate-100"></span>
            </div>
            
            <div className="grid grid-cols-5 gap-2 sm:gap-3">
                {SUGGESTED_AVATARS.map((url, idx) => (
                    <button key={idx} onClick={() => selectSuggestion(url)} className={`relative rounded-full overflow-hidden aspect-square border-2 transition-all hover:scale-105 ${portfolioData.image === url ? 'border-purple-500 ring-2 ring-purple-200' : 'border-transparent hover:border-slate-200'}`}>
                        <img src={url} alt={`Suggestion ${idx}`} className="w-full h-full object-cover" />
                    </button>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileImage;