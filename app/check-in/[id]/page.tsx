"use client"

import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useUserStore, useCategoryStore } from "@/lib/store"
import { formatCurrency, formatDate } from "@/lib/utils"
import { CheckCircle, Clock, User, Phone, Users, UtensilsCrossed } from "lucide-react"

export default function CheckInDetailsPage() {
  const params = useParams()
  const userId = params.id as string
  const { getUserById, checkInUser } = useUserStore()
  const { getCategoryById } = useCategoryStore()

  const user = getUserById(userId)
  const category = user ? getCategoryById(user.categoryId) : null

  if (!user || !category) {
    return (
      <div className="container mx-auto p-6 max-w-2xl">
        <Card>
          <CardContent className="text-center py-12">
            <h2 className="text-xl font-semibold mb-2">Booking Not Found</h2>
            <p className="text-muted-foreground">The booking you're looking for doesn't exist or has been removed.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleCheckIn = () => {
    checkInUser(user.id)
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">Booking Details</h1>
          <Badge variant={user.checkedIn ? "default" : "secondary"} className="text-sm">
            {user.checkedIn ? (
              <>
                <CheckCircle className="h-4 w-4 mr-1" />
                Checked In
              </>
            ) : (
              <>
                <Clock className="h-4 w-4 mr-1" />
                Pending Check-In
              </>
            )}
          </Badge>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              Customer Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{user.name}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{user.phone}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Users className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Number of Persons</p>
                  <p className="font-medium">{user.noOfPersons}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <UtensilsCrossed className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Buffet Category</p>
                  <p className="font-medium">{category.name}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Booking Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Category:</span>
                <span className="font-medium">{category.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Price per plate:</span>
                <span>{formatCurrency(category.pricePerPlate)}</span>
              </div>
              <div className="flex justify-between">
                <span>Number of persons:</span>
                <span>{user.noOfPersons}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold border-t pt-2">
                <span>Total Amount:</span>
                <span>{formatCurrency(user.noOfPersons * category.pricePerPlate)}</span>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              <p>Booked on: {formatDate(user.createdAt)}</p>
              {user.checkedIn && user.updatedAt && <p>Checked in on: {formatDate(user.updatedAt)}</p>}
            </div>
          </CardContent>
        </Card>

        {!user.checkedIn && (
          <div className="text-center">
            <Button onClick={handleCheckIn} size="lg" className="bg-red-700 hover:bg-red-800">
              <CheckCircle className="h-5 w-5 mr-2" />
              Check In Now
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
