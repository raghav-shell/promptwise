"use client"

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { useRef } from "react"
import { ArrowRight, Sparkles, Zap, Shield } from "lucide-react"

function createCtaParticles(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${(((i * 29 + 17) % 100) + (i % 2) * 0.217).toFixed(3)}%`,
    top: `${(((i * 47 + 11) % 100) + (i % 3) * 0.193).toFixed(3)}%`,
    duration: 5 + ((i * 1.11) % 5),
    delay: (i * 0.31) % 5,
  }))
}

// Premium tilt card component
function TiltCard({ 
  children, 
  className = "", 
  glowColor = "oklch(0.70 0.15 270 / 0.15)",
  tiltIntensity = 4
}: { 
  children: React.ReactNode
  className?: string
  glowColor?: string
  tiltIntensity?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)
  
  const springConfig = { damping: 30, stiffness: 200 }
  const rotateX = useSpring(useTransform(mouseY, [0, 1], [tiltIntensity, -tiltIntensity]), springConfig)
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-tiltIntensity, tiltIntensity]), springConfig)
  const highlightX = useSpring(useTransform(mouseX, [0, 1], [0, 100]), springConfig)
  const highlightY = useSpring(useTransform(mouseY, [0, 1], [0, 100]), springConfig)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    mouseX.set((e.clientX - rect.left) / rect.width)
    mouseY.set((e.clientY - rect.top) / rect.height)
  }

  const handleMouseLeave = () => {
    mouseX.set(0.5)
    mouseY.set(0.5)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ y: -5, scale: 1.01 }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        transformPerspective: 1000,
      }}
      transition={{ duration: 0.3 }}
      className={`premium-card relative overflow-hidden group cursor-default ${className}`}
    >
      {/* Mouse-follow highlight */}
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(250px circle at ${highlightX}% ${highlightY}%, oklch(1 0 0 / 0.1), transparent 50%)`,
        }}
      />
      
      {/* Top edge shimmer */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
      
      {/* Hover glow */}
      <motion.div
        className="pointer-events-none absolute -inset-2 rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10"
        style={{ background: glowColor }}
      />
      
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  )
}

export function CTASection() {
  const particles = createCtaParticles(15)

  return (
    <section className="relative py-32 px-4 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-transparent via-lavender/10 to-cyan/10"
          animate={{
            opacity: [0.5, 0.7, 0.5],
          }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-pink/15 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-cyan/15 rounded-full blur-3xl"
          animate={{
            x: [0, -40, 0],
            y: [0, 20, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, delay: 1 }}
        />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 rounded-full bg-indigo/30"
            style={{
              left: particle.left,
              top: particle.top,
            }}
            animate={{
              y: [0, -80, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Asymmetric layout */}
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          {/* Main content - offset left */}
          <div className="lg:col-span-7 lg:col-start-1">
            {/* Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, type: "spring" }}
              className="inline-flex items-center justify-center w-16 h-16 mb-8 rounded-2xl bg-gradient-to-br from-indigo/20 to-cyan/20 shadow-xl shadow-indigo/15"
            >
              <Sparkles className="w-8 h-8 text-indigo" />
            </motion.div>

            {/* Main Headline */}
            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.1] mb-6 text-balance"
            >
              Transform thoughts into{" "}
              <span className="text-gradient">AI-ready clarity</span>
            </motion.h2>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg sm:text-xl text-muted-foreground max-w-xl mb-10 leading-relaxed"
            >
              Join thousands of developers, writers, and creators who use PromptWise 
              to communicate with AI more effectively.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-start gap-4"
            >
              <motion.button
                onClick={() => {
                  const el = document.getElementById('prompt-input')
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
                    setTimeout(() => el.focus(), 500)
                  }
                }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="btn-glow relative px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-medium rounded-2xl shadow-xl shadow-emerald-500/20 hover:shadow-2xl hover:shadow-emerald-500/30 transition-all duration-300 flex items-center gap-2 text-lg group"
              >
                <motion.span className="absolute inset-0 bg-gradient-to-r from-teal-400/20 to-emerald-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                <span className="relative z-10">Get Started Free</span>
                <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </motion.div>
          </div>

          {/* Floating glass cards - Right side, staggered */}
          <div className="lg:col-span-4 lg:col-start-9 hidden lg:block relative h-80">
            {/* Card 1 - Top */}
            <motion.div
              initial={{ opacity: 0, y: 30, rotate: 6 }}
              whileInView={{ opacity: 1, y: 0, rotate: 6 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="absolute top-0 right-0 w-56"
            >
              <TiltCard className="rounded-2xl p-5" glowColor="oklch(0.70 0.20 150 / 0.2)">
                {/* Inner reflection */}
                <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-white/8 to-transparent rounded-t-2xl pointer-events-none" />
                
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center shadow-lg shadow-green-500/10">
                    <Zap className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-foreground">Fast Results</div>
                    <div className="text-xs text-muted-foreground">Under 2 seconds</div>
                  </div>
                </div>
                <div className="h-1.5 bg-muted/50 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-green-500 rounded-full"
                    initial={{ width: 0 }}
                    whileInView={{ width: "90%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.8 }}
                  />
                </div>
              </TiltCard>
            </motion.div>

            {/* Card 2 - Middle */}
            <motion.div
              initial={{ opacity: 0, y: 30, rotate: -3 }}
              whileInView={{ opacity: 1, y: 0, rotate: -3 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="absolute top-28 right-12 w-52"
            >
              <TiltCard className="rounded-2xl p-5" glowColor="oklch(0.50 0.20 270 / 0.2)">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo/10 flex items-center justify-center shadow-lg shadow-indigo/10">
                    <Shield className="w-5 h-5 text-indigo" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-foreground">Privacy First</div>
                    <div className="text-xs text-muted-foreground">Your data stays yours</div>
                  </div>
                </div>
              </TiltCard>
            </motion.div>

            {/* Card 3 - Bottom */}
            <motion.div
              initial={{ opacity: 0, y: 30, rotate: 4 }}
              whileInView={{ opacity: 1, y: 0, rotate: 4 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="absolute bottom-0 right-4 w-48"
            >
              <TiltCard className="rounded-2xl p-4" glowColor="oklch(0.70 0.15 270 / 0.15)">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan to-indigo border-2 border-background shadow-lg"
                      />
                    ))}
                  </div>
                  <div className="text-xs">
                    <span className="font-semibold text-foreground">12k+</span>
                    <span className="text-muted-foreground"> users</span>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          </div>
        </div>

        {/* Trust Badges - Left aligned */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.7 }}
          className="mt-16 flex flex-wrap items-center gap-6 text-sm text-muted-foreground"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 shadow-lg shadow-green-400/50" />
            <span>No credit card required</span>
          </div>
          <div className="w-px h-4 bg-border hidden sm:block" />
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyan shadow-lg shadow-cyan/50" />
            <span>Free tier available</span>
          </div>
          <div className="w-px h-4 bg-border hidden sm:block" />
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-indigo shadow-lg shadow-indigo/50" />
            <span>Cancel anytime</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
