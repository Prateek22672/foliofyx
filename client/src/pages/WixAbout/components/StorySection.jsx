import React from "react";

const StorySection = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center gap-16">
         <div className="md:w-1/2">
            <h2 className="text-sm font-bold tracking-[0.2em] text-gray-500 uppercase mb-6">Our Story</h2>
            <h3 className="text-4xl font-bold mb-6">Born on the beach.</h3>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Wix is the brainchild of our 3 founders: Avishai Abrahami, Nadav Abrahami, and Giora Kaplan. 
                The idea was born while they were building a website to be the basis of another start-up idea. 
                The tech-savvy trio quickly discovered that creating their own website was difficult, frustrating, and costly.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed">
                It was this agonizing experience that led them to a light bulb moment—to build a platform 
                that empowered anyone to create their own website with no coding or design skills needed. 
                In 2006, Wix was born.
            </p>
         </div>
         <div className="md:w-1/2">
            <div className="relative">
                {/* Image Placeholder mimicking the 'founders' or 'beach' vibe */}
                <div className="aspect-[4/3] bg-gray-200 rounded-3xl overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500">
                    <img 
                        src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                        alt="Team Collaboration" 
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>
         </div>
      </div>
    </section>
  );
};

export default StorySection;