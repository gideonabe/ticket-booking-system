import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import { Booking } from "@/lib/models/Booking"
import { Event } from "@/lib/models/Event"

export async function POST(request: NextRequest) {
  try {
    await dbConnect()

    const { bookingReference } = await request.json()

    if (!bookingReference) {
      return NextResponse.json({ error: "Booking reference is required" }, { status: 400 })
    }

    const booking = await Booking.findOne({ bookingReference })

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    if (booking.status === "checked-in") {
      return NextResponse.json({ error: "Ticket already checked in" }, { status: 400 })
    }

    if (booking.status === "cancelled") {
      return NextResponse.json({ error: "Booking has been cancelled" }, { status: 400 })
    }

    const event = await Event.findById(booking.eventId)

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    booking.status = "checked-in"
    await booking.save()

    return NextResponse.json({
      success: true,
      booking: {
        bookingReference: booking.bookingReference,
        attendeeName: booking.attendeeName,
        attendeeEmail: booking.attendeeEmail,
        numberOfTickets: booking.numberOfTickets,
        status: booking.status,
      },
      event: {
        title: event.title,
        date: event.date,
        time: event.time,
        venue: event.venue,
      },
    })
  } catch (error) {
    console.error("Error checking in:", error)
    return NextResponse.json({ error: "Failed to check in" }, { status: 500 })
  }
}
