"use client"

import { motion, useInView, AnimatePresence } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import { Wand2, Check, ArrowRight, Sparkles } from "lucide-react"

const messyPrompt = `i need you to make me a website that looks really good and professional and it should have like a nice header at the top and maybe some animations and also i want it to be responsive on mobile and desktop and it should be fast and also have good seo and stuff like that and use modern design trends and make sure the colors look nice together and add some cool effects if you can`

const refinedPrompt = `Create a professional website with:

• Responsive header with navigation
• Mobile-first design approach  
• Performance optimized (Core Web Vitals)
• SEO best practices implemented
• Modern UI with subtle animations
• Cohesive color palette
• Smooth scroll effects`

const analysisSteps = [
  { label: "Removing redundancy", color: "text-pink" },
  { label: "Extracting requirements", color: "text-cyan" },
  { label: "Structuring format", color: "text-lavender" },
  { label: "Optimizing clarity", color: "text-indigo" },
]

export function TransformSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })
  const [activeStep, setActiveStep] = useState(0)
  const [showRefined, setShowRefined] = useState(false)

  useEffect(() => {
    if (!isInView) return

    const stepInterval = setInterval(() => {
      setActiveStep((prev) => {
        if (prev < analysisSteps.length - 1) return prev + 1
        return prev
      })
    }, 800)

    const refinedTimeout = setTimeout(() => {
      setShowRefined(true)
    }, 3500)

    return () => {
      clearInterval(stepInterval)
      clearTimeout(refinedTimeout)
    }
  }, [isInView])

  return (
    <section
      id="transform"
      ref={containerRef}
      className="relative py-32 px-4 overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 gradient-mesh opacity-50" />
      
      {/* Floating decorative glass card - top right */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.5 }}
        className="absolute top-20 right-[8%] hidden xl:block"
      >
        <div className="glass rounded-xl p-3 rotate-6">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Sparkles className="w-3 h-3 text-pink" />
            <span>AI-Powered</span>
          </div>
        </div>
      </motion.div>
      
      {/* Floating decorative element - bottom left */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.8 }}
        className="absolute bottom-32 left-[5%] hidden lg:block"
      >
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan/20 to-transparent border border-cyan/10 backdrop-blur-sm -rotate-12" />
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header - Left aligned with offset */}
        <div className="grid lg:grid-cols-12 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 lg:col-start-2"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center justify-center w-12 h-12 mb-6 rounded-2xl bg-gradient-to-br from-indigo/20 to-cyan/20"
            >
              <Wand2 className="w-6 h-6 text-indigo" />
            </motion.div>
            <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight mb-4 text-balance">
              Watch the <span className="text-gradient">magic</span> happen
            </h2>
            <p className="text-lg text-muted-foreground max-w-md">
              See how PromptWise transforms vague ideas into precise, optimized instructions
            </p>
          </motion.div>
          
          {/* Floating stat card - overlaps into right area */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="lg:col-span-4 lg:col-start-8 flex items-end lg:-mb-8 lg:translate-y-12"
          >
            <div className="glass-strong rounded-2xl p-5 w-full lg:max-w-[200px]">
              <div className="text-3xl font-bold text-gradient mb-1">75%</div>
              <div className="text-sm text-muted-foreground">Average token reduction</div>
            </div>
          </motion.div>
        </div>

        {/* Transformation UI - Asymmetric layout */}
        <div className="grid lg:grid-cols-12 gap-6 items-start">
          {/* Messy Prompt Card - Offset left */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 lg:col-start-1 relative"
          >
            {/* Layered background card */}
            <div className="absolute -top-3 -left-3 w-full h-full glass rounded-2xl opacity-40 -rotate-2" />
            
            <div className="relative glass rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 rounded-full bg-pink/60" />
                <span className="text-sm font-medium text-muted-foreground">
                  Original Prompt
                </span>
              </div>
              <div className="relative">
                <p className="text-sm leading-relaxed text-muted-foreground/80 font-mono">
                  {messyPrompt.split(" ").map((word, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 1 }}
                      animate={{
                        opacity: showRefined ? 0.3 : 1,
                        filter: showRefined ? "blur(1px)" : "blur(0px)",
                      }}
                      transition={{ duration: 0.5, delay: showRefined ? i * 0.01 : 0 }}
                      className="inline-block mr-1"
                    >
                      {word}
                    </motion.span>
                  ))}
                </p>
                {showRefined && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <div className="glass-strong rounded-xl px-4 py-2 flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-muted-foreground">Analyzed</span>
                    </div>
                  </motion.div>
                )}
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground/60">
                <span className="px-2 py-1 rounded-md bg-pink/10 text-pink">
                  47 words
                </span>
                <span className="px-2 py-1 rounded-md bg-muted">
                  ~380 tokens
                </span>
              </div>
            </div>
          </motion.div>

          {/* Analysis Steps - Floating in center-right, overlapping */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="lg:col-span-2 lg:col-start-6 flex flex-col items-center justify-center py-8 lg:py-0 lg:-translate-y-4"
          >
            <div className="glass-strong rounded-2xl p-4 space-y-3 relative z-10">
              {analysisSteps.map((step, i) => (
                <motion.div
                  key={step.label}
                  initial={{ opacity: 0.3 }}
                  animate={{
                    opacity: i <= activeStep ? 1 : 0.3,
                    scale: i === activeStep ? 1.05 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center gap-2"
                >
                  <motion.div
                    className={`w-2 h-2 rounded-full ${
                      i <= activeStep ? "bg-green-400" : "bg-muted"
                    }`}
                    animate={i === activeStep ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 0.5, repeat: i === activeStep ? Infinity : 0 }}
                  />
                  <span className={`text-xs whitespace-nowrap ${i <= activeStep ? step.color : "text-muted-foreground/50"}`}>
                    {step.label}
                  </span>
                </motion.div>
              ))}
            </div>
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="hidden lg:block mt-4"
            >
              <ArrowRight className="w-6 h-6 text-indigo/50 rotate-90 lg:rotate-0" />
            </motion.div>
          </motion.div>

          {/* Refined Prompt Card - Offset right with overlap */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="lg:col-span-5 lg:col-start-8 relative lg:translate-y-8"
          >
            <AnimatePresence>
              {showRefined ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="relative"
                >
                  {/* Layered glow background */}
                  <div className="absolute -inset-2 bg-gradient-to-br from-green-500/10 to-cyan/10 rounded-3xl blur-xl" />
                  
                  <div className="relative glass-strong rounded-2xl p-6 border border-green-500/20 shadow-lg shadow-green-500/5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-3 h-3 rounded-full bg-green-400" />
                      <span className="text-sm font-medium text-foreground">
                        Optimized Prompt
                      </span>
                      <span className="ml-auto px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 text-xs">
                        Ready
                      </span>
                    </div>
                    <div className="text-sm leading-relaxed text-foreground font-mono whitespace-pre-line">
                      {refinedPrompt.split("\n").map((line, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: i * 0.1 }}
                        >
                          {line}
                        </motion.div>
                      ))}
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground/60">
                      <span className="px-2 py-1 rounded-md bg-green-500/10 text-green-600">
                        18 words
                      </span>
                      <span className="px-2 py-1 rounded-md bg-green-500/10 text-green-600">
                        ~95 tokens
                      </span>
                      <span className="ml-auto text-green-600 font-medium">
                        75% reduction
                      </span>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="glass rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-3 h-3 rounded-full bg-muted animate-pulse" />
                    <span className="text-sm font-medium text-muted-foreground">
                      Optimized Prompt
                    </span>
                  </div>
                  <div className="space-y-3">
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="h-4 rounded bg-muted/50"
                        style={{ width: `${62 + ((i * 11) % 34)}%` }}
                        animate={{ opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
