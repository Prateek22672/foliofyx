import React from "react";

const WhoWeAreSection = ({ onScrollToContact }) => {
  return (
    <div 
      className="fixed inset-0 z-30 bg-[#018061] text-white rounded-t-[60px] shadow-[0_-50px_100px_rgba(0,0,0,0.3)]"
      // SCROLL LOGIC: Index 3
      style={{ transform: `translateY(calc(max(0px, (3 - var(--scroll, 0)) * 100vh)))` }}
    >
      <section className="h-full w-full flex items-center justify-center overflow-y-auto">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center px-8 w-full py-20">
          <div>
            <img
              src="/fyx3.png"
              alt="About FolioFYX"
              className="rounded-[40px] shadow-xl p-4 bg-gradient-to-r  w-[350px] md:w-[450px] object-cover mx-auto"
            />
            <button
              onClick={onScrollToContact}
              className="bg-gradient-to-r font-light from-gray-600  to-black hover:opacity-95 mt-8 text-white px-6 py-3 rounded-full shadow-md transition-transform duration-300 hover:scale-105 mx-auto block"
            >
              Get Connected
            </button>
          </div>

          <div className="text-center md:text-left">
            <h2 className="text-4xl font-bold mb-4">Who is Behind FolioFYX?</h2>
            <p className="text-gray-200 mb-4 text-lg">
              FolioFYX was founded by **Prateek Koratala** with one clear mission — to empower creators,
              designers, and professionals with the easiest and most elegant way
              to build their online presence.
            </p>
            <p className="text-gray-200 mb-6 text-lg">
              Prateek is the **Designer, Developer, and Founder**, bringing a passion for clean UI/UX and robust engineering.
            </p>
            <div className="mt-10">
              <p className="text-white font-semibold text-lg">Prateek Koratala</p>
              <p className="text-gray-400 text-sm">
                Founder | Designer | Developer
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WhoWeAreSection;