"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useCategoryStore, useUserStore } from "@/lib/store"
import { formatDate } from "@/lib/utils"
import { Clock, CheckCircle, User, UtensilsCrossed } from "lucide-react"

export function RecentActivity() {
  const { categories } = useCategoryStore()
  const { users } = useUserStore()

  // Get recent activities (bookings and check-ins)
  const activities = [
    ...users.map((user) => ({
      id: `booking-${user.id}`,
      type: "booking" as const,
      user,
      timestamp: user.createdAt,
      category: categories.find((cat) => cat.id === user.categoryId),
    })),
    ...users
      .filter((user) => user.checkedIn)
      .map((user) => ({
        id: `checkin-${user.id}`,
        type: "checkin" as const,
        user,
        timestamp: user.updatedAt,
        category: categories.find((cat) => cat.id === user.categoryId),
      })),
  ]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10) // Show last 10 activities

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No recent activity</p>
          ) : (
            activities.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-3 p-3 rounded-lg border">
                <div className={`p-2 rounded-full ${activity.type === "booking" ? "bg-blue-100" : "bg-green-100"}`}>
                  {activity.type === "booking" ? (
                    <User className="h-4 w-4 text-blue-600" />
                  ) : (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <p className="font-medium truncate">{activity.user.name}</p>
                    <Badge variant={activity.type === "booking" ? "secondary" : "default"} className="text-xs">
                      {activity.type === "booking" ? "New Booking" : "Checked In"}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span className="flex items-center">
                      <UtensilsCrossed className="h-3 w-3 mr-1" />
                      {activity.category?.name || "Unknown"}
                    </span>
                    <span>
                      {activity.user.noOfPersons} person{activity.user.noOfPersons > 1 ? "s" : ""}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatDate(activity.timestamp)}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
