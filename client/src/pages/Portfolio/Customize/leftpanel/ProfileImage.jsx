import React from "react";
import { Camera, UploadCloud, Trash2 } from "lucide-react";

const ProfileImage = ({ portfolioData, setPortfolioData }) => {
  
  // Handle file upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPortfolioData({ ...portfolioData, image: reader.result });
      reader.readAsDataURL(file);
    }
  };

  // Handle image deletion
  const handleDeleteImage = (e) => {
    e.stopPropagation(); // Prevent triggering the label click if overlapping
    setPortfolioData({ ...portfolioData, image: null });
  };

  return (
    <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
      <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-500 mb-6">
        <Camera size={16} /> Avatar
      </h2>
      
      <div className="flex items-center gap-6">
        
        {/* Image Preview Area */}
        <div className="relative group shrink-0">
          <img
            src={portfolioData.image || "/default-profile.jpg"}
            alt="Profile"
            className="w-24 h-24 object-cover rounded-full border-4 border-slate-50 shadow-md transition-transform duration-300 group-hover:scale-105"
          />
          
          {/* Delete Button (Only visible if a custom image exists) */}
          {portfolioData.image && (
            <button
              onClick={handleDeleteImage}
              type="button"
              className="absolute -top-1 -right-1 bg-white p-2 rounded-full shadow-md border border-slate-200 text-red-500 hover:bg-red-50 hover:text-red-600 hover:scale-110 transition-all z-20"
              title="Remove Image"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
        
        {/* Upload Area */}
        <div className="flex-1">
          <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 hover:border-indigo-400 transition-all group">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <UploadCloud className="w-6 h-6 mb-2 text-slate-400 group-hover:text-indigo-500 transition-colors" />
              <p className="text-xs text-slate-500 font-medium group-hover:text-indigo-600 transition-colors">
                Click to upload image
              </p>
            </div>
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleImageChange} 
            />
          </label>
        </div>

      </div>
    </section>
  );
};

export default ProfileImage;