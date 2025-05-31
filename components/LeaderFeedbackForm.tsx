"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/hooks/useAuth"
import { db } from "@/lib/firebase"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { Input } from "./ui/input"
import { toast } from "sonner"

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



export function LeaderFeedbackForm({ targetUserId }: { targetUserId: string }) {
    const { user } = useAuth()
    const [scores, setScores] = useState<Record<string, string | number>>(
        Object.fromEntries(skillAreas.map((area) => [area.id, ""]))
    )
    const [errors, setErrors] = useState<Record<string, string>>({})

    const handleSubmit = async () => {
        if (!user) return

        const newErrors: Record<string, string> = {}

        for (const [key, val] of Object.entries(scores)) {
            const num = Number(val)

            if (val === "") {
                newErrors[key] = "This field is required."
            } else if (isNaN(num) || num < 1 || num > 3) {
                newErrors[key] = "Score must be between 1 and 3."
            }
        }

        setErrors(newErrors)

        if (Object.keys(newErrors).length > 0) {
            toast.error("⚠️ There was a problem submitting your feedback", {
                description: "Please fix the errors in the form.",
                duration: 4000,
            })
            return
        }

        try {
            await addDoc(collection(db, "feedback"), {
                targetUserId,
                submittedBy: user.uid,
                skillScores: Object.fromEntries(
                    Object.entries(scores).map(([k, v]) => [k, Number(v)])
                ),
                timestamp: serverTimestamp(),
            })

            // Reset form after successful submit
            setScores(Object.fromEntries(skillAreas.map((area) => [area.id, ""])))
            setErrors({})

            toast.success("✅ Feedback submitted", {
                description: "Thanks for helping someone grow. 🙌",
                duration: 4000,
            })
        } catch (err) {
            console.error("Error submitting feedback:", err)
            toast.error("Something went wrong submitting feedback.")
        }
    }


    return (
        <Card>
            <CardHeader>
                <CardTitle>Submit Feedback (1-3)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {skillAreas.map(({ id, label, description, error }) => (
                    <div key={id} className="space-y-1">
                        <Label htmlFor={id}>{label}</Label>
                        <p className="text-sm text-muted-foreground">{description}</p>

                        <Input
                            id={id}
                            min={1}
                            max={3}
                            step={1}
                            type="number"
                            value={scores[id]}
                            onChange={(e) =>
                                setScores((prev) => ({ ...prev, [id]: e.target.value }))
                            }
                            className={errors[id] ? "border-red-500 focus-visible:ring-red-500" : ""}
                        />

                        {errors[id] && (
                            <p className="text-sm text-red-500">{errors[id]}</p>
                        )}

                        <p className="text-xs text-destructive italic">
                            Common Novice Error: {error}
                        </p>
                    </div>
                ))}
                <Button onClick={handleSubmit}>Submit Anonymously</Button>
            </CardContent>
        </Card>
    )
}
