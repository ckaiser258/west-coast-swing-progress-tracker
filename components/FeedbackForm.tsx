// components/FeedbackForm.tsx
"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { useState } from "react"

const skillAreas = [
    { id: "posture", label: "Posture & Pitch" },
    { id: "timing", label: "Rolling Count Timing" },
    { id: "connection", label: "Basic Connection Tone" },
    { id: "anchor", label: "Anchor Awareness" },
    { id: "musicality", label: "Beginner Musical Awareness" },
]

export function FeedbackForm({ onSubmit }: { onSubmit: (data: any) => void }) {
    const [scores, setScores] = useState<Record<string, number>>(
        Object.fromEntries(skillAreas.map((area) => [area.id, 2])) // Default score = 2
    )

    const handleChange = (id: string, value: number[]) => {
        setScores((prev) => ({ ...prev, [id]: value[0] }))
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Submit Feedback</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {skillAreas.map(({ id, label }) => (
                    <div key={id}>
                        <Label htmlFor={id}>{label}</Label>
                        <Slider
                            id={id}
                            min={1}
                            max={3}
                            step={1}
                            value={[scores[id]]}
                            onValueChange={(value) => handleChange(id, value)}
                        />
                    </div>
                ))}
                <Button onClick={() => onSubmit(scores)}>Submit</Button>
            </CardContent>
        </Card>
    )
}
