"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useCategoryStore, useUserStore } from "@/lib/store"
import { formatCurrency } from "@/lib/utils"

export function RevenueChart() {
  const { categories } = useCategoryStore()
  const { users } = useUserStore()

  // Generate last 7 days of data
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - i))
    return date
  })

  const revenueData = last7Days.map((date) => {
    const dayUsers = users.filter((user) => {
      const userDate = new Date(user.createdAt)
      return userDate.toDateString() === date.toDateString()
    })

    const dayRevenue = dayUsers.reduce((sum, user) => {
      const category = categories.find((cat) => cat.id === user.categoryId)
      return sum + user.noOfPersons * (category?.pricePerPlate || 0)
    }, 0)

    return {
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      revenue: dayRevenue,
      bookings: dayUsers.length,
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Trend (Last 7 Days)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis tickFormatter={(value) => `$${value}`} />
            <Tooltip
              formatter={(value, name) => [
                name === "revenue" ? formatCurrency(value as number) : value,
                name === "revenue" ? "Revenue" : "Bookings",
              ]}
            />
            <Line type="monotone" dataKey="revenue" stroke="#b91c1c" strokeWidth={2} dot={{ fill: "#b91c1c" }} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
