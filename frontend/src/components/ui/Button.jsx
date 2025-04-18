// src/components/ui/Button.jsx
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Button = ({ 
  children, 
  variant = "primary", 
  to, 
  href, 
  onClick, 
  className = "",
  icon,
  ...props 
}) => {
  const baseClasses = "px-6 py-2.5 rounded-lg font-medium shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-gradient-to-r from-cyan-600 to-indigo-600 text-white",
    secondary: "bg-white border border-gray-200 text-gray-700",
    outline: "border border-cyan-600 text-cyan-600 hover:bg-cyan-50",
  };
  
  const classes = `${baseClasses} ${variants[variant]} ${className}`;
  
  const motionProps = {
    whileHover: { scale: 1.03 },
    whileTap: { scale: 0.98 },
  };
  
  if (to) {
    return (
      <motion.div {...motionProps}>
        <Link to={to} className={classes} {...props}>
          {children}
          {icon && <span className="ml-2">{icon}</span>}
        </Link>
      </motion.div>
    );
  }
  
  if (href) {
    return (
      <motion.div {...motionProps}>
        <a href={href} className={classes} {...props}>
          {children}
          {icon && <span className="ml-2">{icon}</span>}
        </a>
      </motion.div>
    );
  }
  
  return (
    <motion.button 
      onClick={onClick} 
      className={classes} 
      {...motionProps}
      {...props}
    >
      {children}
      {icon && <span className="ml-2">{icon}</span>}
    </motion.button>
  );
};

export default Button;