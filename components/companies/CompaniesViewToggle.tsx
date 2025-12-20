'use client'

import { ReactNode, useState } from 'react'
import { LayoutGrid, BarChart3 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CompaniesViewToggleProps {
    gridView: ReactNode
    leaderboardView: ReactNode
}

export function CompaniesViewToggle({ gridView, leaderboardView }: CompaniesViewToggleProps) {
    const [view, setView] = useState<'grid' | 'leaderboard'>('grid')

    return (
        <div className="w-full">
            {/* Toggle Buttons */}
            <div className="flex justify-center mb-6 sm:mb-8">
                <div className="inline-flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
                    <button
                        onClick={() => setView('grid')}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all",
                            view === 'grid'
                                ? "bg-white shadow-sm text-slate-900"
                                : "text-slate-500 hover:text-slate-700"
                        )}
                    >
                        <LayoutGrid className="h-4 w-4" />
                        <span className="hidden sm:inline">Grid</span>
                    </button>
                    <button
                        onClick={() => setView('leaderboard')}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all",
                            view === 'leaderboard'
                                ? "bg-white shadow-sm text-slate-900"
                                : "text-slate-500 hover:text-slate-700"
                        )}
                    >
                        <BarChart3 className="h-4 w-4" />
                        <span className="hidden sm:inline">Leaderboard</span>
                    </button>
                </div>
            </div>

            {/* Content */}
            {view === 'grid' ? gridView : leaderboardView}
        </div>
    )
}
