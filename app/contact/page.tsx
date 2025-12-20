import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Contact Us | SupplyChainMap",
    description: "Get in touch with the SupplyChainMap team.",
}

export default function ContactPage() {
    return (
        <div className="container max-w-3xl py-12 md:py-24">
            <h1 className="mb-6 text-4xl font-bold tracking-tight">Contact Us</h1>
            <div className="prose max-w-none text-muted-foreground">
                <p className="text-lg leading-relaxed">
                    Have questions, feedback, or suggestions for Supply Chain Map? We&apos;d love to hear from you.
                </p>

                <div className="mt-8 rounded-lg border bg-card p-6 md:p-10">
                    <p className="mb-4">
                        For general inquiries, please email us at:
                    </p>
                    <a
                        href="mailto:stocserver@gmail.com"
                        className="text-2xl font-semibold text-primary hover:underline"
                    >
                        stocserver@gmail.com
                    </a>

                    <p className="mt-8 text-sm">
                        We typically respond within 24-48 hours.
                    </p>
                </div>
            </div>
        </div>
    )
}
