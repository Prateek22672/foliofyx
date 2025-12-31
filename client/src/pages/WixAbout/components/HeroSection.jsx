import React from "react";

const HeroSection = () => {
  return (
    <section className="pt-32 pb-20 px-6 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 mb-12 leading-tight">
          The place for limitless creation <br className="hidden md:block"/> and online success.
        </h1>
        
        {/* Collage Placeholder - Using CSS Grid for a masonry-like feel */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 h-[500px] md:h-[600px] w-full max-w-[1200px] mx-auto">
          <div className="bg-gray-100 rounded-2xl overflow-hidden col-span-1 md:row-span-2 relative group">
             <img src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Creative work" className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"/>
          </div>
          <div className="bg-gray-100 rounded-2xl overflow-hidden col-span-1 relative group">
             <img src="https://images.unsplash.com/photo-1600607686527-6fb886090705?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Design" className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"/>
          </div>
          <div className="bg-gray-100 rounded-2xl overflow-hidden col-span-1 md:col-span-2 relative group">
             <img src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Teamwork" className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"/>
          </div>
          <div className="bg-gray-100 rounded-2xl overflow-hidden col-span-1 relative group">
             <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Meeting" className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"/>
          </div>
           <div className="bg-gray-100 rounded-2xl overflow-hidden col-span-1 md:col-span-2 relative group">
             <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Strategy" className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"/>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;