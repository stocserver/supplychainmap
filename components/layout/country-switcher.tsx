"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Monitor, Moon, Sun } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const countries = [
    { code: "US", name: "United States", flag: "🇺🇸", color: "bg-background" },
    // { code: "CN", name: "China", flag: "🇨🇳", color: "bg-red-50" }, // Coming soon
    { code: "JP", name: "Japan", flag: "🇯🇵", color: "bg-yellow-50" },
    // { code: "EU", name: "Europe", flag: "🇪🇺", color: "bg-green-50" }, // Coming soon
]

export function CountrySwitcher() {
    const router = useRouter()
    const searchParams = useSearchParams()
    // Default to US if no param
    const currentCode = searchParams.get("country") || "US"
    const currentCountry = countries.find(c => c.code === currentCode) || countries[0]

    // Effect to apply theme
    React.useEffect(() => {
        // Reset classes
        document.body.classList.remove("bg-red-50", "bg-blue-50", "bg-yellow-50", "bg-green-50", "bg-background")

        // Apply new theme class
        if (currentCountry.code === "CN") {
            document.body.classList.add("bg-red-50")
        } else if (currentCountry.code === "JP") {
            document.body.classList.add("bg-yellow-50")
        } else if (currentCountry.code === "EU") {
            document.body.classList.add("bg-green-50")
        } else {
            document.body.classList.add("bg-background")
        }
    }, [currentCountry])

    const handleSelect = (code: string) => {
        // Update URL param with full page reload to get fresh server data
        const params = new URLSearchParams(searchParams.toString())
        if (code === "US") {
            params.delete("country")
        } else {
            params.set("country", code)
        }

        // Get current pathname and build new URL
        const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`

        // Use window.location for hard reload to ensure server-side data is refetched
        window.location.href = newUrl
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="w-[140px] justify-start gap-2">
                    <span>{currentCountry.flag}</span>
                    <span>{currentCountry.name}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {countries.map((country) => (
                    <DropdownMenuItem
                        key={country.code}
                        onClick={() => handleSelect(country.code)}
                        className="gap-2"
                    >
                        <span>{country.flag}</span>
                        <span>{country.name}</span>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
