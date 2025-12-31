import React from "react";

const ThemeCollage = ({ leftImage, rightImage }) => {
  return (
    <div className="w-full bg-white rounded-3xl shadow-xl overflow-hidden p-4">
      <div className="grid grid-cols-2 gap-4">

        {/* LEFT IMAGE */}
        <div className="rounded-2xl overflow-hidden bg-gray-100">
          <img
            src={leftImage}
            alt="Left Preview"
            className="w-full h-full object-cover"
          />
        </div>

        {/* RIGHT IMAGE (TALLER LOOK) */}
        <div className="rounded-2xl overflow-hidden bg-gray-100">
          <img
            src={rightImage}
            alt="Right Preview"
            className="w-full h-full object-cover"
          />
        </div>

      </div>
    </div>
  );
};

export default ThemeCollage;
