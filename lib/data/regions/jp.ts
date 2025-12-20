// Japan regional data - company tickers mapped to industry nodes
// Uses TSE tickers imported via FMP stable API

export const jpData: Record<string, {
    featured: string[]
    nodes: Record<string, string[]>
}> = {}
