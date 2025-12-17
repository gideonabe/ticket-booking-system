"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Search } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface Booking {
  _id: string
  eventId: string
  attendeeName: string
  attendeeEmail: string
  numberOfTickets: number
  totalAmount: number
  bookingReference: string
  status: string
  createdAt: string
}

export default function MyBookingsPage() {
  const [email, setEmail] = useState("")
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const { toast } = useToast()

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    setSearched(true)

    try {
      const response = await fetch(`/api/bookings?email=${encodeURIComponent(email)}`)
      const data = await response.json()
      setBookings(data.bookings || [])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch bookings",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <h1 className="text-2xl font-bold">TicketZone</h1>
          </Link>
          <Button variant="ghost" asChild>
            <Link href="/">Browse Events</Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h2 className="text-4xl font-bold mb-2">My Bookings</h2>
          <p className="text-muted-foreground text-lg">View and manage your event bookings</p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Find Your Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                />
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Search Bookings
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {searched && (
          <div>
            {bookings.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No bookings found for this email address</p>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">{bookings.length} Booking(s) Found</h3>
                {bookings.map((booking) => (
                  <Card key={booking._id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-2">
                          <div>
                            <p className="text-sm text-muted-foreground">Booking Reference</p>
                            <p className="font-semibold text-lg">{booking.bookingReference}</p>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Attendee</p>
                              <p className="font-medium">{booking.attendeeName}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Tickets</p>
                              <p className="font-medium">{booking.numberOfTickets}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Amount</p>
                              <p className="font-medium">₹{booking.totalAmount}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Status</p>
                              <p className="font-medium capitalize">{booking.status}</p>
                            </div>
                          </div>
                        </div>
                        <Button asChild>
                          <Link href={`/booking-confirmation/${booking.bookingReference}`}>View Details</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
