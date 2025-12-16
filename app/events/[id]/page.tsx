"use client"

import type React from "react"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { Calendar, MapPin, Users, Loader2, ArrowLeft, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface Event {
  _id: string
  title: string
  description: string
  date: string
  time: string
  venue: string
  category: string
  availableTickets: number
  totalTickets: number
  price: number
  imageUrl?: string
}

export default function EventPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = use(params)
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [booking, setBooking] = useState(false)
  const [attendeeName, setAttendeeName] = useState("")
  const [attendeeEmail, setAttendeeEmail] = useState("")
  const [numberOfTickets, setNumberOfTickets] = useState(1)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    fetchEvent()
  }, [resolvedParams.id])

  const fetchEvent = async () => {
    try {
      const response = await fetch(`/api/events/${resolvedParams.id}`)
      const data = await response.json()
      setEvent(data.event)
    } catch (error) {
      console.error("Error fetching event:", error)
      toast({
        title: "Error",
        description: "Failed to load event details",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!attendeeName || !attendeeEmail) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    setBooking(true)

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: resolvedParams.id,
          attendeeName,
          attendeeEmail,
          numberOfTickets,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create booking")
      }

      toast({
        title: "Booking Confirmed!",
        description: "Check your email for confirmation and QR code",
      })

      router.push(`/booking-confirmation/${data.booking.bookingReference}`)
    } catch (error: any) {
      toast({
        title: "Booking Failed",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setBooking(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Event Not Found</h2>
          <Button asChild>
            <Link href="/">Back to Events</Link>
          </Button>
        </div>
      </div>
    )
  }

  const eventDate = new Date(event.date)
  const formattedDate = eventDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  })

  const totalAmount = event.price * numberOfTickets

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" asChild>
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Events
            </Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="aspect-video relative bg-muted rounded-lg overflow-hidden">
              {event.imageUrl ? (
                <img
                  src={event.imageUrl || "/placeholder.svg"}
                  alt={event.title}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                  <Calendar className="w-24 h-24 text-muted-foreground/40" />
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Badge className="mb-2">{event.category}</Badge>
                  <h1 className="text-4xl font-bold text-balance">{event.title}</h1>
                </div>
              </div>

              <div className="grid gap-3">
                <div className="flex items-center gap-3 text-lg">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                  <span>{formattedDate}</span>
                </div>
                <div className="flex items-center gap-3 text-lg">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-3 text-lg">
                  <MapPin className="w-5 h-5 text-muted-foreground" />
                  <span>{event.venue}</span>
                </div>
                <div className="flex items-center gap-3 text-lg">
                  <Users className="w-5 h-5 text-muted-foreground" />
                  <span>
                    {event.availableTickets} of {event.totalTickets} tickets available
                  </span>
                </div>
              </div>

              <div className="pt-4">
                <h2 className="text-2xl font-semibold mb-3">About this event</h2>
                <p className="text-muted-foreground leading-relaxed">{event.description}</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Book Tickets</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleBooking} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={attendeeName}
                      onChange={(e) => setAttendeeName(e.target.value)}
                      placeholder="John Doe"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={attendeeEmail}
                      onChange={(e) => setAttendeeEmail(e.target.value)}
                      placeholder="john@example.com"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tickets">Number of Tickets</Label>
                    <Input
                      id="tickets"
                      type="number"
                      min="1"
                      max={event.availableTickets}
                      value={numberOfTickets}
                      onChange={(e) => setNumberOfTickets(Number.parseInt(e.target.value))}
                      required
                    />
                  </div>

                  <div className="pt-4 border-t space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Price per ticket</span>
                      <span className="flex items-center">
                        <DollarSign className="w-3 h-3" />
                        {event.price}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Quantity</span>
                      <span>{numberOfTickets}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg pt-2">
                      <span>Total</span>
                      <span className="flex items-center">
                        <DollarSign className="w-5 h-5" />
                        {totalAmount}
                      </span>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={booking || event.availableTickets === 0}>
                    {booking ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : event.availableTickets === 0 ? (
                      "Sold Out"
                    ) : (
                      "Confirm Booking"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
