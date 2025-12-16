import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import { Booking } from "@/lib/models/Booking"
import { Event } from "@/lib/models/Event"
import QRCode from "qrcode"
import { sendBookingConfirmationEmail } from "@/lib/email"

function generateBookingReference(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let reference = ""
  for (let i = 0; i < 8; i++) {
    reference += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return reference
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect()

    const { eventId, attendeeName, attendeeEmail, numberOfTickets } = await request.json()

    // Check if event exists and has available tickets
    const event = await Event.findById(eventId)
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    if (event.availableTickets < numberOfTickets) {
      return NextResponse.json({ error: "Not enough tickets available" }, { status: 400 })
    }

    // Generate booking reference and QR code
    const bookingReference = generateBookingReference()
    const qrCode = await QRCode.toDataURL(bookingReference)

    // Calculate total amount
    const totalAmount = event.price * numberOfTickets

    // Create booking
    const booking = await Booking.create({
      eventId,
      attendeeName,
      attendeeEmail,
      numberOfTickets,
      totalAmount,
      bookingReference,
      qrCode,
      status: "confirmed",
    })

    // Update available tickets
    await Event.findByIdAndUpdate(eventId, {
      $inc: { availableTickets: -numberOfTickets },
    })

    const eventDate = new Date(event.date).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    })

    await sendBookingConfirmationEmail({
      to: attendeeEmail,
      attendeeName,
      eventTitle: event.title,
      eventDate,
      eventTime: event.time,
      eventVenue: event.venue,
      numberOfTickets,
      totalAmount,
      bookingReference,
      qrCode,
    })

    return NextResponse.json({ booking }, { status: 201 })
  } catch (error) {
    console.error("Error creating booking:", error)
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    const searchParams = request.nextUrl.searchParams
    const email = searchParams.get("email")
    const eventId = searchParams.get("eventId")

    const query: any = {}

    if (email) {
      query.attendeeEmail = email
    }

    if (eventId) {
      query.eventId = eventId
    }

    const bookings = await Booking.find(query).sort({ createdAt: -1 })

    return NextResponse.json({ bookings })
  } catch (error) {
    console.error("Error fetching bookings:", error)
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 })
  }
}
