// src/components/ui/StatCard.jsx
import React, { useState, useEffect } from "react";
import { motion, useSpring } from "framer-motion";

const StatCard = ({ value, label, description, icon, color, index, inView }) => {
  // Parse the numeric value from strings like "80%" or "3x"
  const parseValue = () => {
    if (value.endsWith('%')) {
      return parseFloat(value);
    } else if (value.endsWith('x')) {
      return parseFloat(value);
    } else {
      return parseFloat(value) || 0;
    }
  };

  const suffix = value.replace(/[0-9.]/g, '');
  const numericValue = parseValue();
  
  // Use spring animation for smooth counting effect
  const animatedValue = useSpring(0, {
    stiffness: 50,
    damping: 20,
    duration: 2000
  });

  // Update the animated value when section comes into view
  useEffect(() => {
    if (inView) {
      animatedValue.set(numericValue);
    } else {
      animatedValue.set(0);
    }
  }, [inView, numericValue, animatedValue]);

  // Format the display value appropriately
  const [displayValue, setDisplayValue] = useState("0" + suffix);
  
  useEffect(() => {
    const unsubscribe = animatedValue.onChange((latest) => {
      if (suffix === '%') {
        setDisplayValue(`${Math.round(latest)}%`);
      } else if (suffix === 'x') {
        setDisplayValue(`${latest.toFixed(1)}x`);
      } else {
        setDisplayValue(`${Math.round(latest)}${suffix}`);
      }
    });
    
    return () => unsubscribe();
  }, [animatedValue, suffix]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className={`p-6 rounded-xl bg-white shadow-lg border border-gray-100`}
    >
      <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${color} flex items-center justify-center mb-4`}>
        <div className="text-white">{icon}</div>
      </div>
      
      <p className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
        {displayValue}
      </p>
      
      <p className="text-gray-800 font-medium text-lg mb-1">{label}</p>
      
      <p className="text-gray-600 text-sm">{description}</p>
    </motion.div>
  );
};

export default StatCard;