"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useCategoryStore, useUserStore } from "@/lib/store"
import { formatCurrency } from "@/lib/utils"

export function CategoryPerformance() {
  const { categories } = useCategoryStore()
  const { users } = useUserStore()

  const categoryStats = categories
    .map((category) => {
      const categoryUsers = users.filter((user) => user.categoryId === category.id)
      const revenue = categoryUsers.reduce((sum, user) => sum + user.noOfPersons * category.pricePerPlate, 0)
      const totalPersons = categoryUsers.reduce((sum, user) => sum + user.noOfPersons, 0)

      return {
        ...category,
        bookings: categoryUsers.length,
        revenue,
        totalPersons,
        checkedIn: categoryUsers.filter((user) => user.checkedIn).length,
      }
    })
    .sort((a, b) => b.revenue - a.revenue)

  const maxRevenue = Math.max(...categoryStats.map((cat) => cat.revenue), 1)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Category Performance</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {categoryStats.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No categories available</p>
        ) : (
          categoryStats.map((category) => (
            <div key={category.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{category.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {category.bookings} bookings • {category.totalPersons} persons
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatCurrency(category.revenue)}</p>
                  <p className="text-sm text-muted-foreground">
                    {category.checkedIn}/{category.bookings} checked in
                  </p>
                </div>
              </div>
              <Progress value={(category.revenue / maxRevenue) * 100} className="h-2" />
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
