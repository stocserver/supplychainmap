import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Terms of Service | SupplyChainMap",
    description: "Terms of Service for SupplyChainMap.",
}

export default function TermsPage() {
    return (
        <div className="container max-w-3xl py-12 md:py-24">
            <h1 className="mb-6 text-4xl font-bold tracking-tight">Terms of Service</h1>
            <div className="prose max-w-none text-muted-foreground">
                <p>Last updated: December 2025</p>
                <p>
                    By accessing or using SupplyChainMap, you agree to be bound by these Terms of Service.
                </p>

                <h2 className="mt-8 text-2xl font-semibold text-foreground">1. Use of Data</h2>
                <p>
                    SupplyChainMap is provided for educational and informational purposes only. The financial data provided is sourced from third parties like Yahoo Finance and may not be real-time or accurate.
                </p>
                <p>
                    Do not make investment decisions based solely on information found on this site.
                </p>

                <h2 className="mt-8 text-2xl font-semibold text-foreground">2. Disclaimer</h2>
                <p>
                    THE SERVICE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND. WE DISCLAIM ALL LIABILITIES.
                </p>

                <h2 className="mt-8 text-2xl font-semibold text-foreground">3. Changes</h2>
                <p>
                    We reserve the right to modify these terms at any time.
                </p>
            </div>
        </div>
    )
}
