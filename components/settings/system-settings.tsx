"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ThemeToggle } from "@/components/theme/theme-toggle"
import { useTheme } from "@/components/theme/theme-provider"
import { Settings, Palette, Bell, Database } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

export function SystemSettings() {
  const { theme } = useTheme()
  const { toast } = useToast()
  const [notifications, setNotifications] = useState(true)
  const [autoBackup, setAutoBackup] = useState(true)
  const [language, setLanguage] = useState("en")

  const handleNotificationToggle = (enabled: boolean) => {
    setNotifications(enabled)
    toast({
      title: enabled ? "Notifications enabled" : "Notifications disabled",
      description: enabled
        ? "You will receive notifications for new bookings and check-ins."
        : "Notifications have been turned off.",
    })
  }

  const handleAutoBackupToggle = (enabled: boolean) => {
    setAutoBackup(enabled)
    toast({
      title: enabled ? "Auto-backup enabled" : "Auto-backup disabled",
      description: enabled ? "Your data will be automatically backed up daily." : "Auto-backup has been turned off.",
    })
  }

  return (
    <div className="space-y-6">
      {/* Appearance Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Palette className="h-5 w-5 mr-2" />
            Appearance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Theme</Label>
              <p className="text-sm text-muted-foreground">Choose your preferred color scheme</p>
            </div>
            <ThemeToggle />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Current Theme</Label>
              <p className="text-sm text-muted-foreground capitalize">{theme} mode is active</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="h-5 w-5 mr-2" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="notifications">Push Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive notifications for new bookings and check-ins</p>
            </div>
            <Switch id="notifications" checked={notifications} onCheckedChange={handleNotificationToggle} />
          </div>
        </CardContent>
      </Card>

      {/* System Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            System
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Language</Label>
              <p className="text-sm text-muted-foreground">Select your preferred language</p>
            </div>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="de">Deutsch</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="h-5 w-5 mr-2" />
            Data Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="auto-backup">Auto Backup</Label>
              <p className="text-sm text-muted-foreground">Automatically backup your data daily</p>
            </div>
            <Switch id="auto-backup" checked={autoBackup} onCheckedChange={handleAutoBackupToggle} />
          </div>

          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground mb-2">Last backup: Never (feature coming soon)</p>
            <p className="text-xs text-muted-foreground">
              Your data is automatically saved in your browser's local storage.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
