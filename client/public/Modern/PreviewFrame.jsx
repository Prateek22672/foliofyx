import React from "react";
import Header from "./Header";
import Home from "./Home";
import About from "./About";
import Experience from "./Experience";
import Projects from "./Projects";
import Contact from "./Contact";
import Footer from "./Footer";

const PreviewFrame = ({ data }) => {
  const { themeBg = "#000", themeFont = "#fff" } = data || {};

  return (
    <div
      className="min-h-screen w-full overflow-y-auto transition-all duration-300"
      style={{ backgroundColor: themeBg, color: themeFont }}
    >
      <Header data={data} />
      <Home data={data} />
      <About data={data} />
      <Experience data={data} />
      <Projects data={data} />
      <Contact data={data} />
      <Footer data={data} />
    </div>
  );
};

export default PreviewFrame;
