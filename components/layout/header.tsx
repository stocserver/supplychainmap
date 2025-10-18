import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="text-xl font-bold">Supply Chain Map</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/industries"
              className="transition-colors hover:text-foreground/80 text-foreground"
            >
              Industries
            </Link>
            <Link
              href="/companies"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Companies
            </Link>
            <Link
              href="/about"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              About
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <Link href="/industries" className="hidden md:inline-flex">
            <Button size="sm" className="gap-2">Explore Industries</Button>
          </Link>
          <Link href="/industries" className="md:hidden">
            <Button size="sm" variant="secondary">Explore</Button>
          </Link>
        </div>
      </div>
    </header>
  )
}


