"use client"

import { useState } from "react"
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"

export function SignUpForm() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        try {
            await createUserWithEmailAndPassword(auth, email, password)
            router.push("/")
        } catch (err: any) {
            console.error("Sign up error:", err)
            setError(err.message)
        }
    }

    const handleGoogleLogin = async () => {
        try {
            const provider = new GoogleAuthProvider()
            await signInWithPopup(auth, provider)
            router.push("/")
        } catch (err) {
            console.error("Google sign-in error:", err)
            setError("Google login failed.")
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-sm">
            <div>
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            <div>
                <Label htmlFor="password">Password</Label>
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
            <Button type="submit">Sign Up</Button>
            {error && <p className="text-red-500 text-sm">{error}</p>}
        </form>
    )
}
