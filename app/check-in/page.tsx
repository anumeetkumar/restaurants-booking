"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UserForm } from "@/components/users/user-form"
import { QRCodeDisplay } from "@/components/qr/qr-code-display"
import { Button } from "@/components/ui/button"
import { useUserStore, useCategoryStore } from "@/lib/store"
import { formatCurrency } from "@/lib/utils"
import { CheckCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function CheckInPage() {
  const [bookingId, setBookingId] = useState<string | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const { getUserById } = useUserStore()
  const { getCategoryById } = useCategoryStore()

  const handleBookingSuccess = (userId?: string) => {
    if (userId) {
      setBookingId(userId)
      setShowSuccess(true)
    }
  }

  const booking = bookingId ? getUserById(bookingId) : null
  const category = booking ? getCategoryById(booking.categoryId) : null

  if (showSuccess && booking && category) {
    return (
      <div className="container mx-auto p-6 max-w-2xl">
        <div className="text-center space-y-6">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>

          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Booking Confirmed!</h1>
            <p className="text-muted-foreground">Your buffet booking has been successfully created.</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Booking Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Name:</span>
                  <div className="font-medium">{booking.name}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Phone:</span>
                  <div className="font-medium">{booking.phone}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Persons:</span>
                  <div className="font-medium">{booking.noOfPersons}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Category:</span>
                  <div className="font-medium">{category.name}</div>
                </div>
                <div className="col-span-2">
                  <span className="text-muted-foreground">Total Amount:</span>
                  <div className="font-bold text-lg">
                    {formatCurrency(booking.noOfPersons * category.pricePerPlate)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div>
            <h3 className="text-lg font-semibold mb-4">Your QR Code</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Show this QR code at the restaurant entrance for quick check-in
            </p>
            <QRCodeDisplay
              data={booking.qrCode || `/check-in/${booking.id}`}
              title={`${booking.name} - ${category.name}`}
              subtitle={`${booking.noOfPersons} person${booking.noOfPersons > 1 ? "s" : ""} • ${formatCurrency(booking.noOfPersons * category.pricePerPlate)}`}
            />
          </div>

          <div className="flex justify-center space-x-4">
            <Button asChild variant="outline">
              <Link href="/check-in">
                <ArrowLeft className="h-4 w-4 mr-2" />
                New Booking
              </Link>
            </Button>
            <Button asChild className="bg-red-700 hover:bg-red-800">
              <Link href="/">Go to Dashboard</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">New Check-In</h1>
        <p className="text-muted-foreground">Create a new buffet booking for your customers</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Booking Information</CardTitle>
        </CardHeader>
        <CardContent>
          <UserForm onSuccess={handleBookingSuccess} onCancel={() => window.history.back()} />
        </CardContent>
      </Card>
    </div>
  )
}
