"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { TransformSection } from "@/components/transform-section"
import { AnalyticsSection } from "@/components/analytics-section"
import { ModelSection } from "@/components/model-section"
import { UseCasesSection } from "@/components/use-cases-section"
import { CTASection } from "@/components/cta-section"
import { Footer } from "@/components/footer"

export default function Home() {
  const [showHistory, setShowHistory] = useState(false)

  return (
    <main className="relative min-h-screen gradient-mesh">
      {/* Navbar */}
      <Navbar
        showHistory={showHistory}
        onToggleHistory={() => setShowHistory((prev) => !prev)}
      />

      {/* Hero Section */}
      <HeroSection showHistory={showHistory} />

      {/* Interactive Prompt Transformation */}
      <TransformSection />

      {/* AI Analysis + Savings */}
      <AnalyticsSection />

      {/* Model Recommendations */}
      <ModelSection />

      {/* Use Cases */}
      <UseCasesSection />

      {/* Final CTA */}
      <CTASection />

      {/* Footer */}
      <Footer />
    </main>
  )
}
