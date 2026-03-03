"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Star } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { apiClient, type Review } from "@/lib/api-client"

interface ReviewFormProps {
  initialData?: Review
  mode: "create" | "edit"
}

export function ReviewForm({ initialData, mode }: ReviewFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    university: initialData?.university || "",
    quote: initialData?.quote || "",
    rating: initialData?.rating || 5,
    status: (initialData?.status || "active") as "active" | "inactive",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setSaving(true)
      if (mode === "create") {
        await apiClient.createReview(formData)
        toast({ title: "Success", description: "Review created successfully" })
      } else {
        const id = initialData?._id || initialData?.id
        if (id) {
          await apiClient.updateReview(id, formData)
          toast({ title: "Success", description: "Review updated successfully" })
        }
      }
      router.push("/dashboard/reviews")
    } catch (err: any) {
      const errorMsg = err?.message || "Failed to save review"
      toast({ title: "Error", description: errorMsg, variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Review Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Student Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Mahmudul Hasan"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="university">University *</Label>
              <Input
                id="university"
                value={formData.university}
                onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                placeholder="e.g. Kyung Hee University (South Korea)"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quote">Quote / Testimonial *</Label>
            <Textarea
              id="quote"
              rows={4}
              value={formData.quote}
              onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
              placeholder="What did the student say about their experience?"
              required
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Rating *</Label>
              <div className="flex items-center gap-1 pt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: star })}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`h-7 w-7 cursor-pointer transition-colors ${
                        star <= formData.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted-foreground/30 hover:text-yellow-300"
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-sm text-muted-foreground">{formData.rating}/5</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select
                value={formData.status}
                onValueChange={(value: "active" | "inactive") =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/dashboard/reviews")}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {mode === "create" ? "Creating..." : "Saving..."}
            </>
          ) : (
            mode === "create" ? "Create Review" : "Save Changes"
          )}
        </Button>
      </div>
    </form>
  )
}
