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
                                stroke="#8884d8"
                                strokeWidth={2}
                                dot={{ r: 2 }}
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}