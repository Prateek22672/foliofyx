import React from "react";

const StatItem = ({ number, label, subLabel }) => (
  <div className="flex flex-col items-center text-center p-6 border-r border-gray-200 last:border-0">
    <span className="text-5xl md:text-7xl font-extrabold text-black mb-2">{number}</span>
    <span className="text-gray-900 font-bold text-lg">{label}</span>
    {subLabel && <span className="text-gray-500 text-sm mt-1">{subLabel}</span>}
  </div>
);

const StatsSection = () => {
  return (
    <section className="py-24 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-sm font-bold tracking-[0.2em] text-gray-500 uppercase mb-16 text-center">Numbers & Figures</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <StatItem number="190" label="Countries" subLabel="around the world" />
            <StatItem number="260M+" label="Users" subLabel="Worldwide" />
            <StatItem number="85K+" label="Sites created" subLabel="per day" />
            <StatItem number="17" label="Years" subLabel="of dedication" />
        </div>
      </div>
    </section>
  );
};

export default StatsSection;