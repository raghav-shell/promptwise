import { NextResponse } from "next/server"
import { GoogleGenAI } from "@google/genai"

type PromptType = "coding" | "writing" | "research" | "marketing" | "general"

type OptimizePayload = {
  optimizedPrompt: string
  savings: number
  clarityScore: number
  recommendedModel: string
}

type ParsedModelResponse = {
  optimizedPrompt?: unknown
  clarityScore?: unknown
  savings?: unknown
  recommendedModel?: unknown
}

function detectPromptType(prompt: string): PromptType {
  const lower = prompt.toLowerCase()
  if (/code|debug|refactor|typescript|javascript|react|api|function|bug/.test(lower)) return "coding"
  if (/write|rewrite|email|blog|article|copy|tone|grammar|story/.test(lower)) return "writing"
  if (/research|analy[sz]e|summarize|paper|citations|sources|compare|report/.test(lower)) return "research"
  if (/campaign|ads|ad copy|social|headline|landing page|conversion|brand/.test(lower)) return "marketing"
  return "general"
}

function recommendModel(promptType: PromptType) {
  if (promptType === "coding") return "Codex"
  if (promptType === "writing") return "Claude"
  if (promptType === "research") return "Gemini"
  if (promptType === "marketing") return "Claude"
  return "GPT"
}

function estimateTokens(text: string) {
  // Hackathon-friendly approximation: ~4 chars per token.
  return Math.max(1, Math.round(text.length / 4))
}

function sanitizeBasePrompt(prompt: string) {
  const cleaned = prompt
    .replace(/\s+/g, " ")
    .replace(/\b(really|very|just|actually|basically|kind of|sort of|maybe|probably)\b/gi, "")
    .replace(/\s+,/g, ",")
    .replace(/\s+\./g, ".")
    .trim()
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1)
}

function buildStructuredPrompt(base: string, bullets: string[]) {
  const dedupedBullets = [...new Set(bullets.map((line) => line.trim()).filter(Boolean))]
  return `${base}.\n\nRequirements:\n${dedupedBullets.map((line) => `- ${line}`).join("\n")}`
}

function localOptimizePrompt(prompt: string, promptType: PromptType) {
  const base = sanitizeBasePrompt(prompt)

  if (promptType === "coding") {
    return buildStructuredPrompt(base, [
      "production-ready implementation",
      "clear modular structure",
      "edge-case handling",
      "clean readable code",
    ])
  }
  if (promptType === "writing") {
    return buildStructuredPrompt(base, [
      "concise polished language",
      "consistent tone and grammar",
      "audience-appropriate wording",
      "clear final deliverable",
    ])
  }
  if (promptType === "research") {
    return buildStructuredPrompt(base, [
      "structured summary",
      "evidence-backed findings",
      "concise comparisons",
      "actionable recommendations",
    ])
  }
  if (promptType === "marketing") {
    return buildStructuredPrompt(base, [
      "clear audience targeting",
      "compelling value proposition",
      "strong call to action",
      "conversion-focused messaging",
    ])
  }
  return buildStructuredPrompt(base, [
    "concise and clear output",
    "logical step-by-step structure",
    "no redundancy",
    "grammatically clean language",
  ])
}

function normalizeSavings(savings: number) {
  return Math.max(0, Math.min(80, Number(savings.toFixed(1))))
}

function normalizeClarityScore(score: number) {
  return Math.max(1, Math.min(100, Math.round(score)))
}

function normalizeRecommendedModel(input: string | undefined, fallback: string) {
  if (!input) return fallback
  const model = input.trim().replace(/\s+/g, " ")
  if (!model) return fallback
  if (model.length > 40) return fallback
  if (/[{}[\]<>]/.test(model)) return fallback
  return model
}

