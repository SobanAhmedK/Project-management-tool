

// src/pages/LandingPage.jsx
import React, { useRef } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import HeroSection from "../components/sections/HeroSection";
import FeaturesSection from "../components/sections/FeaturesSection";
import DemoSection from "../components/sections/DemoSection";
import TestimonialsSection from "../components/sections/TestimonialsSection";
import StatsSection from "../components/sections/StatsSection";
import CTASection from "../components/sections/CTASection";
import LogoCloudSection from "../components/sections/LogoCloudSection";
import { motion } from "framer-motion";

const LandingPage = () => {
  // References for scroll navigation
  const featuresRef = useRef(null);
  const demoRef = useRef(null);
  const testimonialsRef = useRef(null);
  const pricingRef = useRef(null);

  // Navigation handler
  const scrollToSection = (ref) => {
    ref.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden -z-10">
        <motion.div 
          className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-cyan-50 to-indigo-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />
        <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-cyan-100 opacity-20 blur-3xl" />
        <div className="absolute bottom-20 right-20 w-64 h-64 rounded-full bg-indigo-100 opacity-20 blur-3xl" />
      </div>

      <Header 
        onFeaturesClick={() => scrollToSection(featuresRef)}
        onDemoClick={() => scrollToSection(demoRef)} 
        onTestimonialsClick={() => scrollToSection(testimonialsRef)}
        onPricingClick={() => scrollToSection(pricingRef)}
      />
      
      <main>
        <HeroSection />
        <LogoCloudSection />
        <StatsSection />
        <div ref={featuresRef}>
          <FeaturesSection />
        </div>
        <div ref={demoRef}>
          <DemoSection />
        </div>
        <div ref={testimonialsRef}>
          <TestimonialsSection />
        </div>
        <div ref={pricingRef}>
          <CTASection />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default LandingPage;









// "use client";
// import React, { useEffect, useRef } from "react";
// import { Link } from "react-router-dom";
// import { motion, useAnimation, useInView, AnimatePresence } from "framer-motion";
// import { 
//   ViewBoardsIcon, 
//   UserGroupIcon, 
//   ChatIcon, 
//   ClockIcon,
//   ArrowRightIcon,
//   SparklesIcon,
//   LightningBoltIcon,
//   ChartBarIcon
// } from "@heroicons/react/outline";
// import { useScroll, useTransform } from "framer-motion";

// // Modern color scheme
// const colors = {
//   primary: '#6366f1',  // indigo-500
//   secondary: '#8b5cf6', // violet-500
//   accent: '#ec4899',   // pink-500
//   dark: '#1e1b4b',     // indigo-950
//   light: '#e0e7ff',    // indigo-100
//   white: '#ffffff'
// };

// const features = [
//   { 
//     title: "Smart Kanban Boards", 
//     icon: ViewBoardsIcon, 
//     description: "AI-powered task organization with predictive column suggestions and automated workflows.",
//     color: colors.primary
//   },
//   { 
//     title: "Team Collaboration", 
//     icon: UserGroupIcon, 
//     description: "Real-time collaboration with presence indicators, threaded comments, and @mentions.",
//     color: colors.accent
//   },
//   { 
//     title: "Integrated Chat", 
//     icon: ChatIcon, 
//     description: "Contextual chat that stays synced with your tasks and projects for seamless communication.",
//     color: colors.secondary
//   },
//   { 
//     title: "Time Analytics", 
//     icon: ChartBarIcon, 
//     description: "Advanced time tracking with productivity insights and automated reporting.",
//     color: '#10b981' // emerald-500
//   },
// ];

// const testimonials = [
//   {
//     name: "Alex Chen",
//     position: "CTO at TechStart",
//     text: "TaskFlow reduced our sprint planning time by 40% and improved cross-team visibility dramatically.",
//     avatar: "https://randomuser.me/api/portraits/women/44.jpg",
//     rating: 5
//   },
//   {
//     name: "Maria Rodriguez",
//     position: "Product Lead at InnoCorp",
//     text: "The predictive task assignment feature alone has saved us 15 hours per week in management overhead.",
//     avatar: "https://randomuser.me/api/portraits/women/68.jpg",
//     rating: 5
//   },
//   {
//     name: "James Wilson",
//     position: "Engineering Manager",
//     text: "Our remote teams finally feel connected with TaskFlow's integrated video and real-time updates.",
//     avatar: "https://randomuser.me/api/portraits/men/32.jpg",
//     rating: 4
//   },
// ];

// const stats = [
//   { value: "10,000+", label: "Active Teams" },
//   { value: "98%", label: "Satisfaction Rate" },
//   { value: "4.9/5", label: "Average Rating" },
//   { value: "2.5x", label: "Productivity Boost" }
// ];

// const LandingPage = () => {
//   const controls = useAnimation();
//   const ref = useRef(null);
//   const isInView = useInView(ref, { once: false, amount: 0.1 });
  
//   const { scrollYProgress } = useScroll();
//   const y = useTransform(scrollYProgress, [0, 1], [0, -200]);

//   useEffect(() => {
//     if (isInView) {
//       controls.start("visible");
//     }
//   }, [isInView, controls]);

//   // Parallax effect for hero image
//   const heroRef = useRef(null);
//   const { scrollYProgress: heroScrollY } = useScroll({
//     target: heroRef,
//     offset: ["start start", "end start"]
//   });
//   const yHero = useTransform(heroScrollY, [0, 1], [0, 100]);

//   // Animation variants
//   const container = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.2
//       }
//     }
//   };

//   const item = {
//     hidden: { y: 20, opacity: 0 },
//     visible: {
//       y: 0,
//       opacity: 1,
//       transition: {
//         duration: 0.5,
//         ease: "easeOut"
//       }
//     }
//   };

//   return (
//     <div className="min-h-screen bg-white text-gray-900 font-sans overflow-hidden">
//       {/* Animated Background Elements */}
//       <div className="fixed inset-0 overflow-hidden -z-10">
//         <motion.div 
//           className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-50 to-purple-50"
//           style={{ y }}
//         />
//         <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-indigo-100 opacity-20 blur-3xl" />
//         <div className="absolute bottom-20 right-20 w-64 h-64 rounded-full bg-purple-100 opacity-20 blur-3xl" />
//       </div>

//       {/* Modern Header with Glass Morphism */}
//       <motion.header 
//         className="fixed top-0 w-full z-50 backdrop-blur-md bg-white/80 shadow-sm"
//         initial={{ y: -100 }}
//         animate={{ y: 0 }}
//         transition={{ type: "spring", stiffness: 300, damping: 20 }}
//       >
//         <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
//           <motion.div
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//           >
//             <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
//               TaskFlow<span className="text-indigo-600">.</span>
//             </h1>
//           </motion.div>
          
//           <nav className="hidden md:flex items-center space-x-8">
//             <Link to="/features" className="text-gray-600 hover:text-indigo-600 transition-colors font-medium">
//               Features
//             </Link>
//             <Link to="/solutions" className="text-gray-600 hover:text-indigo-600 transition-colors font-medium">
//               Solutions
//             </Link>
//             <Link to="/pricing" className="text-gray-600 hover:text-indigo-600 transition-colors font-medium">
//               Pricing
//             </Link>
//             <Link to="/resources" className="text-gray-600 hover:text-indigo-600 transition-colors font-medium">
//               Resources
//             </Link>
//           </nav>
          
//           <div className="flex items-center space-x-4">
//             <Link 
//               to="/login" 
//               className="px-4 py-2 text-gray-700 hover:text-indigo-600 font-medium transition-colors"
//             >
//               Sign in
//             </Link>
//             <motion.div
//               whileHover={{ scale: 1.03 }}
//               whileTap={{ scale: 0.98 }}
//             >
//               <Link
//                 to="/signup"
//                 className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium shadow-sm hover:shadow-md transition-all"
//               >
//                 Get Started
//               </Link>
//             </motion.div>
//           </div>
//         </div>
//       </motion.header>

//       {/* Hero Section with Parallax */}
//       <section 
//         ref={heroRef}
//         className="pt-32 pb-20 md:pt-40 md:pb-32 relative overflow-hidden"
//       >
//         <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 items-center gap-12 relative z-10">
//           <motion.div
//             initial={{ opacity: 0, x: -30 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.8, ease: "easeOut" }}
//             className="text-center md:text-left"
//           >
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 0.4 }}
//               className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium mb-4"
//             >
//               <SparklesIcon className="w-4 h-4 mr-2" />
//               Introducing AI Task Automation
//             </motion.div>
            
