import React from "react";
import { Code, PenTool, Layout, Monitor, Globe, Box } from "lucide-react";

export default function WhyTalentSection() {
  const cats = [
    { icon: <Code />, title: "Development", desc: "React, Node, Python" },
    { icon: <PenTool />, title: "Design", desc: "UI/UX, Branding" },
    { icon: <Monitor />, title: "Marketing", desc: "SEO, Content" },
  ];

  return (
    <div>
        <h2 className="text-3xl font-bold mb-10 text-center">Browse by Category</h2>
        <div className="grid md:grid-cols-3 gap-6">
        {cats.map((c, i) => (
            <div key={i} className="group p-8 rounded-3xl border border-gray-100 bg-white hover:border-black/5 hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-900 group-hover:bg-black group-hover:text-white transition-colors mb-6">
                    {c.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{c.title}</h3>
                <p className="text-gray-500">{c.desc}</p>
            </div>
        ))}
        </div>
    </div>
  );
}