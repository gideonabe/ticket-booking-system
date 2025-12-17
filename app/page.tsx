"use client"

import { useState, useEffect } from "react"
import { EventCard } from "@/components/event-card"
import { EventFilters } from "@/components/event-filters"
import { Loader2, LogOut } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth/auth-provider"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface Event {
  _id: string
  title: string
  description: string
  date: string
  time: string
  venue: string
  category: string
  availableTickets: number
  price: number
  imageUrl?: string
}

export default function HomePage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const { user, signOut } = useAuth()

  useEffect(() => {
    fetchEvents()
  }, [selectedCategory, searchQuery])

  const fetchEvents = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (selectedCategory !== "all") {
        params.append("category", selectedCategory)
      }
      if (searchQuery) {
        params.append("search", searchQuery)
      }

      const response = await fetch(`/api/events?${params.toString()}`)
      const data = await response.json()
      setEvents(data.events || [])
    } catch (error) {
      console.error("Error fetching events:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <h1 className="text-2xl font-bold text-primary">TicketZone</h1>
          </Link>
          <nav className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/my-bookings">My Bookings</Link>
            </Button>
            {user?.role === "admin" && (
              <Button variant="ghost" asChild>
                <Link href="/admin">Admin</Link>
              </Button>
            )}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar>
                      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild>
                <Link href="/auth/signin">Sign In</Link>
              </Button>
            )}
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-4xl font-bold mb-2 text-balance">Discover Amazing Events</h2>
          <p className="text-muted-foreground text-lg">Find and book tickets to the best events happening around you</p>
        </div>

        <div className="mb-8">
          <EventFilters
            selectedCategory={selectedCategory}
            searchQuery={searchQuery}
            onCategoryChange={setSelectedCategory}
            onSearchChange={setSearchQuery}
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">No events found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
