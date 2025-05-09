// src/components/ui/TestimonialCard.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TestimonialCard = ({ name, role, quote, rating, avatar, company, companyLogo, delay = 0 }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Calculate short version of quote for mobile/compact display
  const shortQuote = quote.length > 100 ? `${quote.substring(0, 100)}...` : quote;
  
  // Custom animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        duration: 0.6, 
        delay, 
        ease: [0.22, 1, 0.36, 1]
      }
    },
    hover: {
      y: -8,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 17 
      }
    }
  };
  
  const quoteIconVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: { 
      opacity: 0.15, 
      scale: 1,
      transition: { 
        delay: delay + 0.2,
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };
  
  const contentVariants = {
    hidden: { opacity: 0 },
    visible: i => ({ 
      opacity: 1,
      transition: { 
        delay: delay + 0.1 + (i * 0.1),
        duration: 0.4
      }
    })
  };
  
  const highlightVariants = {
    hidden: { width: "0%" },
    visible: { 
      width: "100%",
      transition: { 
        delay: delay + 0.3,
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, margin: "-50px" }}
      whileHover="hover"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      variants={cardVariants}
      className="relative bg-gradient-to-b from-white/15 to-white/5 backdrop-blur-lg p-8 rounded-2xl border border-white/20 overflow-hidden group"
    >
      {/* Background decorative elements */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan-400 opacity-10 rounded-full blur-3xl group-hover:opacity-20 transition-opacity" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-indigo-400 opacity-10 rounded-full blur-3xl group-hover:opacity-20 transition-opacity" />
      
      {/* Quote icon background */}
      <motion.div 
        variants={quoteIconVariants}
        className="absolute top-6 right-6 text-white"
      >
        <svg 
          width="48" 
          height="48" 
          viewBox="0 0 24 24" 
          fill="currentColor" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5 3.871 3.871 0 01-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5 3.871 3.871 0 01-2.748-1.179z" />
        </svg>
      </motion.div>
      
      {/* Avatar and user info */}
      <div className="flex items-center gap-4 mb-6 relative z-10">
        <motion.div 
          variants={contentVariants}
          custom={0}
          className="relative"
        >
          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-500 flex items-center justify-center p-0.5">
            <img
              src={avatar}
              alt={name}
              className="w-full h-full rounded-full object-cover border-2 border-white/50"
            />
          </div>
          <AnimatePresence>
            {isHovered && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute -right-1 -bottom-1 w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center shadow-lg"
              >
                <svg className="w-4 h-4 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        
        <div>
          <motion.h3 
            variants={contentVariants}
            custom={1}
            className="font-bold text-white text-lg"
          >
            {name}
          </motion.h3>
          
          <motion.div 
            variants={contentVariants}
            custom={2}
            className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3"
          >
            <p className="text-cyan-100 text-sm font-medium">{role}</p>
            
            {company && (
              <>
                <span className="hidden sm:block text-cyan-300/50">•</span>
                <div className="flex items-center">
                  {companyLogo ? (
                    <img src={companyLogo} alt={company} className="h-4 mr-1" />
                  ) : null}
                  <span className="text-cyan-200 text-xs">{company}</span>
                </div>
              </>
            )}
          </motion.div>
        </div>
      </div>
      
      {/* Quote content */}
      <motion.div 
        variants={contentVariants}
        custom={3}
        className="relative mb-8"
      >
        <motion.div 
          variants={highlightVariants}
          className="absolute left-0 top-0 h-0.5 bg-gradient-to-r from-cyan-400 to-indigo-400 opacity-50"
        />
        
        <div className="mt-1 pt-4">
          {/* Desktop/full quote */}
          <p className="hidden sm:block text-white/90 leading-relaxed">
            {quote}
          </p>
          
          {/* Mobile/short quote */}
          <p className="sm:hidden text-white/90 leading-relaxed">
            {shortQuote}
          </p>
        </div>
      </motion.div>
      
      {/* Footer with rating and company info */}
      <div className="flex items-center justify-between">
        <motion.div 
          variants={contentVariants}
          custom={4}
          className="flex"
        >
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={`w-5 h-5 ${
                i < rating 
                  ? 'text-yellow-300 drop-shadow-glow-yellow' 
                  : 'text-gray-500'
              } transition-colors duration-300`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </motion.div>
        
        <motion.div 
          variants={contentVariants}
          custom={5}
          className="text-xs text-cyan-200/60 font-medium"
        >
          Verified Client
        </motion.div>
      </div>
      
      {/* Hover state accent line */}
      <motion.div 
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.3 }}
        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 origin-left"
      />
    </motion.div>
  );
};

export default TestimonialCard;