import React from "react";
import { ArrowRight } from "lucide-react";

const PlatformsSection = () => {
  return (
    <section className="py-20 bg-[#F4F4F4]">
      <div className="max-w-[1440px] mx-auto px-6">
         <h2 className="text-sm font-bold tracking-[0.2em] text-gray-500 uppercase mb-12 text-center">Our Platforms</h2>
         
         <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Card 1 */}
            <div className="bg-white p-10 md:p-14 rounded-3xl shadow-sm hover:shadow-xl transition-shadow duration-300">
                <h3 className="text-3xl font-bold mb-6">Wix</h3>
                <p className="text-gray-600 text-lg leading-relaxed mb-8">
                    The go-to website builder complete with a full suite of tools to build, manage 
                    and grow your online presence with confidence. Start from scratch or use our powerful AI.
                </p>
                <a href="#" className="inline-flex items-center text-blue-600 font-bold hover:underline">
                    Explore Wix <ArrowRight className="ml-2 w-4 h-4" />
                </a>
            </div>

            {/* Card 2 */}
            <div className="bg-black text-white p-10 md:p-14 rounded-3xl shadow-sm hover:shadow-xl transition-shadow duration-300">
                <h3 className="text-3xl font-bold mb-6">Wix Studio</h3>
                <p className="text-gray-300 text-lg leading-relaxed mb-8">
                    Our intuitive web platform for creative, fast-paced teams at agencies and enterprises 
                    to create, develop and manage exceptional web projects with hyper efficiency.
                </p>
                <a href="#" className="inline-flex items-center text-white font-bold hover:underline">
                    Explore Wix Studio <ArrowRight className="ml-2 w-4 h-4" />
                </a>
            </div>
         </div>
      </div>
    </section>
  );
};

export default PlatformsSection;