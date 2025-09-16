"use client"

import { AnalyticsCards } from "@/components/dashboard/analytics-cards"
import { RevenueChart } from "@/components/dashboard/revenue-chart"
import { CategoryPerformance } from "@/components/dashboard/category-performance"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCategoryStore, useUserStore } from "@/lib/store"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

const COLORS = ["#b91c1c", "#dc2626", "#ef4444", "#f87171", "#fca5a5"]

export default function Dashboard() {
  const { categories } = useCategoryStore()
  const { users } = useUserStore()

  const bookingsByCategory = categories.map((category) => ({
    name: category.name,
    bookings: users.filter((user) => user.categoryId === category.id).length,
    revenue: users
      .filter((user) => user.categoryId === category.id)
      .reduce((sum, user) => sum + user.noOfPersons * category.pricePerPlate, 0),
  }))

  // Check-in status data for pie chart
  const checkinData = [
    { name: "Checked In", value: users.filter((u) => u.checkedIn).length },
    { name: "Pending", value: users.filter((u) => !u.checkedIn).length },
  ]

  return (
    <div className="container mx-auto p-4 sm:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to your restaurant management system</p>
        </div>
      </div>

      {/* Analytics Cards */}
      <AnalyticsCards />

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <RevenueChart />

        {/* Check-in Status Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Check-in Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={checkinData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value, percent }) =>
                      window.innerWidth > 640 ? `${name}: ${value} (${(percent * 100).toFixed(0)}%)` : `${value}`
                    }
                    outerRadius={window.innerWidth > 640 ? 80 : 60}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {checkinData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? "#22c55e" : "#eab308"} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Performance and Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        <CategoryPerformance />
        <RecentActivity />
      </div>

      {/* Bookings by Category Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Bookings by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bookingsByCategory} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12 }}
                  interval={0}
                  angle={window.innerWidth < 640 ? -45 : 0}
                  textAnchor={window.innerWidth < 640 ? "end" : "middle"}
                  height={window.innerWidth < 640 ? 80 : 60}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="bookings" fill="#b91c1c" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
