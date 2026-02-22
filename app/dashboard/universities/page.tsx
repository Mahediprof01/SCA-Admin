"use client"

import { useState, useEffect } from "react"
import { UniversitiesTable } from "@/components/universities-table"
import { Card, CardContent } from "@/components/ui/card"
import { Building2, Loader2 } from "lucide-react"
import { apiClient, type UniversityStats } from "@/lib/api-client"

export default function UniversitiesPage() {
  const [stats, setStats] = useState<UniversityStats | null>(null)

  useEffect(() => {
    apiClient.getUniversityStats().then(setStats).catch(console.error)
  }, [])

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="px-6 py-6">
          <h1 className="text-2xl font-semibold text-foreground">Universities</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage and view all universities in your system
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex flex-col gap-6">
          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Universities</p>
                  <p className="text-2xl font-bold">
                    {stats ? stats.total : <Loader2 className="h-5 w-5 animate-spin" />}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10">
                  <Building2 className="h-6 w-6 text-green-600" />
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
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Countries</p>
                  <p className="text-2xl font-bold">
                    {stats ? stats.countries : <Loader2 className="h-5 w-5 animate-spin" />}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Table */}
          <UniversitiesTable />
        </div>
      </div>
    </div>
  )
}
