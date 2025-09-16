"use client"

import { Label } from "@/components/ui/label"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RestaurantSettings } from "@/components/settings/restaurant-settings"
import { SystemSettings } from "@/components/settings/system-settings"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useCategoryStore, useUserStore, useSettingsStore } from "@/lib/store"
import { Building2, Settings, BarChart3, Info } from "lucide-react"

export default function SettingsPage() {
  const { categories } = useCategoryStore()
  const { users } = useUserStore()
  const { settings } = useSettingsStore()

  const stats = [
    { label: "Categories", value: categories.length },
    { label: "Total Bookings", value: users.length },
    { label: "Checked In", value: users.filter((u) => u.checkedIn).length },
    { label: "Pending", value: users.filter((u) => !u.checkedIn).length },
  ]

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your restaurant and system preferences</p>
      </div>

      <Tabs defaultValue="restaurant" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="restaurant" className="flex items-center">
            <Building2 className="h-4 w-4 mr-2" />
            Restaurant
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center">
            <Settings className="h-4 w-4 mr-2" />
            System
          </TabsTrigger>
          <TabsTrigger value="overview" className="flex items-center">
            <BarChart3 className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="restaurant">
          <RestaurantSettings />
        </TabsContent>

        <TabsContent value="system">
          <SystemSettings />
        </TabsContent>

        <TabsContent value="overview" className="space-y-6">
          {/* Current Settings Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Info className="h-5 w-5 mr-2" />
                Current Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-sm font-medium">Restaurant Name</Label>
                  <p className="text-lg font-semibold">{settings.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Contact</Label>
                  <p className="text-lg">{settings.contactInfo}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Theme</Label>
                  <Badge variant="secondary" className="capitalize">
                    {settings.theme} Mode
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <Badge variant="default" className="bg-green-600">
                    System Active
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>System Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                {stats.map((stat) => (
                  <div key={stat.label} className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* System Information */}
          <Card>
            <CardHeader>
              <CardTitle>System Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Version:</span>
                <span>1.0.0</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Last Updated:</span>
                <span>{new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Storage:</span>
                <span>Local Browser Storage</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Data Sync:</span>
                <Badge variant="secondary">Local Only</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
