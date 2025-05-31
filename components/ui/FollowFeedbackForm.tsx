"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/hooks/useAuth"
import { db } from "@/lib/firebase"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { toast } from "sonner"

const followSkillAreas = [
    {
        id: "anchor",
        label: "Anchor Awareness",
        description: "Anchor is grounded, elastic; on time; smooth build of connection for transitions.",
        error: "Anchor is a stop/absent; disruptive of timing; no build of connection.",
    },
    {
        id: "musicality",
        label: "Beginner Musical Awareness",
        description: "Dances by accentuating major breaks/phrase changes; styling synergizes with song energy.",
        error: "Little/no styling; fails to match energy of song; incongruous movement.",
    },
    {
        id: "posture",
        label: "Posture & Pitch",
        description: "Mastery of pitch/hinge, upright gaze.",
        error: "Pitch or hunching from hips; head dips often.",
    },
    {
        id: "balance",
        label: "Balance",
        description: "Mastery of balance on all turns/spins.",
        error: "Often off balance on turns/spins.",
    },
    {
        id: "timing",
        label: "Rolling Count Timing",
        description: "Rolling count (3-a-4); never off time.",
        error: "Stiff, marching count; often off-time.",
    },
    {
        id: "connection",
        label: "Basic Connection Tone",
        description: "Perfectly balanced connection in stretch/compression.",
        error: "Too passive/aggressive; lacks balance.",
    },
    {
        id: "direction",
        label: "Directional Intent & Filling Space",
        description: "Mastery of moving down the slot until redirected and filling space.",
        error: "Anticipatory following/not moving down the slot.",
    },
]

export function FollowFeedbackForm({ targetUserId }: { targetUserId: string }) {
    const { user } = useAuth()
    const [scores, setScores] = useState<Record<string, string | number>>(
        Object.fromEntries(followSkillAreas.map((area) => [area.id, ""]))
    )
    const [errors, setErrors] = useState<Record<string, string>>({})

    const handleSubmit = async () => {
        if (!user) return

        const newErrors: Record<string, string> = {}

        for (const [key, val] of Object.entries(scores)) {
            const num = Number(val)
            if (val === "") {
                newErrors[key] = "This field is required."
            } else if (isNaN(num) || num < 1 || num > 5) {
                newErrors[key] = "Score must be between 1 and 5."
            }
        }

        setErrors(newErrors)

        if (Object.keys(newErrors).length > 0) {
            toast.error("There was a problem submitting your feedback", {
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
                forRole: "follower",
            })

            setScores(Object.fromEntries(followSkillAreas.map((area) => [area.id, ""])))
            setErrors({})

            toast("✅ Feedback submitted", {
                description: "Thanks for helping someone grow. 🙌",
            })
        } catch (err) {
            console.error("Error submitting feedback:", err)
            toast.error("Something went wrong submitting feedback.")
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Submit Feedback for a Follower</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {followSkillAreas.map(({ id, label, description, error }) => (
                    <div key={id} className="space-y-1">
                        <Label htmlFor={id}>{label}</Label>
                        <p className="text-sm text-muted-foreground">{description}</p>
                        <Input
                            id={id}
                            min={1}
                            max={5}
                            step={1}
                            type="number"
                            value={scores[id]}
                            onChange={(e) =>
                                setScores((prev) => ({ ...prev, [id]: e.target.value }))
                            }
                            className={
                                errors[id] ? "border-red-500 focus-visible:ring-red-500" : ""
                            }
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
