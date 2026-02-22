import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { LoginForm } from "@/components/login-form"
import { Shield } from "lucide-react"

export default async function Page() {
  const isAuthenticated = await getSession()
  if (isAuthenticated) {
    redirect("/dashboard")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center gap-2 pb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
            <Shield className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-semibold text-foreground">Admin Login</h1>
          <p className="text-sm text-muted-foreground">
            Sign in to access the contacts dashboard
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
