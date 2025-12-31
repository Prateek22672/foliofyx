import React from "react";
import FAQItem from "./FAQItem";
import Footer from "../../../components/Footer"; // Adjust path based on your project

const FAQFooterSection = () => {
  return (
    <div
      className="fixed z-[60] bg-[#fefefe] text-gray-900 rounded-t-[60px] shadow-[0_-50px_100px_rgba(0,0,0,0.2)] w-full left-0 top-0"
      // SCROLL LOGIC: 
      // 1. Starts below screen (TranslateY > 100vh)
      // 2. Slides up as you scroll (Index 5)
      // 3. calc(100vh - 100%) acts as a "stopper" so it stops scrolling when the bottom of the footer hits the bottom of the screen.
      style={{
        minHeight: "100vh", // Ensure it covers the screen initially
        height: "auto",     // Allow it to grow with content
        transform: `translateY(max(calc(100vh - 100%), (5 - var(--scroll, 0)) * 100vh))` 
      }}
    >
      {/* CHANGE: Removed 'h-full' and 'overflow-y-auto'. Let the main page scroll handle the movement. */}
      <section className="w-full flex flex-col items-center justify-start pt-20 -mb-5">
        <div className="max-w-4xl w-full px-6 mb-12 flex-grow">
          <h2 className="text-4xl font-bold mb-8 text-center md:text-left">
            Website Builder FAQ
          </h2>
          <div className="space-y-2">
            <FAQItem
              question="Is it easy to build a website with FolioFYX?"
              answer="Yes! FolioFYX is designed for simplicity and ease of use. Our intuitive interface and AI-powered tools help you create a stunning portfolio in minutes, no coding required."
            />
            <FAQItem
              question="How do I create a website?"
              answer="Simply choose a theme, upload your work, and customize your content. Our guided process makes it straightforward to build and launch your professional online portfolio."
            />
            <FAQItem
              question="How do I choose the best website builder?"
              answer="The best builder depends on your needs. FolioFYX excels for those seeking elegant, professional portfolios with minimal fuss, strong visual appeal, and great accessibility features."
            />
            <FAQItem
              question="What types of websites can you build on FolioFYX?"
              answer="FolioFYX is optimized for professional portfolios—for artists, designers, developers, writers, and any professional showcasing their work. It’s also great for personal branding sites."
            />
            <FAQItem
              question="What makes a good website?"
              answer="A good website is fast, accessible, visually appealing, easy to navigate, and effectively communicates its purpose. FolioFYX helps you achieve all these crucial elements effortlessly."
            />
          </div>
        </div>

        <div className="w-full mt-auto">
          <div className="bg-white text-white pt-20 pb-4 rounded-t-[40px]">
            <div className="max-w-7xl mx-auto px-6">
              <p className="text-center text-xs text-[#6C63FF] uppercase tracking-[0.25em] mb-4">
                A <span className="text-[#6C63FF] font-bold">PRATEEK™</span> PRODUCT — WHERE IDEAS MEET PASSION.
              </p>
              <Footer />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQFooterSection;