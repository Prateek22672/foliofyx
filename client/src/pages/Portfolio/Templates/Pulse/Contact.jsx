import React from "react";
import useFadeInOnScroll from "../../../../hooks/useFadeInOnScroll";

const Contact = ({ portfolioData }) => {
  const data = portfolioData || {};
  useFadeInOnScroll();

  const bg = data.themeBg || "#0a0a0a";
  const fg = data.themeFont || "#ffffff";
  const accent = data.accentColor || "#ad0000";
  const borderColor = `${fg}15`;

  return (
    <section 
      id="contact" 
      className="py-32 px-6 min-h-[70vh] flex flex-col justify-between relative transition-colors duration-500"
      style={{ backgroundColor: bg, color: fg, borderTop: `1px solid ${borderColor}` }}
    >
      <div className="max-w-[1800px] mx-auto w-full">
        
        <div className="mb-20 fade-up">
           <span 
             className="inline-block py-1 px-3 border rounded-full text-[10px] font-bold uppercase tracking-widest mb-6 opacity-60"
             style={{ borderColor: `${fg}30` }}
           >
             (05) — Contact
           </span>
           <h2 
             className="text-6xl md:text-[8vw] font-black tracking-tighter leading-[0.8] transition-all duration-500 cursor-pointer hover:opacity-80"
           >
             LET'S START <br /> A PROJECT.
           </h2>
        </div>

        <div 
          className="flex flex-col md:flex-row justify-between items-end border-t pt-12 fade-up delay-100"
          style={{ borderColor: borderColor }}
        >
           <div className="flex flex-col gap-2">
             <span className="text-sm font-mono opacity-50 uppercase">Drop me a line</span>
             <a 
               href={`mailto:${data.email}`} 
               className="text-2xl md:text-4xl font-bold hover:opacity-80 transition-colors"
               style={{ color: fg }} // Ensure it stays readable
             >
               {data.email || "hello@foliofy.com"}
             </a>
           </div>

           <div className="flex gap-8 mt-8 md:mt-0">
             {['LinkedIn', 'GitHub', 'Twitter'].map((social) => (
                <a 
                  key={social} 
                  href="#" 
                  className="text-sm font-bold uppercase tracking-widest transition-colors hover:text-opacity-70"
                  style={{ color: fg }}
                >
                  {social}
                </a>
             ))}
           </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;