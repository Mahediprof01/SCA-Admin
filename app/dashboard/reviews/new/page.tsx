import { ReviewForm } from "@/components/review-form"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NewReviewPage() {
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
            Add New Review
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Add a new student testimonial to display on the public site
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="mx-auto max-w-3xl">
          <ReviewForm mode="create" />
        </div>
      </div>
    </div>
  )
}
