// src/components/sections/FeaturesSection.jsx
import React from "react";
import { motion } from "framer-motion";
import FeatureCard from "../ui/FeatureCard";

// Feature data specifically for your remote team project management tool
const features = [
  { 
    title: "Intuitive Kanban Boards", 
    icon: "board",
    description: "Simple, visual task organization with customizable columns. Move tasks seamlessly from one stage to another.",
    color: "#06b6d4" // cyan-500
  },
  { 
    title: "Role-Based Access Control", 
    icon: "lock",
    description: "Assign admin, manager, or employee roles with different permissions across organizations and projects.",
    color: "#8b5cf6" // violet-500
  },
  { 
    title: "Integrated Communication", 
    icon: "chat",
    description: "Built-in text chat and peer-to-peer video calls directly within projects for seamless remote collaboration.",
    color: "#ec4899" // pink-500
  },
  { 
    title: "Multi-Organization Support", 
    icon: "building",
    description: "Create and manage multiple organizations with separate projects and team members all from one account.",
    color: "#10b981" // emerald-500
  },
];

const FeaturesSection = () => {
  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-3 py-1 rounded-full bg-cyan-100 text-cyan-700 text-sm font-medium mb-4">
            BUILT FOR REMOTE TEAMS
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Tools that make remote work <span className="text-cyan-600">simpler</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            TaskSync combines essential project management features with remote collaboration tools, all in a lightweight, intuitive package.
          </p>
        </motion.div>
        
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {features.map((feature, idx) => (
            <FeatureCard 
              key={idx}
              title={feature.title}
              description={feature.description}
              iconType={feature.icon}
              color={feature.color}
            />
          ))}
        </motion.div>

        {/* Additional Feature Highlights */}
        <div className="mt-20 grid md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-white p-8 rounded-xl shadow-sm"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Perfect for Small to Medium Teams
            </h3>
            <ul className="space-y-3 mb-6">
              {[
                "No steep learning curve or complex setup",
                "Focused features without enterprise bloat",
                "Intuitive interface for technical and non-technical users",
                "Optimized for 5-50 team members"
              ].map((item, i) => (
                <li key={i} className="flex items-start">
                  <svg className="w-5 h-5 text-cyan-500 mt-1 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-600">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-white p-8 rounded-xl shadow-sm"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Built for Remote Collaboration
            </h3>
            <ul className="space-y-3 mb-6">
              {[
                "Integrated 1-to-1 video/audio calling",
                "Real-time text chat in project context",
                "Shared Kanban boards with live updates",
                "Clear permission system for distributed teams"
              ].map((item, i) => (
                <li key={i} className="flex items-start">
                  <svg className="w-5 h-5 text-cyan-500 mt-1 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-600">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;