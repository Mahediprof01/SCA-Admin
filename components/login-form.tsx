"use client"

import { useActionState } from "react"
import { Lock, Mail } from "lucide-react"
import { login } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(login, null)

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {state?.error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <Label htmlFor="email" className="text-sm text-muted-foreground">
          Email
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Enter email"
            required
            autoComplete="email"
            className="h-11 border-border bg-card pl-10 text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="password" className="text-sm text-muted-foreground">
          Password
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Enter password"
            required
            autoComplete="current-password"
            className="h-11 border-border bg-card pl-10 text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={isPending}
        className="mt-1 h-11 w-full"
      >
        {isPending ? "Signing in..." : "Sign in"}
      </Button>


    </form>
  )
}
