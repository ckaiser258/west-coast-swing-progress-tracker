"use client"

import { useAuth } from "@/hooks/useAuth"
import { FeedbackForm } from "@/components/FeedbackForm"
import { ProgressChart } from "@/components/ProgressChart"
import { Button } from "@/components/ui/button"
import { signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { useState } from "react"
import { UserSelector } from "@/components/UserSelector"
import Link from "next/link"

export default function HomePage() {
  const { user, loading } = useAuth()
  const [targetUserId, setTargetUserId] = useState<string | null>(null)

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
      {targetUserId && <FeedbackForm targetUserId={targetUserId} />}
      <ProgressChart />
    </main>
  )
}