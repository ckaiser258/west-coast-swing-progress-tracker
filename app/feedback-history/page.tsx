import { FeedbackHistory } from "@/components/FeedbackHistory";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function FeedbackHistoryPage() {
    return (
        <main className="p-6 max-w-3xl mx-auto space-y-4">
            <Button asChild variant="link" className="pl-0">
                <Link href="/">← Back to Home</Link>
            </Button>

            <h1 className="text-2xl font-bold">Your Feedback History</h1>
            <FeedbackHistory />
        </main>
    )
}