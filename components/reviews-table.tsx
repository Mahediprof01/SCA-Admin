"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Search,
  MoreHorizontal,
  Plus,
  Pencil,
  Trash2,
  ChevronDown,
  Loader2,
  Star,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { apiClient, type Review } from "@/lib/api-client"

type StatusFilter = "all" | "active" | "inactive"

export function ReviewsTable() {
  const { toast } = useToast()
  const [reviews, setReviews] = useState<Review[]>([])
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
  const [deleteReview, setDeleteReview] = useState<Review | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    try {
      setLoading(true)
      const response = await apiClient.getReviews(1, 100)
      setReviews(response.data)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to fetch reviews"
      toast({ title: "Error", description: errorMsg, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const filteredReviews = reviews.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.university.toLowerCase().includes(search.toLowerCase()) ||
      r.quote.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === "all" || r.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleDelete = async (id: string) => {
    try {
      setDeleting(true)
      await apiClient.deleteReview(id)
      setReviews((prev) => prev.filter((r) => String(r.id) !== id))
      toast({ title: "Success", description: "Review deleted successfully" })
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to delete review"
      toast({ title: "Error", description: errorMsg, variant: "destructive" })
    } finally {
      setDeleting(false)
      setDeleteReview(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Filters and Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1 sm:max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search reviews..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-1">
                Filter: {statusFilter}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setStatusFilter("all")}>All</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("active")}>Active</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("inactive")}>Inactive</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Link href="/dashboard/reviews/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Review
          </Button>
        </Link>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>University</TableHead>
              <TableHead className="max-w-[300px]">Quote</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReviews.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No reviews found.
                </TableCell>
              </TableRow>
            ) : (
              filteredReviews.map((review) => {
                const reviewId = String(review.id ?? "")
                return (
                  <TableRow key={reviewId}>
                    <TableCell className="font-medium">{review.name}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{review.university}</TableCell>
                    <TableCell className="max-w-[300px] truncate">{review.quote}</TableCell>
                    <TableCell>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}`}
                          />
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={review.status === "active" ? "default" : "secondary"}>
                        {review.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <Link href={`/dashboard/reviews/${reviewId}/edit`}>
                            <DropdownMenuItem>
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                          </Link>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => setDeleteReview(review)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteReview !== null} onOpenChange={() => setDeleteReview(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Review</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the review by {deleteReview?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              variant="destructive"
              disabled={deleting}
              onClick={() => {
                const id = deleteReview?.id
                if (id) handleDelete(String(id))
              }}
            >
              {deleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
