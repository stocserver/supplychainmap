import { NextRequest, NextResponse } from "next/server"
import { searchTopics } from "@/lib/perplexity"

/**
 * API endpoint for researching topics using Perplexity
 * POST /api/research
 * Body: { queries: string[] } or { topic: string }
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { queries, topic } = body

        // Support both array of queries or single topic
        let searchQueries: string[]
        if (queries && Array.isArray(queries)) {
            searchQueries = queries
        } else if (topic && typeof topic === "string") {
            searchQueries = [topic]
        } else {
            return NextResponse.json(
                { error: "Either 'queries' (array) or 'topic' (string) is required" },
                { status: 400 }
            )
        }

        const result = await searchTopics(searchQueries)

        if (result.error) {
            return NextResponse.json({ error: result.error }, { status: 500 })
        }

        return NextResponse.json({ results: result.results })
    } catch (error) {
        console.error("Research API error:", error)
        return NextResponse.json(
            { error: "Failed to process research request" },
            { status: 500 }
        )
    }
}
