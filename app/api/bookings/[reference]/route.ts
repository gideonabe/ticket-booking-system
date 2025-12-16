import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import { Booking } from "@/lib/models/Booking"

export async function GET(request: NextRequest, { params }: { params: Promise<{ reference: string }> }) {
  try {
    await dbConnect()
    const { reference } = await params

    const booking = await Booking.findOne({ bookingReference: reference })

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    return NextResponse.json({ booking })
  } catch (error) {
    console.error("Error fetching booking:", error)
    return NextResponse.json({ error: "Failed to fetch booking" }, { status: 500 })
  }
}
