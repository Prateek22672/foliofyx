import React, { useRef } from 'react';
import { ImagePlus, Pencil } from 'lucide-react';

const EditableImage = ({ src, onImageUpload, className, alt, isReadOnly, fallbackSrc }) => {
  const fileInputRef = useRef(null);

  // 1. Priority: Provided src > Template-specific fallback > Global generic placeholder
  const globalPlaceholder = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1964&auto=format&fit=crop";
  const displaySrc = src || fallbackSrc || globalPlaceholder;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (onImageUpload) onImageUpload(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={`relative overflow-hidden ${className} ${isReadOnly ? 'cursor-default' : 'group/img cursor-pointer'}`}>
      <img 
        src={displaySrc} 
        alt={alt || "Portfolio content"} 
        className={`w-full h-full object-cover transition-transform duration-700 ${!isReadOnly && 'group-hover/img:scale-110'}`}
      />

      {/* ✅ UI is completely stripped if isReadOnly is true */}
      {!isReadOnly && (
        <>
          <div className="absolute top-4 right-4 z-20">
            <div className="bg-indigo-600 text-white p-2 rounded-full shadow-xl border border-white/20 opacity-80 group-hover/img:opacity-100 transition-all group-hover/img:scale-110">
              <Pencil size={14} strokeWidth={3} />
            </div>
          </div>

          <div 
            onClick={() => fileInputRef.current?.click()}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] opacity-0 group-hover/img:opacity-100 transition-all duration-300 flex flex-col items-center justify-center z-30"
          >
            <div className="bg-white text-indigo-600 p-4 rounded-2xl shadow-2xl mb-3 transform translate-y-4 group-hover/img:translate-y-0 transition-transform duration-300">
              <ImagePlus size={28} />
            </div>
            <span className="text-white text-[10px] font-black uppercase tracking-[0.2em] bg-indigo-600 px-4 py-2 rounded-full shadow-lg">
              Change Image
            </span>
          </div>

          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleFileChange} 
          />
          
          <div className="absolute inset-0 border-2 border-dashed border-indigo-500/20 pointer-events-none group-hover/img:border-indigo-500/50 transition-colors" />
        </>
      )}
    </div>
  );
};

export default EditableImage;