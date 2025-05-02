// src/components/layout/Header.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "../ui/Button.jsx";
import LOGO from "../../assets/LOGO.png";

const Header = ({ onFeaturesClick, onDemoClick, onTestimonialsClick, onPricingClick }) => {
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  return (
    <motion.header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "backdrop-blur-md bg-white/90 shadow-sm py-3" : "bg-transparent py-5"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link to="/header" className="flex items-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-indigo-600 bg-clip-text text-transparent">
            <img src={LOGO} alt="TaskSync" className="w-40 " />
            </h1>
          </Link>
        </motion.div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <button 
            onClick={onFeaturesClick}
            className="text-gray-600 hover:text-cyan-600 transition-colors font-medium"
          >
            Features
          </button>
          <button 
            onClick={onDemoClick}
            className="text-gray-600 hover:text-cyan-600 transition-colors font-medium"
          >
            Demo
          </button>
          <button 
            onClick={onTestimonialsClick}
            className="text-gray-600 hover:text-cyan-600 transition-colors font-medium"
          >
            Testimonials
          </button>
          <button 
            onClick={onPricingClick}
            className="text-gray-600 hover:text-cyan-600 transition-colors font-medium"
          >
            Pricing
          </button>
        </nav>
        
        <div className="flex items-center space-x-4">
          <Link 
            to="/login" 
            className="px-4 py-2 text-gray-700 hover:text-cyan-600 font-medium transition-colors"
          >
            Sign in
          </Link>
          <Button 
            to="/signup"
            variant="primary"
          >
            Get Started
          </Button>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;