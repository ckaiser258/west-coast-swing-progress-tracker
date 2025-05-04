"use client"

import { useState } from "react"
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, updateProfile } from "firebase/auth"
import { auth, db } from "@/lib/firebase"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { doc, getDoc, setDoc } from "firebase/firestore"


export function LoginForm() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        try {
            await signInWithEmailAndPassword(auth, email, password)
            router.push("/")
        } catch (err: any) {
            console.error("Login error:", err)
            setError("Invalid email or password.")
        }
    }

    const handleGoogleLogin = async () => {
        try {
            const provider = new GoogleAuthProvider()
            const result = await signInWithPopup(auth, provider)
            const user = result.user

            const userDoc = await getDoc(doc(db, "users", user.uid))
            const displayNameExists = user.displayName && user.displayName.trim().length > 0
            const firestoreHasDisplayName = userDoc.exists() && userDoc.data()?.displayName

            if (!displayNameExists || !firestoreHasDisplayName) {
                const input = prompt("Enter a display name (this will be shown to other dancers):")
                if (!input || input.trim().length === 0) {
                    alert("Display name is required.")
                    await auth.signOut()
                    return
                }

                // Update Firebase Auth displayName
                await updateProfile(user, { displayName: input })

                // Update Firestore user document
                await setDoc(doc(db, "users", user.uid), {
                    uid: user.uid,
                    email: user.email,
                    displayName: input,
                })
            }

            router.push("/")
        } catch (err) {
            console.error("Google sign-in error:", err)
            setError("Google login failed.")
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-sm w-full">
            <div>
                <Label htmlFor="email" className="mb-2">Email</Label>
                <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            <div>
                <Label htmlFor="password" className="mb-2">Password</Label>
                <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>
            <div>
                <Button type="button" variant="outline" className="w-full" onClick={handleGoogleLogin}>
                    Sign in with Google
                </Button>
            </div>
            <Button type="submit" className="w-full">
                Log In
            </Button>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link href="/signup" className="underline">
                    Sign up
                </Link>
            </p>
        </form>
    )
}
