"use client"

import { useState, useEffect, use } from "react"
import { Calendar, MapPin, Loader2, Download, Mail, CheckCircle, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface Booking {
  _id: string
  eventId: string
  attendeeName: string
  attendeeEmail: string
  numberOfTickets: number
  totalAmount: number
  bookingReference: string
  qrCode: string
  status: string
  createdAt: string
}

interface Event {
  title: string
  date: string
  time: string
  venue: string
  category: string
}

export default function BookingConfirmationPage({ params }: { params: Promise<{ reference: string }> }) {
  const resolvedParams = use(params)
  const [booking, setBooking] = useState<Booking | null>(null)
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBooking()
  }, [resolvedParams.reference])

  const fetchBooking = async () => {
    try {
      const response = await fetch(`/api/bookings/${resolvedParams.reference}`)
      const data = await response.json()
      setBooking(data.booking)

      if (data.booking) {
        const eventResponse = await fetch(`/api/events/${data.booking.eventId}`)
        const eventData = await eventResponse.json()
        setEvent(eventData.event)
      }
    } catch (error) {
      console.error("Error fetching booking:", error)
    } finally {
      setLoading(false)
    }
  }

  const downloadQRCode = () => {
    if (!booking) return

    const link = document.createElement("a")
    link.href = booking.qrCode
    link.download = `ticket-${booking.bookingReference}.png`
    link.click()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!booking || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Booking Not Found</h2>
          <Button asChild>
            <Link href="/">Back to Events</Link>
          </Button>
        </div>
      </div>
    )
  }

  const eventDate = new Date(event.date).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  })

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <Link href="/">
          <div className="container mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold">TicketZone</h1>
          </div>
        </Link>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full mb-4">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-500" />
          </div>
          <h1 className="text-4xl font-bold mb-2">Booking Confirmed!</h1>
          <p className="text-muted-foreground text-lg">Your tickets have been successfully booked</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl mb-2">{event.title}</CardTitle>
                <Badge>{event.category}</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <span>{eventDate}</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-muted-foreground" />
                <span>{event.venue}</span>
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Attendee Name</p>
                  <p className="font-semibold">{booking.attendeeName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Email</p>
                  <p className="font-semibold">{booking.attendeeEmail}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Number of Tickets</p>
                  <p className="font-semibold">{booking.numberOfTickets}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Total Amount</p>
                  <p className="font-semibold flex items-center">
                    <DollarSign className="w-4 h-4" />
                    {booking.totalAmount}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Ticket</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Booking Reference</p>
                <p className="text-3xl font-bold tracking-wider">{booking.bookingReference}</p>
              </div>

              <div className="bg-muted p-6 rounded-lg inline-block">
                <img src={booking.qrCode || "/placeholder.svg"} alt="QR Code" className="w-48 h-48" />
              </div>

              <p className="text-sm text-muted-foreground">Show this QR code at the venue entrance</p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={downloadQRCode} variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download QR Code
                </Button>
                <Button variant="outline" disabled>
                  <Mail className="w-4 h-4 mr-2" />
                  Email Sent
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 p-4 bg-muted rounded-lg">
          <h3 className="font-semibold mb-2">Important Information</h3>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
            <li>Please arrive at the venue 30 minutes before the event starts</li>
            <li>Present this QR code at the entrance for check-in</li>
            <li>Keep your booking reference handy</li>
            <li>A confirmation email has been sent to {booking.attendeeEmail}</li>
          </ul>
        </div>

        <div className="mt-6 flex justify-center gap-4">
          <Button asChild variant="outline">
            <Link href="/">Browse More Events</Link>
          </Button>
          <Button asChild>
            <Link href="/my-bookings">View My Bookings</Link>
          </Button>
        </div>
      </main>
    </div>
  )
}
