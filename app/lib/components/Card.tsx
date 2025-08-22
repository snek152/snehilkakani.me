"use client";
import * as motion from "motion/react-m";
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
      initial={{ y: 50, scale: 1, opacity: 0 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ y: -50, scale: 0.96, opacity: 0 }}
      transition={{
        type: "tween",
        duration: 0.6,
        delay: 0.2,
        ease: [0.25, 0.46, 0.45, 0.94],
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
