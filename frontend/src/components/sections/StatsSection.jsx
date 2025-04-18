// src/components/sections/StatsSection.jsx
import React from "react";
import { motion } from "framer-motion";
import StatCard from "../ui/StatCard";

// Stats specifically tailored for your project management tool
const stats = [
  { value: "80%", label: "Faster Onboarding" },
  { value: "50%", label: "Less Management Overhead" },
  { value: "3x", label: "Better Team Collaboration" },
  { value: "30%", label: "More Focus Time" }
];

const StatsSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-center"
        >
          {stats.map((stat, index) => (
            <StatCard 
              key={index}
              value={stat.value}
              label={stat.label}
              delay={index * 0.1}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default StatsSection;