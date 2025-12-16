"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle, XCircle, Scan, Calendar, MapPin, User, Ticket, ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import jsQR from "jsqr"

interface CheckInResult {
  success: boolean
  booking?: {
    bookingReference: string
    attendeeName: string
    attendeeEmail: string
    numberOfTickets: number
    status: string
  }
  event?: {
    title: string
    date: string
    time: string
    venue: string
  }
  error?: string
}

export default function ScannerPage() {
  const [manualReference, setManualReference] = useState("")
  const [scanning, setScanning] = useState(false)
  const [result, setResult] = useState<CheckInResult | null>(null)
  const [cameraActive, setCameraActive] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number>()
  const { toast } = useToast()

  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
        setCameraActive(true)
        scanQRCode()
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
      toast({
        title: "Camera Error",
        description: "Failed to access camera. Please check permissions.",
        variant: "destructive",
      })
    }
  }

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach((track) => track.stop())
      videoRef.current.srcObject = null
    }

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }

    setCameraActive(false)
  }

  const scanQRCode = () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")

    if (!ctx || video.readyState !== video.HAVE_ENOUGH_DATA) {
      animationFrameRef.current = requestAnimationFrame(scanQRCode)
      return
    }

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const code = jsQR(imageData.data, imageData.width, imageData.height)

    if (code) {
      handleCheckIn(code.data)
      stopCamera()
      return
    }

    animationFrameRef.current = requestAnimationFrame(scanQRCode)
  }

  const handleCheckIn = async (reference: string) => {
    setScanning(true)
    setResult(null)

    try {
      const response = await fetch("/api/bookings/check-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingReference: reference }),
      })

      const data = await response.json()

      if (!response.ok) {
        setResult({ success: false, error: data.error })
        toast({
          title: "Check-in Failed",
          description: data.error,
          variant: "destructive",
        })
      } else {
        setResult(data)
        toast({
          title: "Success",
          description: "Ticket checked in successfully",
        })
      }
    } catch (error) {
      setResult({ success: false, error: "Failed to check in" })
      toast({
        title: "Error",
        description: "Failed to check in",
        variant: "destructive",
      })
    } finally {
      setScanning(false)
      setManualReference("")
    }
  }

  const handleManualCheckIn = (e: React.FormEvent) => {
    e.preventDefault()
    if (manualReference.trim()) {
      handleCheckIn(manualReference.trim())
    }
  }

  const handleScanAnother = () => {
    setResult(null)
    setManualReference("")
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">QR Scanner</h1>
          <Button variant="ghost" asChild>
            <Link href="/admin">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Admin
            </Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8">
          <h2 className="text-4xl font-bold mb-2">Ticket Check-In</h2>
          <p className="text-muted-foreground text-lg">Scan QR codes or enter booking references</p>
        </div>

        {!result ? (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Scan QR Code</CardTitle>
              </CardHeader>
              <CardContent>
                {!cameraActive ? (
                  <div className="text-center py-12">
                    <Scan className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground mb-4">Start the camera to scan QR codes</p>
                    <Button onClick={startCamera}>
                      <Scan className="w-4 h-4 mr-2" />
                      Start Camera
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                      <video ref={videoRef} className="w-full h-full object-cover" playsInline />
                      <div className="absolute inset-0 border-4 border-primary/50 m-12 rounded-lg" />
                    </div>
                    <Button onClick={stopCamera} variant="outline" className="w-full bg-transparent">
                      Stop Camera
                    </Button>
                  </div>
                )}
                <canvas ref={canvasRef} className="hidden" />
              </CardContent>
            </Card>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or enter manually</span>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Manual Entry</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleManualCheckIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reference">Booking Reference</Label>
                    <Input
                      id="reference"
                      value={manualReference}
                      onChange={(e) => setManualReference(e.target.value.toUpperCase())}
                      placeholder="Enter 8-character reference"
                      maxLength={8}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={scanning}>
                    {scanning ? "Checking in..." : "Check In"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center mb-6">
                {result.success ? (
                  <>
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full mb-4">
                      <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-500" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Check-in Successful!</h3>
                    <p className="text-muted-foreground">Ticket has been validated</p>
                  </>
                ) : (
                  <>
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full mb-4">
                      <XCircle className="w-8 h-8 text-red-600 dark:text-red-500" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Check-in Failed</h3>
                    <p className="text-muted-foreground">{result.error}</p>
                  </>
                )}
              </div>

              {result.success && result.booking && result.event && (
                <div className="space-y-4 mb-6">
                  <div className="grid gap-3 text-sm">
                    <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                      <User className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{result.booking.attendeeName}</p>
                        <p className="text-muted-foreground">{result.booking.attendeeEmail}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                      <Ticket className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">
                          {result.booking.numberOfTickets} {result.booking.numberOfTickets === 1 ? "Ticket" : "Tickets"}
                        </p>
                        <p className="text-muted-foreground">{result.booking.bookingReference}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                      <Calendar className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{result.event.title}</p>
                        <p className="text-muted-foreground">
                          {new Date(result.event.date).toLocaleDateString()} at {result.event.time}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                      <MapPin className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{result.event.venue}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <Button onClick={handleScanAnother} className="w-full">
                Scan Another Ticket
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