//             <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
//               <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
//                 Smarter
//               </span>{" "}
//               Team Collaboration
//             </h1>
            
//             <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-lg">
//               TaskFlow combines powerful project management with AI-driven insights to help your team work better, faster, and smarter.
//             </p>
            
//             <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4">
//               <motion.div
//                 whileHover={{ scale: 1.02 }}
//                 whileTap={{ scale: 0.98 }}
//               >
//                 <Link
//                   to="/signup"
//                   className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3.5 rounded-lg shadow-md hover:shadow-lg transition-all font-medium"
//                 >
//                   Start Free Trial <ArrowRightIcon className="w-5 h-5" />
//                 </Link>
//               </motion.div>
              
//               <motion.div
//                 whileHover={{ scale: 1.02 }}
//                 whileTap={{ scale: 0.98 }}
//               >
//                 <a
//                   href="#demo"
//                   className="flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 px-6 py-3.5 rounded-lg shadow-sm hover:shadow-md transition-all font-medium"
//                 >
//                   Watch Demo
//                 </a>
//               </motion.div>
//             </div>
            
//             <div className="mt-8 flex flex-wrap justify-center md:justify-start gap-4">
//               {[1, 2, 3, 4, 5].map((star) => (
//                 <div key={star} className="flex items-center">
//                   <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
//                     <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//                   </svg>
//                 </div>
//               ))}
//               <span className="text-gray-600 text-sm font-medium">Rated 4.9/5 by 2,500+ teams</span>
//             </div>
//           </motion.div>
          
