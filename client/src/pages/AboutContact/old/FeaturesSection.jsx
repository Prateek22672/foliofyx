import React from "react";

const FeaturesSection = ({ showSplash, navigate }) => {
  return (
    <div
      className="fixed inset-0 z-10 bg-white rounded-t-[60px] shadow-[0_-50px_100px_rgba(0,0,0,0.1)]"
      // SCROLL LOGIC: Slides up when scroll is between 0 and 1
      style={{
        transform: `translateY(calc(max(0px, (1 - var(--scroll, 0)) * 100vh)))`,
        willChange: "transform",
      }}
    >
      <section className="h-full w-full overflow-y-auto pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-black mb-16">
            Everything you need.
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-20">
             {/* Example Card 1 */}
             <div className="bg-gray-50 p-8 rounded-3xl hover:bg-gray-100 transition">
                <h3 className="text-xl font-bold mb-2 text-[#0d0d82]">Drag & Drop</h3>
                <p className="text-gray-600">Build easily without code using our intuitive builder.</p>
             </div>
             {/* Example Card 2 */}
             <div className="bg-gray-50 p-8 rounded-3xl hover:bg-gray-100 transition">
                <h3 className="text-xl font-bold mb-2 text-[#0d0d82]">AI Themes</h3>
                <p className="text-gray-600">Smart designs that adapt to your content automatically.</p>
             </div>
             {/* Example Card 3 */}
             <div className="bg-gray-50 p-8 rounded-3xl hover:bg-gray-100 transition">
                <h3 className="text-xl font-bold mb-2 text-[#0d0d82]">Fast & Secure</h3>
                <p className="text-gray-600">Optimized performance with enterprise-grade security.</p>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FeaturesSection;