// src/components/ui/FeatureCard.jsx
import React from "react";
import { motion } from "framer-motion";
import { 
  ViewBoardsIcon, 
  UserGroupIcon, 
  ChatIcon, 
  ChartBarIcon,
  LockClosedIcon,
  OfficeBuildingIcon,
  CalendarIcon,
  DocumentTextIcon
} from "@heroicons/react/outline";

const FeatureCard = ({ title, description, iconType, color, link }) => {
  const iconMap = {
    board: ViewBoardsIcon,
    team: UserGroupIcon,
    chat: ChatIcon,
    chart: ChartBarIcon,
    lock: LockClosedIcon,
    building: OfficeBuildingIcon,
    calendar: CalendarIcon,
    document: DocumentTextIcon
  };

  const Icon = iconMap[iconType] || ViewBoardsIcon;

  // Animation variant
  const item = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      variants={item}
      whileHover={{ y: -10 }}
      className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100"
    >
      <div 
        className="w-12 h-12 flex items-center justify-center rounded-xl mb-6"
        style={{ backgroundColor: `${color}20`, color: color }}
      >
        <Icon className="w-6 h-6" />
      </div>
      
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      
      {link && (
        <a href={link} className="inline-flex items-center text-cyan-600 font-medium group">
          Learn more
          <svg 
            className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </a>
      )}
    </motion.div>
  );
};

export default FeatureCard;