"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { UniversityForm } from "@/components/university-form"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { apiClient, type University } from "@/lib/api-client"

export default function EditUniversityPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const [university, setUniversity] = useState<University | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await apiClient.getUniversityById(id)
        setUniversity(data)
      } catch {
        router.push("/dashboard/universities")
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [id, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!university) return null

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="px-6 py-6">
          <Link
            href="/dashboard/universities"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Universities
          </Link>
          <h1 className="text-2xl font-semibold text-foreground">
            Edit University
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Update the details for {university.name}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="mx-auto max-w-4xl">
          <UniversityForm mode="edit" initialData={university} />
        </div>
      </div>
    </div>
  )
}
