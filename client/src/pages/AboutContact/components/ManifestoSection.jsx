import React from "react";

const ManifestoSection = () => {
  return (
    <div
      // CHANGED: sticky top-0 h-screen
      className="sticky top-0 w-full h-screen bg-[#f4f4f4] text-black rounded-t-[40px] md:rounded-t-[60px] shadow-[0_-50px_100px_rgba(0,0,0,0.5)] flex items-center justify-center"
    >
      <section className="h-full w-full flex items-center justify-center overflow-hidden relative">
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

        <div className="max-w-6xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-center h-full py-20">
          
          <div>
            <h2 className="text-5xl md:text-7xl font-bold leading-[0.9] tracking-tight mb-8">
              We don't just <br />
              <span className="text-[#0d0d82]">build websites.</span>
            </h2>
            <div className="h-1 w-20 bg-black mb-8"></div>
          </div>

          <div className="space-y-6 text-lg md:text-xl leading-relaxed text-neutral-800 font-light">
            <p>
              In a world of noise, clarity is power. <span className="font-bold">FolioFYX Studio</span> was born from a frustration with clunky builders and generic templates.
            </p>
            <p>
              We believe your portfolio is your digital handshake. It shouldn't just show your work; it should prove your worth.
            </p>
            <p>
              We merge <span className="underline decoration-[#0d0d82] decoration-2 underline-offset-4">Silicon Valley engineering</span> with <span className="underline decoration-[#0d0d82] decoration-2 underline-offset-4">High-fashion aesthetics</span> to give you a platform that feels like magic.
            </p>
          </div>

        </div>
      </section>
    </div>
  );
};

export default ManifestoSection;