"use client"

import { Calendar, MapPin, Users, DollarSign } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface EventCardProps {
  event: {
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
}

export function EventCard({ event }: EventCardProps) {
  const eventDate = new Date(event.date)
  const formattedDate = eventDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  return (
    <Link href={`/events/${event._id}`} >
      <Card className="pt-0 pb-0 overflow-hidden hover:shadow-lg transform transition duration-300 hover:scale-101">
        <div className="aspect-video relative bg-muted overflow-hidden">
          {event.imageUrl ? (
            <img src={event.imageUrl || "/placeholder.svg"} alt={event.title} className="object-cover w-full h-full" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-primary/10 to-primary/5">
              <Calendar className="w-16 h-16 text-muted-foreground/40" />
            </div>
          )}
          <Badge className="absolute top-3 right-3">{event.category}</Badge>
        </div>
        <CardContent className="px-5 pb-0">
          <h3 className="font-semibold text-xl mb-2 line-clamp-1 text-balance">{event.title}</h3>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{event.description}</p>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span>
                {formattedDate} at {event.time}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span className="line-clamp-1">{event.venue}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span>{event.availableTickets} tickets available</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-5 pt-0 flex items-center justify-between">
          <div className="flex items-center gap-1 font-semibold text-lg">
            <DollarSign className="w-5 h-5" />
            {event.price}
          </div>
          <Button asChild>
            <Link href={`/events/${event._id}`}>Book Now</Link>
          </Button>
        </CardFooter>
        {/* <div class="qr-code">
          <h3 style="margin-top: 0; color: #667eea;">Your Ticket QR Code</h3>
          <img src="${qrCode}" alt="QR Code" style="max-width: 200px; height: auto;" />
          <p style="color: #666; margin-top: 15px;">Show this QR code at the venue entrance</p>
        </div> */}
      </Card>
    </Link>
  )
}
