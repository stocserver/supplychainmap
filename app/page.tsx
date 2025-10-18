import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="container py-8">
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        // Using dangerouslySetInnerHTML to embed JSON-LD
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "SupplyChainMap",
            url: "/",
            description:
              "Explore US public companies through their industry value chains and supply chain relationships",
            potentialAction: {
              "@type": "SearchAction",
              target: "/industries?query={search_term_string}",
              "query-input": "required name=search_term_string",
            },
          }),
        }}
      />
      {/* Hero Section - inspired by Taiwan site's header */}
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          US Supply Chain & Value Chain Platform
        </h1>
        <p className="mx-auto max-w-3xl text-xl text-muted-foreground">
          Explore public companies through their industry value chains. 
          Understand supply chain relationships and investment opportunities.
        </p>
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

      
      

      {/* Call to Action */}
      <div className="mt-16 rounded-lg bg-primary/5 p-8 text-center">
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
    </div>
  )
}


