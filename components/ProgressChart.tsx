"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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

const mockData = [
    { session: "Week 1", posture: 2, timing: 1, connection: 2 },
    { session: "Week 2", posture: 3, timing: 2, connection: 2 },
    { session: "Week 3", posture: 3, timing: 3, connection: 3 },
]

export function ProgressChart() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Progress Over Time</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={mockData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="session" />
                        <YAxis domain={[1, 3]} />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="posture" stroke="#8884d8" />
                        <Line type="monotone" dataKey="timing" stroke="#82ca9d" />
                        <Line type="monotone" dataKey="connection" stroke="#ffc658" />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}
