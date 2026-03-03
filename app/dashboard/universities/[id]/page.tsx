"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Globe, Mail, Phone, MapPin, Calendar, Award, DollarSign, Edit, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { apiClient, type University } from "@/lib/api-client"

export default function UniversityDetailsPage() {
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

  const uniId = university._id || university.id || ""

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
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">
                {university.name}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {university.location}, {university.country}
              </p>
            </div>
            <Link href={`/dashboard/universities/${uniId}/edit`}>
              <Button className="gap-2">
                <Edit className="h-4 w-4" />
                Edit
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="mx-auto max-w-5xl space-y-6">
          {/* University Image */}
          {university.image && (
            <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden bg-muted border border-border">
              <img
                src={university.image}
                alt={university.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Status and Key Info */}
          <div className="flex items-center gap-4">
            <Badge
              variant={university.status === "active" ? "default" : "secondary"}
              className="text-sm"
            >
              {university.status}
            </Badge>
            <Badge variant="outline" className="text-sm capitalize">
              {university.type}
            </Badge>
            <Badge variant="outline" className="text-sm">
              World Rank #{university.ranking}
            </Badge>
          </div>

          {/* Main Info Grid */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* About */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {university.description}
                </p>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Globe className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Website</p>
                    <a
                      href={university.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      {university.website}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <a
                      href={`mailto:${university.email}`}
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      {university.email}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <p className="text-sm text-muted-foreground">
                      {university.phone}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Location</p>
                    <p className="text-sm text-muted-foreground">
                      {university.location}, {university.country}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Key Details */}
            <Card>
              <CardHeader>
                <CardTitle>Key Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Established</p>
                    <p className="text-sm text-muted-foreground">
                      {university.established}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Award className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">World Ranking</p>
                    <p className="text-sm text-muted-foreground">
                      #{university.ranking}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <DollarSign className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Tuition Fee</p>
                    <p className="text-sm text-muted-foreground">
                      {university.tuitionFee}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Added to System</p>
                    <p className="text-sm text-muted-foreground">
                      {university.createdAt
                        ? new Date(university.createdAt).toLocaleDateString()
                        : "-"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Academic Programs */}
            <Card>
              <CardHeader>
                <CardTitle>Academic Programs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {university.programs.map((program, index) => (
                    <Badge key={index} variant="secondary">
                      {program}
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
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {university.facilities.map((facility, index) => (
                    <Badge key={index} variant="outline">
                      {facility}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
