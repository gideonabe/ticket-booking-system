import { Schema, model, models } from "mongoose"

export interface IEvent {
  _id: string
  title: string
  description: string
  date: Date
  time: string
  venue: string
  category: string
  totalTickets: number
  availableTickets: number
  price: number
  imageUrl?: string
  createdAt: Date
  updatedAt: Date
}

const EventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    venue: { type: String, required: true },
    category: { type: String, required: true },
    totalTickets: { type: Number, required: true },
    availableTickets: { type: Number, required: true },
    price: { type: Number, required: true },
    imageUrl: { type: String },
  },
  {
    timestamps: true,
  },
)

export const Event = models.Event || model<IEvent>("Event", EventSchema)
