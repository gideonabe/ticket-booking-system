"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { EventForm } from "@/components/admin/event-form"
import { Calendar, MapPin, Users, Pencil, Trash2, Plus, Loader2, DollarSign } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

interface Event {
  _id: string
  title: string
  description: string
  date: string
  time: string
  venue: string
  category: string
  totalTickets: number
  availableTickets: number
  price: number
  imageUrl?: string
}

export default function AdminPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [showDialog, setShowDialog] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/events")
      const data = await response.json()
      setEvents(data.events || [])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch events",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return

    try {
      const response = await fetch(`/api/events/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete event")
      }

      toast({
        title: "Success",
        description: "Event deleted successfully",
      })

      fetchEvents()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete event",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (event: Event) => {
    setEditingEvent(event)
    setShowDialog(true)
  }

  const handleCreate = () => {
    setEditingEvent(null)
    setShowDialog(true)
  }

  const handleDialogClose = () => {
    setShowDialog(false)
    setEditingEvent(null)
  }

  const handleSuccess = () => {
    handleDialogClose()
    fetchEvents()
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/">Browse Events</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/admin/scanner">QR Scanner</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-4xl font-bold mb-2">Event Management</h2>
            <p className="text-muted-foreground text-lg">Create and manage your events</p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="w-4 h-4 mr-2" />
            Create Event
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : events.length === 0 ? (
          <Card>
            <CardContent className="py-20 text-center">
              <p className="text-muted-foreground text-lg mb-4">No events created yet</p>
              <Button onClick={handleCreate}>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Event
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => {
              const eventDate = new Date(event.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
              const ticketsSold = event.totalTickets - event.availableTickets

              return (
                <Card key={event._id}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <Badge>{event.category}</Badge>
                      <div className="flex gap-1">
                        <Button size="icon" variant="ghost" onClick={() => handleEdit(event)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => handleDelete(event._id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <CardTitle className="line-clamp-2 text-balance">{event.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>
                          {eventDate} at {event.time}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="line-clamp-1">{event.venue}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span>
                          {ticketsSold} / {event.totalTickets} sold
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm font-semibold">
                        <DollarSign className="w-4 h-4" />
                        <span>{event.price}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </main>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingEvent ? "Edit Event" : "Create New Event"}</DialogTitle>
          </DialogHeader>
          <EventForm event={editingEvent || undefined} onSuccess={handleSuccess} onCancel={handleDialogClose} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
