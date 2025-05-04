"use client"

import { useEffect, useState } from "react"
import { db } from "@/lib/firebase"
import { collection, query, where, getDocs, orderBy } from "firebase/firestore"
import { useAuth } from "@/hooks/useAuth"
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

type FeedbackEntry = {
    skillScores: Record<string, number>
    timestamp: { seconds: number }
}

export function ProgressChart() {
    const { user } = useAuth()
    const [data, setData] = useState<any[]>([])

    const skillColors: Record<string, string> = {
        posture: "#6366F1",     // Indigo
        timing: "#10B981",      // Emerald
        connection: "#F59E0B",  // Amber
        patterns: "#3B82F6",    // Blue
        musicality: "#EC4899",  // Pink
        anchor: "#8B5CF6",      // Violet
        center: "#EF4444",      // Red
    }

    useEffect(() => {
        if (!user) return

        const fetchFeedback = async () => {
            const q = query(
                collection(db, "feedback"),
                where("targetUserId", "==", user.uid),
                orderBy("timestamp")
            )
            const snapshot = await getDocs(q)

            const formatted = snapshot.docs.map((doc) => {
                const entry = doc.data() as FeedbackEntry
                const date = new Date(entry.timestamp.seconds * 1000)
                return {
                    date: date.toLocaleDateString(),
                    ...entry.skillScores,
                }
            })

            setData(formatted)
        }

        fetchFeedback()
    }, [user])

    if (!data.length) {
        return <p className="text-muted-foreground">No feedback yet.</p>
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Your Progress</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis domain={[1, 3]} tickCount={3} />
                        <Tooltip />
                        <Legend />
                        {Object.keys(data[0]).filter(k => k !== "date").map((key) => (
                            <Line
                                key={key}
                                type="monotone"
                                dataKey={key}
                                stroke={skillColors[key] || "#8884d8"}
                                strokeWidth={2}
                                dot={{ r: 2 }}
                                activeDot={{ r: 4 }}
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}