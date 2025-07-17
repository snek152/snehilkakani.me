"use client";
import { motion } from "motion/react";
import React from "react";

export default function Card({
  className,
  style,
  children,
  transition,
  ...props
}: React.ComponentProps<typeof motion.div>) {
  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -100, opacity: 0 }}
      transition={{
        type: "spring",
        stiffness: 60,
        duration: 0.8,
        delay: 0.2,
        damping: 20,
        ...transition,
      }}
      className={`w-full rounded-xl border-4 border-secondary bg-background relative overflow-hidden ${className}`}
      style={{
        boxShadow: "0 8px 32px 0 rgba(13, 110, 253, 0.19)",
        ...style,
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
