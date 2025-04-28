// src/components/sections/DemoSection.jsx
import React from "react";
import { motion } from "framer-motion";
import Button from "../ui/Button";
import { PlayCircleIcon } from '@heroicons/react/24/outline';

const DemoSection = () => {
  return (
    <section id="demo" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-3 py-1 rounded-full bg-cyan-100 text-cyan-700 text-sm font-medium mb-4">
            LIVE DEMO
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            See TaskSync in <span className="text-cyan-600">action</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Watch how TaskSync can transform your team's workflow in just 2 minutes.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative rounded-2xl overflow-hidden shadow-xl bg-gray-900 aspect-video"
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <Button
              variant="primary"
              className="!p-4"
              icon={<PlayCircleIcon className="w-6 h-6" />}
            />
          </div>
          <img
            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
            alt="TaskSync Demo"
            className="w-full h-full object-cover opacity-70"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <Button
            to="/signup"
            variant="primary"
            className="mx-auto"
          >
            Start Free Trial
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default DemoSection;