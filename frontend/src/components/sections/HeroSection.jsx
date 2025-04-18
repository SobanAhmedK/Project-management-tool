// src/components/sections/HeroSection.jsx
import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { SparklesIcon, ArrowRightIcon } from "@heroicons/react/outline";
import Button from "../ui/Button";

const HeroSection = () => {
  const heroRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const yHero = useTransform(scrollYProgress, [0, 1], [0, 100]);

  return (
    <section 
      ref={heroRef}
      className="pt-32 pb-20 md:pt-40 md:pb-32 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 items-center gap-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center md:text-left"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="inline-flex items-center px-3 py-1 rounded-full bg-cyan-100 text-cyan-700 text-sm font-medium mb-4"
          >
            <SparklesIcon className="w-4 h-4 mr-2" />
            Remote Teams Focused
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Simple, Intuitive 
            <span className="bg-gradient-to-r from-cyan-600 to-indigo-600 bg-clip-text text-transparent ml-2">
              Project Management
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-lg">
            TaskSync helps small to medium-sized remote teams collaborate efficiently without the complexity of enterprise tools.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4">
            <Button
              to="/signup"
              variant="primary"
              icon={<ArrowRightIcon className="w-5 h-5" />}
              className="py-3.5"
            >
              Start Free Trial
            </Button>
            
            <Button
              href="#demo"
              variant="secondary"
              className="py-3.5"
            >
              Watch Demo
            </Button>
          </div>
          
          <div className="mt-8 flex flex-wrap justify-center md:justify-start gap-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <div key={star} className="flex items-center">
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            ))}
            <span className="text-gray-600 text-sm font-medium">Rated 4.9/5 by remote teams</span>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{ y: yHero }}
          className="relative"
        >
          <div className="absolute -top-10 -left-10 w-64 h-64 rounded-2xl bg-cyan-200 opacity-30 blur-xl" />
          <div className="absolute -bottom-10 -right-10 w-64 h-64 rounded-2xl bg-indigo-200 opacity-30 blur-xl" />
          
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border-8 border-white transform rotate-1">
            <img
              src="https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
              alt="TaskSync Dashboard"
              className="w-full h-auto object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/30 to-indigo-900/10" />
            
            {/* Floating UI elements */}
            <motion.div 
              className="absolute top-1/4 left-1/4 bg-white p-3 rounded-lg shadow-md"
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <span className="text-xs font-medium">Task completed</span>
              </div>
            </motion.div>
            
            <motion.div 
              className="absolute bottom-1/4 right-1/4 bg-white p-3 rounded-lg shadow-md"
              animate={{
                y: [0, 10, 0],
              }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
            >
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center mr-2">
                  <svg className="w-4 h-4 text-cyan-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                </div>
                <span className="text-xs font-medium">Remote team active</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;