"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"

import { CountrySwitcher } from "@/components/layout/country-switcher"

export function Header() {
  const [open, setOpen] = useState(false)
  const searchParams = useSearchParams()
  const country = searchParams.get("region")

  // Helper to build country-aware URLs
  const getHref = (path: string) => {
    if (country && country !== 'US') {
      return `${path}?region=${country}`
    }
    return path
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container relative grid h-16 items-center grid-cols-[1fr_auto] md:grid-cols-3">
        {/* Left: Brand */}
        <div className="flex items-center">
          <Link href={getHref("/")} className="mr-6 flex items-center space-x-2 min-w-0">
            <Image
              src="/otters.png"
              alt="StockOtters"
              width={40}
              height={40}
              className="h-8 w-auto sm:h-10 md:h-12 shrink-0"
            />
            {/* Brand text shrinks and truncates on narrow screens */}
            <div className="flex flex-col leading-tight min-w-0">
              <span className="text-[10px] sm:text-xs font-medium text-muted-foreground truncate">StockOtters</span>
              <span className="text-sm sm:text-base font-bold truncate">Supply Chain Map</span>
            </div>
          </Link>
        </div>

        {/* Center: Nav (desktop) */}
        <div className="hidden md:flex items-center justify-center">
          <nav className="flex items-center space-x-8">
            <Link
              href={getHref("/industries")}
              className="text-sm font-medium transition-colors hover:text-foreground text-foreground/60"
            >
              Industries
            </Link>
            {/* Analysis link hidden until backend timeout is resolved
            <Link
              href={getHref("/analysis")}
              className="text-sm font-medium transition-colors hover:text-foreground text-foreground/60"
            >
              Analysis
            </Link>
            */}
            <Link
              href={getHref("/companies")}
              className="transition-colors hover:text-foreground/80 text-foreground/60 text-sm font-medium"
            >
              Companies
            </Link>
            <Link
              href="/blog"
              className="transition-colors hover:text-foreground/80 text-foreground/60 text-sm font-medium"
            >
              Blog
            </Link>
            <Link
              href="/about"
              className="transition-colors hover:text-foreground/80 text-foreground/60 text-sm font-medium"
            >
              About
            </Link>
          </nav>
        </div>

        {/* Right: Actions (Desktop) - Country Switcher */}
        <div className="hidden md:flex justify-end">
          <CountrySwitcher />
        </div>

        {/* Right: Kebab (mobile) */}
        <div className="flex justify-end md:hidden">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[90%] max-w-sm">
              <nav className="flex flex-col space-y-4 pt-4">
                <Link
                  href={getHref("/industries")}
                  className="text-base font-medium px-2 py-2"
                  onClick={() => setOpen(false)}
                >
                  Industries
                </Link>
                {/* Analysis link hidden until backend timeout is resolved
                <Link
                  href={getHref("/analysis")}
                  className="text-base font-medium px-2 py-2"
                  onClick={() => setOpen(false)}
                >
                  Analysis
                </Link>
                */}
                <Link
                  href={getHref("/companies")}
                  className="transition-colors hover:text-foreground/80 text-foreground/60 text-base font-medium px-2 py-2"
                  onClick={() => setOpen(false)}
                >
                  Companies
                </Link>
                <Link
                  href="/blog"
                  className="transition-colors hover:text-foreground/80 text-foreground/60 text-base font-medium px-2 py-2"
                  onClick={() => setOpen(false)}
                >
                  Blog
                </Link>
                <Link
                  href="/about"
                  className="transition-colors hover:text-foreground/80 text-foreground/60 text-base font-medium px-2 py-2"
                  onClick={() => setOpen(false)}
                >
                  About
                </Link>
                <div className="px-2 pt-4 border-t">
                  <CountrySwitcher />
                </div>
              </nav>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </header>
  )
}
