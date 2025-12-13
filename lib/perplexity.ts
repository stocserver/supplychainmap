/**
 * Perplexity API integration for real-time research and content generation
 * Uses the official @perplexity-ai/perplexity_ai SDK for search
 * Uses standard fetch for chat completions (writing)
 */

import Perplexity from "@perplexity-ai/perplexity_ai"

// Initialize client
const client = new Perplexity()

export interface SearchResult {
    title: string
    url: string
    snippet?: string
}

/**
 * Search for real-time information using Perplexity
 */
export async function searchTopics(queries: string[]): Promise<{
    results: SearchResult[]
    error?: string
}> {
    try {
        const search = await client.search.create({
            query: queries,
        })

        const results: SearchResult[] = search.results.map((result: { title: string; url: string; snippet?: string }) => ({
            title: result.title,
            url: result.url,
            snippet: result.snippet,
        }))

        return { results }
    } catch (error) {
        console.error("Perplexity search error:", error)
        return {
            results: [],
            error: error instanceof Error ? error.message : "Unknown error",
        }
    }
}

/**
 * Generate high-relevance SEO keywords for a given topic
 */
export async function generateKeywords(topic: string): Promise<string[]> {
    const apiKey = process.env.PERPLEXITY_API_KEY
    if (!apiKey) return []

    try {
        const response = await fetch("https://api.perplexity.ai/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "sonar",
                messages: [
                    {
                        role: "system",
                        content: "You are an SEO expert. Return a JSON array of 5-8 high-intent, trending search keywords/phrases related to the user's topic. Return ONLY the JSON array."
                    },
                    {
                        role: "user",
                        content: `Topic: ${topic}`
                    }
                ]
            })
        })

        const data = await response.json()
        const content = data.choices[0].message.content
        // Extract array from potential markdown
        const jsonStr = content.replace(/```json/g, "").replace(/```/g, "").trim()
        return JSON.parse(jsonStr)
    } catch (e) {
        console.error("Keyword generation failed", e)
        return [topic] // Fallback
    }
}

/**
 * Generate blog content using Perplexity's Sonar model
 * @param prompt - The prompt for the AI writer
 * @param context - Optional research context to include
 */
export async function generateContent(
    prompt: string,
    context?: SearchResult[]
): Promise<{ content: string; error?: string }> {
    const apiKey = process.env.PERPLEXITY_API_KEY

    if (!apiKey) {
        return { content: "", error: "PERPLEXITY_API_KEY is missing" }
    }

    // Format context for the LLM
    const contextString = context
        ? `\n\nResearch Context:\n${context.map(r => `- ${r.title}: ${r.snippet}`).join("\n")}`
        : ""

    try {
        const response = await fetch("https://api.perplexity.ai/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "sonar",
                messages: [
                    {
                        role: "system",
                        content: "You are an expert financial journalist for SupplyChainMap. You write insightful, data-driven articles about US public companies, supply chains, and market trends. Use HTML formatting (h2, p, ul, li, strong) for the output. Do not include markdown code blocks."
                    },
                    {
                        role: "user",
                        content: `${prompt}${contextString}`
                    }
                ],
                max_tokens: 3000,
            })
        })

        if (!response.ok) {
            throw new Error(`Perplexity API Error: ${response.statusText}`)
        }

        const data = await response.json()
        return { content: data.choices[0].message.content }

    } catch (error) {
        console.error("Generation error:", error)
        return {
            content: "",
            error: error instanceof Error ? error.message : "Generation failed"
        }
    }
}
