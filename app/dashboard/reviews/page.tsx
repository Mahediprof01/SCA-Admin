"use client"

import { useState, useEffect } from "react"
import { ReviewsTable } from "@/components/reviews-table"
import { Card, CardContent } from "@/components/ui/card"
import { Star, Loader2 } from "lucide-react"
import { apiClient, type ReviewStats } from "@/lib/api-client"

export default function ReviewsPage() {
  const [stats, setStats] = useState<ReviewStats | null>(null)

  useEffect(() => {
    apiClient.getReviewStats().then(setStats).catch(console.error)
  }, [])

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="px-6 py-6">
          <h1 className="text-2xl font-semibold text-foreground">Reviews</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage student testimonials shown on the public site
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex flex-col gap-6">
          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Star className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Reviews</p>
                  <p className="text-2xl font-bold">
                    {stats ? stats.total : <Loader2 className="h-5 w-5 animate-spin" />}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10">
                  <Star className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active</p>
                  <p className="text-2xl font-bold">
                    {stats ? stats.active : <Loader2 className="h-5 w-5 animate-spin" />}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-500/10">
                  <Star className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Inactive</p>
                  <p className="text-2xl font-bold">
                    {stats ? stats.inactive : <Loader2 className="h-5 w-5 animate-spin" />}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-500/10">
                  <Star className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg. Rating</p>
                  <p className="text-2xl font-bold">
                    {stats ? `${stats.averageRating}/5` : <Loader2 className="h-5 w-5 animate-spin" />}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Table */}
          <ReviewsTable />
        </div>
      </div>
    </div>
  )
}
