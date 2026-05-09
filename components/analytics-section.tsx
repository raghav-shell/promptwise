"use client"

import { motion, useInView, useSpring, useTransform } from "framer-motion"
import { useRef, useEffect, useState } from "react"
import { TrendingDown, Zap, Target, Sparkles, BarChart3 } from "lucide-react"

function AnimatedCounter({ value, suffix = "", prefix = "" }: { value: number; suffix?: string; prefix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })
  const spring = useSpring(0, { duration: 2000 })
  const display = useTransform(spring, (current) => Math.floor(current))
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    if (isInView) {
      spring.set(value)
    }
  }, [isInView, spring, value])

  useEffect(() => {
    const unsubscribe = display.on("change", (latest) => {
      setDisplayValue(latest)
    })
    return unsubscribe
  }, [display])

  return (
    <span ref={ref}>
      {prefix}{displayValue}{suffix}
    </span>
  )
}

const metrics = [
  {
    icon: TrendingDown,
    label: "Token Reduction",
    value: 38,
    suffix: "%",
    description: "Average savings per prompt",
    color: "from-cyan to-cyan/50",
    bgColor: "bg-cyan/10",
    textColor: "text-cyan",
  },
  {
    icon: Zap,
    label: "Cost Savings",
    value: 42,
    suffix: "%",
    prefix: "~",
    description: "Estimated API cost reduction",
    color: "from-green-400 to-green-400/50",
    bgColor: "bg-green-400/10",
    textColor: "text-green-500",
  },
  {
    icon: Target,
    label: "Clarity Score",
    value: 94,
    suffix: "/100",
    description: "Prompt optimization rating",
    color: "from-indigo to-indigo/50",
    bgColor: "bg-indigo/10",
    textColor: "text-indigo",
  },
  {
    icon: Sparkles,
    label: "Redundancy Removed",
    value: 67,
    suffix: "%",
    description: "Unnecessary words eliminated",
    color: "from-pink to-pink/50",
    bgColor: "bg-pink/10",
    textColor: "text-pink",
  },
]

const tokenBreakdown = [
  { label: "Instructions", original: 180, optimized: 45, color: "bg-indigo" },
  { label: "Context", original: 120, optimized: 30, color: "bg-cyan" },
  { label: "Examples", original: 60, optimized: 15, color: "bg-lavender" },
  { label: "Formatting", original: 20, optimized: 5, color: "bg-pink" },
]

