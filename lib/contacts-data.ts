export interface Contact {
  id: string
  name: string
  email: string
  phone: string
  subject: string
  message: string
  status: "active" | "inactive" | "pending"
  addedAt: string
}

export const contacts: Contact[] = [
  {
    id: "1",
    name: "Sarah Chen",
    email: "sarah.chen@example.com",
    phone: "+1 (415) 555-0102",
    subject: "Inquiry about UK Universities",
    message: "I am interested in studying Computer Science in the UK. Can you provide information about the best universities?",
    status: "active",
    addedAt: "2026-02-10",
  },
  {
    id: "2",
    name: "Marcus Johnson",
    email: "m.johnson@example.io",
    phone: "+1 (212) 555-0198",
    subject: "Application Support",
    message: "I need help with my application process. Can someone from your team contact me?",
    status: "active",
    addedAt: "2026-02-08",
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    email: "emily.r@example.co",
    phone: "+1 (310) 555-0147",
    subject: "Scholarship Availability",
    message: "Are there any scholarships available for undergraduate students from Latin America?",
    status: "pending",
    addedAt: "2026-02-12",
  },
  {
    id: "4",
    name: "James Liu",
    email: "jliu@example.com",
    phone: "+1 (650) 555-0163",
    subject: "Course Information",
    message: "I would like to know more about the available courses and program duration.",
    status: "active",
    addedAt: "2026-02-05",
  },
  {
    id: "5",
    name: "Ava Patel",
    email: "ava.patel@example.dev",
    phone: "+1 (408) 555-0189",
    subject: "Accommodation Options",
    message: "Do you provide on-campus housing? What are the costs?",
    status: "inactive",
    addedAt: "2025-11-28",
  },
  {
    id: "6",
    name: "David Kim",
    email: "dkim@example.io",
    phone: "+1 (323) 555-0134",
    subject: "Visa and Immigration",
    message: "What is the visa process for international students? How long does it take?",
    status: "active",
    addedAt: "2026-02-03",
  },
  {
    id: "7",
    name: "Olivia Martinez",
    email: "o.martinez@example.co",
    phone: "+1 (718) 555-0156",
    subject: "Financial Aid and Tuition",
    message: "Can you provide details about tuition fees and available financial aid?",
    status: "active",
    addedAt: "2026-01-08",
  },
  {
    id: "8",
    name: "Noah Thompson",
    email: "noah.t@example.com",
    phone: "+1 (503) 555-0172",
    subject: "Campus Tour Request",
    message: "I would like to schedule a campus tour. When are the available dates?",
    status: "pending",
    addedAt: "2026-02-05",
  },
  {
    id: "9",
    name: "Sophia Lee",
    email: "sophia@example.io",
    phone: "+1 (619) 555-0145",
    subject: "Internship Opportunities",
    message: "Are there internship opportunities available as part of the study program?",
    status: "active",
    addedAt: "2025-12-20",
  },
  {
    id: "10",
    name: "Liam O'Brien",
    email: "lobrien@example.co",
    phone: "+1 (206) 555-0118",
    subject: "General Inquiry",
    message: "I have general questions about your programs. Can someone contact me?",
    status: "inactive",
    addedAt: "2025-10-15",
  },
]
