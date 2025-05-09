// src/components/layout/Footer.jsx
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import LOGO from "../../assets/LOGO.png";

const Footer = () => {
  const footerLinks = [
    {
      title: "Product",
      links: [
        { name: "Features", to: "#features" },
        { name: "Demo", to: "#demo" },
        { name: "Pricing", to: "#pricing" },
        { name: "Updates", to: "#" }
      ]
    },
    {
      title: "Company",
      links: [
        { name: "About", to: "#" },
        { name: "Careers", to: "#" },
        { name: "Blog", to: "#" }
      ]
    },
    {
      title: "Support",
      links: [
        { name: "Help Center", to: "#" },
        { name: "Contact", to: "#" },
        { name: "Privacy", to: "#" }
      ]
    }
  ];

  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mb-6"
            >
              <Link to="/" className="flex items-center">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-indigo-600 bg-clip-text text-transparent">
               <img src={LOGO} alt="TaskSync" className="w-40" />
                </h1>
              </Link>
            </motion.div>
            <p className="text-gray-600 mb-6">
              TaskSync helps remote teams collaborate efficiently without the complexity of enterprise tools.
            </p>
            <div className="flex space-x-4">
              {['Twitter', 'LinkedIn', 'GitHub'].map((social, idx) => (
                <motion.a
                  key={idx}
                  href="#"
                  whileHover={{ y: -2 }}
                  className="text-gray-500 hover:text-cyan-600 transition-colors"
                >
                  {social}
                </motion.a>
              ))}
            </div>
          </div>

          {footerLinks.map((column, idx) => (
            <div key={idx}>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{column.title}</h3>
              <ul className="space-y-3">
                {column.links.map((link, linkIdx) => (
                  <motion.li 
                    key={linkIdx}
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Link 
                      to={link.to} 
                      className="text-gray-600 hover:text-cyan-600 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} TaskSync. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-500 hover:text-cyan-600 text-sm transition-colors">Privacy</a>
            <a href="#" className="text-gray-500 hover:text-cyan-600 text-sm transition-colors">Terms</a>
            <a href="#" className="text-gray-500 hover:text-cyan-600 text-sm transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;