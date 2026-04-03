"use client"

import { useState, useEffect, useRef } from "react"
import { Loader2, Upload, Trash2, PlayCircle, Plus, X, Image as ImageIcon, Video } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { apiClient, type SuccessStory } from "@/lib/api-client"

// Helper to extract YouTube embed URL
function getYouTubeEmbedUrl(url: string): string | null {
  try {
    const regexPatterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    ]
    for (const regex of regexPatterns) {
      const match = url.match(regex)
      if (match) return `https://www.youtube.com/embed/${match[1]}`
    }
    return null
  } catch {
    return null
  }
}

export default function SuccessStoriesPage() {
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const MAX_IMAGE_SIZE_MB = 5

  const [images, setImages] = useState<SuccessStory[]>([])
  const [videos, setVideos] = useState<SuccessStory[]>([])
  const [loadingImages, setLoadingImages] = useState(true)
  const [loadingVideos, setLoadingVideos] = useState(true)

  // Image upload form state
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [imageTitle, setImageTitle] = useState("")
  const [imageDescription, setImageDescription] = useState("")
  const [uploadingImage, setUploadingImage] = useState(false)

  // Video form state
  const [videoUrl, setVideoUrl] = useState("")
  const [videoTitle, setVideoTitle] = useState("")
  const [videoDescription, setVideoDescription] = useState("")
  const [addingVideo, setAddingVideo] = useState(false)

  // Delete state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchImages = async () => {
    try {
      setLoadingImages(true)
      const res = await apiClient.getSuccessStories("image")
      setImages(res.data)
    } catch {
      toast({ title: "Error", description: "Failed to load images", variant: "destructive" })
    } finally {
      setLoadingImages(false)
    }
  }

  const fetchVideos = async () => {
    try {
      setLoadingVideos(true)
      const res = await apiClient.getSuccessStories("video")
      setVideos(res.data)
    } catch {
      toast({ title: "Error", description: "Failed to load videos", variant: "destructive" })
    } finally {
      setLoadingVideos(false)
    }
  }

  useEffect(() => {
    fetchImages()
    fetchVideos()
  }, [])

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
        toast({
          title: "Error",
          description: `Image must be smaller than ${MAX_IMAGE_SIZE_MB}MB`,
          variant: "destructive",
        })
        if (fileInputRef.current) fileInputRef.current.value = ""
        return
      }
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => setImagePreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const clearImageFile = () => {
    setImageFile(null)
    setImagePreview("")
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleImageUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!imageFile) {
      toast({ title: "Error", description: "Please select an image file", variant: "destructive" })
      return
    }

    try {
      setUploadingImage(true)
      const formData = new FormData()
      formData.append("type", "image")
      formData.append("image", imageFile)
      if (imageTitle.trim()) formData.append("title", imageTitle.trim())
      if (imageDescription.trim()) formData.append("description", imageDescription.trim())

      await apiClient.createSuccessStory(formData)
      toast({ title: "Success", description: "Image uploaded successfully" })
      setImageFile(null)
      setImagePreview("")
      setImageTitle("")
      setImageDescription("")
      if (fileInputRef.current) fileInputRef.current.value = ""
      await fetchImages()
    } catch {
      toast({ title: "Error", description: "Failed to upload image", variant: "destructive" })
    } finally {
      setUploadingImage(false)
    }
  }

  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!videoUrl.trim()) {
      toast({ title: "Error", description: "Please enter a YouTube URL", variant: "destructive" })
      return
    }
    if (!getYouTubeEmbedUrl(videoUrl)) {
      toast({ title: "Error", description: "Please enter a valid YouTube URL", variant: "destructive" })
      return
    }

    try {
      setAddingVideo(true)
      const formData = new FormData()
      formData.append("type", "video")
      formData.append("videoUrl", videoUrl.trim())
      if (videoTitle.trim()) formData.append("title", videoTitle.trim())
      if (videoDescription.trim()) formData.append("description", videoDescription.trim())

      await apiClient.createSuccessStory(formData)
      toast({ title: "Success", description: "Video added successfully" })
      setVideoUrl("")
      setVideoTitle("")
      setVideoDescription("")
      await fetchVideos()
    } catch {
      toast({ title: "Error", description: "Failed to add video", variant: "destructive" })
    } finally {
      setAddingVideo(false)
    }
  }

  const confirmDelete = (id: string) => {
    setDeletingId(id)
    setDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!deletingId) return
    try {
      setDeleting(true)
      await apiClient.deleteSuccessStory(deletingId)
      toast({ title: "Success", description: "Deleted successfully" })
      setDeleteDialogOpen(false)
      setDeletingId(null)
      await fetchImages()
      await fetchVideos()
    } catch {
      toast({ title: "Error", description: "Failed to delete", variant: "destructive" })
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="flex flex-col">
      <div className="border-b border-border bg-card">
        <div className="px-6 py-6">
          <h1 className="text-2xl font-semibold text-foreground">Success Stories</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage photos and videos for the public success stories page</p>
        </div>
      </div>

      <div className="p-6">
        <Tabs defaultValue="photos" className="space-y-6">
          <TabsList className="grid w-full max-w-sm grid-cols-2">
            <TabsTrigger value="photos" className="gap-2">
              <ImageIcon className="h-4 w-4" /> Photos
            </TabsTrigger>
            <TabsTrigger value="videos" className="gap-2">
              <Video className="h-4 w-4" /> Videos
            </TabsTrigger>
          </TabsList>

          {/* ============ PHOTOS TAB ============ */}
          <TabsContent value="photos" className="space-y-6">
            {/* Upload Form */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Upload New Photo</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleImageUpload} className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Image File *</Label>
                      <div className="relative border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 hover:border-muted-foreground/50 transition-colors">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageFileChange}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                        <div className="flex flex-col items-center gap-2 text-center">
                          <Upload className="h-6 w-6 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {imageFile ? imageFile.name : "Click to select image"}
                          </span>
                        </div>
                      </div>
                      {imagePreview && (
                        <div className="relative w-full h-32 rounded-lg overflow-hidden bg-muted">
                          <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={clearImageFile}
                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="space-y-2">
                        <Label htmlFor="imageTitle">Title (optional)</Label>
                        <Input
                          id="imageTitle"
                          value={imageTitle}
                          onChange={(e) => setImageTitle(e.target.value)}
                          placeholder="e.g., Visa Approved!"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="imageDesc">Description (optional)</Label>
                        <Textarea
                          id="imageDesc"
                          value={imageDescription}
                          onChange={(e) => setImageDescription(e.target.value)}
                          placeholder="e.g., Student got visa to study in South Korea"
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>
                  <Button type="submit" disabled={uploadingImage || !imageFile} className="gap-2">
                    {uploadingImage ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                    {uploadingImage ? "Uploading..." : "Upload Photo"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Images Grid */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-medium text-muted-foreground">
                  {loadingImages ? "Loading..." : `${images.length} photo${images.length !== 1 ? "s" : ""}`}
                </h2>
              </div>

              {loadingImages ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : images.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground border border-dashed rounded-lg">
                  <ImageIcon className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p>No photos uploaded yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {images.map((img) => (
                    <div key={img.id} className="relative group rounded-lg overflow-hidden border bg-muted aspect-square">
                      <img
                        src={img.imageUrl}
                        alt={img.title || "Success story"}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                        {img.title && <p className="text-white text-xs font-medium text-center line-clamp-2">{img.title}</p>}
                        <Badge variant={img.status === "active" ? "default" : "secondary"} className="text-xs">
                          {img.status}
                        </Badge>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="h-7 text-xs gap-1"
                          onClick={() => confirmDelete(String(img.id ?? ""))}
                        >
                          <Trash2 className="h-3 w-3" /> Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* ============ VIDEOS TAB ============ */}
          <TabsContent value="videos" className="space-y-6">
            {/* Add Video Form */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Add YouTube Video</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddVideo} className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="videoUrl">YouTube URL *</Label>
                      <Input
                        id="videoUrl"
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        placeholder="https://www.youtube.com/watch?v=..."
                        required
                      />
                      {videoUrl && getYouTubeEmbedUrl(videoUrl) && (
                        <div className="aspect-video rounded-lg overflow-hidden border bg-muted mt-2">
                          <iframe
                            src={getYouTubeEmbedUrl(videoUrl)!}
                            className="w-full h-full"
                            allowFullScreen
                            title="Video preview"
                          />
                        </div>
                      )}
                      {videoUrl && !getYouTubeEmbedUrl(videoUrl) && (
                        <p className="text-xs text-destructive">Invalid YouTube URL</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="space-y-2">
                        <Label htmlFor="videoTitle">Title (optional)</Label>
                        <Input
                          id="videoTitle"
                          value={videoTitle}
                          onChange={(e) => setVideoTitle(e.target.value)}
                          placeholder="e.g., Student Testimonial"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="videoDesc">Description (optional)</Label>
                        <Textarea
                          id="videoDesc"
                          value={videoDescription}
                          onChange={(e) => setVideoDescription(e.target.value)}
                          placeholder="Brief description of the video"
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>
                  <Button type="submit" disabled={addingVideo || !videoUrl.trim()} className="gap-2">
                    {addingVideo ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                    {addingVideo ? "Adding..." : "Add Video"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Videos Grid */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-medium text-muted-foreground">
                  {loadingVideos ? "Loading..." : `${videos.length} video${videos.length !== 1 ? "s" : ""}`}
                </h2>
              </div>

              {loadingVideos ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : videos.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground border border-dashed rounded-lg">
                  <PlayCircle className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p>No videos added yet</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {videos.map((vid) => (
                    <div key={vid.id} className="border rounded-lg overflow-hidden bg-card">
                      <div className="aspect-video bg-muted">
                        {vid.videoUrl && getYouTubeEmbedUrl(vid.videoUrl) ? (
                          <iframe
                            src={getYouTubeEmbedUrl(vid.videoUrl)!}
                            className="w-full h-full"
                            allowFullScreen
                            title={vid.title || "Video"}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <PlayCircle className="h-12 w-12 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="p-3 space-y-2">
                        {vid.title && <p className="text-sm font-medium line-clamp-1">{vid.title}</p>}
                        {vid.description && <p className="text-xs text-muted-foreground line-clamp-2">{vid.description}</p>}
                        <div className="flex items-center justify-between">
                          <Badge variant={vid.status === "active" ? "default" : "secondary"} className="text-xs">
                            {vid.status}
                          </Badge>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="h-7 text-xs gap-1"
                            onClick={() => confirmDelete(String(vid.id ?? ""))}
                          >
                            <Trash2 className="h-3 w-3" /> Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Success Story</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this item? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
