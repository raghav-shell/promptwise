"use client"

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { useRef, type ReactNode } from "react"
import { cn } from "@/lib/utils"

interface PremiumCardProps {
  children: ReactNode
  className?: string
  glowColor?: string
  tiltEnabled?: boolean
  hoverScale?: number
  hoverLift?: number
  variant?: "default" | "strong" | "highlight" | "subtle"
}

export function PremiumCard({
  children,
  className,
  glowColor = "oklch(0.70 0.15 270 / 0.15)",
  tiltEnabled = true,
  hoverScale = 1.02,
  hoverLift = -8,
  variant = "default",
}: PremiumCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  
  // Motion values for tilt effect
  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)
  
  // Smooth spring animation
  const springConfig = { damping: 30, stiffness: 200 }
  const rotateX = useSpring(useTransform(mouseY, [0, 1], [5, -5]), springConfig)
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-5, 5]), springConfig)
  
  // Highlight position for inner reflection
  const highlightX = useSpring(useTransform(mouseX, [0, 1], [0, 100]), springConfig)
  const highlightY = useSpring(useTransform(mouseY, [0, 1], [0, 100]), springConfig)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current || !tiltEnabled) return
    const rect = ref.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    mouseX.set(x)
    mouseY.set(y)
  }

  const handleMouseLeave = () => {
    mouseX.set(0.5)
    mouseY.set(0.5)
  }

  const variants = {
    default: "premium-card",
    strong: "premium-card-strong",
    highlight: "premium-card-highlight",
    subtle: "premium-card-subtle",
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ 
        scale: hoverScale, 
        y: hoverLift,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      style={{
        rotateX: tiltEnabled ? rotateX : 0,
        rotateY: tiltEnabled ? rotateY : 0,
        transformStyle: "preserve-3d",
        transformPerspective: 1000,
      }}
      className={cn(
        variants[variant],
        "relative overflow-hidden group cursor-default",
        className
      )}
    >
      {/* Inner highlight reflection that follows mouse */}
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(300px circle at ${highlightX}% ${highlightY}%, oklch(1 0 0 / 0.15), transparent 50%)`,
        }}
      />
      
      {/* Top edge highlight */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />
      
      {/* Left edge highlight */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-px bg-gradient-to-b from-white/40 via-white/20 to-transparent" />
      
      {/* Hover glow effect */}
      <motion.div
        className="pointer-events-none absolute -inset-1 rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10"
        style={{
          background: glowColor,
        }}
      />
      
      {/* Content */}
      <div className="relative z-10" style={{ transform: "translateZ(20px)" }}>
        {children}
      </div>
    </motion.div>
  )
}

// Simpler variant without tilt for smaller cards
interface GlassCardProps {
  children: ReactNode
  className?: string
  hoverLift?: number
  glowOnHover?: boolean
  glowColor?: string
}

export function GlassCard({
  children,
  className,
  hoverLift = -6,
  glowOnHover = true,
  glowColor = "oklch(0.70 0.15 270 / 0.12)",
}: GlassCardProps) {
  return (
    <motion.div
      whileHover={{ 
        y: hoverLift, 
        scale: 1.02,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      className={cn(
        "premium-card relative overflow-hidden group cursor-default",
        className
      )}
    >
      {/* Inner top highlight */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
      
      {/* Hover glow */}
      {glowOnHover && (
        <div 
          className="pointer-events-none absolute -inset-1 rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-lg -z-10"
          style={{ background: glowColor }}
        />
      )}
      
      {children}
    </motion.div>
  )
}

// Layered card with background offset
interface LayeredCardProps {
  children: ReactNode
  className?: string
  layers?: number
  layerOffset?: number
  layerRotation?: number
}

export function LayeredCard({
  children,
  className,
  layers = 2,
  layerOffset = 3,
  layerRotation = 2,
}: LayeredCardProps) {
  return (
    <div className="relative">
      {/* Background layers */}
      {Array.from({ length: layers }).map((_, i) => (
        <div
          key={i}
          className="absolute inset-0 premium-card-subtle rounded-[inherit] -z-10"
          style={{
            transform: `translate(${-(i + 1) * layerOffset}px, ${-(i + 1) * layerOffset}px) rotate(${(i + 1) * layerRotation}deg)`,
            opacity: 0.3 - i * 0.1,
          }}
        />
      ))}
      
      {/* Main card */}
      <motion.div
        whileHover={{ 
          y: -6, 
          scale: 1.01,
          transition: { duration: 0.3 }
        }}
        className={cn("premium-card-strong relative group", className)}
      >
        {/* Inner highlights */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 left-0 w-px bg-gradient-to-b from-white/40 via-white/20 to-transparent" />
        
        {children}
      </motion.div>
    </div>
  )
}
