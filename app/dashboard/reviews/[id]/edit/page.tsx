"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ReviewForm } from "@/components/review-form"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { apiClient, type Review } from "@/lib/api-client"

export default function EditReviewPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const [review, setReview] = useState<Review | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await apiClient.getReviewById(id)
        setReview(data)
      } catch {
        router.push("/dashboard/reviews")
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

  if (!review) return null

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="px-6 py-6">
          <Link
            href="/dashboard/reviews"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Reviews
          </Link>
          <h1 className="text-2xl font-semibold text-foreground">
            Edit Review
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Update the review by {review.name}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="mx-auto max-w-3xl">
          <ReviewForm mode="edit" initialData={review} />
        </div>
      </div>
    </div>
  )
}
