import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-muted">
      <div className="w-full max-w-sm md:max-w-3xl px-4 py-8">
        <LoginForm />
      </div>
    </div>
  )
}