import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Supply Chain Map</h3>
            <p className="text-sm text-muted-foreground">
              Explore US public companies through their industry value chains
            </p>
          </div>
          
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Industries</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/industries/semiconductors" className="text-muted-foreground hover:text-foreground">
                  Semiconductors
                </Link>
              </li>
              <li>
                <Link href="/industries/artificial-intelligence" className="text-muted-foreground hover:text-foreground">
                  Artificial Intelligence
                </Link>
              </li>
              <li>
                <Link href="/industries/electric-vehicles" className="text-muted-foreground hover:text-foreground">
                  Electric Vehicles
                </Link>
              </li>
              <li>
                <Link href="/industries" className="text-muted-foreground hover:text-foreground">
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
                <Link href="/api-docs" className="text-muted-foreground hover:text-foreground">
                  API Documentation
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
            Data provided by Yahoo Finance. Built for educational and research purposes.
          </p>
        </div>
      </div>
    </footer>
  )
}


