"use client"

import { auth } from "@/lib/firebase"
import {
    GoogleAuthProvider,
    signInWithPopup,
    signInWithEmailAndPassword,
    signOut,
} from "firebase/auth"
import { useAuth } from "@/hooks/useAuth"

export function AuthButtons() {
    const { user, loading } = useAuth()

    const signInWithGoogle = async () => {
        const provider = new GoogleAuthProvider()
        try {
            await signInWithPopup(auth, provider)
        } catch (err) {
            console.error("Google sign-in error:", err)
        }
    }

    const signInWithEmail = async () => {
        try {
            await signInWithEmailAndPassword(auth, "test@example.com", "password123")
        } catch (err) {
            console.error("Email sign-in error:", err)
        }
    }

    if (loading) return <p>Loading...</p>

    if (user) {
        return (
            <div>
                <p>Signed in as {user.displayName || user.email}</p>
                <button onClick={() => signOut(auth)}>Sign Out</button>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-2">
            <button onClick={signInWithGoogle}>Sign in with Google</button>
            <button onClick={signInWithEmail}>Sign in with test email</button>
        </div>
    )
}