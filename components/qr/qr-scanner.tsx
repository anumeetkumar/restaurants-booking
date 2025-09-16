"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Camera, CameraOff, AlertCircle } from "lucide-react"

interface QRScannerProps {
  onScan: (data: string) => void
  onError?: (error: string) => void
}

export function QRScanner({ onScan, onError }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const startScanning = async () => {
    try {
      setError(null)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
        setIsScanning(true)
      }
    } catch (err) {
      const errorMessage = "Camera access denied or not available"
      setError(errorMessage)
      onError?.(errorMessage)
    }
  }

  const stopScanning = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    setIsScanning(false)
  }

  useEffect(() => {
    return () => {
      stopScanning()
    }
  }, [])

  // Simulate QR code detection (in a real app, you'd use a QR code library)
  const handleVideoClick = () => {
    if (isScanning) {
      // Simulate successful scan
      const mockQRData = `/check-in/${crypto.randomUUID()}`
      onScan(mockQRData)
      stopScanning()
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Camera className="h-5 w-5 mr-2" />
          QR Code Scanner
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="relative">
          {isScanning ? (
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-64 bg-black rounded-lg cursor-pointer"
                onClick={handleVideoClick}
              />
              <div className="absolute inset-0 border-2 border-red-500 rounded-lg pointer-events-none">
                <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-red-500"></div>
                <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-red-500"></div>
                <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-red-500"></div>
                <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-red-500"></div>
              </div>
              <p className="text-center text-sm text-muted-foreground mt-2">
                Point camera at QR code or click to simulate scan
              </p>
            </div>
          ) : (
            <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center">
                <CameraOff className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">Camera not active</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-center">
          {isScanning ? (
            <Button onClick={stopScanning} variant="outline">
              <CameraOff className="h-4 w-4 mr-2" />
              Stop Scanning
            </Button>
          ) : (
            <Button onClick={startScanning} className="bg-red-700 hover:bg-red-800">
              <Camera className="h-4 w-4 mr-2" />
              Start Scanning
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
