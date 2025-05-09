import React, { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import FeatureCard from "../ui/FeatureCard";

// Feature data with enhanced details
const features = [
  { 
    title: "Intuitive Kanban Boards", 
    icon: "board",
    description: "Simple, visual task organization with customizable columns. Move tasks seamlessly from one stage to another.",
    color: "#06b6d4", 
    details: "Drag-and-drop interface with custom fields, labels, and priorities. Set WIP limits and create automations to streamline workflows."
  },
  { 
    title: "Role-Based Access Control", 
    icon: "lock",
    description: "Assign admin, manager, or employee roles with different permissions across organizations and projects.",
    color: "#8b5cf6", 
    details: "Fine-grained permission settings let you control who can view, edit, or manage specific projects and boards. Ideal for client collaboration."
  },
  { 
    title: "Integrated Communication", 
    icon: "chat",
    description: "Built-in text chat and peer-to-peer video calls directly within projects for seamless remote collaboration.",
    color: "#ec4899", 
    details: "Thread-based discussions, @mentions, screen sharing, and automatic meeting scheduling based on team availability across time zones."
  },
  { 
    title: "Multi-Organization Support", 
    icon: "building",
    description: "Create and manage multiple organizations with separate projects and team members all from one account.",
    color: "#10b981", // emerald-500
    details: "Switch seamlessly between organizations. Perfect for agencies, consultants, or anyone working across multiple teams or clients."
  },
];

const FeaturesSection = () => {
  const [expandedFeature, setExpandedFeature] = useState(null);
  const sectionRef = useRef(null);

  // Scroll-based animations
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Transform scroll progress for various animations
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const yTranslate = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [100, 0, 0, -100]);
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.95, 1, 1, 0.95]);

  // Animation variants for feature cards
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const item = {
    hidden: { y: 30, opacity: 0, scale: 0.95 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] },
    },
  };

  const featureExpand = {
    collapsed: { height: 0, opacity: 0, y: -10 },
    expanded: {
      height: "auto",
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
    },
  };

  return (
    <section
      id="features"
      ref={sectionRef}
      className="py-24 bg-gradient-to-b from-gray-50 to-white"
    >
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          style={{ opacity, y: yTranslate }}
          className="text-center mb-20"
        >
          <motion.span
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: false, amount: 0.3 }}
            className="inline-block px-4 py-1.5 rounded-full bg-cyan-100 text-cyan-700 text-sm font-medium mb-5"
          >
            BUILT FOR REMOTE TEAMS
          </motion.span>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
            Tools that make remote work{" "}
            <motion.span
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: false, amount: 0.3 }}
              className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600"
            >
              simpler
            </motion.span>
          </h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: false, amount: 0.3 }}
            className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto"
          >
            TaskSync combines essential project management features with powerful
            remote collaboration tools, all in a lightweight, intuitive package
            built for today's distributed teams.
          </motion.p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              variants={item}
              style={{ scale }}
              className="relative"
              whileHover={{ scale: 1.03, transition: { duration: 0.3 } }}
            >
              <div
                onClick={() =>
                  setExpandedFeature(expandedFeature === idx ? null : idx)
                }
                className="cursor-pointer"
              >
                <FeatureCard
                  title={feature.title}
                  description={feature.description}
                  iconType={feature.icon}
                  color={feature.color}
                />
              </div>

              <motion.div
                initial="collapsed"
                animate={expandedFeature === idx ? "expanded" : "collapsed"}
                variants={featureExpand}
                className="bg-white rounded-b-xl shadow-lg mt-1 overflow-hidden"
              >
                <div className="p-6 border-t border-gray-100">
                  <p className="text-gray-600">{feature.details}</p>
                  <button
                    className="mt-4 text-sm font-medium text-cyan-600 hover:text-cyan-800 flex items-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedFeature(null);
                    }}
                  >
                    Close
                    <svg
                      className="w-4 h-4 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 15l7-7 7 7"
                      />
                    </svg>
                  </button>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Enhanced Feature Highlights with Scroll Animations */}
        <div className="mt-24 grid md:grid-cols-2 gap-12">
          <motion.div
            style={{ opacity, x: useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [-100, 0, 0, -100]) }}
            className="bg-white p-8 md:p-10 rounded-2xl shadow-lg border border-gray-100 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-50 rounded-bl-full opacity-50" />
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Perfect for Small to Medium Teams
            </h3>
            <ul className="space-y-4 mb-6">
              {[
                "No steep learning curve or complex setup",
                "Focused features without enterprise bloat",
                "Intuitive interface for technical and non-technical users",
                "Optimized for 5-50 team members",
              ].map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.15, duration: 0.5 }}
                  viewport={{ once: false, amount: 0.3 }}
                  className="flex items-start"
                >
                  <motion.div
                    whileHover={{ scale: 1.3, rotate: 180 }}
                    transition={{ duration: 0.5 }}
                    className="flex-shrink-0"
                  >
                    <svg
                      className="w-5 h-5 text-cyan-500 mt-1 mr-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </motion.div>
                  <span className="text-gray-600 text-lg">{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            style={{ opacity, x: useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [100, 0, 0, 100]) }}
            className="bg-white p-8 md:p-10 rounded-2xl shadow-lg border border-gray-100 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-32 h-32 bg-violet-50 rounded-br-full opacity-50" />
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Built for Remote Collaboration
            </h3>
            <ul className="space-y-4 mb-6">
              {[
                "Integrated 1-to-1 video/audio calling",
                "Real-time text chat in project context",
                "Shared Kanban boards with live updates",
                "Clear permission system for distributed teams",
              ].map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.15, duration: 0.5 }}
                  viewport={{ once: false, amount: 0.3 }}
                  className="flex items-start"
                >
                  <motion.div
                    whileHover={{ scale: 1.3, rotate: 180 }}
                    transition={{ duration: 0.5 }}
                    className="flex-shrink-0"
                  >
                    <svg
                      className="w-5 h-5 text-violet-500 mt-1 mr-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </motion.div>
                  <span className="text-gray-600 text-lg">{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Updated Social Proof Section with Scroll Animation */}
        <motion.div
          style={{ opacity, y: yTranslate }}
          className="mt-24 text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: false, amount: 0.3 }}
            className="inline-flex items-center space-x-1 mb-8"
          >
            <svg
              className="w-5 h-5 text-yellow-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3 .921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784 .57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <svg
              className="w-5 h-5 text-yellow-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3 .921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784 .57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <svg
              className="w-5 h-5 text-yellow-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3 .921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784 .57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <svg
              className="w-5 h-5 text-yellow-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3 .921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784 .57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <svg
              className="w-5 h-5 text-yellow-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3 .921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784 .57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-gray-700 font-medium ml-2">
              4.9/5 from over 200+ remote teams
            </span>
          </motion.div>

          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            {["Acme Inc", "Globex", "Initech", "Umbrella Corp"].map(
              (company, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15, duration: 0.5 }}
                  whileHover={{ scale: 1.1, color: "#111827" }}
                  viewport={{ once: false, amount: 0.3 }}
                  className="text-xl font-bold text-gray-400"
                >
                  {company}
                </motion.div>
              )
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;