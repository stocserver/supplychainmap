import { NextRequest, NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase/server"
import { searchTopics, generateContent, generateKeywords } from "@/lib/perplexity"

// Force dynamic to read searchParams
export const dynamic = 'force-dynamic'

/**
 * GET /api/create-post?topic=...&template=...
 * Generates and publishes a blog post using specific AI templates
 */
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        const userTopic = searchParams.get('topic')
        const template = searchParams.get('template') || 'general' // general, listicle, comparison, trends

        let mainTopic = userTopic

        // If no topic provided, we enter "News Discovery Mode"
        if (!mainTopic) {
            console.log("[Agent] No topic provided. Entering News Discovery Mode...")

            // 1. Fetch potential subjects (Industries or Top Companies)
            // We'll flip a coin to decide whether to cover an Industry or a specific Company
            const isIndustryMode = Math.random() > 0.4 // 60% chance of industry news (broader), 40% company specific

            let searchSubject = ""
            let searchQuery = ""

            if (isIndustryMode) {
                const { data: industries } = await supabaseServer.from('industries').select('name').limit(50)
                if (industries && industries.length > 0) {
                    const randomInd = industries[Math.floor(Math.random() * industries.length)].name
                    searchSubject = randomInd
                    searchQuery = `latest major supply chain news trends challenges ${randomInd} industry last 2 weeks`
                }
            } else {
                const { data: companies } = await supabaseServer
                    .from('companies')
                    .select('name')
                    .gt('market_cap', 50000000000) // Only news about huge companies (>50B)
                    .order('market_cap', { ascending: false })
                    .limit(30)

                if (companies && companies.length > 0) {
                    const randomCo = companies[Math.floor(Math.random() * companies.length)].name
                    searchSubject = randomCo
                    searchQuery = `latest supply chain logistics business news ${randomCo} this month`
                }
            }

            if (!searchSubject) {
                searchSubject = "Global Logistics"
                searchQuery = "latest global supply chain news disruption this week"
            }

            console.log(`[Agent] Hunting for news about: ${searchSubject}...`)

            // 2. Perform Pre-Research Search
            const newsResults = await searchTopics([searchQuery])

            // 3. Generate a Headline based on real news
            if (newsResults.results.length > 0) {
                const topicPrompt = `
                You are a news editor. Review these search results for ${searchSubject}.
                Identify the single most significant, specific, and interesting news story or trend.
                
                Write a compelling, click-worthy blog post TITLE about this specific story.
                
                Rules:
                - Do NOT use generic titles like "Trends in X" or "Future of Y".
                - BE SPECIFIC. Example: "How the Red Sea Crisis is Impacting Tesla" or "NVIDIA's New Chip Plant Faces Water Shortage".
                - If the news is negative, that's fine. Be objective but gripping.
                - Return ONLY the title text. No quotes.
            `
                const headlineGen = await generateContent(topicPrompt, newsResults.results)

                if (headlineGen.content && !headlineGen.error) {
                    mainTopic = headlineGen.content.trim().replace(/^"|"$/g, '')
                    console.log(`[Agent] 💡 Generated News-Based Topic: "${mainTopic}"`)
                } else {
                    mainTopic = `Emerging Trends in ${searchSubject} Supply Chain`
                }
            } else {
                mainTopic = `The State of ${searchSubject} Supply Chain 2026`
            }
        }

        // 0. Keyword Discovery Phase
        console.log(`[Agent] Mode: ${template}, Topic: ${mainTopic}`)
        console.log("Discovering keywords...")
        const keywords = await generateKeywords(mainTopic as string)
        console.log("Target Keywords:", keywords)

        // 1. Research phase
        console.log("Starting research...")

        // FETCH RANDOM SAMPLE OF VALID TICKERS FOR CONTEXT
        // Fetching 200 and taking a random slice helps rotate which companies get highlighted
        // while ensuring they actually exist on our site.
        const { data: availableCompanies } = await supabaseServer
            .from('companies')
            .select('ticker, name')
            .gt('market_cap', 1000000000) // Ensure significant companies
            .limit(200)

        // Shuffle and pick top 50 to fit in prompt context without token overflow
        const shuffledTickers = availableCompanies ? availableCompanies.sort(() => 0.5 - Math.random()).slice(0, 50) : []
        const validTickersList = shuffledTickers.map(c => `${c.name} (${c.ticker})`).join(", ")

        const searchRes = await searchTopics([
            mainTopic as string,
            ...keywords.slice(0, 3)
        ])

        if (searchRes.error) {
            throw new Error(`Research failed: ${searchRes.error}`)
        }

        // 2. Writing phase
        console.log("Generating content...")
        const kws = keywords.join(", ")

        let promptInstruction = ""

        switch (template) {
            case 'listicle':
                promptInstruction = `
                TEMPLATE: TOOLS/RESOURCES LISTICLE
                - Structure: Introduction -> List of 7-10 Items -> detailed analysis for each -> Conclusion.
                - For each item, bold the name and provide: Pros, Cons, and "Best For".
                - Title example: "Top 10 [Topic] for 2026"
                - Ensure the tone is objective but helpful for decision making.
            `
                break;
            case 'comparison':
                promptInstruction = `
                TEMPLATE: COMPARISON ARTICLE
                - Structure: Deep dive comparison between entities in the topic.
                - Sections: Feature-by-feature breakdown, Pricing/Cost analysis, Performance comparison.
                - Title example: "[Item A] vs [Item B]: Which is better for [User]?"
                - Use a "Winner" verdict at the end.
            `
                break;
            case 'trends':
                promptInstruction = `
                TEMPLATE: INDUSTRY TRENDS PREDICTION
                - Structure: 5 Key Trends shaping the industry.
                - For each trend: "The Shift" (what's changing), "Why it Matters" (impact), "Who Wins" (companies benefiting).
                - Title example: "5 [Topic] Trends to Watch in Q1 2026"
            `
                break;
            default: // 'general'
                promptInstruction = `
                TEMPLATE: ANALYTICAL DEEP DIVE
                - Structure: Executive Summary -> Market Analysis -> Sector Breakdown -> Future Outlook.
                - Focus on data-driven insights and financial implications.
                - Title: Catchy, professional, and includes the primary keyword.
            `
                break;
        }

        const prompt = `
      Write a compelling, high-quality blog post about: "${mainTopic}".
      
      SEO Optimization Requirements:
      - Primary Keyword: ${keywords[0] || mainTopic}
      - Secondary Keywords to weave in naturally: ${kws}
      
      Internal Linking Strategy (STRICT ENFORCEMENT):
      - You MUST link to at least 3 relevant companies from the ALLOWED LIST below.
      - 🔴 CRITICAL: You are strictly FORBIDDEN from creating links for anyone NOT in the allowed list. If a company is not in the list, mention them in plain text only. Do not guess links.
      - ALLOWED LIST: ${validTickersList || "None available (do not create links)"}
      - Link Format: <a href="/companies/TICKER">Company Name (TICKER)</a>
      
      ${promptInstruction}
      
      General Requirements:
      - Tone: Experienced industry expert. Insightful, authoritative.
      - Format: HTML (h2, p, ul, li, strong). Do NOT use markdown code blocks.
      - Length: Comprehensive (1200+ words equivalent).
      
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
                title: `Insight: ${mainTopic}`,
                slug: `insight-${String(mainTopic).toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`,
                excerpt: "Expert analysis on the latest market trends.",
                meta_description: `Read our latest deep dive on ${mainTopic} and its impact on the supply chain.`
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
            template: template,
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
