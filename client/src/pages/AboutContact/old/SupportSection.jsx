import React from "react";
import { ArrowRight } from "lucide-react";

const SupportSection = () => {
  return (
    <div 
      className="fixed inset-0 z-20 bg-[#17212e] text-white rounded-t-[60px] shadow-[0_-50px_100px_rgba(0,0,0,0.3)]"
      // SCROLL LOGIC: Index 2
      style={{ transform: `translateY(calc(max(0px, (2 - var(--scroll, 0)) * 100vh)))` }}
    >
      <section className="h-full w-full flex items-center justify-center overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-16 w-full">
          <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center md:text-left">We're here for you **24/7**</h2>

          <div className="space-y-6">
            {[
              { title: "Get answers", desc: "Ask anything and get quick answers in the **FolioFYX Help Center**." },
              { title: "Chat with us", desc: "Get 24/7 chat help from our Helpmate or contact a Customer Care Expert." },
              { title: "Hire a pro", desc: "Get help at any stage—from site creation to online growth." }
            ].map((item, idx) => (
              <div key={idx} className="bg-[#2a374a] p-6 rounded-2xl flex items-center justify-between hover:bg-[#3d4c63] transition-colors duration-300 cursor-pointer border border-[#3d4c63]">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-1">{item.title}</h3>
                  <p className="text-gray-300 text-sm">{item.desc}</p>
                </div>
                <ArrowRight className="h-6 w-6 text-gray-400 ml-4" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default SupportSection;