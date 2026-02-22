import { contacts } from "@/lib/contacts-data"
import { universities } from "@/lib/universities-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Building2, TrendingUp, Activity } from "lucide-react"

export default function DashboardPage() {
  const stats = [
    {
      title: "Total Contacts",
      value: contacts.length,
      icon: Users,
      description: `${contacts.filter(c => c.status === "active").length} active contacts`,
      trend: "+12% from last month",
    },
    {
      title: "Total Universities",
      value: universities.length,
      icon: Building2,
      description: `${universities.filter(u => u.status === "active").length} active universities`,
      trend: "+3 new this month",
    },
    {
      title: "Pending Contacts",
      value: contacts.filter(c => c.status === "pending").length,
      icon: Activity,
      description: "Awaiting review",
      trend: "2 need attention",
    },
    {
      title: "Countries",
      value: new Set(universities.map(u => u.country)).size,
      icon: TrendingUp,
      description: "Universities worldwide",
      trend: "In 5 countries",
    },
  ]

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="px-6 py-6">
          <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Welcome back! Here's an overview of your admin panel.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="p-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
                <p className="text-xs text-green-600 mt-2">{stat.trend}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Activity Section */}
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Contacts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contacts.slice(0, 5).map((contact) => (
                  <div
                    key={contact.id}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="text-sm font-medium">{contact.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {contact.company}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        contact.status === "active"
                          ? "bg-green-100 text-green-800"
                          : contact.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {contact.status}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Universities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {universities
                  .sort((a, b) => a.ranking - b.ranking)
                  .slice(0, 5)
                  .map((university) => (
                    <div
                      key={university.id}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <p className="text-sm font-medium">{university.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {university.country}
                        </p>
                      </div>
                      <span className="text-xs font-semibold text-primary">
                        #{university.ranking}
                      </span>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
