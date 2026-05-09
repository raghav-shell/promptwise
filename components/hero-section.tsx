"use client"

import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import { ArrowRight, Sparkles } from "lucide-react"

const placeholderPrompts = [
  "make a website that looks nice and has good colors...",
  "write code for an app that does stuff with data...",
  "create something that helps users do things faster...",
  "build a dashboard with charts and information...",
]

const analysisStages = [
  "Analyzing intent",
  "Removing redundancy",
  "Improving clarity",
  "Selecting optimal model",
]

const thinkingLogs = [
  "Analyzing user intent...",
  "Detecting redundant phrasing...",
  "Compressing token usage...",
  "Selecting optimal model...",
  "Generating refined instruction...",
]

const stageDurations = [700, 950, 900, 1100]

type OptimizationMetrics = {
  tokenSavings: number
  costReduction: number
  clarityImprovement: number
  score: number
  originalTokens: number
  optimizedTokens: number
}

type OptimizeApiResponse = {
  optimizedPrompt: string
  savings: number
  clarityScore: number
  recommendedModel: string
}

type PromptHistoryItem = {
  id: string
  originalPrompt: string
  optimizedPrompt: string
  recommendedModel: string
  timestamp: number
}

const HISTORY_STORAGE_KEY = "promptwise.prompt.history"
const HISTORY_MAX_ITEMS = 12

function createDeterministicParticles(count: number) {
  return Array.from({ length: count }, (_, i) => {
    const x = ((i * 37 + 13) % 100) + ((i % 3) * 0.173)
    const y = ((i * 53 + 29) % 100) + ((i % 4) * 0.211)
    const size = 2 + ((i * 7) % 5)
    const delay = (i * 0.37) % 5
    const duration = 8 + ((i * 1.13) % 5)
    return {
      id: i,
      x: `${x.toFixed(3)}%`,
      y: `${y.toFixed(3)}%`,
      size,
      delay,
      duration,
    }
  })
}

function optimizePromptText(prompt: string) {
  let cleaned = prompt
    .replace(/\s+/g, " ")
    .replace(/\b(really|very|just|basically|actually)\b/gi, "")
    .replace(/\s+,/g, ",")
    .replace(/\s+\./g, ".")
    .trim()

  const lower = cleaned.toLowerCase()
  const type =
    /code|build|react|api|function|debug|app/.test(lower)
      ? "coding"
      : /copy|campaign|email|ad|post|brand|marketing/.test(lower)
        ? "marketing"
        : /analy[sz]e|summarize|report|data|research|insight/.test(lower)
          ? "analysis"
          : "general"

  if (type === "coding") {
    cleaned = `Act as a senior software engineer.\nGoal: ${cleaned}\nConstraints: Keep output production-ready, explain assumptions, and include edge cases.`
  } else if (type === "marketing") {
    cleaned = `Act as a conversion-focused marketer.\nTask: ${cleaned}\nRequirements: Use clear CTA language, concise messaging, and audience-specific positioning.`
  } else if (type === "analysis") {
    cleaned = `Act as an analytical assistant.\nObjective: ${cleaned}\nOutput format: Key findings, risks, opportunities, and a short recommendation.`
  } else {
    cleaned = `You are an expert AI assistant.\nRequest: ${cleaned}\nDeliverable: Structured, concise response with actionable next steps.`
  }

  return { cleaned, type }
}

function recommendModel(promptType: string) {
  if (promptType === "coding") return "GPT-4.1 / o3-mini-high"
  if (promptType === "marketing") return "Claude 3.5 Sonnet"
  if (promptType === "analysis") return "Claude 3 Opus"
  return "GPT-4o"
}

function generateMetrics(original: string, optimized: string): OptimizationMetrics {
  const originalWords = original.trim().split(/\s+/).filter(Boolean).length || 1
  const optimizedWords = optimized.trim().split(/\s+/).filter(Boolean).length || 1
  const originalTokens = Math.round(originalWords * 22.5)
  const optimizedTokens = Math.round(Math.max(optimizedWords * 12, originalTokens * 0.54))
  const tokenSavings = Math.max(18, Math.min(62, Math.round(((originalTokens - optimizedTokens) / originalTokens) * 100)))
  const costReduction = Math.max(14, Math.min(58, Math.round(tokenSavings * 0.82)))
  const clarityImprovement = Math.max(22, Math.min(74, Math.round(tokenSavings * 0.9 + 12)))
  const score = Math.max(80, Math.min(98, Math.round((tokenSavings + clarityImprovement + costReduction) / 3 + 32)))
  return { tokenSavings, costReduction, clarityImprovement, score, originalTokens, optimizedTokens }
}

