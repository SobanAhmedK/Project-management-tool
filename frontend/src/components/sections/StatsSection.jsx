import React, { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import StatCard from "../ui/StatCard";
import { ArrowTrendingUpIcon, ClockIcon, UsersIcon, BoltIcon } from "@heroicons/react/24/outline";

const stats = [
  { 
    value: "80%", 
    label: "Faster Onboarding", 
    description: "New team members get up to speed in days, not weeks",
    icon: <BoltIcon className="w-6 h-6" />,
    color: "from-orange-400 to-amber-500"
  },
  { 
    value: "50%", 
    label: "Less Management Overhead", 
    description: "Automate routine tasks and focus on what matters",
    icon: <ClockIcon className="w-6 h-6" />,
    color: "from-cyan-400 to-blue-500"
  },
  { 
    value: "3x", 
    label: "Better Team Collaboration", 
    description: "Break down silos with real-time collaborative features",
    icon: <UsersIcon className="w-6 h-6" />,
    color: "from-indigo-400 to-purple-500"
  },
  { 
    value: "30%", 
    label: "More Focus Time", 
    description: "Reduce context switching and unnecessary meetings",
    icon: <ArrowTrendingUpIcon className="w-6 h-6" />,
    color: "from-green-400 to-emerald-500"
  }
];

const StatsSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.3 });
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.8, 1], [0.3, 1, 1, 0.3]);

  // Staggered animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };
  
  const headingVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  // Track if cards are in view for animation
  const cardsRef = useRef(null);
  const cardsInView = useInView(cardsRef, { once: false, amount: 0.2 });

  return (
    <section 
      ref={sectionRef}
      className="py-24 md:py-32 relative overflow-hidden"
    >
      {/* Background decoration */}
      <motion.div 
        style={{ y: backgroundY, opacity }}
        className="absolute inset-0 -z-10"
      >
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white to-gray-50" />
        <div className="absolute top-40 -left-20 w-72 h-72 rounded-full bg-orange-100 opacity-30 blur-3xl" />
        <div className="absolute bottom-40 -right-20 w-80 h-80 rounded-full bg-blue-100 opacity-30 blur-3xl" />
        <div className="absolute bg-grid-pattern opacity-[0.03] inset-0" />
      </motion.div>

      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center mb-16"
        >
          <motion.span 
            variants={headingVariants}
            className="inline-block px-4 py-1.5 rounded-full bg-gradient-to-r from-gray-50 to-white border border-gray-200 text-gray-700 text-sm font-medium mb-4 shadow-sm"
          >
            Real Results for Remote Teams
          </motion.span>
          
          <motion.h2 
            variants={headingVariants}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            The impact of TaskSync on your productivity
          </motion.h2>
          
          <motion.p 
            variants={headingVariants}
            className="max-w-2xl mx-auto text-gray-600 text-lg"
          >
            Our customers report significant improvements across their team workflows. Here's how TaskSync transforms remote work.
          </motion.p>
        </motion.div>

        <div 
          ref={cardsRef}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
        >
          {stats.map((stat, index) => (
            <StatCard 
              key={index}
              value={stat.value}
              label={stat.label}
              description={stat.description}
              icon={stat.icon}
              color={stat.color}
              index={index}
              inView={cardsInView}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;