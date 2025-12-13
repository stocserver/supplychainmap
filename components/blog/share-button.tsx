"use client"

import { Button } from "@/components/ui/button"
import { Share2 } from "lucide-react"

interface ShareButtonProps {
    title: string
    url: string
}

export function ShareButton({ title, url }: ShareButtonProps) {
    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({ title, url })
            } catch (err) {
                // User cancelled or error
            }
        } else {
            // Fallback: copy to clipboard
            await navigator.clipboard.writeText(url)
            alert("Link copied to clipboard!")
        }
    }

    return (
        <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
            onClick={handleShare}
        >
            <Share2 className="mr-1.5 h-4 w-4" />
            Share
        </Button>
    )
}
