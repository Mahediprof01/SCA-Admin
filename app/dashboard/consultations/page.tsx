import { ConsultationsTable } from "@/components/consultations-table"

export default function ConsultationsPage() {
  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="px-6 py-6">
          <h1 className="text-2xl font-semibold text-foreground">
            Consultations
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage consultation bookings and track their status
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex flex-col gap-6">
          <ConsultationsTable />
        </div>
      </div>
    </div>
  )
}
