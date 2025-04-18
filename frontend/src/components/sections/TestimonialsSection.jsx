// src/components/sections/TestimonialsSection.jsx
import React from "react";
import { motion } from "framer-motion";
import TestimonialCard from "../ui/TestimonialCard";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Product Manager at TechCorp",
    quote: "TaskSync has transformed how our remote team collaborates. The integrated chat and video features eliminated our need for multiple tools.",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    name: "Michael Chen",
    role: "CTO at StartupX",
    quote: "We tried several tools before finding TaskSync. Its simplicity and focus on remote teams made all the difference for us.",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    name: "Emma Rodriguez",
    role: "Team Lead at DigitalAgency",
    quote: "The multi-organization support is perfect for our agency. We can manage all client projects in one place with clear separation.",
    rating: 4,
    avatar: "https://randomuser.me/api/portraits/women/68.jpg"
  }
];

const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="py-20 bg-gradient-to-br from-cyan-600 to-indigo-600">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-white text-sm font-medium mb-4">
            TRUSTED BY TEAMS
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Loved by remote teams worldwide
          </h2>
          <p className="text-lg text-cyan-100 max-w-2xl mx-auto">
            Join thousands of productive teams who use TaskSync every day.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ staggerChildren: 0.2 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial, idx) => (
            <TestimonialCard 
              key={idx}
              name={testimonial.name}
              role={testimonial.role}
              quote={testimonial.quote}
              rating={testimonial.rating}
              avatar={testimonial.avatar}
              delay={idx * 0.1}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;