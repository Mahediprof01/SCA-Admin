"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Building2, Users, LayoutDashboard, LogOut, CalendarCheck, Star, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { logout } from "@/app/actions/auth"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Contacts", href: "/dashboard/contacts", icon: Users },
  { name: "Consultations", href: "/dashboard/consultations", icon: CalendarCheck },
  { name: "Universities", href: "/dashboard/universities", icon: Building2 },
  { name: "Reviews", href: "/dashboard/reviews", icon: Star },
  { name: "Success Stories", href: "/dashboard/success-stories", icon: Trophy },
]

export function AppSidebar() {
  const pathname = usePathname()

  const handleLogout = async () => {
    await logout()
  }

  return (
    <div className="flex h-screen w-64 flex-col border-r border-border bg-card overflow-hidden">
      {/* Logo/Header */}
      <div className="flex h-16 items-center border-b border-border px-6 flex-shrink-0">
        <h1 className="text-lg font-semibold text-foreground">Admin Panel</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Logout Button */}
      <div className="border-t border-border p-4 flex-shrink-0">
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full justify-start gap-2"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  )
}
