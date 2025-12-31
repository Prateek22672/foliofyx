import React from "react";

const Milestone = ({ year, title, description }) => (
  <div className="flex flex-col md:flex-row gap-4 md:gap-12 py-8 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors px-4 rounded-xl">
    <span className="text-3xl font-bold text-blue-600 w-32">{year}</span>
    <div>
        <h4 className="text-xl font-bold text-gray-900 mb-2">{title}</h4>
        <p className="text-gray-600">{description}</p>
    </div>
  </div>
);

const MilestonesSection = () => {
  return (
    <section className="py-24 bg-white">
       <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-sm font-bold tracking-[0.2em] text-gray-500 uppercase mb-12">Wix Milestones</h2>
          <div className="space-y-2">
            <Milestone year="2006" title="Founded" description="Wix was founded by Avishai Abrahami, Nadav Abrahami and Giora Kaplan." />
            <Milestone year="2008" title="Flash Editor Launched" description="Wix launches its first Flash Editor, changing the game." />
            <Milestone year="2012" title="HTML5 Editor" description="HTML5 Editor is released to replace Flash." />
            <Milestone year="2013" title="IPO on NASDAQ" description="Wix goes public on the NASDAQ global market." />
            <Milestone year="2016" title="Wix ADI Launched" description="Launch of Artificial Design Intelligence, the first AI web solution." />
            <Milestone year="2019" title="150M Users" description="Wix reaches a massive milestone of 150 million users worldwide." />
            <Milestone year="2023" title="Wix Studio" description="Launch of Wix Studio, the end-to-end platform for agencies." />
          </div>
       </div>
    </section>
  );
};

export default MilestonesSection;