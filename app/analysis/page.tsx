
"use client"

import { useState, useRef, useEffect } from "react"
import { Send, AlertTriangle, TrendingUp, TrendingDown, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import Link from "next/link"

interface Impact {
    tag: string
    sentiment: 'positive' | 'negative'
    reason: string
}

interface Company {
    ticker: string
    name: string
    market_cap: number
    logo_url: string
    country: string
    matched_impacts: Impact[]
    overall_sentiment: 'positive' | 'negative' | 'mixed' | 'neutral'
    specific_reason?: string
}

interface AnalysisResult {
    summary: string
    impacts: Impact[]
}



const LoadingDots = () => {
    const [dots, setDots] = useState(".")

    useEffect(() => {
        const interval = setInterval(() => {
            setDots(prev => prev.length >= 3 ? "." : prev + ".")
        }, 500)
        return () => clearInterval(interval)
    }, [])

    return <span className="animate-pulse">{dots}</span>
}

const ThinkingConsole = ({ logs }: { logs: string[] }) => {
    const bottomRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [logs])

    if (logs.length === 0) return null

    return (
        <div className="max-w-3xl mx-auto mt-6 bg-slate-950 rounded-lg border border-slate-800 shadow-2xl overflow-hidden font-mono text-xs mb-8 relative group">
            {/* Ambient Glow Effect */}
            <div className="absolute inset-0 bg-blue-500/5 group-hover:bg-blue-500/10 transition-colors pointer-events-none" />

            <div className="flex items-center gap-2 px-4 py-2 border-b border-slate-800 bg-slate-900/50 relative z-10">
                <div className="flex gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-red-500/80 shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
                    <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/80 shadow-[0_0_8px_rgba(234,179,8,0.6)]" />
                    <div className="h-2.5 w-2.5 rounded-full bg-green-500/80 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                </div>
                <span className="text-slate-400 ml-2 flex items-center gap-2">
                    system_process
                    — analysis running
                    <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                </span>
            </div>

            <div className="p-4 h-32 overflow-y-auto space-y-2 bg-black/90 text-slate-300 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent relative z-10">
                {logs.map((log, i) => (
                    <div key={i} className="flex gap-2">
                        <span className="text-slate-600 select-none shrink-0">{`>`}</span>
                        <span className={`${log.includes('⚠️') ? 'text-yellow-400' : log.includes('❌') ? 'text-red-400' : log.includes('✅') ? 'text-green-400' : log.includes('🌐') ? 'text-blue-400' : 'text-slate-300'} break-words`}>
                            {log}
                            {i === logs.length - 1 && <LoadingDots />}
                        </span>
                    </div>
                ))}
                <div ref={bottomRef} />
            </div>
        </div>
    )
}

