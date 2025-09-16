"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Input from "@/components/ui/input"
import Textarea from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useSettingsStore } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"
import { Building2, Phone, Mail, MapPin } from "lucide-react"

const restaurantSchema = z.object({
  name: z.string().min(1, "Restaurant name is required").max(100, "Name must be less than 100 characters"),
  contactInfo: z.string().min(1, "Contact info is required").max(50, "Contact info must be less than 50 characters"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  address: z.string().max(200, "Address must be less than 200 characters").optional().or(z.literal("")),
  description: z.string().max(500, "Description must be less than 500 characters").optional().or(z.literal("")),
})

type RestaurantFormData = z.infer<typeof restaurantSchema>

export function RestaurantSettings() {
  const [isLoading, setIsLoading] = useState(false)
  const { settings, updateSettings } = useSettingsStore()
  const { toast } = useToast()
  console.log("settings", settings)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RestaurantFormData>({
    resolver: zodResolver(restaurantSchema),
     mode: "onChange", 
    defaultValues: {
      name: settings.name,
      contactInfo: settings.contactInfo,
      email: (settings as any).email || "",
      address: (settings as any).address || "",
      description: (settings as any).description || "",
    },
  })


  console.log("errors",errors)

  const onSubmit = async (data: RestaurantFormData) => {
    setIsLoading(true)
    try {
      updateSettings(data)
      toast({
        title: "Settings saved",
        description: "Your restaurant settings have been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Building2 className="h-5 w-5 mr-2" />
          Restaurant Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Restaurant Name</Label>
              <Input
                id="name"
                {...register("name")}
                placeholder="Your Restaurant Name"
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactInfo">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="contactInfo"
                  {...register("contactInfo")}
                  placeholder="+1 (555) 123-4567"
                  className={`pl-10 ${errors.contactInfo ? "border-destructive" : ""}`}
                />
              </div>
              {errors.contactInfo && <p className="text-sm text-destructive">{errors.contactInfo.message}</p>}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  placeholder="restaurant@example.com"
                  className={`pl-10 ${errors.email ? "border-destructive" : ""}`}
                />
              </div>
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="address"
                  {...register("address")}
                  placeholder="123 Main St, City, State"
                  className={`pl-10 ${errors.address ? "border-destructive" : ""}`}
                />
              </div>
              {errors.address && <p className="text-sm text-destructive">{errors.address.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Tell customers about your restaurant..."
              rows={3}
              className={errors.description ? "border-destructive" : ""}
            />
            {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading} className="bg-red-700 hover:bg-red-800">
              {isLoading ? "Saving..." : "Save Settings"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
