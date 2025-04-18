// src/components/ui/StatCard.jsx
import React from "react";
import { motion } from "framer-motion";

const StatCard = ({ value, label, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className="p-6 rounded-xl bg-gradient-to-br from-cyan-50 to-indigo-50"
    >
      <p className="text-4xl font-bold text-cyan-600 mb-2">{value}</p>
      <p className="text-gray-600 font-medium">{label}</p>
    </motion.div>
  );
};

// Fix: Complete the export statement
export default StatCard;