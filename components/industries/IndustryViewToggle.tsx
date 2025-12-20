'use client'

import { ReactNode } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Layers, BarChart3 } from 'lucide-react'

interface IndustryViewToggleProps {
    valueChain: ReactNode
    visualMap: ReactNode
}

export function IndustryViewToggle({ valueChain, visualMap }: IndustryViewToggleProps) {
    return (
        <Tabs defaultValue="visual" className="w-full">
            <div className="flex justify-center mb-6 sm:mb-8">
                <TabsList className="grid w-full max-w-[300px] sm:max-w-[400px] grid-cols-2 p-1 bg-slate-100 rounded-xl">
                    <TabsTrigger
                        value="visual"
                        className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all py-2"
                    >
                        <BarChart3 className="h-4 w-4" />
                        <span className="font-semibold">Leaderboard</span>
                    </TabsTrigger>
                    <TabsTrigger
                        value="value-chain"
                        className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all py-2"
                    >
                        <Layers className="h-4 w-4" />
                        <span className="font-semibold">Value Chain</span>
                    </TabsTrigger>
                </TabsList>
            </div>

            <TabsContent value="visual" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                {visualMap}
            </TabsContent>
            <TabsContent value="value-chain" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                {valueChain}
            </TabsContent>
        </Tabs>
    )
}
