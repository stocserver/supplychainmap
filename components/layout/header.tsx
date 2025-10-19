import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container grid h-16 grid-cols-3 items-center">
        {/* Left: Brand */}
        <div className="flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Image 
              src="/otters.png" 
              alt="StockOtters" 
              width={40} 
              height={40}
              className="h-8 w-auto sm:h-10 md:h-12"
            />
            <div className="flex flex-col">
              <span className="text-xs font-medium text-muted-foreground sm:text-sm">StockOtters</span>
              <span className="text-base font-bold sm:text-lg">Supply Chain Map</span>
            </div>
          </Link>
        </div>

        {/* Center: Nav (desktop) */}
        <div className="hidden md:flex items-center justify-center">
          <nav className="flex items-center space-x-8">
            <Link
              href="/industries"
              className="text-base font-semibold transition-colors hover:text-foreground"
            >
              Industries
            </Link>
            <Link
              href="/companies"
              className="transition-colors hover:text-foreground/80 text-foreground/60 text-sm font-medium"
            >
              Companies
            </Link>
            <Link
              href="/about"
              className="transition-colors hover:text-foreground/80 text-foreground/60 text-sm font-medium"
            >
              About
            </Link>
          </nav>
        </div>

        {/* Right: Kebab (mobile) */}
        <div className="flex justify-end md:hidden">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[90%] max-w-sm">
              <nav className="flex flex-col space-y-4 pt-4">
                <Link
                  href="/industries"
                  className="text-lg font-semibold px-2 py-2"
                >
                  Industries
                </Link>
                <Link
                  href="/companies"
                  className="transition-colors hover:text-foreground/80 text-foreground/60 text-base font-medium px-2 py-2"
                >
                  Companies
                </Link>
                <Link
                  href="/about"
                  className="transition-colors hover:text-foreground/80 text-foreground/60 text-base font-medium px-2 py-2"
                >
                  About
                </Link>
              </nav>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </header>
  )
}


