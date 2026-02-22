"use client"

import { useState, useEffect } from "react"
import {
  Search,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  ChevronDown,
  Loader2,
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
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { apiClient, type Consultation } from "@/lib/api-client"

type StatusFilter = "all" | "pending" | "contacted" | "completed" | "cancelled"

export function ConsultationsTable() {
  const { toast } = useToast()
  const [consultations, setConsultations] = useState<Consultation[]>([])
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
  const [viewConsultation, setViewConsultation] = useState<Consultation | null>(null)
  const [editConsultation, setEditConsultation] = useState<Consultation | null>(null)
  const [deleteConsultation, setDeleteConsultation] = useState<Consultation | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updating, setUpdating] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    status: "pending" as Consultation["status"],
  })

  // Fetch consultations from backend
  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await apiClient.getConsultations(
          1,
          100,
          statusFilter !== "all" ? statusFilter : undefined,
          search
        )
        setConsultations(response.data)
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "Failed to fetch consultations"
        setError(errorMsg)
        toast({
          title: "Error",
          description: errorMsg,
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchConsultations()
  }, [toast])

  const filteredConsultations = consultations.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.email.toLowerCase().includes(search.toLowerCase()) ||
      item.phone.toLowerCase().includes(search.toLowerCase())
    const matchesStatus =
      statusFilter === "all" || item.status === statusFilter
    return matchesSearch && matchesStatus
  })

  function getStatusBadge(status: Consultation["status"]) {
    switch (status) {
      case "pending":
        return (
          <Badge className="border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100">
            Pending
          </Badge>
        )
      case "contacted":
        return (
          <Badge className="border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100">
            Contacted
          </Badge>
        )
      case "completed":
        return (
          <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100">
            Completed
          </Badge>
        )
      case "cancelled":
        return (
          <Badge className="border-red-200 bg-red-50 text-red-700 hover:bg-red-100">
            Cancelled
          </Badge>
        )
    }
  }

  async function handleEdit() {
    if (!editConsultation) return
    try {
      setUpdating(true)
      const id = editConsultation._id || editConsultation.id
      if (!id) throw new Error("Consultation ID not found")

      await apiClient.updateConsultation(id, formData)
      setConsultations(
        consultations.map((c) =>
          c._id === id || c.id === id ? { ...editConsultation, ...formData } : c
        )
      )
      setEditConsultation(null)
      toast({
        title: "Success",
        description: "Consultation updated successfully",
      })
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to update consultation"
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      })
    } finally {
      setUpdating(false)
    }
  }

  async function handleDelete() {
    if (!deleteConsultation) return
    try {
      setDeleting(true)
      const id = deleteConsultation._id || deleteConsultation.id
      if (!id) throw new Error("Consultation ID not found")

      await apiClient.deleteConsultation(id)
      setConsultations(
        consultations.filter((c) => c._id !== id && c.id !== id)
      )
      setDeleteConsultation(null)
      toast({
        title: "Success",
        description: "Consultation deleted successfully",
      })
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to delete consultation"
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      })
    } finally {
      setDeleting(false)
    }
  }

  function openEdit(consultation: Consultation) {
    setFormData({
      name: consultation.name,
      email: consultation.email,
      phone: consultation.phone,
      status: consultation.status,
    })
    setEditConsultation(consultation)
  }

  const statusFilters: { label: string; value: StatusFilter }[] = [
    { label: "All", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "Contacted", value: "contacted" },
    { label: "Completed", value: "completed" },
    { label: "Cancelled", value: "cancelled" },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Loading consultations...
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm text-red-600">Error: {error}</p>
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            size="sm"
          >
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search consultations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-card border-border shadow-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1.5 bg-card">
                Status:{" "}
                {statusFilters.find((f) => f.value === statusFilter)?.label}
                <ChevronDown className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {statusFilters.map((filter) => (
                <DropdownMenuItem
                  key={filter.value}
                  onClick={() => setStatusFilter(filter.value)}
                >
                  {filter.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border">
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead className="hidden lg:table-cell">Phone</TableHead>
              <TableHead className="hidden sm:table-cell">Status</TableHead>
              <TableHead className="hidden sm:table-cell">Date</TableHead>
              <TableHead className="w-12">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredConsultations.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-24 text-center text-muted-foreground"
                >
                  No consultations found.
                </TableCell>
              </TableRow>
            ) : (
              filteredConsultations.map((item) => (
                <TableRow key={item._id || item.id} className="border-border">
                  <TableCell>
                    <div>
                      <p className="font-medium text-foreground">
                        {item.name}
                      </p>
                      <p className="text-sm text-muted-foreground md:hidden">
                        {item.email}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="hidden text-muted-foreground md:table-cell">
                    {item.email}
                  </TableCell>
                  <TableCell className="hidden text-muted-foreground lg:table-cell">
                    {item.phone}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {getStatusBadge(item.status)}
                  </TableCell>
                  <TableCell className="hidden text-muted-foreground sm:table-cell">
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => setViewConsultation(item)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openEdit(item)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => setDeleteConsultation(item)}
                          className="text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <p className="text-sm text-muted-foreground">
        Showing {filteredConsultations.length} of {consultations.length}{" "}
        consultations
      </p>

      {/* View Dialog */}
      <Dialog
        open={viewConsultation !== null}
        onOpenChange={() => setViewConsultation(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{viewConsultation?.name}</DialogTitle>
            <DialogDescription>Consultation details</DialogDescription>
          </DialogHeader>
          {viewConsultation && (
            <div className="flex flex-col gap-3 pt-2">
              <div className="flex items-center justify-between rounded-lg bg-secondary p-3">
                <span className="text-sm text-muted-foreground">Email</span>
                <span className="text-sm text-foreground">
                  {viewConsultation.email}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-secondary p-3">
                <span className="text-sm text-muted-foreground">Phone</span>
                <span className="text-sm text-foreground">
                  {viewConsultation.phone}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-secondary p-3">
                <span className="text-sm text-muted-foreground">Status</span>
                {getStatusBadge(viewConsultation.status)}
              </div>
              <div className="flex items-center justify-between rounded-lg bg-secondary p-3">
                <span className="text-sm text-muted-foreground">
                  Booked on
                </span>
                <span className="text-sm text-foreground">
                  {viewConsultation.createdAt
                    ? new Date(viewConsultation.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        }
                      )
                    : "N/A"}
                </span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={editConsultation !== null}
        onOpenChange={() => setEditConsultation(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Consultation</DialogTitle>
            <DialogDescription>
              Update the consultation details below.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 pt-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Full name"
                className="bg-card"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="email@example.com"
                className="bg-card"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="edit-phone">Phone</Label>
              <Input
                id="edit-phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="+8801306890908"
                className="bg-card"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="edit-status">Status</Label>
              <select
                id="edit-status"
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as Consultation["status"],
                  })
                }
                className="rounded-md border border-input bg-card px-3 py-2 text-sm"
              >
                <option value="pending">Pending</option>
                <option value="contacted">Contacted</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          <DialogFooter className="pt-2">
            <DialogClose asChild>
              <Button variant="outline" className="bg-transparent">
                Cancel
              </Button>
            </DialogClose>
            <Button onClick={handleEdit} disabled={updating}>
              {updating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConsultation !== null}
        onOpenChange={() => setDeleteConsultation(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Consultation</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the consultation for{" "}
              <span className="font-medium text-foreground">
                {deleteConsultation?.name}
              </span>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-2">
            <DialogClose asChild>
              <Button variant="outline" className="bg-transparent">
                Cancel
              </Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
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
