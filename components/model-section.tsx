"use client"

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { useRef, useState } from "react"
import { Sparkles, Zap, Brain, Code, ArrowUpRight } from "lucide-react"

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
      whileHover={{ y: -8, scale: 1.02 }}
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
          background: `radial-gradient(350px circle at ${highlightX}% ${highlightY}%, oklch(1 0 0 / 0.12), transparent 50%)`,
        }}
      />
      
      {/* Top edge shimmer */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />
      
      {/* Left edge highlight */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-px bg-gradient-to-b from-white/40 via-white/20 to-transparent" />
      
      {/* Hover glow */}
      <motion.div
        className="pointer-events-none absolute -inset-2 rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10"
        style={{ background: glowColor }}
      />
      
      <div className="relative z-10" style={{ transform: "translateZ(20px)" }}>
        {children}
      </div>
    </motion.div>
  )
}

const models = [
  {
    id: "claude",
    name: "Claude",
    version: "3.5 Sonnet",
    icon: "C",
    color: "from-[#CC785C] to-[#CC785C]/60",
    bgColor: "bg-[#CC785C]/10",
    borderColor: "border-[#CC785C]/30",
    textColor: "text-[#CC785C]",
    glowColor: "oklch(0.65 0.15 45 / 0.3)",
    description: "Best for nuanced writing and complex reasoning tasks",
    strengths: ["Long context", "Nuanced output", "Safe responses"],
    recommended: true,
    matchScore: 94,
  },
  {
    id: "gpt",
    name: "GPT",
    version: "4o",
    icon: "G",
    color: "from-[#10A37F] to-[#10A37F]/60",
    bgColor: "bg-[#10A37F]/10",
    borderColor: "border-[#10A37F]/30",
    textColor: "text-[#10A37F]",
    glowColor: "oklch(0.65 0.18 160 / 0.2)",
    description: "Versatile model for general-purpose applications",
    strengths: ["Broad knowledge", "Tool calling", "Multimodal"],
    recommended: false,
    matchScore: 87,
  },
  {
    id: "gemini",
    name: "Gemini",
    version: "1.5 Pro",
    icon: "G",
    color: "from-[#4285F4] to-[#EA4335]/60",
    bgColor: "bg-[#4285F4]/10",
    borderColor: "border-[#4285F4]/30",
    textColor: "text-[#4285F4]",
    glowColor: "oklch(0.60 0.20 250 / 0.2)",
    description: "Excellent for multimodal and research tasks",
    strengths: ["Multimodal", "Long context", "Fast inference"],
    recommended: false,
    matchScore: 82,
  },
  {
    id: "codex",
    name: "Codex",
    version: "Latest",
    icon: "Cx",
    color: "from-[#9333EA] to-[#9333EA]/60",
    bgColor: "bg-[#9333EA]/10",
    borderColor: "border-[#9333EA]/30",
    textColor: "text-[#9333EA]",
    glowColor: "oklch(0.55 0.25 300 / 0.2)",
    description: "Specialized for code generation and debugging",
    strengths: ["Code generation", "Debugging", "Documentation"],
    recommended: false,
    matchScore: 78,
  },
]

