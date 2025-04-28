

// src/pages/LandingPage.jsx
import React, { useRef } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import HeroSection from "../components/sections/HeroSection";
import FeaturesSection from "../components/sections/FeaturesSection";
import DemoSection from "../components/sections/DemoSection";
import TestimonialsSection from "../components/sections/TestimonialsSection";
import StatsSection from "../components/sections/StatsSection";
import CTASection from "../components/sections/CTASection";
import LogoCloudSection from "../components/sections/LogoCloudSection";
import { motion } from "framer-motion";

const LandingPage = () => {
  // References for scroll navigation
  const featuresRef = useRef(null);
  const demoRef = useRef(null);
  const testimonialsRef = useRef(null);
  const pricingRef = useRef(null);

  // Navigation handler
  const scrollToSection = (ref) => {
    ref.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden -z-10">
        <motion.div 
          className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-cyan-50 to-indigo-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />
        <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-cyan-100 opacity-20 blur-3xl" />
        <div className="absolute bottom-20 right-20 w-64 h-64 rounded-full bg-indigo-100 opacity-20 blur-3xl" />
      </div>

      <Header 
        onFeaturesClick={() => scrollToSection(featuresRef)}
        onDemoClick={() => scrollToSection(demoRef)} 
        onTestimonialsClick={() => scrollToSection(testimonialsRef)}
        onPricingClick={() => scrollToSection(pricingRef)}
      />
      
      <main>
        <HeroSection />
        <LogoCloudSection />
        <StatsSection />
        <div ref={featuresRef}>
          <FeaturesSection />
        </div>
        <div ref={demoRef}>
          <DemoSection />
        </div>
        <div ref={testimonialsRef}>
          <TestimonialsSection />
        </div>
        <div ref={pricingRef}>
          <CTASection />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default LandingPage;