//           <motion.div
//             initial={{ opacity: 0, scale: 0.95 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ duration: 0.6, delay: 0.3 }}
//             style={{ y: yHero }}
//             className="relative"
//           >
//             <div className="absolute -top-10 -left-10 w-64 h-64 rounded-2xl bg-purple-200 opacity-30 blur-xl" />
//             <div className="absolute -bottom-10 -right-10 w-64 h-64 rounded-2xl bg-indigo-200 opacity-30 blur-xl" />
            
//             <div className="relative rounded-2xl overflow-hidden shadow-2xl border-8 border-white transform rotate-1">
//               <img
//                 src="https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
//                 alt="TaskFlow Dashboard"
//                 className="w-full h-auto object-cover"
//               />
//               <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/30 to-indigo-900/10" />
              
//               {/* Floating UI elements */}
//               <motion.div 
//                 className="absolute top-1/4 left-1/4 bg-white p-3 rounded-lg shadow-md"
//                 animate={{
//                   y: [0, -10, 0],
//                 }}
//                 transition={{
//                   duration: 3,
//                   repeat: Infinity,
//                   ease: "easeInOut",
//                 }}
//               >
//                 <div className="flex items-center">
//                   <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
//                   <span className="text-xs font-medium">Task completed</span>
//                 </div>
//               </motion.div>
              
//               <motion.div 
//                 className="absolute bottom-1/4 right-1/4 bg-white p-3 rounded-lg shadow-md"
//                 animate={{
//                   y: [0, 10, 0],
//                 }}
//                 transition={{
//                   duration: 3.5,
//                   repeat: Infinity,
//                   ease: "easeInOut",
//                   delay: 0.5
//                 }}
//               >
//                 <div className="flex items-center">
//                   <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-2">
//                     <UserGroupIcon className="w-4 h-4 text-indigo-600" />
//                   </div>
//                   <span className="text-xs font-medium">3 collaborators</span>
//                 </div>
//               </motion.div>
//             </div>
//           </motion.div>
//         </div>
//       </section>

//       {/* Logo Cloud Section */}
//       <section className="py-12 bg-gray-50 border-y border-gray-200">
//         <div className="max-w-7xl mx-auto px-6">
//           <p className="text-center text-gray-500 text-sm font-medium mb-8">TRUSTED BY INNOVATIVE TEAMS WORLDWIDE</p>
//           <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center justify-center">
//             {['TechCrunch', 'Forbes', 'Microsoft', 'Spotify', 'Slack', 'Airbnb'].map((company, index) => (
//               <motion.div
//                 key={company}
//                 initial={{ opacity: 0, y: 20 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 transition={{ delay: index * 0.1, duration: 0.5 }}
//                 viewport={{ once: true }}
//                 className="flex justify-center"
//               >
//                 <div className="text-gray-400 hover:text-gray-600 text-xl font-bold transition-colors">
//                   {company}
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Stats Section */}
//       <section className="py-20 bg-white">
//         <div className="max-w-7xl mx-auto px-6">
//           <motion.div
//             initial={{ opacity: 0 }}
//             whileInView={{ opacity: 1 }}
//             transition={{ duration: 0.8 }}
//             viewport={{ once: true }}
//             className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-center"
//           >
//             {stats.map((stat, index) => (
//               <motion.div
//                 key={index}
//                 whileHover={{ y: -5 }}
//                 className="p-6 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50"
//               >
//                 <p className="text-4xl font-bold text-indigo-600 mb-2">{stat.value}</p>
//                 <p className="text-gray-600 font-medium">{stat.label}</p>
//               </motion.div>
//             ))}
//           </motion.div>
//         </div>
//       </section>

