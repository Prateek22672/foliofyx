import React from "react";
import { motion } from "framer-motion";

const AnimatedReveal = ({ children, delay = 0 }) => {
  return (
    <motion.div
      initial={{ x: 150, scale: 1.1, opacity: 0 }}
      whileInView={{ x: 0, scale: 1, opacity: 1 }}
      transition={{ duration: 1, ease: "easeOut", delay }}
      viewport={{ once: true, margin: "-20% 0px" }}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedReveal;
