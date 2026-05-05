// src/components/VideoBackground.jsx
import React from 'react';
import loopVideo from "/preview/modern/modernbg.mp4"; // Adjust path as needed

const VideoBackground = ({ opacity = 0.4, blur = '0px' }) => {
  return (
    <>
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
        style={{ opacity: opacity, filter: `blur(${blur})` }}
      >
        <source src={loopVideo} type="video/mp4" />
      </video>
      {/* Gradient Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/90 z-0"></div>
    </>
  );
};

export default VideoBackground;