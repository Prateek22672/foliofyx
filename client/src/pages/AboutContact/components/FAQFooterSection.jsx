import React from "react";
import FAQItem from "../old/FAQItem";
import Footer from "../../../components/Footer"; 

const FAQFooterSection = () => {
  return (
    <div
      // KEY CHANGE: Relative + Z-Index 40 (Highest)
      // This ensures it scrolls over the sticky Contact section naturally
      className="relative z-40 w-full bg-white text-gray-900 rounded-t-[40px] md:rounded-t-[60px] flex flex-col shadow-[0_-50px_100px_rgba(0,0,0,0.5)]"
      style={{
        minHeight: "60vh"
      }}
    >
      {/* === UPPER SECTION: FAQs === */}
      <section className="w-full flex flex-col items-center justify-start pt-20 pb-16 flex-grow">
        <div className="max-w-4xl w-full px-6">
          <h2 className="text-4xl font-bold mb-8 text-center md:text-left tracking-tight">
            Common Questions
          </h2>
          <div className="space-y-4">
            <FAQItem
              question="Can I hire the Studio for custom work?"
              answer="Absolutely. While FolioFYX is a DIY builder, our Studio division takes on select custom clients for branding and advanced development."
            />
            <FAQItem
              question="How is FolioFYX different?"
              answer="We prioritize aesthetics and engineering equally. No bloat, just beautiful code and beautiful design."
            />
            <FAQItem
              question="Is it easy to build a website with FolioFYX?"
              answer="Yes! FolioFYX is designed for simplicity. Our intuitive interface helps you create a stunning portfolio in minutes."
            />
            <FAQItem
              question="Is FolioFYX really free for students?"
              answer="Yes — students qualify for the Max plan at no cost. Log in, head to Benefits, and verify your student email to unlock it."
            />
            <FAQItem
              question="Can I connect my own domain?"
              answer="Yes. Publish your site, then connect a domain you own — we walk you through the exact DNS records, and verification runs automatically."
            />
          </div>
        </div>
      </section>

      {/* === LOWER SECTION: real site footer (was a one-line strip that
           didn't match the rest of the site) === */}
      <Footer />
    </div>
  );
};

export default FAQFooterSection;