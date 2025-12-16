"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface EventFormProps {
  event?: {
    _id?: string
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
  onSuccess?: () => void
  onCancel?: () => void
}

export function EventForm({ event, onSuccess, onCancel }: EventFormProps) {
  const [formData, setFormData] = useState({
    title: event?.title || "",
    description: event?.description || "",
    date: event?.date ? new Date(event.date).toISOString().split("T")[0] : "",
    time: event?.time || "",
    venue: event?.venue || "",
    category: event?.category || "music",
    totalTickets: event?.totalTickets || 100,
    availableTickets: event?.availableTickets || 100,
    price: event?.price || 0,
    imageUrl: event?.imageUrl || "",
  })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = event?._id ? `/api/events/${event._id}` : "/api/events"
      const method = event?._id ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to save event")
      }

      toast({
        title: "Success",
        description: event?._id ? "Event updated successfully" : "Event created successfully",
      })

      onSuccess?.()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save event",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Event Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="Summer Music Festival"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Event description..."
          rows={4}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => handleChange("date", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="time">Time</Label>
          <Input
            id="time"
            type="time"
            value={formData.time}
            onChange={(e) => handleChange("time", e.target.value)}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="venue">Venue</Label>
        <Input
          id="venue"
          value={formData.venue}
          onChange={(e) => handleChange("venue", e.target.value)}
          placeholder="Madison Square Garden"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select value={formData.category} onValueChange={(value) => handleChange("category", value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="music">Music</SelectItem>
            <SelectItem value="sports">Sports</SelectItem>
            <SelectItem value="arts">Arts</SelectItem>
            <SelectItem value="technology">Technology</SelectItem>
            <SelectItem value="business">Business</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="totalTickets">Total Tickets</Label>
          <Input
            id="totalTickets"
            type="number"
            min="1"
            value={formData.totalTickets}
            onChange={(e) => handleChange("totalTickets", Number.parseInt(e.target.value))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="availableTickets">Available Tickets</Label>
          <Input
            id="availableTickets"
            type="number"
            min="0"
            max={formData.totalTickets}
            value={formData.availableTickets}
            onChange={(e) => handleChange("availableTickets", Number.parseInt(e.target.value))}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="price">Price (₹)</Label>
        <Input
          id="price"
          type="number"
          min="0"
          step="0.01"
          value={formData.price}
          onChange={(e) => handleChange("price", Number.parseFloat(e.target.value))}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="imageUrl">Image URL (Optional)</Label>
        <Input
          id="imageUrl"
          value={formData.imageUrl}
          onChange={(e) => handleChange("imageUrl", e.target.value)}
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : event?._id ? (
            "Update Event"
          ) : (
            "Create Event"
          )}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}