function mapApiResponseToMetrics(data: OptimizeApiResponse, originalPrompt: string): OptimizationMetrics {
  const originalTokens = Math.max(1, Math.round(originalPrompt.trim().split(/\s+/).filter(Boolean).length * 22.5))
  const tokenSavings = Math.max(0, Math.min(80, Math.round(data.savings)))
  const optimizedTokens = Math.max(1, Math.round(originalTokens * (1 - tokenSavings / 100)))
  const costReduction = Math.max(0, Math.round(data.savings))
  const clarityImprovement = Math.max(1, Math.min(100, Math.round(data.clarityScore)))
  const score = Math.max(1, Math.min(100, Math.round((tokenSavings + costReduction + clarityImprovement) / 3)))
  return {
    tokenSavings,
    costReduction,
    clarityImprovement,
    score,
    originalTokens,
    optimizedTokens,
  }
}

function formatHistoryTime(timestamp: number) {
  return new Date(timestamp).toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}

function splitIntoPhrases(text: string) {
  const chunks = text
    .split(/(?<=[.!?])\s+|\n/)
    .flatMap((segment) => {
      const trimmed = segment.trim()
      if (!trimmed) return []
      const words = trimmed.split(/\s+/)
      if (words.length <= 6) return [trimmed]
      const grouped: string[] = []
      for (let i = 0; i < words.length; i += 4) {
        grouped.push(words.slice(i, i + 4).join(" "))
      }
      return grouped
    })
  return chunks.length ? chunks : [text]
}

function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    let frame = 0
    const duration = 900
    const start = performance.now()

    const animate = (time: number) => {
      const progress = Math.min((time - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplayValue(Math.round(value * eased))
      if (progress < 1) {
        frame = requestAnimationFrame(animate)
      }
    }

    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [value])

  return <span>{displayValue}{suffix}</span>
}