//       {/* Features Section */}
//       <section id="features" className="py-20 bg-gray-50">
//         <div className="max-w-7xl mx-auto px-6">
//           <motion.div
//             initial={{ opacity: 0, y: 30 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6 }}
//             viewport={{ once: true }}
//             className="text-center mb-16"
//           >
//             <span className="inline-block px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium mb-4">
//               POWERFUL FEATURES
//             </span>
//             <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
//               Everything your team needs in one place
//             </h2>
//             <p className="text-lg text-gray-600 max-w-2xl mx-auto">
//               TaskFlow combines project management, collaboration, and automation to streamline your workflow.
//             </p>
//           </motion.div>
          
//           <motion.div
//             variants={container}
//             initial="hidden"
//             whileInView="visible"
//             viewport={{ once: true }}
//             className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
//           >
//             {features.map((feature, idx) => (
//               <motion.div
//                 key={idx}
//                 variants={item}
//                 whileHover={{ y: -10 }}
//                 className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100"
//               >
//                 <div 
//                   className={`w-12 h-12 flex items-center justify-center rounded-xl mb-6`}
//                   style={{ backgroundColor: `${feature.color}20`, color: feature.color }}
//                 >
//                   <feature.icon className="w-6 h-6" />
//                 </div>
//                 <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
//                 <p className="text-gray-600 mb-4">{feature.description}</p>
//                 <a href="#" className="inline-flex items-center text-indigo-600 font-medium group">
//                   Learn more
//                   <ArrowRightIcon className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
//                 </a>
//               </motion.div>
//             ))}
//           </motion.div>
//         </div>
//       </section>

//       {/* Demo Video Section */}
//       <section id="demo" className="py-20 bg-white">
//         <div className="max-w-6xl mx-auto px-6">
//           <motion.div
//             initial={{ opacity: 0, y: 30 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6 }}
//             viewport={{ once: true }}
//             className="text-center mb-12"
//           >
//             <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
//               See TaskFlow in action
//             </h2>
//             <p className="text-lg text-gray-600 max-w-2xl mx-auto">
//               Watch how TaskFlow can transform your team's productivity in just 2 minutes.
//             </p>
//           </motion.div>
          
//           <motion.div
//             initial={{ opacity: 0, scale: 0.95 }}
//             whileInView={{ opacity: 1, scale: 1 }}
//             transition={{ duration: 0.8 }}
//             viewport={{ once: true }}
//             className="relative rounded-2xl overflow-hidden shadow-2xl aspect-video bg-gray-900"
//           >
//             <div className="absolute inset-0 flex items-center justify-center">
//               <button className="w-20 h-20 rounded-full bg-indigo-600 hover:bg-indigo-700 transition-colors flex items-center justify-center shadow-lg">
//                 <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
//                   <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
//                 </svg>
//               </button>
//             </div>
//             <img 
//               src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80" 
//               alt="Video placeholder" 
//               className="w-full h-full object-cover opacity-70"
//             />
//           </motion.div>
//         </div>
//       </section>

//       {/* Testimonials Section */}
//       <section className="py-20 bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
//         <div className="max-w-7xl mx-auto px-6">
//           <motion.div
//             initial={{ opacity: 0, y: 30 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6 }}
//             viewport={{ once: true }}
//             className="text-center mb-16"
//           >
//             <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-white text-sm font-medium mb-4">
//               TRUSTED BY TEAMS
//             </span>
//             <h2 className="text-3xl md:text-4xl font-bold mb-4">
//               Loved by teams worldwide
//             </h2>
//             <p className="text-lg text-indigo-100 max-w-2xl mx-auto">
//               Join thousands of satisfied teams who have transformed their workflow with TaskFlow.
//             </p>
//           </motion.div>
          
