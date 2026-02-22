"use client"

import { Users, UserCheck, UserX, Clock } from "lucide-react"
import type { Contact } from "@/lib/contacts-data"

interface DashboardHeaderProps {
  contacts: Contact[]
}

export function DashboardHeader({ contacts }: DashboardHeaderProps) {
  const totalContacts = contacts.length
  const activeContacts = contacts.filter((c) => c.status === "active").length
  const pendingContacts = contacts.filter((c) => c.status === "pending").length
  const inactiveContacts = contacts.filter(
    (c) => c.status === "inactive"
  ).length

  const stats = [
    {
      label: "Total Contacts",
      value: totalContacts,
      icon: Users,
    },
    {
      label: "Active",
      value: activeContacts,
      icon: UserCheck,
    },
    {
      label: "Pending",
      value: pendingContacts,
      icon: Clock,
    },
    {
      label: "Inactive",
      value: inactiveContacts,
      icon: UserX,
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex items-center gap-4 rounded-lg border border-border bg-card p-4"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <stat.icon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-semibold text-foreground">
              {stat.value}
            </p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
