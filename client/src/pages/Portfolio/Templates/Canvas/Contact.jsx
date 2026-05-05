import React from "react";
import { usePortfolio } from "../../../../context/PortfolioContext";
import useFadeInOnScroll from "../../../../hooks/useFadeInOnScroll";
import EditableText from "../EditableText";
import { Mail, ArrowUpRight } from "lucide-react";

const Contact = ({ portfolioData: propData, isReadOnly }) => {
  const { portfolioData: contextData, setPortfolioData } = usePortfolio();
  const data = propData || contextData || {};
  useFadeInOnScroll();

  const bg = data.themeBg || "#0a0a0a";
  const fg = data.themeFont || "#f0f0f0";
  const accent = data.accentColor || "#e8ff47";

  // Inverted Boutique Style
  const sectionBg = fg;
  const sectionFg = bg;
  const muted = `${bg}70`;
  const border = `${bg}20`;

  const socials = [
    data.github && { label: "GitHub", href: data.github },
    data.linkedin && { label: "LinkedIn", href: data.linkedin },
    data.twitter && { label: "Twitter", href: data.twitter },
  ].filter(Boolean);

  return (
    <section id="contact" className="py-24 px-6 md:px-10 transition-colors duration-500" style={{ background: sectionBg }}>
      <div className="max-w-[1400px] mx-auto flex flex-col min-h-[70vh] justify-between gap-20">

        {/* Section Header */}
        <div className="flex items-center gap-4 fade-up">
          <div className="px-3 py-1.5 rounded-full border flex items-center gap-2" style={{ background: `${sectionFg}08`, borderColor: border }}>
            <Mail size={12} style={{ color: muted }} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: muted }}>05 / Contact</span>
          </div>
          <div className="flex-1 h-px" style={{ background: border }} />
        </div>

        {/* Cinematic CTA */}
        <div className="fade-up">
          <h2 className="text-6xl md:text-8xl lg:text-[10vw] font-black tracking-tighter leading-[0.85] mb-12 uppercase italic" style={{ color: sectionFg }}>
            <EditableText 
              value={data.contactHeadline || "Let's build something great."} 
              onChange={(v) => setPortfolioData({...data, contactHeadline: v})} 
              readOnly={isReadOnly}
            />
          </h2>

          {data.email && (
            <a
              href={`mailto:${data.email}`}
              className="group inline-flex items-center gap-6 text-2xl md:text-5xl font-black tracking-tighter transition-all hover:opacity-60"
              style={{ color: sectionFg }}
            >
              <EditableText 
                value={data.email} 
                onChange={(v) => setPortfolioData({...data, email: v})} 
                readOnly={isReadOnly} 
              />
              <div className="w-12 h-12 md:w-20 md:h-20 rounded-full flex items-center justify-center transition-transform group-hover:rotate-45" style={{ background: accent, color: bg }}>
                <ArrowUpRight size={32} />
              </div>
            </a>
          )}
        </div>

        {/* Socials & Identity */}
        <div className="flex items-center justify-between fade-up flex-wrap gap-8 pt-8 border-t" style={{ borderColor: border }}>
          <div className="flex gap-8">
            {socials.map(({ label, href }) => (
              <a key={label} href={href} target="_blank" rel="noreferrer" className="text-[10px] font-black uppercase tracking-[0.3em] transition-opacity hover:opacity-50" style={{ color: muted }}>
                {label}
              </a>
            ))}
          </div>

          <div className="text-[10px] font-mono uppercase tracking-widest opacity-40" style={{ color: muted }}>
            {data.name || "Canvas"} STUDIO &copy; {new Date().getFullYear()}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;