// Particle component for subtle ambient motion
function Particle({ delay, duration, x, y, size }: { delay: number; duration: number; x: string; y: string; size: number }) {
  return (
    <motion.div
      className="absolute rounded-full bg-gradient-to-br from-lavender/40 to-cyan/30"
      style={{
        width: size,
        height: size,
        left: x,
        top: y,
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 0.6, 0.3, 0.6, 0],
        scale: [0.5, 1, 0.8, 1, 0.5],
        y: [0, -30, -10, -40, 0],
        x: [0, 10, -5, 15, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  )
}

// Floating AI Orb centerpiece
function AIOrb({ mouseX, mouseY }: { mouseX: ReturnType<typeof useMotionValue<number>>; mouseY: ReturnType<typeof useMotionValue<number>> }) {
  const orbRef = useRef<HTMLDivElement>(null)
  
  const springConfig = { damping: 25, stiffness: 150 }
  const orbX = useSpring(useMotionValue(0), springConfig)
  const orbY = useSpring(useMotionValue(0), springConfig)

  useEffect(() => {
    const unsubX = mouseX.on("change", (latest) => {
      if (orbRef.current) {
        const rect = orbRef.current.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const deltaX = (latest - centerX) * 0.02
        orbX.set(deltaX)
      }
    })
    const unsubY = mouseY.on("change", (latest) => {
      if (orbRef.current) {
        const rect = orbRef.current.getBoundingClientRect()
        const centerY = rect.top + rect.height / 2
        const deltaY = (latest - centerY) * 0.02
        orbY.set(deltaY)
      }
    })
    return () => {
      unsubX()
      unsubY()
    }
  }, [mouseX, mouseY, orbX, orbY])

  return (
    <motion.div
      ref={orbRef}
      className="absolute -z-10 w-[500px] h-[500px] -top-20"
      style={{ x: orbX, y: orbY }}
    >
      {/* Outer glow rings */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: "radial-gradient(circle, oklch(0.80 0.12 290 / 0.15) 0%, transparent 70%)",
        }}
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.5, 0.3, 0.5],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Secondary glow */}
      <motion.div
        className="absolute inset-8 rounded-full"
        style={{
          background: "radial-gradient(circle, oklch(0.82 0.12 200 / 0.2) 0%, transparent 60%)",
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.6, 0.4, 0.6],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />

      {/* Inner core orb */}
      <motion.div
        className="absolute inset-16 rounded-full overflow-hidden"
        style={{
          background: "linear-gradient(135deg, oklch(0.90 0.08 290 / 0.6) 0%, oklch(0.88 0.10 200 / 0.5) 50%, oklch(0.85 0.08 270 / 0.55) 100%)",
          border: "1px solid oklch(1 0 0 / 0.2)",
          boxShadow: "inset 0 0 60px oklch(1 0 0 / 0.3), 0 0 80px oklch(0.70 0.15 270 / 0.2)",
        }}
        animate={{
          rotate: [0, 360],
        }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      >
        {/* Inner shine */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, oklch(1 0 0 / 0.4) 0%, transparent 50%, oklch(1 0 0 / 0.1) 100%)",
          }}
        />
        
        {/* Animated gradient overlay */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: "conic-gradient(from 0deg, oklch(0.85 0.12 290 / 0.3), oklch(0.85 0.12 200 / 0.3), oklch(0.85 0.10 350 / 0.2), oklch(0.85 0.12 290 / 0.3))",
          }}
          animate={{
            rotate: [0, -360],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
      </motion.div>

      {/* Floating glass cards around orb */}
      <motion.div
        className="absolute top-1/4 -left-8 w-24 h-16 rounded-xl"
        style={{
          background: "oklch(0.98 0.005 270 / 0.5)",
          backdropFilter: "blur(20px)",
          border: "1px solid oklch(1 0 0 / 0.3)",
        }}
        animate={{
          y: [0, -15, 0],
          rotate: [-5, -8, -5],
          opacity: [0.7, 0.5, 0.7],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <motion.div
        className="absolute top-1/3 -right-4 w-20 h-12 rounded-xl"
        style={{
          background: "oklch(0.98 0.005 270 / 0.4)",
          backdropFilter: "blur(20px)",
          border: "1px solid oklch(1 0 0 / 0.25)",
        }}
        animate={{
          y: [0, 12, 0],
          rotate: [5, 10, 5],
          opacity: [0.6, 0.4, 0.6],
        }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      
      <motion.div
        className="absolute bottom-1/4 left-1/4 w-16 h-10 rounded-lg"
        style={{
          background: "oklch(0.98 0.005 270 / 0.35)",
          backdropFilter: "blur(15px)",
          border: "1px solid oklch(1 0 0 / 0.2)",
        }}
        animate={{
          y: [0, -10, 0],
          x: [0, 8, 0],
          opacity: [0.5, 0.3, 0.5],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
    </motion.div>
  )
}

export function HeroSection({ showHistory = false }: { showHistory?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, 200])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, 100])

  // Mouse tracking for lighting effect
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springConfig = { damping: 30, stiffness: 200 }
  const mouseXSpring = useSpring(mouseX, springConfig)
  const mouseYSpring = useSpring(mouseY, springConfig)

  const [currentPrompt, setCurrentPrompt] = useState("")
  const [promptIndex, setPromptIndex] = useState(0)
  const [isTyping, setIsTyping] = useState(true)
  const [userPrompt, setUserPrompt] = useState("")
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [analysisStep, setAnalysisStep] = useState(0)
  const [activeLogIndex, setActiveLogIndex] = useState(-1)
  const [optimizedPrompt, setOptimizedPrompt] = useState("")
  const [displayedOptimizedPrompt, setDisplayedOptimizedPrompt] = useState("")
  const [recommendedModel, setRecommendedModel] = useState("")
  const [metrics, setMetrics] = useState<OptimizationMetrics | null>(null)
  const [reasoning, setReasoning] = useState("")
  const [isCopied, setIsCopied] = useState(false)
  const [history, setHistory] = useState<PromptHistoryItem[]>([])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [mouseX, mouseY])

  useEffect(() => {
    const targetPrompt = placeholderPrompts[promptIndex]
    
    if (isTyping) {
      if (currentPrompt.length < targetPrompt.length) {
        const timeout = setTimeout(() => {
          setCurrentPrompt(targetPrompt.slice(0, currentPrompt.length + 1))
        }, 40)
        return () => clearTimeout(timeout)
      } else {
        const timeout = setTimeout(() => setIsTyping(false), 2000)
        return () => clearTimeout(timeout)
      }
    } else {
      if (currentPrompt.length > 0) {
        const timeout = setTimeout(() => {
          setCurrentPrompt(currentPrompt.slice(0, -1))
        }, 20)
        return () => clearTimeout(timeout)
      } else {
        setPromptIndex((prev) => (prev + 1) % placeholderPrompts.length)
        setIsTyping(true)
      }
    }
  }, [currentPrompt, isTyping, promptIndex])

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(HISTORY_STORAGE_KEY)
      if (!stored) return
      const parsed = JSON.parse(stored) as PromptHistoryItem[]
      if (Array.isArray(parsed)) {
        setHistory(parsed.slice(0, HISTORY_MAX_ITEMS))
      }
    } catch {
      setHistory([])
    }
  }, [])

  const pushToHistory = (item: Omit<PromptHistoryItem, "id" | "timestamp">) => {
    setHistory((prev) => {
      const next: PromptHistoryItem[] = [
        {
          ...item,
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          timestamp: Date.now(),
        },
        ...prev,
      ].slice(0, HISTORY_MAX_ITEMS)
      window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }

  const deleteHistoryItem = (id: string) => {
    setHistory((prev) => {
      const next = prev.filter((item) => item.id !== id)
      window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }

  const loadHistoryItem = (item: PromptHistoryItem) => {
    setUserPrompt(item.originalPrompt)
    setOptimizedPrompt(item.optimizedPrompt)
    setDisplayedOptimizedPrompt(item.optimizedPrompt)
    setRecommendedModel(item.recommendedModel)
    setReasoning("")
    setIsCopied(false)
    setMetrics(generateMetrics(item.originalPrompt, item.optimizedPrompt))
  }

  const handleOptimize = async () => {
    const input = userPrompt.trim()
    if (!input || isOptimizing) return

    setIsOptimizing(true)
    setAnalysisStep(0)
    setActiveLogIndex(0)
    setOptimizedPrompt("")
    setDisplayedOptimizedPrompt("")
    setRecommendedModel("")
    setMetrics(null)
    setReasoning("")
    setIsCopied(false)

    let elapsed = 0
    stageDurations.forEach((duration, index) => {
      if (index === 0) return
      elapsed += stageDurations[index - 1]
      window.setTimeout(() => {
        setAnalysisStep(index)
      }, elapsed)
    })

    thinkingLogs.forEach((_, index) => {
      window.setTimeout(() => {
        setActiveLogIndex(index)
      }, index * 520 + 180)
    })

    const totalDuration = stageDurations.reduce((sum, value) => sum + value, 0) + 450

    const apiRequest = fetch("/api/optimize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: input }),
    })
      .then(async (res) => {
        const payload = await res.json().catch(() => null)
        if (!res.ok) {
          throw new Error(payload?.error || "Optimization failed")
        }
        return payload as OptimizeApiResponse
      })

    const minAnimationDelay = new Promise((resolve) => window.setTimeout(resolve, totalDuration))

    const [apiResult] = await Promise.allSettled([apiRequest, minAnimationDelay])

    if (apiResult.status === "fulfilled") {
      const data = apiResult.value
      setOptimizedPrompt(data.optimizedPrompt)
      setRecommendedModel(data.recommendedModel)
      setMetrics(mapApiResponseToMetrics(data, input))
      setReasoning("")
      pushToHistory({
        originalPrompt: input,
        optimizedPrompt: data.optimizedPrompt,
        recommendedModel: data.recommendedModel,
      })
    } else {
      const { cleaned, type } = optimizePromptText(input)
      setOptimizedPrompt(cleaned)
      setRecommendedModel(recommendModel(type))
      setMetrics(generateMetrics(input, cleaned))
      setReasoning("Using local optimization fallback because the API request did not complete.")
      pushToHistory({
        originalPrompt: input,
        optimizedPrompt: cleaned,
        recommendedModel: recommendModel(type),
      })
    }

    setIsOptimizing(false)
    setActiveLogIndex(thinkingLogs.length - 1)
  }

  useEffect(() => {
    if (!optimizedPrompt) return
    const chunks = splitIntoPhrases(optimizedPrompt)
    let index = 0
    setDisplayedOptimizedPrompt("")
    const stream = window.setInterval(() => {
      const currentIndex = index
      setDisplayedOptimizedPrompt((prev) => `${prev}${prev ? " " : ""}${chunks[currentIndex]}`)
      index += 1
      if (index >= chunks.length) {
        window.clearInterval(stream)
      }
    }, 120)
    return () => window.clearInterval(stream)
  }, [optimizedPrompt])

  const handleCopyOptimized = async () => {
    if (!optimizedPrompt) return
    try {
      await navigator.clipboard.writeText(optimizedPrompt)
      setIsCopied(true)
      window.setTimeout(() => setIsCopied(false), 1800)
    } catch {
      setIsCopied(false)
    }
  }

  // Keep SSR/CSR output stable to avoid hydration mismatches.
  const particles = createDeterministicParticles(20)

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-32 pb-20 overflow-hidden"
    >
      {/* Premium subtle grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)] z-0 pointer-events-none" />

      {/* Mouse-follow lighting effect */}
      <motion.div
        className="pointer-events-none fixed z-0 rounded-full blur-[80px] will-change-transform"
        style={{
          width: 800,
          height: 800,
          left: -400,
          top: -400,
          x: mouseXSpring,
          y: mouseYSpring,
          background: "oklch(0.70 0.15 160 / 0.10)",
        }}
      />

      {/* Animated Background Orbs with parallax */}
      <motion.div 
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{ y: backgroundY }}
      >
        <motion.div
          className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-emerald-500/15 rounded-full blur-[100px]"
          style={{ willChange: "transform" }}
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-0 right-0 w-[700px] h-[700px] bg-teal-500/15 rounded-full blur-[120px]"
          style={{ willChange: "transform" }}
          animate={{
            x: [0, -60, 0],
            y: [0, 40, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
        <motion.div
          className="absolute -bottom-20 left-1/4 w-[500px] h-[500px] bg-emerald-400/10 rounded-full blur-[80px]"
          style={{ willChange: "transform" }}
          animate={{
            x: [0, 30, 0],
            y: [0, -40, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4,
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-teal-400/10 rounded-full blur-[60px]"
          style={{ willChange: "transform" }}
          animate={{
            x: [0, -35, 0],
            y: [0, 25, 0],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />

        {/* Subtle particles */}
        {particles.map((particle) => (
          <Particle key={particle.id} {...particle} />
        ))}
      </motion.div>

      {/* Main Content */}
      <motion.div
        style={{ y, opacity }}
        className="relative z-20 max-w-5xl mx-auto text-center"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 mb-8 glass rounded-full"
        >
          <Sparkles className="w-4 h-4 text-indigo" />
          <span className="text-sm text-muted-foreground">
            Intelligent Prompt Optimization
          </span>
        </motion.div>

        {/* Main Headline with animated glow */}
        <div className="relative">
          {/* Headline glow effect */}
          <motion.div
            className="absolute inset-0 -z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[200px] rounded-full blur-[80px]"
              style={{
                background: "linear-gradient(90deg, oklch(0.70 0.15 160 / 0.2), oklch(0.60 0.10 200 / 0.2), oklch(0.70 0.15 160 / 0.2))",
              }}
              animate={{
                opacity: [0.4, 0.6, 0.4],
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.1] mb-6 text-balance"
          >
            <span className="text-foreground">Clarity for the</span>
            <br />
            <motion.span
              className="text-gradient relative inline-block"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              style={{
                backgroundSize: "200% 200%",
              }}
            >
              AI era.
            </motion.span>
          </motion.h1>
        </div>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed text-pretty"
        >
          Transform messy prompts into clear, optimized AI instructions.
          <br className="hidden sm:block" />
          Reduce token costs and discover the perfect model for every task.
        </motion.p>

        {/* Interactive Prompt Input with AI Orb centerpiece */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="relative z-20 max-w-2xl mx-auto"
        >
          {/* AI Orb centerpiece behind prompt box */}
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center pointer-events-none">
            <AIOrb mouseX={mouseX} mouseY={mouseY} />
          </div>
          
          <div className="glass-strong rounded-2xl p-2 shadow-2xl shadow-indigo/5 relative z-10 overflow-hidden group focus-within:ring-1 focus-within:ring-indigo/40 focus-within:shadow-indigo/10 transition-all duration-500 hover:shadow-indigo/10">
            <div className="relative">
              <div className="flex items-start gap-3 p-4 min-h-[120px]">
                <div className="flex-shrink-0 w-8 h-8 rounded-md bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.15)]">
                  <span className="text-base font-bold text-emerald-400 animate-pulse">_</span>
                </div>
                <div className="flex-1 pt-1 text-left">
                  <textarea
                    id="prompt-input"
                    value={userPrompt}
                    onChange={(e) => setUserPrompt(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleOptimize()
                      }
                    }}
                    placeholder={currentPrompt}
                    className="w-full resize-none bg-transparent outline-none text-base font-mono text-foreground min-h-[72px] placeholder:text-muted-foreground/40"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between px-4 pb-4 pt-2 border-t border-border/50">
                <div className="flex items-center gap-2 text-xs text-muted-foreground/70">
                  <motion.span
                    className="w-2 h-2 rounded-full bg-emerald-400"
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.7, 1, 0.7],
                    }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={isOptimizing ? analysisStages[analysisStep] : "ready"}
                      initial={{ opacity: 0, y: 5, filter: "blur(4px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, y: -5, filter: "blur(4px)" }}
                      transition={{ duration: 0.3 }}
                    >
                      {isOptimizing ? analysisStages[analysisStep] : "Ready to optimize your prompt"}
                    </motion.span>
                  </AnimatePresence>
                </div>
                <MagneticButton>
                  <motion.span
                    onClick={handleOptimize}
                    className="btn-magnetic flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-medium rounded-xl shadow-lg shadow-emerald-500/20 cursor-pointer relative overflow-hidden group"
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Liquid hover effect */}
                    <motion.span
                      className="absolute inset-0 bg-gradient-to-r from-teal-400/20 to-emerald-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    />
                    {/* Glow effect */}
                    <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl bg-gradient-to-r from-emerald-400/40 to-teal-400/40" />
                    <span className="relative z-10">{isOptimizing ? "Optimizing..." : "Optimize"}</span>
                    <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-0.5 transition-transform" />
                  </motion.span>
                </MagneticButton>
              </div>
            </div>

            <AnimatePresence>
              {isOptimizing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 pointer-events-none"
                >
                  <motion.div
                    className="absolute inset-0"
                    style={{
                      background: "linear-gradient(120deg, transparent 30%, oklch(0.88 0.1 270 / 0.2) 50%, transparent 70%)",
                    }}
                    animate={{ x: ["-120%", "140%"] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  />
                  <div className="absolute inset-0 backdrop-blur-[2px]" />
                  <motion.div
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 rounded-full"
                    style={{
                      border: "1px solid oklch(1 0 0 / 0.25)",
                      background: "radial-gradient(circle, oklch(0.9 0.08 280 / 0.25), transparent 70%)",
                    }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  >
                    <motion.div
                      className="absolute inset-3 rounded-full border border-cyan/40"
                      animate={{ rotate: -360 }}
                      transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
                    />
                  </motion.div>
                  <div className="absolute left-4 bottom-4 right-4 text-left">
                    <div className="space-y-1.5">
                      {thinkingLogs.map((log, index) => (
                        <motion.p
                          key={log}
                          initial={{ opacity: 0.2, y: 8 }}
                          animate={{
                            opacity: index <= activeLogIndex ? (index === activeLogIndex ? 1 : 0.45) : 0.1,
                            y: index <= activeLogIndex ? 0 : 8,
                          }}
                          transition={{ duration: 0.35, delay: index * 0.06 }}
                          className="text-[11px] font-mono text-muted-foreground/90"
                        >
                          {index <= activeLogIndex ? ">" : ""} {log}
                        </motion.p>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence mode="wait">
            {optimizedPrompt && !isOptimizing && (
              <motion.div
                key="optimized-panel"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="mt-6 space-y-4"
              >
                <div className="glass rounded-2xl p-4 border border-white/20">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground/70">Optimized Prompt</p>
                    <MagneticButton>
                      <motion.button
                        type="button"
                        onClick={handleCopyOptimized}
                        whileTap={{ scale: 0.96 }}
                        animate={isCopied ? { boxShadow: "0 0 24px oklch(0.84 0.12 230 / 0.45)" } : { boxShadow: "0 0 0px oklch(0.84 0.12 230 / 0)" }}
                        transition={{ duration: 0.35 }}
                        className="text-[11px] px-3 py-1.5 rounded-lg border border-white/20 bg-white/5 text-muted-foreground hover:text-foreground relative overflow-hidden"
                      >
                        <motion.span
                          className="absolute inset-0 bg-gradient-to-r from-cyan/20 to-indigo/20"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: isCopied ? [0, 0.8, 0] : 0 }}
                          transition={{ duration: 0.8 }}
                        />
                        <AnimatePresence mode="wait">
                          <motion.span
                            key={isCopied ? "copied" : "copy"}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.2 }}
                            className="relative z-10"
                          >
                            {isCopied ? "Copied" : "Copy optimized"}
                          </motion.span>
                        </AnimatePresence>
                      </motion.button>
                    </MagneticButton>
                  </div>
                  <motion.p
                    initial={{ opacity: 0, filter: "blur(6px)" }}
                    animate={{ opacity: 1, filter: "blur(0px)" }}
                    transition={{ duration: 0.45 }}
                    className="text-left text-sm text-foreground/90 whitespace-pre-line"
                  >
                    {displayedOptimizedPrompt}
                    {displayedOptimizedPrompt !== optimizedPrompt && (
                      <motion.span
                        animate={{ opacity: [1, 0.2, 1] }}
                        transition={{ duration: 0.7, repeat: Infinity }}
                        className="inline-block w-0.5 h-4 ml-1 bg-indigo align-middle"
                      />
                    )}
                  </motion.p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {metrics &&
                    [
                      { label: "Token savings", value: `${metrics.tokenSavings}%`, color: "from-cyan/25 to-cyan/10" },
                      { label: "Cost reduction", value: `${metrics.costReduction}%`, color: "from-emerald-400/25 to-emerald-300/10" },
                      { label: "Clarity boost", value: `${metrics.clarityImprovement}%`, color: "from-lavender/25 to-indigo/10" },
                      { label: "Optimization score", value: `${metrics.score}/100`, color: "from-indigo/30 to-cyan/10" },
                    ].map((card, index) => (
                      <motion.div
                        key={card.label}
                        initial={{ opacity: 0, y: 24, scale: 0.94, filter: "blur(6px)" }}
                        animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                        transition={{ duration: 0.5, delay: 0.14 * index, ease: "easeOut" }}
                        whileHover={{ y: -4, scale: 1.02 }}
                        className={`glass rounded-xl p-3 text-left bg-gradient-to-br ${card.color} border border-white/20`}
                      >
                        <p className="text-[11px] uppercase tracking-wide text-muted-foreground/70">{card.label}</p>
                        <p className="text-lg font-semibold mt-1 text-foreground">
                          {card.label === "Optimization score" ? (
                            <>
                              <AnimatedCounter value={metrics.score} />
                              /100
                            </>
                          ) : (
                            <AnimatedCounter value={Number.parseInt(card.value, 10)} suffix="%" />
                          )}
                        </p>
                      </motion.div>
                    ))}
                </div>

                {metrics && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.25 }}
                    className="glass rounded-xl p-3 border border-white/20 text-left"
                  >
                    <p className="text-xs text-muted-foreground/70 uppercase tracking-wider mb-1">Token footprint</p>
                    <p className="text-sm text-foreground flex items-center gap-2">
                      <span className="font-semibold text-muted-foreground">
                        <AnimatedCounter value={metrics.originalTokens} />
                      </span>
                      <motion.span
                        animate={{ x: [0, 3, 0], opacity: [0.6, 1, 0.6] }}
                        transition={{ duration: 1.1, repeat: Infinity }}
                        className="text-cyan"
                      >
                        →
                      </motion.span>
                      <span className="font-semibold text-indigo">
                        <AnimatedCounter value={metrics.optimizedTokens} />
                      </span>
                    </p>
                  </motion.div>
                )}

                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="glass rounded-xl p-3 border border-white/20 text-left"
                >
                  <p className="text-xs text-muted-foreground/70 uppercase tracking-wider mb-1">Best model recommendation</p>
                  <p className="text-sm text-foreground">
                    <span className="font-semibold text-indigo">{recommendedModel}</span>
                    {" "}for this prompt category.
                  </p>
                  {reasoning && <p className="text-xs text-muted-foreground/80 mt-1">{reasoning}</p>}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Floating Preview Cards */}
          {!optimizedPrompt && (
            <>
              <motion.div
                initial={{ opacity: 0, x: -30, y: -8 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 0.9, delay: 0.8 }}
                className="absolute -left-48 top-6 hidden xl:block pointer-events-none -z-10"
              >
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="glass rounded-xl p-3 shadow-lg"
                >
                  <div className="flex items-center gap-2 text-xs">
                    <span className="w-2 h-2 rounded-full bg-green-400" />
                    <span className="text-muted-foreground">38% tokens saved</span>
                  </div>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30, y: -8 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 0.9, delay: 0.9 }}
                className="absolute -right-48 top-8 hidden xl:block pointer-events-none -z-10"
              >
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  className="glass rounded-xl p-3 shadow-lg"
                >
                  <div className="flex items-center gap-2 text-xs">
                    <span className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo/20 to-cyan/20 flex items-center justify-center text-[10px] font-bold text-indigo">C</span>
                    <span className="text-muted-foreground">Claude recommended</span>
                  </div>
                </motion.div>
              </motion.div>
            </>
          )}
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="relative z-30 mt-32 max-w-4xl mx-auto w-full px-4"
        >
          {/* Subtle premium divider */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-border/60 to-transparent mb-10" />
          
          <div className="flex flex-col items-center justify-center gap-8">
            <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/60 font-semibold">
              Powering next-generation AI teams
            </span>
            
            <div className="flex flex-wrap items-center justify-center gap-12 sm:gap-20">
              {/* Vercel Logo */}
              <div className="flex items-center gap-1.5 text-muted-foreground/60 hover:text-foreground transition-colors duration-300 cursor-default">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L24 22H0L12 2Z"/></svg>
                <span className="text-2xl font-black tracking-tighter">Vercel</span>
              </div>
              
              {/* Linear Logo */}
              <div className="flex items-center text-muted-foreground/60 hover:text-foreground transition-colors duration-300 cursor-default">
                <span className="text-2xl font-bold tracking-tight">Linear</span>
              </div>
              
              {/* Notion Logo */}
              <div className="flex items-center text-muted-foreground/60 hover:text-foreground transition-colors duration-300 cursor-default">
                <span className="text-2xl font-serif">Notion</span>
              </div>
              
              {/* Figma Logo */}
              <div className="flex items-center text-muted-foreground/60 hover:text-foreground transition-colors duration-300 cursor-default">
                <span className="text-xl font-bold tracking-widest">Figma</span>
              </div>
            </div>
          </div>
        </motion.div>

        <AnimatePresence>
          {showHistory && (
            <motion.aside
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.35 }}
              className="relative z-20 mt-8 max-w-2xl mx-auto xl:absolute xl:top-[15.5rem] xl:-right-[22rem] xl:mt-0 xl:w-80"
            >
              <div className="glass-strong rounded-2xl border border-white/20 p-3 md:p-4 shadow-xl shadow-indigo/10">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground/70">Prompt History</p>
                  <span className="text-[11px] text-muted-foreground/60">{history.length} saved</span>
                </div>

                <div className="max-h-52 md:max-h-72 overflow-auto space-y-2 pr-1">
                  <AnimatePresence initial={false}>
                    {history.length === 0 && (
                      <motion.p
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-xs text-muted-foreground/60 py-2"
                      >
                        Your optimized prompts will appear here.
                      </motion.p>
                    )}
                    {history.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 10, filter: "blur(5px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, y: -8, scale: 0.98 }}
                        transition={{ duration: 0.25, delay: index * 0.04 }}
                        className="glass rounded-xl border border-white/15 p-2.5"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <button
                            type="button"
                            onClick={() => loadHistoryItem(item)}
                            className="text-left flex-1"
                          >
                            <p className="text-[11px] text-muted-foreground/70 mb-1">{formatHistoryTime(item.timestamp)}</p>
                            <p className="text-xs text-foreground/85 line-clamp-2">{item.originalPrompt}</p>
                            <p className="text-[11px] text-indigo mt-1">{item.recommendedModel}</p>
                          </button>
                          <motion.button
                            type="button"
                            whileTap={{ scale: 0.92 }}
                            onClick={() => deleteHistoryItem(item.id)}
                            className="text-[11px] px-2 py-1 rounded-md border border-white/20 text-muted-foreground/70 hover:text-foreground hover:border-white/35"
                          >
                            Delete
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-10 rounded-full border-2 border-muted-foreground/20 flex justify-center pt-2"
        >
          <motion.div className="w-1 h-2 rounded-full bg-muted-foreground/40" />
        </motion.div>
      </motion.div>
    </section>
  )
}

// Magnetic button component for premium hover effect
function MagneticButton({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  
  const springConfig = { damping: 15, stiffness: 150 }
  const xSpring = useSpring(x, springConfig)
  const ySpring = useSpring(y, springConfig)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    x.set((e.clientX - centerX) * 0.15)
    y.set((e.clientY - centerY) * 0.15)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      style={{ x: xSpring, y: ySpring }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
    >
      {children}
    </motion.div>
  )
}