//           <motion.div
//             ref={ref}
//             variants={container}
//             initial="hidden"
//             animate={controls}
//             className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
//           >
//             {testimonials.map((testimonial, idx) => (
//               <motion.div
//                 key={idx}
//                 variants={item}
//                 className="bg-white/10 backdrop-blur-sm p-8 rounded-xl border border-white/20 hover:border-white/30 transition-all"
//               >
//                 <div className="flex items-center gap-4 mb-6">
//                   <img
//                     src={testimonial.avatar}
//                     alt={testimonial.name}
//                     className="w-12 h-12 rounded-full object-cover"
//                   />
//                   <div>
//                     <h3 className="font-bold text-white">{testimonial.name}</h3>
//                     <p className="text-indigo-100 text-sm">{testimonial.position}</p>
//                   </div>
//                 </div>
//                 <p className="text-white mb-6">{testimonial.text}</p>
//                 <div className="flex">
//                   {[...Array(5)].map((_, i) => (
//                     <svg
//                       key={i}
//                       className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-300' : 'text-gray-400'}`}
//                       fill="currentColor"
//                       viewBox="0 0 20 20"
//                     >
//                       <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//                     </svg>
//                   ))}
//                 </div>
//               </motion.div>
//             ))}
//           </motion.div>
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="py-20 bg-white">
//         <div className="max-w-4xl mx-auto px-6 text-center">
//           <motion.div
//             initial={{ opacity: 0, y: 30 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6 }}
//             viewport={{ once: true }}
//             className="bg-gradient-to-br from-indigo-50 to-purple-50 p-8 md:p-12 rounded-2xl shadow-sm"
//           >
//             <LightningBoltIcon className="w-12 h-12 text-indigo-600 mx-auto mb-6" />
//             <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
//               Ready to transform your team's productivity?
//             </h2>
//             <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
//               Join thousands of teams who use TaskFlow to work smarter, not harder.
//             </p>
//             <div className="flex flex-col sm:flex-row justify-center gap-4">
//               <motion.div
//                 whileHover={{ scale: 1.03 }}
//                 whileTap={{ scale: 0.98 }}
//               >
//                 <Link
//                   to="/signup"
//                   className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-lg shadow-md hover:shadow-lg transition-all font-medium"
//                 >
//                   Start Free Trial <ArrowRightIcon className="w-5 h-5" />
//                 </Link>
//               </motion.div>
//               <motion.div
//                 whileHover={{ scale: 1.03 }}
//                 whileTap={{ scale: 0.98 }}
//               >
//                 <Link
//                   to="/demo"
//                   className="inline-flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 px-8 py-4 rounded-lg shadow-sm hover:shadow-md transition-all font-medium"
//                 >
//                   Request Demo
//                 </Link>
//               </motion.div>
//             </div>
//           </motion.div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="bg-gray-900 text-gray-400 pt-20 pb-12">
//         <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-5 gap-12">
//           <div className="md:col-span-2">
//             <h3 className="text-white text-xl font-bold mb-4">TaskFlow</h3>
//             <p className="mb-6">
//               The modern project management platform for high-performing teams.
//             </p>
//             <div className="flex space-x-4">
//               {['Twitter', 'LinkedIn', 'Facebook', 'GitHub'].map((social) => (
//                 <a 
//                   key={social} 
//                   href="#" 
//                   className="text-gray-400 hover:text-white transition-colors"
//                 >
//                   {social}
//                 </a>
//               ))}
//             </div>
//           </div>
          
//           {[
//             {
//               title: "Product",
//               links: ["Features", "Integrations", "Pricing", "Changelog"]
//             },
//             {
//               title: "Company",
//               links: ["About us", "Careers", "Blog", "Press"]
//             },
//             {
//               title: "Resources",
//               links: ["Community", "Help center", "Tutorials", "Templates"]
//             },
//             {
//               title: "Legal",
//               links: ["Privacy", "Terms", "Security", "GDPR"]
//             }
//           ].map((column, index) => (
//             <div key={index}>
//               <h4 className="text-white font-semibold mb-4">{column.title}</h4>
//               <ul className="space-y-3">
//                 {column.links.map((link, idx) => (
//                   <li key={idx}>
//                     <a href="#" className="hover:text-white transition-colors">
//                       {link}
//                     </a>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           ))}
//         </div>
        
//         <div className="max-w-7xl mx-auto px-6 pt-12 mt-12 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
//           <p className="text-sm mb-4 md:mb-0">
//             © {new Date().getFullYear()} TaskFlow. All rights reserved.
//           </p>
//           <div className="flex space-x-6">
//             <a href="#" className="text-sm hover:text-white transition-colors">Privacy Policy</a>
//             <a href="#" className="text-sm hover:text-white transition-colors">Terms of Service</a>
//             <a href="#" className="text-sm hover:text-white transition-colors">Cookies</a>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default LandingPage;




