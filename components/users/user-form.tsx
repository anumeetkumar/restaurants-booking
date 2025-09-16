"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import Input from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useUserStore, useCategoryStore } from "@/lib/store"
import { generateQRCodeData } from "@/lib/utils"
import type { User } from "@/lib/types"

const userSchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name must be less than 50 characters"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must be less than 15 digits"),
  noOfPersons: z.number().min(1, "At least 1 person required").max(20, "Maximum 20 persons allowed"),
  categoryId: z.string().min(1, "Please select a buffet category"),
})

type UserFormData = z.infer<typeof userSchema>

interface UserFormProps {
  user?: User
  onSuccess: (userId?: string) => void
  onCancel: () => void
}

export function UserForm({ user, onSuccess, onCancel }: UserFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { addUser, updateUser } = useUserStore()
  const { categories } = useCategoryStore()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: user
      ? {
          name: user.name,
          phone: user.phone,
          noOfPersons: user.noOfPersons,
          categoryId: user.categoryId,
        }
      : {
          name: "",
          phone: "",
          noOfPersons: 1,
          categoryId: "",
        },
  })

  const selectedCategoryId = watch("categoryId")

  const onSubmit = async (data: UserFormData) => {
    setIsLoading(true)
    try {
      if (user) {
        updateUser(user.id, {
          ...data,
          qrCode: generateQRCodeData(user.id, window.location.origin),
        })
        onSuccess()
      } else {
        const userId = addUser(data)
        // Generate QR code after user creation
        updateUser(userId, {
          qrCode: generateQRCodeData(userId, window.location.origin),
        })
        onSuccess(userId)
      }
    } catch (error) {
      console.error("Error saving user:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const selectedCategory = categories.find((cat) => cat.id === selectedCategoryId)

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          {...register("name")}
          placeholder="Enter customer's full name"
          className={errors.name ? "border-destructive" : ""}
        />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          {...register("phone")}
          placeholder="Enter phone number"
          className={errors.phone ? "border-destructive" : ""}
        />
        {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="noOfPersons">Number of Persons</Label>
        <Input
          id="noOfPersons"
          type="number"
          min="1"
          max="20"
          {...register("noOfPersons", { valueAsNumber: true })}
          className={errors.noOfPersons ? "border-destructive" : ""}
        />
        {errors.noOfPersons && <p className="text-sm text-destructive">{errors.noOfPersons.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="categoryId">Buffet Category</Label>
        <Select value={selectedCategoryId} onValueChange={(value) => setValue("categoryId", value)}>
          <SelectTrigger className={errors.categoryId ? "border-destructive" : ""}>
            <SelectValue placeholder="Select a buffet category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                <div className="flex items-center justify-between w-full">
                  <span>{category.name}</span>
                  <span className="text-sm text-muted-foreground ml-2">${category.pricePerPlate}/plate</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.categoryId && <p className="text-sm text-destructive">{errors.categoryId.message}</p>}
      </div>

      {selectedCategory && (
        <div className="p-4 bg-muted rounded-lg">
          <h4 className="font-medium text-sm mb-2">Booking Summary</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Category:</span>
              <span className="font-medium">{selectedCategory.name}</span>
            </div>
            <div className="flex justify-between">
              <span>Price per plate:</span>
              <span>${selectedCategory.pricePerPlate}</span>
            </div>
            <div className="flex justify-between">
              <span>Number of persons:</span>
              <span>{watch("noOfPersons") || 1}</span>
            </div>
            <div className="flex justify-between font-medium border-t pt-1 mt-2">
              <span>Total Amount:</span>
              <span>${((watch("noOfPersons") || 1) * selectedCategory.pricePerPlate).toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading} className="bg-red-700 hover:bg-red-800">
          {isLoading ? "Saving..." : user ? "Update Booking" : "Create Booking"}
        </Button>
      </div>
    </form>
  )
}
