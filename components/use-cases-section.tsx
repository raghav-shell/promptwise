"use client"

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { useRef, useState } from "react"
import { 
  Code, 
  Palette, 
  Search, 
  FileText, 
  PenTool, 
  Megaphone, 
  Presentation,
  Mail,
  ArrowRight,
  Layers
} from "lucide-react"

// Premium tilt card component
function TiltCard({ 
  children, 
  className = "", 
  glowColor = "oklch(0.70 0.15 270 / 0.15)",
  hoverScale = 1.02,
  hoverLift = -6
}: { 
  children: React.ReactNode
  className?: string
  glowColor?: string
  hoverScale?: number
  hoverLift?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)
  
  const springConfig = { damping: 30, stiffness: 200 }
  const rotateX = useSpring(useTransform(mouseY, [0, 1], [3, -3]), springConfig)
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-3, 3]), springConfig)
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
      whileHover={{ y: hoverLift, scale: hoverScale }}
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
          background: `radial-gradient(280px circle at ${highlightX}% ${highlightY}%, oklch(1 0 0 / 0.1), transparent 50%)`,
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

const useCases = [
  {
    icon: Code,
    title: "Coding",
    description: "Generate clean, efficient code with precise instructions",
    glowColor: "oklch(0.50 0.20 270 / 0.2)",
    bgColor: "bg-indigo/10",
    featured: true,
  },
  {
    icon: Palette,
    title: "UI Generation",
    description: "Create stunning interfaces with clear design specifications",
    glowColor: "oklch(0.80 0.12 350 / 0.2)",
    bgColor: "bg-pink/10",
    featured: true,
  },
  {
    icon: Search,
    title: "Research",
    description: "Extract insights from complex data and sources",
    glowColor: "oklch(0.82 0.12 200 / 0.2)",
    bgColor: "bg-cyan/10",
  },
  {
    icon: FileText,
    title: "Resume Writing",
    description: "Craft compelling resumes that stand out",
    glowColor: "oklch(0.70 0.20 150 / 0.2)",
    bgColor: "bg-green-500/10",
  },
  {
    icon: PenTool,
    title: "Content Creation",
    description: "Write engaging content that resonates with your audience",
    glowColor: "oklch(0.80 0.10 290 / 0.2)",
    bgColor: "bg-lavender/10",
  },
  {
    icon: Megaphone,
    title: "Marketing",
    description: "Develop persuasive copy that converts",
    glowColor: "oklch(0.70 0.18 50 / 0.2)",
    bgColor: "bg-orange-500/10",
  },
  {
    icon: Presentation,
    title: "Presentations",
    description: "Build impactful slides with structured content",
    glowColor: "oklch(0.60 0.18 250 / 0.2)",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: Mail,
    title: "Email Writing",
    description: "Compose professional emails that get responses",
    glowColor: "oklch(0.65 0.20 25 / 0.2)",
    bgColor: "bg-red-500/10",
  },
]

export function UseCasesSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section
      id="use-cases"
      ref={containerRef}
      className="relative py-32 px-4 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-lavender/15 rounded-full blur-3xl"
          animate={{
            y: [0, -30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-cyan/10 rounded-full blur-3xl"
          animate={{
            y: [0, 20, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{ duration: 8, repeat: Infinity, delay: 1 }}
        />
      </div>
      
      {/* Floating decorative elements */}
      <motion.div
        initial={{ opacity: 0, rotate: 12 }}
        whileInView={{ opacity: 1, rotate: 12 }}
        viewport={{ once: true }}
        className="absolute top-28 right-[15%] hidden xl:block"
      >
        <div className="premium-card-subtle rounded-lg px-3 py-2 flex items-center gap-2">
          <Layers className="w-3 h-3 text-lavender" />
          <span className="text-xs text-muted-foreground">8+ use cases</span>
        </div>
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Asymmetric header with featured cards */}
        <div className="grid lg:grid-cols-12 gap-8 mb-12">
          {/* Section Header - Left with more breathing room */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 lg:col-start-1"
          >
            <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight mb-4 text-balance">
              Optimize prompts for <span className="text-gradient">any task</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              From coding to content creation, PromptWise adapts to your specific use case
            </p>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="group flex items-center gap-2 text-sm font-medium text-indigo hover:text-indigo/80 transition-colors"
            >
              <span>Explore all use cases</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>
          
          {/* Featured use cases - Overlapping right side */}
          <div className="lg:col-span-6 lg:col-start-7 grid sm:grid-cols-2 gap-4">
            {useCases.filter(u => u.featured).map((useCase, i) => (
              <motion.div
                key={useCase.title}
                initial={{ opacity: 0, y: 30, x: i === 0 ? 0 : 20 }}
                whileInView={{ opacity: 1, y: i === 1 ? 16 : 0, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={i === 1 ? "sm:translate-y-6" : ""}
              >
                {/* Layered background for depth */}
                <div className="relative">
                  {i === 0 && (
                    <div className="absolute -top-2 -left-2 w-full h-full premium-card-subtle rounded-2xl opacity-30 -rotate-2" />
                  )}
                  
                  <TiltCard 
                    className="rounded-2xl p-6 h-full"
                    glowColor={useCase.glowColor}
                    hoverLift={-8}
                  >
                    {/* Inner top reflection */}
                    <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-white/6 to-transparent rounded-t-2xl pointer-events-none" />
                    
                    <motion.div
                      animate={{
                        rotate: hoveredIndex === i ? [0, -8, 8, 0] : 0,
                      }}
                      transition={{ duration: 0.5 }}
                      className={`w-14 h-14 rounded-xl ${useCase.bgColor} flex items-center justify-center mb-4 shadow-lg`}
                    >
                      <useCase.icon className="w-7 h-7" style={{ color: 'inherit' }} />
                    </motion.div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{useCase.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {useCase.description}
                    </p>
                  </TiltCard>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Remaining use cases - Fluid masonry-style grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-6 gap-4">
          {useCases.filter(u => !u.featured).map((useCase, i) => {
            // Varying column spans for visual interest
            const colSpan = "lg:col-span-2"
            const offset = i === 2 ? "lg:translate-y-4" : i === 4 ? "lg:-translate-y-4" : ""
            
            return (
              <motion.div
                key={useCase.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.05 * i }}
                onMouseEnter={() => setHoveredIndex(i + 2)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`${colSpan} ${offset}`}
              >
                <TiltCard 
                  className="rounded-2xl p-5 h-full"
                  glowColor={useCase.glowColor}
                  hoverScale={1.03}
                  hoverLift={-5}
                >
                  <div className="flex items-start gap-4">
                    <motion.div
                      animate={{
                        rotate: hoveredIndex === i + 2 ? [0, -10, 10, 0] : 0,
                      }}
                      transition={{ duration: 0.5 }}
                      className={`w-10 h-10 rounded-xl ${useCase.bgColor} flex items-center justify-center shrink-0 shadow-lg`}
                    >
                      <useCase.icon className="w-5 h-5" style={{ color: 'inherit' }} />
                    </motion.div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">{useCase.title}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {useCase.description}
                      </p>
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            )
          })}
        </div>

        {/* Bottom floating element - offset right */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 flex justify-end"
        >
          <TiltCard className="rounded-2xl px-5 py-3" glowColor="oklch(0.70 0.15 270 / 0.15)">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo/60 to-cyan/60 border-2 border-background shadow-lg"
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">2,400+</span> prompts optimized today
              </span>
            </div>
          </TiltCard>
        </motion.div>
      </div>
    </section>
  )
}