export function AnalyticsSection() {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <section
      id="features"
      ref={containerRef}
      className="relative py-32 px-4 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/4 -left-32 w-[600px] h-[600px] bg-cyan/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-32 right-0 w-[500px] h-[500px] bg-pink/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity, delay: 1 }}
        />
      </div>

      {/* Floating decorative elements */}
      <motion.div
        initial={{ opacity: 0, rotate: -12 }}
        whileInView={{ opacity: 1, rotate: -12 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="absolute top-24 right-[10%] hidden xl:block"
      >
        <div className="glass rounded-lg p-2 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-cyan" />
          <span className="text-xs text-muted-foreground">Live metrics</span>
        </div>
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Asymmetric header + metrics layout */}
        <div className="grid lg:grid-cols-12 gap-8 mb-20">
          {/* Section Header - Right aligned this time for variety */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 lg:col-start-7 text-left lg:text-right"
          >
            <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight mb-4 text-balance">
              Real savings, <span className="text-gradient">real clarity</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-md lg:ml-auto">
              Every optimization is measured. See exactly what PromptWise saves you.
            </p>
          </motion.div>
          
          {/* Large featured metric - overlapping left side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-4 lg:col-start-1 lg:row-start-1 flex items-center"
          >
            <div className="relative w-full">
              {/* Layered card effect */}
              <div className="absolute -top-2 -left-2 w-full h-full glass rounded-3xl opacity-30 rotate-3" />
              <div className="relative glass-strong rounded-3xl p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-400/20 to-green-400/5 flex items-center justify-center">
                    <Zap className="w-7 h-7 text-green-500" />
                  </div>
                </div>
                <div className="text-5xl font-bold text-green-500 mb-2">
                  <AnimatedCounter value={42} suffix="%" prefix="~" />
                </div>
                <div className="text-lg font-medium text-foreground mb-1">Cost Savings</div>
                <div className="text-sm text-muted-foreground">Estimated API cost reduction</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Metrics Cards - Staggered grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 mb-16">
          {metrics.slice(0, 1).map((metric, i) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="lg:col-span-3 lg:col-start-1 glass-strong rounded-2xl p-6 group cursor-default"
            >
              <div className={`w-10 h-10 rounded-xl ${metric.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <metric.icon className={`w-5 h-5 ${metric.textColor}`} />
              </div>
              <div className={`text-3xl font-semibold ${metric.textColor} mb-1`}>
                <AnimatedCounter value={metric.value} suffix={metric.suffix} prefix={metric.prefix || ""} />
              </div>
              <div className="text-sm font-medium text-foreground mb-1">{metric.label}</div>
              <div className="text-xs text-muted-foreground">{metric.description}</div>
            </motion.div>
          ))}
          
          {metrics.slice(2, 3).map((metric, i) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="lg:col-span-3 lg:col-start-4 lg:translate-y-8 glass-strong rounded-2xl p-6 group cursor-default"
            >
              <div className={`w-10 h-10 rounded-xl ${metric.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <metric.icon className={`w-5 h-5 ${metric.textColor}`} />
              </div>
              <div className={`text-3xl font-semibold ${metric.textColor} mb-1`}>
                <AnimatedCounter value={metric.value} suffix={metric.suffix} prefix={metric.prefix || ""} />
              </div>
              <div className="text-sm font-medium text-foreground mb-1">{metric.label}</div>
              <div className="text-xs text-muted-foreground">{metric.description}</div>
            </motion.div>
          ))}
          
          {metrics.slice(3).map((metric, i) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="lg:col-span-3 lg:col-start-7 glass-strong rounded-2xl p-6 group cursor-default"
            >
              <div className={`w-10 h-10 rounded-xl ${metric.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <metric.icon className={`w-5 h-5 ${metric.textColor}`} />
              </div>
              <div className={`text-3xl font-semibold ${metric.textColor} mb-1`}>
                <AnimatedCounter value={metric.value} suffix={metric.suffix} prefix={metric.prefix || ""} />
              </div>
              <div className="text-sm font-medium text-foreground mb-1">{metric.label}</div>
              <div className="text-xs text-muted-foreground">{metric.description}</div>
            </motion.div>
          ))}
        </div>

        {/* Token Visualization - Asymmetric two-column */}
        <div className="grid lg:grid-cols-12 gap-6 items-start">
          {/* Token breakdown - left side with offset */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="lg:col-span-7 lg:col-start-1"
          >
            <div className="glass-strong rounded-3xl p-8">
              <h3 className="text-xl font-semibold mb-8">Token Breakdown</h3>
              <div className="space-y-6">
                {tokenBreakdown.map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                    className="space-y-2"
                  >
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{item.label}</span>
                      <span className="text-foreground font-mono">
                        {item.original} → {item.optimized}
                      </span>
                    </div>
                    <div className="relative h-2.5 bg-muted/50 rounded-full overflow-hidden">
                      <motion.div
                        className={`absolute inset-y-0 left-0 ${item.color} rounded-full opacity-30`}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${(item.original / 200) * 100}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                      />
                      <motion.div
                        className={`absolute inset-y-0 left-0 ${item.color} rounded-full`}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${(item.optimized / 200) * 100}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.8 + i * 0.1 }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Summary Card - right side, floating higher */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="lg:col-span-4 lg:col-start-9 lg:-translate-y-12"
          >
            {/* Layered effect */}
            <div className="absolute -top-3 -right-3 w-full h-full glass rounded-3xl opacity-20 rotate-6" />
            
            <div className="relative bg-gradient-to-br from-indigo/10 via-cyan/10 to-pink/10 rounded-3xl p-8 border border-border/50">
              <div className="text-center">
                <div className="text-sm text-muted-foreground mb-4">Total Optimization</div>
                <div className="flex items-baseline justify-center gap-3 mb-2">
                  <span className="text-5xl font-bold text-gradient">380</span>
                  <span className="text-2xl text-muted-foreground">→</span>
                  <span className="text-5xl font-bold text-green-500">95</span>
                </div>
                <div className="text-sm text-muted-foreground mb-6">tokens reduced</div>
                <div className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-green-500/10 text-green-600">
                  <TrendingDown className="w-5 h-5" />
                  <span className="font-semibold text-lg">75% savings</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