function sanitizeOptimizedPrompt(text: string) {
  const cleaned = text
    .replace(/```[\s\S]*?```/g, (block) => block.replace(/```/g, ""))
    .replace(/\b(undefined|null)\b/gi, "")
    .replace(/^\s*(Role|Request|Task|Objective|Output|Explanation|Reasoning|Prompt)\s*:\s*/gim, "")
    .replace(/^\s*Here(?:'s| is).*$\n?/gim, "")
    .replace(/^\s*Optimized prompt\s*:\s*/gim, "")
    .replace(/^\s*(Sure|Absolutely|Here you go)[.!]?\s*$/gim, "")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim()

  const lines = cleaned
    .split("\n")
    .map((line) => line.trimEnd())
    .filter((line, idx, arr) => !(line.trim() === "" && arr[idx - 1]?.trim() === ""))

  return lines
    .map((line) => {
      if (line.startsWith("* ")) return `- ${line.slice(2).trim()}`
      if (/^-\S/.test(line)) return `- ${line.slice(1).trim()}`
      return line
    })
    .join("\n")
    .replace(/\s+([,.;!?])/g, "$1")
    .trim()
}

function parseAndValidateResponse(rawText: string) {
  let parsed: ParsedModelResponse = {}
  
  // Extract JSON from markdown backticks or preambles
  const match = rawText.match(/\{[\s\S]*\}/)
  const jsonString = match ? match[0] : rawText

  try {
    parsed = JSON.parse(jsonString) as ParsedModelResponse
  } catch {
    return { ok: false as const, reason: "invalid OpenRouter JSON response" }
  }

  const optimizedPrompt = sanitizeOptimizedPrompt(
    typeof parsed.optimizedPrompt === "string" ? parsed.optimizedPrompt : "",
  )

  if (!optimizedPrompt || optimizedPrompt.length < 16) {
    return { ok: false as const, reason: "missing or low-quality optimizedPrompt in OpenRouter response" }
  }

  const clarityScore = Number.isFinite(parsed.clarityScore)
    ? normalizeClarityScore(Number(parsed.clarityScore))
    : 86

  const savings = Number.isFinite(parsed.savings)
    ? normalizeSavings(Number(parsed.savings))
    : null

  const recommendedModel =
    typeof parsed.recommendedModel === "string" ? parsed.recommendedModel : undefined

  return {
    ok: true as const,
    optimizedPrompt,
    clarityScore,
    savings,
    recommendedModel,
  }
}

function buildResponse(optimizedPrompt: string, clarityScore: number, savings: number, recommendedModel: string): OptimizePayload {
  return {
    optimizedPrompt,
    savings: normalizeSavings(savings),
    clarityScore: normalizeClarityScore(clarityScore),
    recommendedModel,
  }
}

function fallbackResponse(prompt: string, promptType: PromptType, reason: string): OptimizePayload {
  const optimizedPrompt = sanitizeOptimizedPrompt(localOptimizePrompt(prompt, promptType))
  const recommendedModel = recommendModel(promptType)
  const clarityScore = Math.max(78, Math.min(96, 84 + (promptType === "general" ? 2 : 6)))
  const before = estimateTokens(prompt)
  const ratioByType: Record<PromptType, number> = {
    coding: 0.68,
    writing: 0.64,
    research: 0.66,
    marketing: 0.62,
    general: 0.65,
  }
  const after = Math.max(1, Math.round(before * ratioByType[promptType]))
  const savings = ((before - after) / Math.max(before, 1)) * 100
  console.warn(`[PromptWise] fallback activated`, { promptType, reason })
  return buildResponse(optimizedPrompt, clarityScore, savings, recommendedModel)
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null)
    const prompt = typeof body?.prompt === "string" ? body.prompt.trim() : ""
    const targetModel = typeof body?.targetModel === "string" ? body.targetModel.trim() : "Auto-detect"

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required." }, { status: 400 })
    }

    const promptType = detectPromptType(prompt)
    const recommendedModel = recommendModel(promptType)
    const geminiApiKey = process.env.GEMINI_API_KEY
    if (!geminiApiKey) {
      return NextResponse.json(fallbackResponse(prompt, promptType, "missing GEMINI_API_KEY"))
    }

    const instruction = `
You are an expert AI Prompt Engineer. Your goal is to deeply analyze the user's raw prompt, understand their underlying intent and logic, and completely rewrite it into the most effective, highly detailed, and professional prompt possible.

Do not just format their text. You must:
1. Actively expand on their ideas and fill in logical gaps.
2. Define clear roles, constraints, and edge cases.
3. Use precise, expert-level terminology appropriate for their task.
4. Structure the output beautifully for an AI to understand perfectly.

Return STRICT JSON only with this exact shape:
{
  "optimizedPrompt": "string",
  "clarityScore": number,
  "savings": number,
  "recommendedModel": "string"
}

Rules:
- clarityScore must be an integer from 1 to 100.
- savings must be a number from 0 to 80 (represents percentage of token reduction or efficiency gained).
- optimizedPrompt must be the fully rewritten prompt. It MUST NOT include: "Role:", "Request:", "undefined", explanations, or meta commentary.
- optimizedPrompt should follow this structure:
  [Expert Persona / Context Definition]
  [Clear, expanded core instruction]

  Requirements & Constraints:
  - [Specific expert-level requirement 1]
  - [Specific expert-level requirement 2]
  - [Format/Output constraint]
- Do not wrap JSON in markdown.
${
  targetModel && targetModel !== "Auto-detect"
    ? `\nCRITICAL DIRECTIVE:\nThe user intends to run this optimized prompt specifically in the **${targetModel}** AI model. You MUST tailor the formatting, syntax, and phrasing of the optimized prompt to perfectly match the quirks and best practices of ${targetModel}. (e.g., if Midjourney, use comma-separated keywords; if Claude, use heavy XML tags like <instructions>; if ChatGPT, use markdown blocks).`
    : ""
}
`

    try {
      let rawText = ""
      const ai = new GoogleGenAI({ apiKey: geminiApiKey })
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            systemInstruction: instruction,
            responseMimeType: "application/json",
            temperature: 0.3,
        }
      });
      
      rawText = response.text || ""
      
      if (!rawText) {
        return NextResponse.json(fallbackResponse(prompt, promptType, "empty Gemini response"))
      }

      const parsedResponse = parseAndValidateResponse(rawText)
      
      if (!parsedResponse.ok) {
        return NextResponse.json(fallbackResponse(prompt, promptType, `Gemini JSON parsing failed: ${parsedResponse.reason}`))
      }

      const parsed = parsedResponse

      const before = estimateTokens(prompt)
      const after = estimateTokens(parsed.optimizedPrompt)
      const computedSavings = ((before - Math.min(before, after)) / Math.max(before, 1)) * 100
      const savings = Number.isFinite(parsed.savings)
        ? Number(parsed.savings)
        : computedSavings
      const model = normalizeRecommendedModel(parsed.recommendedModel, recommendedModel)

      console.info(`[PromptWise] optimize success`, {
        promptType,
        savings: normalizeSavings(savings),
        clarityScore: normalizeClarityScore(parsed.clarityScore),
        model,
      })

      return NextResponse.json(
        buildResponse(parsed.optimizedPrompt, parsed.clarityScore, savings, model),
      )
    } catch (error) {
      const message = error instanceof Error ? error.message : "network or unknown error"
      return NextResponse.json(fallbackResponse(prompt, promptType, message))
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected server error."
    const safePrompt = "Please optimize this request with clearer instructions."
    return NextResponse.json(fallbackResponse(safePrompt, "general", `request parsing error: ${message}`))
  }
}
