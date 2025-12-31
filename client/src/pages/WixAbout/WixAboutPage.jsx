import React from "react";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import MissionSection from "./components/MissionSection";
import PlatformsSection from "./components/PlatformsSection";
import StatsSection from "./components/StatsSection";
import StorySection from "./components/StorySection";
import MilestonesSection from "./components/MilestonesSection";
import OfficesSection from "./components/OfficesSection";
import Footer from "./components/Footer";

const WixAboutPage = () => {
  return (
    <div className="font-sans antialiased text-gray-900 bg-white min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <MissionSection />
        <PlatformsSection />
        <StatsSection />
        <StorySection />
        <MilestonesSection />
        <OfficesSection />
      </main>
      <Footer />
    </div>
  );
};

export default WixAboutPage;