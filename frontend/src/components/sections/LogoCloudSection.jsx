// src/components/sections/LogoCloudSection.jsx
import React from "react";
import { motion } from "framer-motion";

const LogoCloudSection = () => {
  // Array of company logos (using text for simplicity, but you can replace with actual logo images)
  const companies = [
    { name: "TechCrunch", logo: "TechCrunch" },
    { name: "Forbes", logo: "Forbes" },
    { name: "Microsoft", logo: "Microsoft" },
    { name: "Spotify", logo: "Spotify" },
    { name: "Slack", logo: "Slack" },
    { name: "Airbnb", logo: "Airbnb" }
  ];

  return (
    <section className="py-12 bg-gray-50 border-y border-gray-200">
      <div className="max-w-7xl mx-auto px-6">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center text-gray-500 text-sm font-medium mb-8"
        >
          TRUSTED BY REMOTE TEAMS AT
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-center"
        >
          {companies.map((company, index) => (
            <motion.div
              key={company.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              className="flex justify-center"
            >
              {/* For actual implementation, replace the div with an img tag */}
              <div className="text-gray-400 hover:text-gray-600 text-xl font-bold transition-colors">
                {company.logo}
              </div>
              {/* Actual image implementation would look like this:
              <img
                src={`/path/to/${company.name.toLowerCase()}-logo.svg`}
                alt={company.name}
                className="h-8 object-contain opacity-70 hover:opacity-100 transition-opacity"
              />
              */}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default LogoCloudSection;