export function ModelSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [hoveredModel, setHoveredModel] = useState<string | null>(null)

  return (
    <section
      ref={containerRef}
      className="relative py-32 px-4 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 gradient-mesh opacity-30" />
      
      {/* Floating decorative elements */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="absolute top-32 left-[8%] hidden xl:block"
      >
        <div className="w-16 h-16 rounded-2xl border border-indigo/20 backdrop-blur-sm rotate-12 flex items-center justify-center premium-card-subtle">
          <Brain className="w-6 h-6 text-indigo/40" />
        </div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.3 }}
        className="absolute bottom-40 right-[12%] hidden lg:block"
      >
        <div className="premium-card-subtle rounded-xl p-3 -rotate-6">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Code className="w-3 h-3 text-cyan" />
            <span>Smart routing</span>
          </div>
        </div>
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header - Left aligned with featured card */}
        <div className="grid lg:grid-cols-12 gap-8 mb-16 items-end">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-6 lg:col-start-1"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center justify-center w-12 h-12 mb-6 rounded-2xl bg-gradient-to-br from-cyan/20 to-indigo/20 shadow-lg shadow-indigo/10"
            >
              <Brain className="w-6 h-6 text-indigo" />
            </motion.div>
            <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight mb-4 text-balance">
              The right model for <span className="text-gradient">every task</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-lg">
              PromptWise analyzes your prompt and recommends the AI model best suited for your specific task
            </p>
          </motion.div>
          
          {/* Task context badge - floating right */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="lg:col-span-4 lg:col-start-8 lg:mb-4"
          >
            <TiltCard className="rounded-2xl px-5 py-4" glowColor="oklch(0.50 0.20 270 / 0.15)">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo/10 flex items-center justify-center shadow-lg shadow-indigo/10">
                  <Code className="w-5 h-5 text-indigo" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Detected task</div>
                  <div className="text-sm font-medium text-foreground">Frontend UI generation</div>
                </div>
              </div>
            </TiltCard>
          </motion.div>
        </div>

        {/* Model Cards - Asymmetric bento-style grid */}
        <div className="grid lg:grid-cols-12 gap-4">
          {/* Recommended model - Large card with overlap */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            onMouseEnter={() => setHoveredModel("claude")}
            onMouseLeave={() => setHoveredModel(null)}
            className="lg:col-span-5 lg:row-span-2 relative"
          >
            {/* Animated glow effect behind card */}
            <motion.div
              className="absolute -inset-2 bg-gradient-to-r from-cyan via-indigo to-pink rounded-3xl opacity-30 blur-lg -z-10"
              animate={{
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            
            {/* Layered background cards */}
            <div className="absolute -top-3 -left-3 w-full h-full premium-card-subtle rounded-3xl opacity-20 -rotate-2" />
            
            <TiltCard 
              className="h-full rounded-3xl p-8 border-2 border-[#CC785C]/30" 
              glowColor="oklch(0.65 0.15 45 / 0.35)"
              tiltIntensity={5}
            >
              {/* Recommended Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute -top-3 left-8 flex items-center gap-1 px-4 py-1.5 rounded-full bg-gradient-to-r from-cyan to-indigo text-primary-foreground text-xs font-medium shadow-lg shadow-indigo/30"
              >
                <Sparkles className="w-3 h-3" />
                Recommended
              </motion.div>
              
              {/* Inner top reflection */}
              <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/8 to-transparent rounded-t-3xl pointer-events-none" />

              {/* Model Icon */}
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#CC785C] to-[#CC785C]/60 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-xl shadow-[#CC785C]/20">
                <span className="text-white font-bold text-2xl">C</span>
              </div>

              {/* Model Info */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-2xl font-semibold text-foreground">Claude</h3>
                  <span className="text-sm text-muted-foreground">3.5 Sonnet</span>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Best for nuanced writing and complex reasoning tasks
                </p>
              </div>

              {/* Match Score - Larger display */}
              <div className="mb-6">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Match Score</span>
                  <span className="text-2xl font-bold text-[#CC785C]">94%</span>
                </div>
                <div className="h-2.5 bg-muted/50 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#CC785C] to-[#CC785C]/60 rounded-full"
                    initial={{ width: 0 }}
                    whileInView={{ width: "94%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
              </div>

              {/* Strengths */}
              <div className="flex flex-wrap gap-2">
                {["Long context", "Nuanced output", "Safe responses"].map((strength) => (
                  <span
                    key={strength}
                    className="px-3 py-1 rounded-lg text-sm bg-[#CC785C]/10 text-[#CC785C] border border-[#CC785C]/20"
                  >
                    {strength}
                  </span>
                ))}
              </div>
              
              {/* Action hint */}
              <motion.div
                className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity"
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowUpRight className="w-5 h-5 text-[#CC785C]" />
              </motion.div>
            </TiltCard>
          </motion.div>

          {/* Other models - Staggered smaller cards */}
          {models.slice(1).map((model, i) => (
            <motion.div
              key={model.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 + i * 0.1 }}
              onMouseEnter={() => setHoveredModel(model.id)}
              onMouseLeave={() => setHoveredModel(null)}
              className={`lg:col-span-3 ${i === 1 ? "lg:col-start-9" : ""} relative`}
            >
              <TiltCard 
                className="h-full rounded-2xl p-5"
                glowColor={model.glowColor}
                tiltIntensity={3}
              >
                {/* Model Icon */}
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${model.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                  <span className="text-white font-bold text-base">{model.icon}</span>
                </div>

                {/* Model Info */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-foreground">{model.name}</h3>
                    <span className="text-xs text-muted-foreground">{model.version}</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    {model.description}
                  </p>
                </div>

                {/* Match Score */}
                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Match</span>
                    <span className={`font-semibold ${model.textColor}`}>{model.matchScore}%</span>
                  </div>
                  <div className="h-1.5 bg-muted/50 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full bg-gradient-to-r ${model.color} rounded-full`}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${model.matchScore}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                    />
                  </div>
                </div>

                {/* Strengths */}
                <div className="flex flex-wrap gap-1">
                  {model.strengths.slice(0, 2).map((strength) => (
                    <span
                      key={strength}
                      className={`px-2 py-0.5 rounded text-xs ${model.bgColor} ${model.textColor} border ${model.borderColor}`}
                    >
                      {strength}
                    </span>
                  ))}
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>

        {/* Additional Info - Offset left */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-12 lg:ml-0"
        >
          <div className="inline-flex items-center gap-4 premium-card rounded-2xl px-6 py-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Zap className="w-4 h-4 text-cyan" />
              <span>Based on your prompt analysis</span>
            </div>
            <div className="w-px h-4 bg-border" />
            <div className="flex items-center gap-2 text-sm text-green-600">
              <div className="w-2 h-2 rounded-full bg-green-400 shadow-lg shadow-green-400/50" />
              <span>Auto-routing enabled</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
