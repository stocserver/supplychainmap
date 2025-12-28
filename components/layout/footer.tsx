"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"

export function Footer() {
  const searchParams = useSearchParams()
  const country = searchParams.get("region") || "US"

  // Helper to build country-aware URLs
  const getHref = (path: string) => country !== "US" ? `${path}?region=${country}` : path

  return (
    <footer className="border-t">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Supply Chain Map</h3>
            <p className="text-sm text-muted-foreground">
              Explore public companies through their industry value chains
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Industries</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href={getHref("/industries/semiconductors")} className="text-muted-foreground hover:text-foreground">
                  Semiconductors
                </Link>
              </li>
              <li>
                <Link href={getHref("/industries/artificial-intelligence")} className="text-muted-foreground hover:text-foreground">
                  Artificial Intelligence
                </Link>
              </li>
              <li>
                <Link href={getHref("/industries/electric-vehicles")} className="text-muted-foreground hover:text-foreground">
                  Electric Vehicles
                </Link>
              </li>
              <li>
                <Link href={getHref("/industries")} className="text-muted-foreground hover:text-foreground">
                  View All
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground">
                  About
                </Link>
              </li>

              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Supply Chain Map. All rights reserved.</p>
          <p className="mt-2">
            Data provided for educational and research purposes.
          </p>
        </div>
      </div>
    </footer>
  )
}
