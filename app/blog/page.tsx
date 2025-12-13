import Link from "next/link"
import type { Metadata } from "next"
import { supabaseServer } from "@/lib/supabase/server"
import { CalendarDays, Clock, ArrowRight, MessageSquare, TrendingUp } from "lucide-react"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

// Force dynamic rendering to ensure new posts appear immediately
export const revalidate = 0

export const metadata: Metadata = {
    title: "Blog | SupplyChainMap",
    description:
        "Read the latest insights on supply chains, value chains, and investment analysis for US public companies.",
    alternates: { canonical: `${siteUrl}/blog` },
}

interface BlogPost {
    id: string
    slug: string
    title: string
    excerpt: string | null
    published_at: string | null
}

// Estimate reading time based on content
function getReadingTime(excerpt: string | null): string {
    const words = excerpt?.split(/\s+/).length || 100
    const minutes = Math.max(1, Math.ceil(words / 200))
    return `${minutes} min read`
}

export default async function BlogPage() {
    const { data: posts } = await supabaseServer
        .from("blog_posts")
        .select("id, slug, title, excerpt, published_at")
        .eq("published", true)
        .order("published_at", { ascending: false })
        .limit(50)

    const blogPosts: BlogPost[] = posts || []

    return (
        <div className="min-h-screen bg-background">
            {/* Blog CollectionPage JSON-LD */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "CollectionPage",
                        name: "SupplyChainMap Blog",
                        description:
                            "Read the latest insights on supply chains, value chains, and investment analysis.",
                        url: `${siteUrl}/blog`,
                    }),
                }}
            />

            {/* Simple Header */}
            <div className="border-b bg-muted/30">
                <div className="container py-8">
                    <h1 className="text-3xl font-bold tracking-tight">Market Insights</h1>
                    <p className="text-muted-foreground mt-2">Latest analysis on US supply chains and public markets.</p>
                </div>
            </div>

            {/* Reddit-style List */}
            <div className="container max-w-4xl py-6">
                {blogPosts.length > 0 ? (
                    <div className="space-y-0 divide-y border rounded-md bg-card">
                        {blogPosts.map((post, index) => (
                            <div key={post.id} className="group relative p-4 hover:bg-muted/50 transition-colors">
                                {/* Rank/Upvote simulated column (visual only) */}
                                <div className="absolute left-4 top-4 w-6 flex flex-col items-center text-muted-foreground/50 gap-1 hidden sm:flex">
                                    <TrendingUp className="h-4 w-4" />
                                    <span className="text-xs font-medium">{blogPosts.length - index}</span>
                                </div>

                                <div className="sm:pl-10">
                                    {/* Meta Header */}
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1.5">
                                        <span className="font-medium text-foreground">r/supplychain</span>
                                        <span>•</span>
                                        <span>Posted by u/AnalystBot</span>
                                        <span>•</span>
                                        {post.published_at && (
                                            <span>
                                                {new Date(post.published_at).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "numeric",
                                                })}
                                            </span>
                                        )}
                                    </div>

                                    {/* Title Link */}
                                    <Link href={`/blog/${post.slug}`} className="block">
                                        <h2 className="text-lg font-semibold leading-snug group-hover:text-primary transition-colors mb-2">
                                            {post.title}
                                        </h2>
                                    </Link>

                                    {/* Snippet */}
                                    {post.excerpt && (
                                        <div className="text-sm text-muted-foreground line-clamp-2 md:line-clamp-1 mb-2.5">
                                            {post.excerpt}
                                        </div>
                                    )}

                                    {/* Action Bar */}
                                    <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground">
                                        <Link href={`/blog/${post.slug}`} className="flex items-center gap-1.5 p-1 -ml-1 hover:bg-muted rounded text-foreground/80">
                                            <MessageSquare className="h-3.5 w-3.5" />
                                            <span>Read Analysis</span>
                                        </Link>

                                        <div className="flex items-center gap-1.5 cursor-default">
                                            <Clock className="h-3.5 w-3.5" />
                                            <span>{getReadingTime(post.excerpt)}</span>
                                        </div>

                                        <div className="flex items-center gap-1.5 cursor-default hover:bg-muted p-1 rounded">
                                            <ShareButton postUrl={`${siteUrl}/blog/${post.slug}`} title={post.title} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-24 text-center border rounded-md border-dashed">
                        <p className="text-muted-foreground">No posts found.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

function ShareButton({ postUrl, title }: { postUrl: string, title: string }) {
    return (
        <div className="flex items-center gap-1">
            <ArrowRight className="h-3.5 w-3.5" />
            <span>Share</span>
        </div>
    )
}
