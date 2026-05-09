"use client"

import { motion } from "framer-motion"
import { Twitter, Github, Linkedin, Mail } from "lucide-react"

const footerLinks = {
  product: [
    { name: "Features", href: "#features" },
    { name: "Pricing", href: "#" },
    { name: "API", href: "#" },
    { name: "Integrations", href: "#" },
  ],
  company: [
    { name: "About", href: "#" },
    { name: "Blog", href: "#" },
    { name: "Careers", href: "#" },
    { name: "Contact", href: "#" },
  ],
  resources: [
    { name: "Documentation", href: "#" },
    { name: "Guides", href: "#" },
    { name: "Changelog", href: "#" },
    { name: "Status", href: "#" },
  ],
  legal: [
    { name: "Privacy", href: "#" },
    { name: "Terms", href: "#" },
    { name: "Security", href: "#" },
  ],
}

const socialLinks = [
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Github, href: "#", label: "GitHub" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
]

export function Footer() {
  return (
    <footer className="relative py-20 px-4 border-t border-border/50 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-t from-lavender/5 to-transparent pointer-events-none" />
      
      {/* Decorative element */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.5 }}
        viewport={{ once: true }}
        className="absolute top-0 right-[20%] w-64 h-64 bg-cyan/5 rounded-full blur-3xl"
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Asymmetric top section */}
        <div className="grid lg:grid-cols-12 gap-12 mb-16">
          {/* Logo & Description - Left side with offset */}
          <div className="lg:col-span-4 lg:col-start-1">
            <motion.a
              href="#"
              className="inline-flex items-center gap-3 group mb-6"
              whileHover={{ scale: 1.02 }}
            >
              <div className="relative flex items-center justify-center w-9 h-9 rounded-[10px] bg-gradient-to-br from-[#0F172A] to-[#020617] border border-white/10 shadow-[0_0_15px_rgba(16,185,129,0.15)] group-hover:shadow-[0_0_25px_rgba(16,185,129,0.3)] group-hover:border-emerald-500/30 transition-all duration-300">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-0.5 mt-0.5">
                  <path d="M5 4C5 2.89543 5.89543 2 7 2H14.5C18.6421 2 22 5.35786 22 9.5C22 13.6421 18.6421 17 14.5 17H7V21C7 21.5523 6.55228 22 6 22C5.44772 22 5 21.5523 5 21V4Z" fill="url(#gradient-p-footer)" opacity="0.9"/>
                  <path d="M9 6.5L12.5 9.5L9 12.5" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M13.5 13.5H17" stroke="#34D399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="animate-pulse"/>
                  <defs>
                    <linearGradient id="gradient-p-footer" x1="5" y1="2" x2="22" y2="17" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#10B981"/>
                      <stop offset="1" stopColor="#0F766E"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 group-hover:from-emerald-400 group-hover:to-teal-500 transition-all duration-300">
                PromptWise
              </span>
            </motion.a>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mb-8">
              Transform messy prompts into clear, optimized AI instructions. 
              Save tokens, reduce costs, find the perfect model.
            </p>
            
            {/* Newsletter signup - unique element */}
            <div className="glass rounded-2xl p-4 max-w-xs">
              <div className="text-sm font-medium text-foreground mb-3">Stay updated</div>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 px-3 py-2 bg-background/50 rounded-lg text-sm border border-border/50 focus:outline-none focus:border-indigo/50 transition-colors"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-3 py-2 bg-indigo text-primary-foreground rounded-lg"
                >
                  <Mail className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </div>

          {/* Links - Staggered right side */}
          <div className="lg:col-span-7 lg:col-start-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
              {/* Product Links */}
              <div>
                <h4 className="font-medium text-foreground mb-4 text-sm">Product</h4>
                <ul className="space-y-3">
                  {footerLinks.product.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Company Links - Offset down */}
              <div className="sm:translate-y-4">
                <h4 className="font-medium text-foreground mb-4 text-sm">Company</h4>
                <ul className="space-y-3">
                  {footerLinks.company.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Resources Links */}
              <div>
                <h4 className="font-medium text-foreground mb-4 text-sm">Resources</h4>
                <ul className="space-y-3">
                  {footerLinks.resources.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Legal Links - Offset down */}
              <div className="sm:translate-y-4">
                <h4 className="font-medium text-foreground mb-4 text-sm">Legal</h4>
                <ul className="space-y-3">
                  {footerLinks.legal.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar - Asymmetric */}
        <div className="pt-8 border-t border-border/50">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <p className="text-sm text-muted-foreground">
                {new Date().getFullYear()} PromptWise
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span>All systems operational</span>
              </div>
            </div>
            
            {/* Social links - Right aligned */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  className="w-9 h-9 rounded-xl glass flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
