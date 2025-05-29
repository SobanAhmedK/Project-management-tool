// src/components/sections/LogoCloudSection.jsx
import React from "react";
import { motion } from "framer-motion";
import airbnb from "@/assets/LogoCloud/airbnb.png";
import microsoft from "@/assets/LogoCloud/microsoft.png";
import slack from "@/assets/LogoCloud/slack.png";       
import spotify from "@/assets/LogoCloud/spotify.png";
import techcrunch from "@/assets/LogoCloud/techcrunch.png";
import forbes from "@/assets/LogoCloud/forbes.png";

const LogoCloudSection = () => {
  // Array of company logos with imported images
  const companies = [
    { name: "TechCrunch", logo: techcrunch },
    { name: "Forbes", logo: forbes },
    { name: "Microsoft", logo: microsoft },
    { name: "Spotify", logo: spotify },
    { name: "Slack", logo: slack },
    { name: "Airbnb", logo: airbnb }
  ];

  return (
    <section className="py-12 bg-gray-50 border-y border-gray-200">
      <div className="max-w-7xl mx-auto px-6">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: false }}
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
              initial={{ opacity: 0, y: 70 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: false }}
              whileHover={{ scale: 1.05 }}
              className="flex justify-center"
            >
              <img
                src={company.logo}
                alt={company.name}
                className="h-14 object-contain  hover:opacity-100 transition-opacity"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default LogoCloudSection;