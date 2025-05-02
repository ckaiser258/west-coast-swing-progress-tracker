import { LoginForm } from "@/components/LoginForm"

export default function LoginPage() {
    return (
        <main className="p-6 flex flex-col items-center">
            <h1 className="text-2xl font-bold mb-4">Log In</h1>
            <LoginForm />
        </main>
    )
}
