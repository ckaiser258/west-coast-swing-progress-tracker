"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { useAuth } from "@/hooks/useAuth"
import { db } from "@/lib/firebase"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"

const skillAreas = [
    {
        id: "posture",
        label: "Posture & Pitch",
        description:
            "Standing tall with knees soft, chest lifted, arms present, and head neutral. Gaze is upright and engaged.",
        error: "No pitch or hunching from the hips, disconnected movement.",
    },
    {
        id: "center",
        label: "Center-Led Movement",
        description:
            "Movement initiated from the core/pelvis, not the arms. Anchor felt in the body, not just through foot movement.",
        error: "Leads from arms or feet, 'crab walking' look.",
    },
    {
        id: "timing",
        label: "Rolling Count Timing",
        description:
            "Uses 'rolling count' (i.e., '1-a-2') instead of straight timing for a flowing rhythm.",
        error: "Over-reliance on straight 1-2-3 count; feels stiff or march-like.",
    },
    {
        id: "connection",
        label: "Basic Connection Tone",
        description:
            "Push/pull tone, with proper compression/stretch and elasticity in anchor.",
        error: "Connection is too passive or too aggressive, lacks balance.",
    },
    {
        id: "patterns",
        label: "Pattern Proficiency",
        description:
            "Leads basic patterns (Sugar Push, Tuck, Side Pass) clearly and smoothly, partners can predict moves.",
        error: "Over-executing moves, unclear leads, mechanical.",
    },
    {
        id: "anchor",
        label: "Anchor Awareness",
        description:
            "Grounded, elastic anchor that flows with the music; resets to allow for smooth transitions.",
        error: "Anchor is a stop or is unclear in timing, disrupts musical flow.",
    },
    {
        id: "musicality",
        label: "Beginner Musical Awareness",
        description:
            "Recognizes phrasing, accents, and adjusts energy to match song.",
        error: "Dances through breaks or ignores shifts in musical tone.",
    },
]



export function FeedbackForm({ targetUserId }: { targetUserId: string }) {
    const { user } = useAuth()
    const [scores, setScores] = useState<Record<string, number>>(
        Object.fromEntries(skillAreas.map((area) => [area.id, 2])) // Default score = 2
    )

    const handleSubmit = async () => {
        if (!user) return

        try {
            await addDoc(collection(db, "feedback"), {
                targetUserId,
                submittedBy: user.uid, // stored but not shown
                skillScores: scores,
                timestamp: serverTimestamp(),
            })

            alert("Feedback submitted anonymously.")
        } catch (err) {
            console.error("Error submitting feedback:", err)
        }
    }


    return (
        <Card>
            <CardHeader>
                <CardTitle>Submit Feedback</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {skillAreas.map(({ id, label, description, error }) => (
                    <div key={id} className="space-y-1">
                        <Label htmlFor={id}>{label}</Label>
                        <p className="text-sm text-muted-foreground">{description}</p>
                        <Slider
                            id={id}
                            min={1}
                            max={3}
                            step={1}
                            value={[scores[id]]}
                            onValueChange={(value) =>
                                setScores((prev) => ({ ...prev, [id]: value[0] }))
                            }
                        />
                        <p className="text-xs text-destructive italic">Common Novice Error: {error}</p>
                    </div>
                ))}
                <Button onClick={handleSubmit}>Submit Anonymously</Button>
            </CardContent>
        </Card>
    )
}
