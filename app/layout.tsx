import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import Script from "next/script"

const inter = Inter({ subsets: ["latin"] })

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "US Supply Chain & Value Chain Platform",
    template: "%s | SupplyChainMap",
  },
  description:
    "Explore US public companies through their industry value chains and supply chain relationships",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/favicon-32x32.png",
  },
  openGraph: {
    title: "US Supply Chain & Value Chain Platform",
    description:
      "Explore US public companies through their industry value chains and supply chain relationships",
    url: "/",
    siteName: "SupplyChainMap",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "US Supply Chain & Value Chain Platform",
    description:
      "Explore US public companies through their industry value chains and supply chain relationships",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-69H6XBDD50"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-69H6XBDD50');
          `}
        </Script>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  )
}

