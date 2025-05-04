"use client"

import { useEffect, useState } from "react"
import { db } from "@/lib/firebase"
import { useAuth } from "@/hooks/useAuth"
import {
    collection,
    getDocs,
    query,
    where,
    orderBy,
} from "firebase/firestore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type FeedbackEntry = {
    skillScores: Record<string, number>
    timestamp: { seconds: number }
}

export function FeedbackHistory() {
    const { user } = useAuth()
    const [groupedFeedback, setGroupedFeedback] = useState<
        Record<string, FeedbackEntry[]>
    >({})

    useEffect(() => {
        if (!user) return

        const fetchData = async () => {
            const q = query(
                collection(db, "feedback"),
                where("targetUserId", "==", user.uid),
                orderBy("timestamp")
            )

            const snapshot = await getDocs(q)
            const grouped: Record<string, FeedbackEntry[]> = {}

            snapshot.forEach((doc) => {
                const data = doc.data() as FeedbackEntry
                const dateKey = new Date(data.timestamp.seconds * 1000).toLocaleDateString()
                if (!grouped[dateKey]) grouped[dateKey] = []
                grouped[dateKey].push(data)
            })

            setGroupedFeedback(grouped)
        }

        fetchData()
    }, [user])

    if (!Object.keys(groupedFeedback).length) {
        return <p className="text-muted-foreground">No feedback yet.</p>
    }

    return (
        <div className="space-y-6">
            {Object.entries(groupedFeedback).map(([date, entries], i) => (
                <div key={date}>
                    <h2 className="text-lg font-semibold mb-2">{date}</h2>
                    <div className="grid gap-4">
                        {entries.map((entry, idx) => (
                            <Card key={idx}>
                                <CardHeader>
                                    <CardTitle className="text-sm">Anonymous Feedback #{idx + 1}</CardTitle>
                                </CardHeader>
                                <CardContent className="grid grid-cols-2 gap-2 text-sm">
                                    {Object.entries(entry.skillScores).map(([skill, score]) => (
                                        <div key={skill}>
                                            <span className="font-medium capitalize">{skill}:</span> {score}
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}