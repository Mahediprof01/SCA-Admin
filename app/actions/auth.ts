"use server"

import { redirect } from "next/navigation"
import { createSession, destroySession } from "@/lib/session"

const ADMIN_USERNAME = "admin"
const ADMIN_PASSWORD = "admin123"

export async function login(
  _prevState: { error: string } | null,
  formData: FormData
) {
  const username = formData.get("username") as string
  const password = formData.get("password") as string

  if (!username || !password) {
    return { error: "Please enter both username and password." }
  }

  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    return { error: "Invalid username or password." }
  }

  await createSession()
  redirect("/dashboard")
}

export async function logout() {
  await destroySession()
  redirect("/")
}
