"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useMotionValue, useSpring, useScroll, useMotionValueEvent } from "framer-motion"
import { Menu, X } from "lucide-react"

const navLinks = [
  { name: "Features", href: "#features" },
  { name: "How It Works", href: "#transform" },
  { name: "Use Cases", href: "#use-cases" },
]

// Magnetic button for premium hover effect
function MagneticNavButton({ children, className, onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) {
  const ref = useRef<HTMLButtonElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  
  const springConfig = { damping: 20, stiffness: 200 }
  const xSpring = useSpring(x, springConfig)
  const ySpring = useSpring(y, springConfig)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    x.set((e.clientX - centerX) * 0.1)
    y.set((e.clientY - centerY) * 0.1)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.button
      ref={ref}
      style={{ x: xSpring, y: ySpring }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={className}
      whileTap={{ scale: 0.97 }}
    >
      {children}
    </motion.button>
  )
}

export function Navbar({
  showHistory,
  onToggleHistory,
}: {
  showHistory: boolean
  onToggleHistory: () => void
}) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [hidden, setHidden] = useState(false)
  
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0
    if (latest > previous && latest > 150) {
      setHidden(true)
      setIsMobileMenuOpen(false)
    } else {
      setHidden(false)
    }
  })

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
      const progress = Math.min(window.scrollY / 200, 1)
      setScrollProgress(progress)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: hidden ? -100 : 0, opacity: hidden ? 0 : 1 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl transition-all duration-700 ${
          isScrolled ? "top-3" : "top-6"
        }`}
      >
        <motion.div
          className="relative rounded-2xl px-6 py-3 flex items-center justify-between overflow-hidden"
          style={{
            background: `oklch(0.98 0.005 270 / ${0.6 + scrollProgress * 0.2})`,
            backdropFilter: `blur(${20 + scrollProgress * 20}px)`,
            WebkitBackdropFilter: `blur(${20 + scrollProgress * 20}px)`,
            boxShadow: isScrolled 
              ? `0 8px 40px oklch(0.5 0.15 270 / ${0.08 + scrollProgress * 0.08}), inset 0 1px 0 oklch(1 0 0 / 0.5), inset 0 -1px 0 oklch(0.9 0.02 270 / 0.3)`
              : `inset 0 1px 0 oklch(1 0 0 / 0.4), inset 0 -1px 0 oklch(0.9 0.02 270 / 0.2)`,
            border: `1px solid oklch(1 0 0 / ${0.3 + scrollProgress * 0.15})`,
          }}
        >
          {/* Subtle animated gradient border effect */}
          <motion.div
            className="absolute inset-0 rounded-2xl opacity-0 pointer-events-none"
            style={{
              background: "linear-gradient(90deg, oklch(0.80 0.12 290 / 0.1), oklch(0.82 0.12 200 / 0.1), oklch(0.80 0.12 290 / 0.1))",
              backgroundSize: "200% 100%",
            }}
            animate={{
              backgroundPosition: ["0% 0%", "100% 0%", "0% 0%"],
              opacity: isScrolled ? 0.5 : 0,
            }}
            transition={{ 
              backgroundPosition: { duration: 5, repeat: Infinity, ease: "linear" },
              opacity: { duration: 0.5 }
            }}
          />

          {/* Logo */}
          <motion.a
            href="#"
            className="flex items-center gap-3 group relative z-10"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="relative flex items-center justify-center w-9 h-9 rounded-[10px] bg-gradient-to-br from-[#0F172A] to-[#020617] border border-white/10 shadow-[0_0_15px_rgba(16,185,129,0.15)] group-hover:shadow-[0_0_25px_rgba(16,185,129,0.3)] group-hover:border-emerald-500/30 transition-all duration-300">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-0.5 mt-0.5">
                <path d="M5 4C5 2.89543 5.89543 2 7 2H14.5C18.6421 2 22 5.35786 22 9.5C22 13.6421 18.6421 17 14.5 17H7V21C7 21.5523 6.55228 22 6 22C5.44772 22 5 21.5523 5 21V4Z" fill="url(#gradient-p)" opacity="0.9"/>
                <path d="M9 6.5L12.5 9.5L9 12.5" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M13.5 13.5H17" stroke="#34D399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="animate-pulse"/>
                <defs>
                  <linearGradient id="gradient-p" x1="5" y1="2" x2="22" y2="17" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#10B981"/>
                    <stop offset="1" stopColor="#0F766E"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 group-hover:from-emerald-400 group-hover:to-teal-500 transition-all duration-300">
              PromptWise
            </span>
          </motion.a>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1 relative z-10">
            {navLinks.map((link) => (
              <motion.a
                key={link.name}
                href={link.href}
                className="relative px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Hover background */}
                <motion.span
                  className="absolute inset-0 rounded-lg bg-secondary/0 group-hover:bg-secondary/50 transition-colors duration-300"
                />
                <span className="relative z-10">{link.name}</span>
              </motion.a>
            ))}
          </div>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center gap-3 relative z-10">
            <MagneticNavButton
              onClick={onToggleHistory}
              className={`px-4 py-2 text-sm transition-colors rounded-lg border ${
                showHistory
                  ? "text-foreground border-white/35 bg-secondary/40"
                  : "text-muted-foreground hover:text-foreground border-white/15 hover:bg-secondary/30"
              }`}
            >
              Prompt History
            </MagneticNavButton>
            <MagneticNavButton 
              onClick={() => {
                const el = document.getElementById('prompt-input')
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth', block: 'center' })
                  setTimeout(() => el.focus(), 500)
                }
              }}
              className="relative px-5 py-2.5 bg-gradient-to-r from-indigo to-primary text-primary-foreground text-sm font-medium rounded-xl shadow-lg shadow-indigo/20 hover:shadow-xl hover:shadow-indigo/30 transition-all duration-300 overflow-hidden group"
            >
              <motion.span className="absolute inset-0 bg-gradient-to-r from-cyan/20 to-lavender/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl bg-gradient-to-r from-indigo/40 to-cyan/40 -z-10" />
              <span className="relative z-10">Get Started</span>
            </MagneticNavButton>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden p-2 text-muted-foreground hover:text-foreground relative z-10"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            whileTap={{ scale: 0.95 }}
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </motion.button>
        </motion.div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="mt-2 rounded-2xl p-4 md:hidden overflow-hidden"
              style={{
                background: "oklch(0.98 0.005 270 / 0.85)",
                backdropFilter: "blur(30px)",
                WebkitBackdropFilter: "blur(30px)",
                border: "1px solid oklch(1 0 0 / 0.4)",
                boxShadow: "0 8px 40px oklch(0.5 0.15 270 / 0.12), inset 0 1px 0 oklch(1 0 0 / 0.5)",
              }}
            >
              <div className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    className="px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-xl transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                    whileTap={{ scale: 0.98 }}
                  >
                    {link.name}
                  </motion.a>
                ))}
                <hr className="my-2 border-border/50" />
                <motion.button
                  onClick={() => {
                    onToggleHistory()
                    setIsMobileMenuOpen(false)
                  }}
                  className={`px-4 py-3 text-sm rounded-xl transition-colors text-left ${
                    showHistory
                      ? "text-foreground bg-secondary/60"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  }`}
                  whileTap={{ scale: 0.98 }}
                >
                  Prompt History
                </motion.button>
                <motion.button
                  onClick={() => {
                    const el = document.getElementById('prompt-input')
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
                      setTimeout(() => el.focus(), 500)
                    }
                    setIsMobileMenuOpen(false)
                  }}
                  className="px-4 py-3 bg-gradient-to-r from-indigo to-primary text-primary-foreground text-sm font-medium rounded-xl shadow-lg shadow-indigo/20 text-left"
                  whileTap={{ scale: 0.98 }}
                >
                  Get Started
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  )
}
