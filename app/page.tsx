import Link from "next/link"
import type { Metadata } from "next"
import { Card, CardContent } from "@/components/ui/card"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

export const metadata: Metadata = {
  title: "US Supply Chain & Value Chain Platform | SupplyChainMap",
  description:
    "Explore US public companies through their industry value chains. Understand supply chain relationships, find investment opportunities, and analyze company fundamentals.",
  alternates: { canonical: siteUrl },
  openGraph: {
    title: "US Supply Chain & Value Chain Platform",
    description:
      "Explore US public companies through their industry value chains and supply chain relationships",
    url: siteUrl,
    type: "website",
  },
}

export default function Home() {
  // FAQ data for both display and JSON-LD
  const faqs = [
    {
      question: "What is SupplyChainMap?",
      answer:
        "SupplyChainMap is a platform to explore US public companies through their industry value chains. It helps investors understand supply chain relationships and identify investment opportunities across different sectors.",
    },
    {
      question: "How many industries are covered?",
      answer:
        "We cover 20+ industry value chains including Semiconductors, Cloud Computing, Electric Vehicles, Pharmaceuticals, Banking, and more. Each industry includes detailed value chain stages from upstream to downstream.",
    },
    {
      question: "What company information is available?",
      answer:
        "For each company, we provide key fundamentals, financial statements, market cap, P/E ratio, revenue, and their position within the industry value chain.",
    },
  ]

  return (
    <div className="container py-8">
      {/* Structured Data for SEO - WebSite + FAQPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "SupplyChainMap",
            url: siteUrl,
            description:
              "Explore US public companies through their industry value chains and supply chain relationships",
            potentialAction: {
              "@type": "SearchAction",
              target: `${siteUrl}/industries?query={search_term_string}`,
              "query-input": "required name=search_term_string",
            },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
              },
            })),
          }),
        }}
      />

      {/* Hero Section */}
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          US Supply Chain & Value Chain Platform
        </h1>
        <p className="mx-auto max-w-3xl text-xl text-muted-foreground">
          Explore public companies through their industry value chains.
          Understand supply chain relationships and investment opportunities.
        </p>
      </div>

      {/* Call to Action */}
      <div className="mb-12 rounded-lg bg-primary/5 p-8 text-center">
        <h2 className="mb-4 text-2xl font-bold">
          Understand the Complete Supply Chain
        </h2>
        <p className="mx-auto mb-6 max-w-2xl text-muted-foreground">
          See how companies connect from raw materials to end products.
          Identify investment opportunities across the value chain.
        </p>
        <Link
          href="/industries"
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Explore All Industries
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="mb-12 grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">20+</div>
              <p className="text-sm text-muted-foreground">Industry Value Chains</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">150+</div>
              <p className="text-sm text-muted-foreground">Featured Companies</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">Financial</div>
              <p className="text-sm text-muted-foreground">Reports</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* FAQ Section for SEO */}
      <div className="mb-12">
        <h2 className="mb-6 text-2xl font-bold text-center">Frequently Asked Questions</h2>
        <div className="mx-auto max-w-3xl space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="rounded-lg border p-4">
              <h3 className="font-semibold mb-2">{faq.question}</h3>
              <p className="text-muted-foreground">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
