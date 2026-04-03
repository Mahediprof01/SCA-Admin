"use server"

import { redirect } from "next/navigation"
import { createSession, destroySession } from "@/lib/session"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export async function login(
  _prevState: { error: string } | null,
  formData: FormData
) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return { error: "Please enter both email and password." }
  }

  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    if (!res.ok) {
      return { error: "Invalid email or password." }
    }

    await createSession()
    redirect("/dashboard")
  } catch (error) {
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error
    }
    return { error: "Unable to connect to server. Please try again." }
  }
}

export async function logout() {
  await destroySession()
  redirect("/")
}
