import { SignUpForm } from "@/components/SignUpForm";

export default function SignupPage() {
    return (
        <main className="p-6 flex flex-col items-center">
            <h1 className="text-2xl font-bold mb-4">Create an Account</h1>
            <SignUpForm />
        </main>
    )
}
