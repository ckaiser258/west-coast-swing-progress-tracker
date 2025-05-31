"use client"

import { useAuth } from "@/hooks/useAuth"
import { LeaderFeedbackForm } from "@/components/LeaderFeedbackForm"
import { ProgressChart } from "@/components/ProgressChart"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { useState } from "react"
import { UserSelector } from "@/components/UserSelector"
import Link from "next/link"
import { FollowFeedbackForm } from "@/components/ui/FollowFeedbackForm"

export default function HomePage() {
  const { user, loading } = useAuth()
  const [targetUserId, setTargetUserId] = useState<string | null>(null)
  const [role, setRole] = useState<"leader" | "follower">("leader")

  if (loading) return <p className="p-4">Loading...</p>
  if (!user) {
    return (
      <div className="p-6 text-center space-y-2">
        <p className="text-muted-foreground">Please log in to access your dashboard.</p>
        <Button asChild>
          <a href="/login">Go to Login</a>
        </Button>
      </div>
    )
  }


  return (
    <main className="p-6 space-y-4 max-w-3xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Welcome, {user.displayName || user.email}</h1>
        <Button variant="outline" onClick={() => signOut(auth)}>
          Sign Out
        </Button>
      </div>
      <div>
        <Button
          asChild
          variant="default"
        >
          <Link href="/feedback-history">View Feedback History</Link>
        </Button>
      </div>
      <UserSelector onSelect={(uid) => setTargetUserId(uid)} />
      <div className="space-y-2">
        <Label className="text-lg">Select the role of the dancer</Label>
        <RadioGroup
          defaultValue="leader"
          onValueChange={(val) => setRole(val as "leader" | "follower")}
          className="flex gap-6"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="leader" id="leader" />
            <Label htmlFor="leader">Leader</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="follower" id="follower" />
            <Label htmlFor="follower">Follower</Label>
          </div>
        </RadioGroup>
      </div>
      {targetUserId && (
        role === "leader" ? (
          <LeaderFeedbackForm targetUserId={targetUserId} />
        ) : (
          <FollowFeedbackForm targetUserId={targetUserId} />
        )
      )}
      <ProgressChart />
    </main>
  )
}