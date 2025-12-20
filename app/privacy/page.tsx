import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Privacy Policy | SupplyChainMap",
    description: "Privacy Policy for SupplyChainMap.",
}

export default function PrivacyPage() {
    return (
        <div className="container max-w-3xl py-12 md:py-24">
            <h1 className="mb-6 text-4xl font-bold tracking-tight">Privacy Policy</h1>
            <div className="prose max-w-none text-muted-foreground">
                <p>Last updated: December 2025</p>
                <p>
                    At SupplyChainMap, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your personal information.
                </p>

                <h2 className="mt-8 text-2xl font-semibold text-foreground">1. Information We Collect</h2>
                <p>
                    We currently do not collect any personal data from users. We are an educational resource providing public market data.
                </p>

                <h2 className="mt-8 text-2xl font-semibold text-foreground">2. Cookies</h2>
                <p>
                    We may use cookies to improve website performance and user experience.
                </p>

                <h2 className="mt-8 text-2xl font-semibold text-foreground">3. Contact Us</h2>
                <p>
                    If you have any questions about this Privacy Policy, please contact us at hello@supplychainmap.com.
                </p>
            </div>
        </div>
    )
}
