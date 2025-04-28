// src/components/sections/CTASection.jsx
import React from "react";
import { motion } from "framer-motion";
import Button from "../ui/Button";
import { BoltIcon } from '@heroicons/react/24/outline';


const CTASection = () => {
  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-cyan-50 to-indigo-50 p-8 md:p-12 rounded-2xl shadow-sm text-center"
        >
          <BoltIcon  className="w-12 h-12 text-cyan-600 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to streamline your remote team?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of productive teams using TaskSync today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              to="/signup"
              variant="primary"
              className="py-3.5 px-8"
            >
              Start Free Trial
            </Button>
            <Button
              href="#demo"
              variant="secondary"
              className="py-3.5 px-8"
            >
              Watch Demo
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;