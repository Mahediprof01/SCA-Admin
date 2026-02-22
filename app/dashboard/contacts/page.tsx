import { contacts } from "@/lib/contacts-data"
import { DashboardHeader } from "@/components/dashboard-header"
import { ContactsTable } from "@/components/contacts-table"

export default function ContactsPage() {
  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="px-6 py-6">
          <h1 className="text-2xl font-semibold text-foreground">Contacts</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage and view all your contacts
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex flex-col gap-6">
          <DashboardHeader contacts={contacts} />
          <ContactsTable />
        </div>
      </div>
    </div>
  )
}
