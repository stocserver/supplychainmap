import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SupplyChainMap - US Supply Chain & Value Chain Platform",
    short_name: "SupplyChainMap",
    description:
      "Explore US public companies through their industry value chains and supply chain relationships",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      {
        src: "/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
    ],
  }
}