export default function AnalysisPage() {
    const [query, setQuery] = useState("")
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<{ analysis: AnalysisResult, companies: Company[] } | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [logs, setLogs] = useState<string[]>([])
    const [useRag, setUseRag] = useState(true) // RAG V2 is now the only option (Tag-based disabled)
    const [embeddingVersion, setEmbeddingVersion] = useState<'v1' | 'v2'>('v2') // V2 is now default (V1 disabled but code preserved)

    // Pool of random scenarios (comprehensive coverage)
    const scenarioPool = [
        // === GEOPOLITICAL & TRADE ===
        "What if the US imposes 100% tariffs on all Chinese imports?",
        "What if China invades Taiwan?",
        "What if Russia escalates war with NATO involvement?",
        "What if North Korea launches missiles at South Korea?",
        "What if Iran blockades the Strait of Hormuz?",
        "What if India and Pakistan enter armed conflict?",
        "What if the EU breaks apart after France exits?",
        "What if US-Mexico border closes completely?",
        "What if China annexes the South China Sea?",
        "What if Saudi Arabia and Iran go to war?",

        // === NATURAL DISASTERS (By Region) ===
        "What if a 9.0 earthquake devastates Tokyo, Japan?",
        "What if a massive earthquake hits Taiwan's chip foundries?",
        "What if Category 5 hurricanes destroy Texas refineries?",
        "What if flooding shuts down German automotive factories?",
        "What if wildfires devastate California's tech corridor?",
        "What if a tsunami hits Vietnam's manufacturing coast?",
        "What if a volcanic eruption grounds all European flights?",
        "What if drought collapses Brazil's soybean harvest?",
        "What if monsoons flood Bangladesh's garment factories?",

        // === ENERGY & COMMODITIES ===
        "What if OPEC cuts oil production by 30%?",
        "What if OPEC floods the market, dropping oil to $30/barrel?",
        "What if Russia cuts all natural gas to Europe?",
        "What if lithium prices triple due to Chile mine closures?",
        "What if copper prices spike 200% on Congo supply disruption?",
        "What if uranium prices surge on nuclear renaissance?",
        "What if cobalt supply from DRC is completely cut off?",
        "What if nickel exports from Indonesia are banned?",

        // === TECHNOLOGY & SEMICONDUCTORS ===
        "What if TSMC factories are destroyed in Taiwan conflict?",
        "What if a global chip shortage lasts 3 more years?",
        "What if China achieves 5nm chip independence?",
        "What if Intel's new fabs double US chip production?",
        "What if quantum computing breaks current encryption?",
        "What if AI regulation bans large language models in EU?",
        "What if a solar storm destroys global satellite networks?",
        "What if 5G infrastructure is banned in major economies?",

        // === FINANCE & MONETARY POLICY ===
        "What if the Federal Reserve raises rates to 10%?",
        "What if China's real estate market completely collapses?",
        "What if the US dollar loses reserve currency status?",
        "What if Japan's yen crashes 50% against the dollar?",
        "What if a major global bank fails like Lehman 2.0?",
        "What if cryptocurrency replaces 20% of global transactions?",
        "What if emerging markets face mass debt defaults?",
        "What if hyperinflation hits major European economies?",

        // === HEALTHCARE & PHARMA ===
        "What if a new pandemic deadlier than COVID emerges?",
        "What if antibiotic resistance causes untreatable infections?",
        "What if a breakthrough cure for cancer is discovered?",
        "What if mRNA technology cures Alzheimer's disease?",
        "What if India bans all generic drug exports?",
        "What if China's pharmaceutical supply chain is sanctioned?",
        "What if a bird flu pandemic shuts down global poultry?",

        // === AGRICULTURE & FOOD ===
        "What if Ukraine and Russia stop all grain exports?",
        "What if climate change destroys 30% of global wheat production?",
        "What if fertilizer prices triple on natural gas crisis?",
        "What if lab-grown meat becomes 50% cheaper than beef?",
        "What if a pest destroys Southeast Asia's rice crops?",
        "What if coffee rust disease collapses global coffee supply?",
        "What if water shortages halt California agriculture?",

        // === LOGISTICS & INFRASTRUCTURE ===
        "What if the Suez Canal is blocked for 6 months?",
        "What if the Panama Canal runs dry from drought?",
        "What if major US ports face year-long labor strikes?",
        "What if a cyberattack shuts down global shipping?",
        "What if autonomous trucks replace 50% of trucking jobs?",
        "What if Maersk and MSC merge into shipping monopoly?",
        "What if air freight costs triple on fuel crisis?",

        // === AUTOMOTIVE & EV ===
        "What if EV battery costs drop 70% overnight?",
        "What if Tesla's new battery eliminates cobalt dependency?",
        "What if Toyota announces solid-state battery breakthrough?",
        "What if autonomous vehicles are approved globally?",
        "What if combustion engine cars are banned by 2030?",
        "What if Chinese EVs dominate the global market?",
        "What if a major EV recall destroys consumer confidence?",

        // === POSITIVE BREAKTHROUGHS ===
        "What if nuclear fusion becomes commercially viable?",
        "What if solar efficiency reaches 50%?",
        "What if carbon capture becomes profitable?",
        "What if desalination solves global water crisis?",
        "What if vertical farming reduces food costs by 80%?",
        "What if room-temperature superconductors are discovered?",
        "What if the US and China sign comprehensive trade peace?",
        "What if Africa's economy grows 10% annually for a decade?",
        "What if India becomes the world's manufacturing hub?",
        "What if global shipping goes fully carbon-neutral?",
    ]

    const getRandomScenario = () => {
        const randomIndex = Math.floor(Math.random() * scenarioPool.length)
        setQuery(scenarioPool[randomIndex])
    }

    const handleAnalyze = async () => {
        if (!query.trim()) return
        setLoading(true)
        setError(null)
        setResult(null)
        setLogs([]) // Clear previous logs

        try {
            const endpoint = useRag ? '/api/analysis-rag' : '/api/analysis'
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query, embeddingVersion }),
                cache: 'no-store'
            })

            if (!res.ok) throw new Error('Analysis failed check console.')

            if (!res.body) throw new Error('No response body')

            // Stream reading logic
            const reader = res.body.getReader()
            const decoder = new TextDecoder()
            let buffer = ''

            while (true) {
                const { done, value } = await reader.read()
                if (done) break

                buffer += decoder.decode(value, { stream: true })
                const lines = buffer.split('\n')
                buffer = lines.pop() || '' // Keep partial line

                for (const line of lines) {
                    if (!line.trim()) continue
                    try {
                        const msg = JSON.parse(line)
                        if (msg.type === 'log') {
                            setLogs(prev => [...prev, msg.message])
                        } else if (msg.type === 'result') {
                            setResult(msg.data)
                        } else if (msg.type === 'error') {
                            throw new Error(msg.message)
                        }
                    } catch (e) {
                        console.error('Error parsing stream chunk', e)
                    }
                }
            }

        } catch (err: any) {
            setError(err.message)
            setLogs(prev => [...prev, `❌ Critical Error: ${err.message}`])
        } finally {
            setLoading(false)
        }
    }

    const formatMCap = (val: number) => {
        return val ? `$${(val / 1e9).toFixed(1)}B` : 'N/A'
    }

    return (
        <div className="container max-w-7xl mx-auto py-8 px-4 space-y-8">

            {/* Header Section */}
            {/* Header Section */}
            <div className="flex flex-col items-center text-center space-y-2 mb-6">
                <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                    Scenario Analysis
                    <span className="px-1.5 py-0.5 rounded-sm bg-blue-500/20 text-blue-600 text-[10px] font-semibold border border-blue-500/30 align-middle">BETA</span>
                    <div className="p-1 bg-blue-50 rounded-full inline-block">
                        <Info className="h-4 w-4 text-blue-600" />
                    </div>
                </h1>
                <p className="text-muted-foreground max-w-2xl text-sm">
                    Ask &quot;What if&quot; questions to map ripple effects. AI identifies winners and losers based on live supply chain data.
                </p>
            </div>

            {/* Input Section */}
            <Card className="max-w-3xl mx-auto border-blue-100 shadow-sm">
                <CardContent className="p-4 space-y-3">
                    <div className="flex gap-2 flex-col sm:flex-row">
                        <Input
                            placeholder="e.g. What if the US imposes comprehensive trade tariffs?"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                            disabled={loading}
                            className="flex-1"
                        />
                        <Button
                            onClick={handleAnalyze}
                            disabled={loading || !query.trim()}
                            className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
                        >
                            {loading ? "Analyzing..." : (
                                <>
                                    Analyze <Send className="ml-2 h-4 w-4" />
                                </>
                            )}
                        </Button>
                    </div>

                    {/* Random Scenario Button */}
                    <div className="flex justify-center pt-1">
                        <button
                            onClick={getRandomScenario}
                            className="px-4 py-2 text-sm bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:from-purple-600 hover:to-pink-600 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                        >
                            🎲 Random Scenario
                        </button>
                    </div>

                    {/* Tag-Based/RAG Toggle DISABLED - RAG V2 is now the only option
                    <div className="flex items-center justify-center gap-2 pt-2 border-t border-slate-100">
                        <span className={`text-xs ${!useRag ? 'font-semibold text-blue-600' : 'text-slate-400'}`}>
                            Tag-Based
                        </span>
                        <button
                            onClick={() => setUseRag(!useRag)}
                            className={`relative w-12 h-6 rounded-full transition-colors ${useRag ? 'bg-purple-500' : 'bg-slate-300'
                                }`}
                        >
                            <span
                                className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${useRag ? 'translate-x-7' : 'translate-x-1'
                                    }`}
                            />
                        </button>
                        <span className={`text-xs ${useRag ? 'font-semibold text-purple-600' : 'text-slate-400'}`}>
                            RAG (AI Search)
                        </span>
                    </div>
                    */}

                    {/* V1/V2 Toggle DISABLED - V2 is now default
                    {useRag && (
                        <div className="flex items-center justify-center gap-2 pt-2">
                            <span className="text-xs text-slate-500">Embedding:</span>
                            <button
                                onClick={() => setEmbeddingVersion('v1')}
                                className={`px-2 py-1 text-xs rounded ${embeddingVersion === 'v1'
                                    ? 'bg-blue-100 text-blue-700 font-semibold'
                                    : 'bg-slate-100 text-slate-500'
                                    }`}
                            >
                                V1 (768d)
                            </button>
                            <button
                                onClick={() => setEmbeddingVersion('v2')}
                                className={`px-2 py-1 text-xs rounded ${embeddingVersion === 'v2'
                                    ? 'bg-green-100 text-green-700 font-semibold'
                                    : 'bg-slate-100 text-slate-500'
                                    }`}
                            >
                                V2 (3072d) ✨
                            </button>
                        </div>
                    )}
                    */}
                </CardContent>
            </Card>

            {/* Thinking Console - Visible only when processing */}
            {(loading || (!result && logs.length > 0)) && (
                <ThinkingConsole logs={logs} />
            )}

            {/* Error State */}
            {error && (
                <div className="max-w-3xl mx-auto p-4 bg-red-50 text-red-700 rounded-md flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    {error}
                </div>
            )}

            {/* Results Section */}
            {result && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

                    {/* AI Summary */}
                    <Card className="bg-slate-50/50 border-slate-200">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <span className="text-xl">🤖 AI Assessment</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-lg leading-relaxed text-slate-700">{result.analysis.summary}</p>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                        {/* Winners Column */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 pb-2 border-b border-green-200">
                                <TrendingUp className="h-6 w-6 text-green-600" />
                                <h3 className="text-xl font-bold text-green-800">Potential Beneficiaries</h3>
                            </div>

                            {result.companies.filter(c => c.overall_sentiment === 'positive').length === 0 ? (
                                <p className="text-muted-foreground italic">No clear beneficiaries identified.</p>
                            ) : (
                                <div className="grid grid-cols-1 gap-4">
                                    {result.companies
                                        .filter(c => c.overall_sentiment === 'positive')
                                        .map(company => (
                                            <Card key={company.ticker} className="overflow-hidden border-green-100 hover:shadow-md transition-shadow">
                                                <div className="p-4 flex items-start gap-4">

                                                    <div className="flex-1 min-w-0">
                                                        <Link href={`/companies/${company.ticker}`} className="hover:underline">
                                                            <h4 className="font-bold text-lg truncate">{company.name}</h4>
                                                        </Link>
                                                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                                            <span className="font-mono">{company.ticker}</span>
                                                            <span>•</span>
                                                            <span>{company.country}</span>
                                                            <span>•</span>
                                                            <span>{formatMCap(company.market_cap)}</span>
                                                        </div>
                                                        <div className="flex flex-wrap gap-2">
                                                            {company.matched_impacts.map((impact, idx) => (
                                                                <Badge key={idx} variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                                                    {impact.tag}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                        <div className="mt-3 p-2 bg-green-50 rounded text-sm text-green-900">
                                                            <span className="font-semibold block mb-1">AI Reasoning:</span>
                                                            {company.specific_reason || company.matched_impacts[0]?.reason || "Analysis pending..."}
                                                        </div>
                                                    </div>
                                                </div>
                                            </Card>
                                        ))}
                                </div>
                            )}
                        </div>

                        {/* Losers Column */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 pb-2 border-b border-red-200">
                                <TrendingDown className="h-6 w-6 text-red-600" />
                                <h3 className="text-xl font-bold text-red-800">At Risk</h3>
                            </div>

                            {result.companies.filter(c => c.overall_sentiment === 'negative').length === 0 ? (
                                <p className="text-muted-foreground italic">No clear risks identified.</p>
                            ) : (
                                <div className="grid grid-cols-1 gap-4">
                                    {result.companies
                                        .filter(c => c.overall_sentiment === 'negative')
                                        .map(company => (
                                            <Card key={company.ticker} className="overflow-hidden border-red-100 hover:shadow-md transition-shadow">
                                                <div className="p-4 flex items-start gap-4">

                                                    <div className="flex-1 min-w-0">
                                                        <Link href={`/companies/${company.ticker}`} className="hover:underline">
                                                            <h4 className="font-bold text-lg truncate">{company.name}</h4>
                                                        </Link>
                                                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                                            <span className="font-mono">{company.ticker}</span>
                                                            <span>•</span>
                                                            <span>{company.country}</span>
                                                            <span>•</span>
                                                            <span>{formatMCap(company.market_cap)}</span>
                                                        </div>
                                                        <div className="flex flex-wrap gap-2">
                                                            {company.matched_impacts.map((impact, idx) => (
                                                                <Badge key={idx} variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                                                    {impact.tag}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                        <div className="mt-3 p-2 bg-red-50 rounded text-sm text-red-900">
                                                            <span className="font-semibold block mb-1">AI Reasoning:</span>
                                                            {company.specific_reason || company.matched_impacts[0]?.reason || "Analysis pending..."}
                                                        </div>
                                                    </div>
                                                </div>
                                            </Card>
                                        ))}
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            )}
        </div>
    )
}
