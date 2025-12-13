import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase/server"
import { searchTopics, generateContent, generateKeywords } from "@/lib/perplexity"

/**
 * GET /api/create-post
 * Generates and publishes a blog post about current market news using AI
 */
export async function GET() {
    try {
        // 0. Keyword Discovery Phase
        console.log("Discovering keywords...")
        const mainTopic = "US Stock Market Trends December 2025"
        const keywords = await generateKeywords(mainTopic)
        console.log("Target Keywords:", keywords)

        // 1. Research phase
        console.log("Starting research...")
        const searchRes = await searchTopics([
            mainTopic,
            ...keywords.slice(0, 3)
        ])

        if (searchRes.error) {
            throw new Error(`Research failed: ${searchRes.error}`)
        }

        // 2. Writing phase
        console.log("Generating content...")
        const kws = keywords.join(", ")
        const prompt = `
      Write a compelling, analytical blog post about the current state of the US stock market as of December 2025.
      
      SEO Optimization Requirements:
      - Primary Keyword: ${keywords[0] || mainTopic}
      - Secondary Keywords to weave in naturally: ${kws}
      
      Structure Requirements:
      - Title: Catchy, professional, and includes the primary keyword.
      - Tone: Experienced financial analyst. Insightful, not just reporting news.
      - Format: HTML (h2, p, ul, li). Do NOT use markdown code blocks.
      - Content: 
        - Accurate market summary based on research.
        - Analysis of key sectors.
        - Outlook for 2026.
      - Links: When mentioning big companies, format as: <a href="/companies/TICKER">Company Name (TICKER)</a>.
      
      Generate the FULL post content in HTML.
    `

        const writerRes = await generateContent(prompt, searchRes.results)

        if (writerRes.error || !writerRes.content) {
            throw new Error(`Writing failed: ${writerRes.error}`)
        }

        // 3. Metadata generation phase
        const metaPrompt = `
      Based on this article content, generate a JSON object with:
      - title: a SEO-optimized title
      - slug: a url-friendly slug
      - excerpt: a 150-char summary
      - meta_description: a 160-char seo description
      
      Article start: ${writerRes.content.substring(0, 1000)}...
      
      Return ONLY valid JSON.
    `
        const metaRes = await generateContent(metaPrompt)
        let meta
        try {
            const cleanJson = metaRes.content.replace(/```json/g, "").replace(/```/g, "").trim()
            meta = JSON.parse(cleanJson)
        } catch (e) {
            console.error("Meta parsing failed, using defaults")
            meta = {
                title: "Market Update: December 2025 Trends",
                slug: "market-update-december-2025",
                excerpt: "Analysis of the latest US market trends and outlook for 2026.",
                meta_description: "Latest expert analysis on US stock market performance and sector rotation as we head into 2026."
            }
        }

        // 4. Publishing phase
        console.log("Publishing to database...")
        const { error } = await supabaseServer.from("blog_posts").upsert(
            {
                slug: meta.slug,
                title: meta.title,
                excerpt: meta.excerpt,
                content: writerRes.content,
                meta_description: meta.meta_description,
                published: true,
                published_at: new Date().toISOString(),
            },
            { onConflict: "slug" }
        )

        if (error) {
            throw new Error(`Database error: ${error.message}`)
        }

        return NextResponse.json({
            success: true,
            message: `Created post: ${meta.title}`,
            keywords: keywords,
            url: `/blog/${meta.slug}`
        })

    } catch (error) {
        console.error("Agent error:", error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Unknown error" },
            { status: 500 }
        )
    }
}
