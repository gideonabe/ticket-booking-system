import { Schema, model, models } from "mongoose"

export interface IBooking {
  _id: string
  eventId: string
  attendeeName: string
  attendeeEmail: string
  numberOfTickets: number
  totalAmount: number
  bookingReference: string
  qrCode: string
  status: "pending" | "confirmed" | "checked-in" | "cancelled"
  createdAt: Date
  updatedAt: Date
}

const BookingSchema = new Schema<IBooking>(
  {
    eventId: { type: String, required: true, ref: "Event" },
    attendeeName: { type: String, required: true },
    attendeeEmail: { type: String, required: true },
    numberOfTickets: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    bookingReference: { type: String, required: true, unique: true },
    qrCode: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "checked-in", "cancelled"],
      default: "confirmed",
    },
  },
  {
    timestamps: true,
  },
)

BookingSchema.index({ eventId: 1 })
BookingSchema.index({ attendeeEmail: 1 })
BookingSchema.index({ bookingReference: 1 })

export const Booking = models.Booking || model<IBooking>("Booking", BookingSchema)
