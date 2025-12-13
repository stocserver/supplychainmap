import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileQuestion } from "lucide-react"

export default function NotFound() {
    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center px-4">
            <div className="mb-6 rounded-full bg-muted p-6">
                <FileQuestion className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="mb-2 text-3xl font-bold tracking-tight">Page Not Found</h2>
            <p className="mb-8 text-muted-foreground max-w-md">
                Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved, deleted, or never existed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/">
                    <Button variant="default">Go Home</Button>
                </Link>
                <Link href="/companies">
                    <Button variant="outline">Browse Companies</Button>
                </Link>
                <Link href="/blog">
                    <Button variant="ghost">Read Blog</Button>
                </Link>
            </div>
        </div>
    )
}
