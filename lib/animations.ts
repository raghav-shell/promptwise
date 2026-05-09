"use client"

import { Variants } from "framer-motion"

// Premium easing curves for cinematic feel
export const easings = {
  smooth: [0.25, 0.46, 0.45, 0.94] as const,
  smoothOut: [0.22, 1, 0.36, 1] as const,
  smoothIn: [0.64, 0, 0.78, 0] as const,
  elastic: [0.68, -0.6, 0.32, 1.6] as const,
  bounce: [0.34, 1.56, 0.64, 1] as const,
  premium: [0.4, 0, 0.2, 1] as const,
  cinematic: [0.16, 1, 0.3, 1] as const,
}

// Staggered reveal animation variants
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
}

export const staggerContainerSlow: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
}

// Fade + blur entrance variants
export const fadeBlurIn: Variants = {
  hidden: {
    opacity: 0,
    filter: "blur(10px)",
    y: 20,
  },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    y: 0,
    transition: {
      duration: 0.7,
      ease: easings.cinematic,
    },
  },
}

export const fadeBlurInUp: Variants = {
  hidden: {
    opacity: 0,
    filter: "blur(8px)",
    y: 30,
  },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    y: 0,
    transition: {
      duration: 0.8,
      ease: easings.cinematic,
    },
  },
}

export const fadeBlurInScale: Variants = {
  hidden: {
    opacity: 0,
    filter: "blur(12px)",
    scale: 0.95,
    y: 20,
  },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    scale: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: easings.cinematic,
    },
  },
}

// Slide variants with blur
export const slideInLeft: Variants = {
  hidden: {
    opacity: 0,
    x: -40,
    filter: "blur(6px)",
  },
  visible: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.7,
      ease: easings.smoothOut,
    },
  },
}

export const slideInRight: Variants = {
  hidden: {
    opacity: 0,
    x: 40,
    filter: "blur(6px)",
  },
  visible: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.7,
      ease: easings.smoothOut,
    },
  },
}

// Scale reveal for icons and badges
export const scaleReveal: Variants = {
  hidden: {
    opacity: 0,
    scale: 0,
    rotate: -10,
  },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {
      duration: 0.5,
      ease: easings.bounce,
    },
  },
}

// Floating animation for ambient motion
export const floatingAnimation = {
  y: [0, -8, 0],
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: "easeInOut",
  },
}

export const floatingSlow = {
  y: [0, -12, 0],
  transition: {
    duration: 5,
    repeat: Infinity,
    ease: "easeInOut",
  },
}

export const floatingWithRotate = {
  y: [0, -6, 0],
  rotate: [0, 2, 0, -2, 0],
  transition: {
    duration: 4,
    repeat: Infinity,
    ease: "easeInOut",
  },
}

// Gradient animation for backgrounds
export const animatedGradient = {
  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
  transition: {
    duration: 8,
    repeat: Infinity,
    ease: "linear",
  },
}

// Glow pulse animation
export const glowPulse = {
  opacity: [0.4, 0.7, 0.4],
  scale: [1, 1.05, 1],
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: "easeInOut",
  },
}

// Soft breathing animation
export const breathe = {
  scale: [1, 1.02, 1],
  opacity: [0.8, 1, 0.8],
  transition: {
    duration: 4,
    repeat: Infinity,
    ease: "easeInOut",
  },
}

// Progress bar animation
export const progressReveal = (width: string, delay: number = 0) => ({
  initial: { width: 0 },
  animate: { 
    width,
    transition: {
      duration: 1.2,
      delay,
      ease: easings.smoothOut,
    },
  },
})

// Counter animation spring config
export const counterSpringConfig = {
  damping: 25,
  stiffness: 100,
  duration: 2000,
}

// Magnetic pull spring config
export const magneticSpringConfig = {
  damping: 20,
  stiffness: 200,
}

// Hover lift animation
export const hoverLift = {
  y: -6,
  scale: 1.02,
  transition: {
    duration: 0.3,
    ease: easings.smooth,
  },
}

// Card entrance with stagger
export const cardEntrance: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
    filter: "blur(8px)",
  },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.6,
      delay: i * 0.1,
      ease: easings.cinematic,
    },
  }),
}

// Text reveal animation
export const textReveal: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    filter: "blur(4px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.6,
      ease: easings.smoothOut,
    },
  },
}

// Badge pop animation
export const badgePop: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    y: 10,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: easings.bounce,
    },
  },
}
