import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase/server"

/**
 * GET /api/seed-blog - Seeds the blog with a sample post
 * Updates the existing post with narrative-driven content
 */
export async function GET() {
    const { data, error } = await supabaseServer.from("blog_posts").upsert(
        {
            slug: "jpmorgan-chase-2024-financial-analysis",
            title: "JPMorgan Chase 2024: How America's Largest Bank Crushed Expectations",
            excerpt:
                "Beyond the record $58.5B profit, JPMorgan's 2024 performance signals a major shift in investment banking and asset management dominance.",
            content: `<h2>The Fortress Balance Sheet Flexes Its Muscles</h2>
<p><a href="/companies/JPM"><strong>JPMorgan Chase (NYSE: JPM)</strong></a> didn't just report good numbers for 2024—they effectively rewrote the standard for what a mega-bank can achieve in a high-rate environment. Delivering a <strong>record $58.5 billion in net income</strong>, the bank has demonstrated that its "fortress balance sheet" strategy is more than just a tagline; it's a compounding engine of growth.</p>

<p>What's particularly telling about this year's performance isn't just the raw profit figure, but where it came from. While many regional competitors struggled with deposit flight and margin compression, JPMorgan actually <em>strengthened</em> its grip on the US financial system, opening nearly 2 million new checking accounts. This "flight to quality" has solidified their funding base at a time when capital costs are elevated.</p>

<p style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #0ea5e9; font-style: italic;">
  "The 2024 results validate the diversified business model—when consumer lending slowed, investment banking roared back to life."
</p>

<h2>The Return of the Dealmakers</h2>
<p>Perhaps the most significant signal for the broader market was the resurgence in the <strong>Commercial & Investment Bank (CIB)</strong> unit. After a quiet 2023, dealmaking is back.</p>

<p>The unit posted <strong>$6.6 billion in net income</strong> in Q4 alone, fueled by a massive 49% surge in Investment Banking fees. This suggests that corporate boardrooms are finally thawing, with M&A, IPOs, and debt issuance ramping up. For investors in the broader financial sector, this is a bellwether moment—JPMorgan is often the first mover in these cycles.</p>

<h2>Wealth Management: The Silent Giant</h2>
<p>While headlines focus on the investment bank, the <strong>Asset & Wealth Management</strong> division has quietly become a juggernaut, crossing the <strong>$4.0 trillion</strong> threshold in assets under management (AUM). This 18% growth is critical because it represents <em>sticky</em>, recurring fee revenue that is less volatile than trading profits.</p>

<p style="margin-top: 2rem; margin-bottom: 2rem;">
  👇 <strong>Analyze the fundamentals yourself:</strong><br/>
  <a href="/companies/JPM" style="display: inline-block; background: #0f172a; color: white; padding: 0.75rem 1.5rem; border-radius: 0.5rem; text-decoration: none; font-weight: 600; margin-top: 0.5rem;">View JPM Stock Analysis & Financials →</a>
</p>

<h2>Strategic Outlook: Is the Premium Justified?</h2>
<p>Analysts currently maintain a consensus <strong>"Buy" rating</strong> with a $326 price target, implying that the stock still has room to run despite its recent rally. The argument for the premium valuation is simple: in an uncertain economic environment, JPM offers the defensive characteristics of a utility with the growth potential of a top-tier investment bank.</p>

<p>However, risks remain. Regulatory capital requirements (Basel III endgame) could tighten, and credit costs in the consumer space are normalizing. But compared to peers, JPMorgan appears best positioned to navigate these headwinds.</p>

<h3>Peer Comparison</h3>
<p>When looking at the <a href="/industries/banking-diversified">Diversified Banking</a> value chain, JPM stands apart in scale, but value can also be found elsewhere:</p>
<ul>
  <li><strong><a href="/companies/BAC">Bank of America (BAC)</a></strong> - Often trades at a lower multiple, offering potential catch-up value.</li>
  <li><strong><a href="/companies/GS">Goldman Sachs (GS)</a></strong> - A purer play on the investment banking recovery theme.</li>
  <li><strong><a href="/companies/C">Citigroup (C)</a></strong> - A turnaround story for investors with higher risk tolerance.</li>
</ul>`,
            meta_description:
                "Analysis of JPMorgan's 2024 record performance. Why the 49% surge in investment banking fees signals a market shift. Stock analysis and peer comparison.",
            published: true,
            published_at: new Date().toISOString(),
        },
        { onConflict: "slug" }
    )

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
        success: true,
        message: "Blog post rewritten with narrative content! Visit /blog to see it."
    })
}
