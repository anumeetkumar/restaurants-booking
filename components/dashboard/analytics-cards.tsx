"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useCategoryStore, useUserStore } from "@/lib/store"
import { formatCurrency, isToday } from "@/lib/utils"
import { UtensilsCrossed, Users, TrendingUp, DollarSign, Clock, CheckCircle } from "lucide-react"

export function AnalyticsCards() {
  const { categories } = useCategoryStore()
  const { users } = useUserStore()

  const todayBookings = users.filter((user) => isToday(user.createdAt))
  const checkedInUsers = users.filter((user) => user.checkedIn)
  const pendingUsers = users.filter((user) => !user.checkedIn)

  // Calculate revenue
  const totalRevenue = users.reduce((sum, user) => {
    const category = categories.find((cat) => cat.id === user.categoryId)
    return sum + user.noOfPersons * (category?.pricePerPlate || 0)
  }, 0)

  const todayRevenue = todayBookings.reduce((sum, user) => {
    const category = categories.find((cat) => cat.id === user.categoryId)
    return sum + user.noOfPersons * (category?.pricePerPlate || 0)
  }, 0)

  // Calculate average booking size
  const avgBookingSize = users.length > 0 ? users.reduce((sum, user) => sum + user.noOfPersons, 0) / users.length : 0

  // Most popular category
  const categoryBookings = categories.map((category) => ({
    ...category,
    bookingCount: users.filter((user) => user.categoryId === category.id).length,
  }))
  const mostPopularCategory = categoryBookings.reduce(
    (prev, current) => (prev.bookingCount > current.bookingCount ? prev : current),
    categoryBookings[0],
  )

  const stats = [
    {
      title: "Total Revenue",
      value: formatCurrency(totalRevenue),
      icon: DollarSign,
      color: "text-green-600",
      change: todayRevenue > 0 ? `+${formatCurrency(todayRevenue)} today` : "No revenue today",
      changeColor: todayRevenue > 0 ? "text-green-600" : "text-muted-foreground",
    },
    {
      title: "Total Bookings",
      value: users.length,
      icon: Users,
      color: "text-blue-600",
      change: `${todayBookings.length} today`,
      changeColor: todayBookings.length > 0 ? "text-blue-600" : "text-muted-foreground",
    },
    {
      title: "Checked In",
      value: checkedInUsers.length,
      icon: CheckCircle,
      color: "text-green-600",
      change: `${((checkedInUsers.length / Math.max(users.length, 1)) * 100).toFixed(1)}% rate`,
      changeColor: "text-green-600",
    },
    {
      title: "Pending Check-ins",
      value: pendingUsers.length,
      icon: Clock,
      color: "text-yellow-600",
      change: pendingUsers.length > 0 ? "Needs attention" : "All caught up",
      changeColor: pendingUsers.length > 0 ? "text-yellow-600" : "text-green-600",
    },
    {
      title: "Active Categories",
      value: categoryBookings.filter((cat) => cat.bookingCount > 0).length,
      icon: UtensilsCrossed,
      color: "text-red-700",
      change: `${categories.length} total`,
      changeColor: "text-muted-foreground",
    },
    {
      title: "Avg. Party Size",
      value: avgBookingSize.toFixed(1),
      icon: TrendingUp,
      color: "text-purple-600",
      change: "persons per booking",
      changeColor: "text-muted-foreground",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className={`text-xs ${stat.changeColor}`}>{stat.change}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Popular Category Highlight */}
      {false && (
        <Card className="border-red-200 bg-red-50/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-red-700" />
              Most Popular Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">{mostPopularCategory.name}</h3>
                <p className="text-muted-foreground">{mostPopularCategory.description}</p>
                <p className="text-sm font-medium mt-1">
                  {formatCurrency(mostPopularCategory.pricePerPlate)} per plate
                </p>
              </div>
              <div className="text-right">
                <Badge variant="secondary" className="text-lg px-3 py-1">
                  {mostPopularCategory.bookingCount} bookings
                </Badge>
                <p className="text-sm text-muted-foreground mt-1">
                  {((mostPopularCategory.bookingCount / Math.max(users.length, 1)) * 100).toFixed(1)}% of total
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
