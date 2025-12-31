import React from "react";

const OfficeCard = ({ city, image }) => (
    <div className="relative group overflow-hidden rounded-2xl aspect-square cursor-pointer">
        <img src={image} alt={city} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors flex items-center justify-center">
            <span className="text-white text-xl md:text-2xl font-bold opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                {city}
            </span>
        </div>
        <div className="absolute bottom-6 left-6 text-white font-bold text-xl md:text-2xl group-hover:opacity-0 transition-opacity">
            {city}
        </div>
    </div>
);

const OfficesSection = () => {
    const offices = [
        { city: "Tel Aviv", img: "https://images.unsplash.com/photo-1544971587-b842c27f8e14?auto=format&fit=crop&w=400&q=80" },
        { city: "New York", img: "https://images.unsplash.com/photo-1496442226666-8d4a0e62e6e9?auto=format&fit=crop&w=400&q=80" },
        { city: "San Francisco", img: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=400&q=80" },
        { city: "Dublin", img: "https://images.unsplash.com/photo-1569429532559-67d169f44865?auto=format&fit=crop&w=400&q=80" },
        { city: "Kyiv", img: "https://images.unsplash.com/photo-1622630732303-8e995054c256?auto=format&fit=crop&w=400&q=80" },
        { city: "Vilnius", img: "https://images.unsplash.com/photo-1563884175-9c9459586119?auto=format&fit=crop&w=400&q=80" },
        { city: "Tokyo", img: "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?auto=format&fit=crop&w=400&q=80" },
        { city: "London", img: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=400&q=80" },
    ];

  return (
    <section className="py-24 bg-white">
       <div className="max-w-7xl mx-auto px-6">
         <div className="text-center mb-16">
            <h2 className="text-sm font-bold tracking-[0.2em] text-gray-500 uppercase mb-4">We're Global</h2>
            <h3 className="text-4xl font-bold mb-4">Wix Offices Around the World</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
                Home to a diverse group of professionals (and their dogs) spread over four continents 
                and twelve countries, we bring passion, skill and innovation to products people love to use.
            </p>
         </div>
         
         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {offices.map((office, idx) => (
                <OfficeCard key={idx} city={office.city} image={office.img} />
            ))}
         </div>
       </div>

       <div className="relative p-50 bg-white">
        <img src="/fyx3.png" className="w-30  m-auto block"/>
       </div>
    </section>
  );
};

export default OfficesSection;