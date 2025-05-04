"use client"

import { useState } from "react"
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, updateProfile } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

export function SignUpForm() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [displayName, setDisplayName] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        try {
            await createUserWithEmailAndPassword(auth, email, password)
            if (!displayName.trim()) {
                setError("Display name is required.")
                return
            }

            // Update Firebase Auth profile
            if (auth.currentUser) {
                await updateProfile(auth.currentUser, { displayName })
            }

            // Save to Firestore
            await setDoc(doc(db, "users", auth.currentUser!.uid), {
                uid: auth.currentUser!.uid,
                email: auth.currentUser!.email,
                displayName,
            })
            router.push("/")
        } catch (err: any) {
            console.error("Sign up error:", err)
            setError(err.message)
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
                <Label htmlFor="displayName" className="mb-2">Display Name</Label>
                <Input
                    id="displayName"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required
                />
            </div>
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
            <Button type="submit" className="w-full">Sign Up</Button>
            {error && <p className="text-red-500 text-sm">{error}</p>}
        </form>
    )
}
