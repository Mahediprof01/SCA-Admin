"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Upload, X } from "lucide-react"
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
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { apiClient, type University } from "@/lib/api-client"

interface UniversityFormProps {
  initialData?: University
  mode: "create" | "edit"
}

interface UniversityFormData {
  name: string
  description: string
  location: string
  country: string
  established: number | ""
  type: "public" | "private"
  ranking: number | ""
  tuitionFee: string
  website: string
  email: string
  phone: string
  status: "active" | "inactive"
}

export function UniversityForm({ initialData, mode }: UniversityFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [saving, setSaving] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>(initialData?.image || "")
  const [formData, setFormData] = useState<UniversityFormData>({
    name: initialData?.name || "",
    description: initialData?.description || "",
    location: initialData?.location || "",
    country: initialData?.country || "",
    established: initialData?.established ?? new Date().getFullYear(),
    type: initialData?.type || "public" as "public" | "private",
    ranking: initialData?.ranking ?? 1,
    tuitionFee: initialData?.tuitionFee || "",
    website: initialData?.website || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    status: initialData?.status || "active" as "active" | "inactive",
  })

  const [programs, setPrograms] = useState<string[]>(initialData?.programs || [])
  const [newProgram, setNewProgram] = useState("")
  const [facilities, setFacilities] = useState<string[]>(initialData?.facilities || [])
  const [newFacility, setNewFacility] = useState("")
  const MAX_IMAGE_SIZE_MB = 2

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setSaving(true)
      const established = Number(formData.established)
      const ranking = Number(formData.ranking)
      if (!Number.isFinite(established) || !Number.isFinite(ranking)) {
        toast({
          title: "Error",
          description: "Established year and ranking must be valid numbers",
          variant: "destructive",
        })
        return
      }

      const payload = new FormData()
      payload.append("name", formData.name)
      payload.append("description", formData.description)
      payload.append("location", formData.location)
      payload.append("country", formData.country)
      payload.append("established", String(established))
      payload.append("type", formData.type)
      payload.append("ranking", String(ranking))
      payload.append("tuitionFee", formData.tuitionFee)
      payload.append("website", formData.website)
      payload.append("email", formData.email)
      payload.append("phone", formData.phone)
      payload.append("status", formData.status)

      programs.forEach((program) => payload.append("programs", program))
      facilities.forEach((facility) => payload.append("facilities", facility))

      if (imageFile) {
        payload.append("image", imageFile)
      } else if (imagePreview && !imagePreview.startsWith("data:")) {
        payload.append("image", imagePreview)
      }

      if (mode === "create") {
        await apiClient.createUniversity(payload)
        toast({
          title: "Success",
          description: "University created successfully",
        })
      } else {
        const id = initialData?._id || initialData?.id
        if (id) {
          await apiClient.updateUniversity(id, payload)
          toast({
            title: "Success",
            description: "University updated successfully",
          })
        }
      }
      router.push("/dashboard/universities")
    } catch (err: any) {
      const errorMsg = err?.message || "Failed to save university"
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const addProgram = () => {
    if (newProgram.trim()) {
      setPrograms([...programs, newProgram.trim()])
      setNewProgram("")
    }
  }

  const removeProgram = (index: number) => {
    setPrograms(programs.filter((_, i) => i !== index))
  }

  const addFacility = () => {
    if (newFacility.trim()) {
      setFacilities([...facilities, newFacility.trim()])
      setNewFacility("")
    }
  }

  const removeFacility = (index: number) => {
    setFacilities(facilities.filter((_, i) => i !== index))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
        toast({
          title: "Error",
          description: `Image must be smaller than ${MAX_IMAGE_SIZE_MB}MB`,
          variant: "destructive",
        })
        return
      }
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const clearImage = () => {
    setImageFile(null)
    setImagePreview(initialData?.image || "")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">University Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website *</Label>
              <Input
                id="website"
                type="url"
                value={formData.website}
                onChange={(e) =>
                  setFormData({ ...formData, website: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              rows={4}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country *</Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) =>
                  setFormData({ ...formData, country: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="established">Established Year *</Label>
              <Input
                id="established"
                type="number"
                min="1000"
                max={new Date().getFullYear()}
                value={formData.established}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    established: e.target.value === "" ? "" : Number(e.target.value),
                  })
                }
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Details */}
      <Card>
        <CardHeader>
          <CardTitle>University Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="type">Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value: "public" | "private") =>
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ranking">World Ranking *</Label>
              <Input
                id="ranking"
                type="number"
                min="1"
                value={formData.ranking}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    ranking: e.target.value === "" ? "" : Number(e.target.value),
                  })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tuitionFee">Tuition Fee *</Label>
              <Input
                id="tuitionFee"
                value={formData.tuitionFee}
                onChange={(e) =>
                  setFormData({ ...formData, tuitionFee: e.target.value })
                }
                placeholder="$50,000 per year"
                required
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone *</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">University Image</Label>
            <div className="flex gap-4 flex-col md:flex-row">
              <div className="flex-1">
                <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-gray-400 transition-colors">
                  <input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    aria-label="Upload university image"
                  />
                  <label htmlFor="image" className="cursor-pointer flex flex-col items-center gap-2">
                    <Upload className="w-8 h-8 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">
                      {imageFile ? imageFile.name : "Click to upload or drag and drop"}
                    </span>
                    <span className="text-xs text-gray-500">PNG, JPG up to 10MB</span>
                  </label>
                </div>
              </div>

              {imagePreview && (
                <div className="flex-1">
                  <div className="relative w-full aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={clearImage}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
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
        </CardContent>
      </Card>

      {/* Programs */}
      <Card>
        <CardHeader>
          <CardTitle>Academic Programs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newProgram}
              onChange={(e) => setNewProgram(e.target.value)}
              placeholder="Add a program (e.g., Computer Science)"
              onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addProgram())}
            />
            <Button type="button" onClick={addProgram}>
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {programs.map((program, index) => (
              <Badge key={index} variant="secondary" className="gap-1">
                {program}
                <button
                  type="button"
                  onClick={() => removeProgram(index)}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Facilities */}
      <Card>
        <CardHeader>
          <CardTitle>Facilities</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newFacility}
              onChange={(e) => setNewFacility(e.target.value)}
              placeholder="Add a facility (e.g., Research Lab)"
              onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addFacility())}
            />
            <Button type="button" onClick={addFacility}>
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {facilities.map((facility, index) => (
              <Badge key={index} variant="secondary" className="gap-1">
                {facility}
                <button
                  type="button"
                  onClick={() => removeFacility(index)}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/dashboard/universities")}
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
            mode === "create" ? "Create University" : "Save Changes"
          )}
        </Button>
      </div>
    </form>
  )
}
