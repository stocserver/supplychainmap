import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, CalendarDays, Clock } from "lucide-react"
import { supabaseServer } from "@/lib/supabase/server"
import { ShareButton } from "@/components/blog/share-button"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

// Force dynamic rendering to ensure updates appear immediately
export const revalidate = 0

interface BlogPost {
    id: string
    slug: string
    title: string
    content: string
    excerpt: string | null
    meta_description: string | null
    published_at: string | null
    updated_at: string | null
}

export async function generateMetadata({
    params,
}: {
    params: { slug: string }
}): Promise<Metadata> {
    const { data: post } = await supabaseServer
        .from("blog_posts")
        .select("title, meta_description, excerpt")
        .eq("slug", params.slug)
        .eq("published", true)
        .maybeSingle()

    if (!post) {
        return { title: "Article Not Found | SupplyChainMap" }
    }

    const description = post.meta_description || post.excerpt || ""

    return {
        title: `${post.title} | SupplyChainMap Blog`,
        description,
        alternates: { canonical: `${siteUrl}/blog/${params.slug}` },
        openGraph: {
            title: post.title,
            description,
            url: `${siteUrl}/blog/${params.slug}`,
            type: "article",
        },
        twitter: {
            card: "summary_large_image",
            title: post.title,
            description,
        },
    }
}

// Estimate reading time
function getReadingTime(content: string): string {
    const words = content.replace(/<[^>]*>/g, "").split(/\s+/).length
    const minutes = Math.max(1, Math.ceil(words / 200))
    return `${minutes} min read`
}

export default async function BlogPostPage({
    params,
}: {
    params: { slug: string }
}) {
    const { data: post } = await supabaseServer
        .from("blog_posts")
        .select("*")
        .eq("slug", params.slug)
        .eq("published", true)
        .maybeSingle()

    if (!post) {
        notFound()
    }

    const blogPost = post as BlogPost
    const articleUrl = `${siteUrl}/blog/${blogPost.slug}`

    return (
        <div className="min-h-screen">
            {/* Article JSON-LD for SEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Article",
                        headline: blogPost.title,
                        description: blogPost.meta_description || blogPost.excerpt,
                        url: articleUrl,
                        datePublished: blogPost.published_at,
                        dateModified: blogPost.updated_at || blogPost.published_at,
                        publisher: {
                            "@type": "Organization",
                            name: "SupplyChainMap",
                            url: siteUrl,
                        },
                        mainEntityOfPage: {
                            "@type": "WebPage",
                            "@id": articleUrl,
                        },
                    }),
                }}
            />

            {/* Breadcrumb JSON-LD */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "BreadcrumbList",
                        itemListElement: [
                            { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
                            { "@type": "ListItem", position: 2, name: "Blog", item: `${siteUrl}/blog` },
                            { "@type": "ListItem", position: 3, name: blogPost.title, item: articleUrl },
                        ],
                    }),
                }}
            />

            {/* Article Header */}
            <div className="border-b bg-gradient-to-b from-muted/50 to-background">
                <div className="container py-8 md:py-12">
                    {/* Back button */}
                    <Link href="/blog">
                        <Button variant="ghost" size="sm" className="mb-6 -ml-2 text-muted-foreground hover:text-foreground">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Blog
                        </Button>
                    </Link>

                    {/* Title & Meta */}
                    <div className="mx-auto max-w-3xl">
                        <h1 className="mb-6 text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl">
                            {blogPost.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            {blogPost.published_at && (
                                <span className="flex items-center gap-1.5">
                                    <CalendarDays className="h-4 w-4" />
                                    {new Date(blogPost.published_at).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </span>
                            )}
                            <span className="flex items-center gap-1.5">
                                <Clock className="h-4 w-4" />
                                {getReadingTime(blogPost.content)}
                            </span>
                            <ShareButton title={blogPost.title} url={articleUrl} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Article Content */}
            <div className="container py-8 md:py-12">
                <article className="mx-auto max-w-3xl">
                    {/* Excerpt/Lead */}
                    {blogPost.excerpt && (
                        <p className="mb-8 text-xl text-muted-foreground leading-relaxed border-l-4 border-primary/30 pl-4">
                            {blogPost.excerpt}
                        </p>
                    )}

                    {/* Main Content */}
                    <div
                        className="blog-content max-w-none"
                        dangerouslySetInnerHTML={{ __html: blogPost.content }}
                    />

                    {/* Bottom CTA */}
                    <div className="mt-12 pt-8 border-t">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <Link href="/blog">
                                <Button variant="outline">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    More Articles
                                </Button>
                            </Link>
                            <Link href="/industries">
                                <Button>
                                    Explore Industries
                                </Button>
                            </Link>
                        </div>
                    </div>
                </article>
            </div>
        </div>
    )
}
