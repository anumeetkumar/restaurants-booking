"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { QRCodeSVG } from "qrcode.react"
import { useCategoryStore, useUserStore } from "@/lib/store"
import { formatCurrency } from "@/lib/utils"
import { Download, FileText, QrCode } from "lucide-react"

export function BulkQRGenerator() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const { categories } = useCategoryStore()
  const { users } = useUserStore()

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
    )
  }

  const handleUserToggle = (userId: string) => {
    setSelectedUsers((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]))
  }

  const handleSelectAllCategories = () => {
    setSelectedCategories(selectedCategories.length === categories.length ? [] : categories.map((cat) => cat.id))
  }

  const handleSelectAllUsers = () => {
    setSelectedUsers(selectedUsers.length === users.length ? [] : users.map((user) => user.id))
  }

  const downloadQRCodes = () => {
    // Create a new window with all QR codes for printing
    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    const selectedCategoryData = categories.filter((cat) => selectedCategories.includes(cat.id))
    const selectedUserData = users.filter((user) => selectedUsers.includes(user.id))

    let htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>QR Codes - Restaurant Buffet</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .qr-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; }
            .qr-item { text-align: center; border: 1px solid #ddd; padding: 15px; border-radius: 8px; }
            .qr-item h3 { margin: 0 0 10px 0; font-size: 16px; }
            .qr-item p { margin: 5px 0; font-size: 14px; color: #666; }
            @media print { .no-print { display: none; } }
          </style>
        </head>
        <body>
          <h1>Restaurant QR Codes</h1>
          <button class="no-print" onclick="window.print()">Print QR Codes</button>
          <div class="qr-grid">
    `

    // Add category QR codes
    selectedCategoryData.forEach((category) => {
      const qrData = `/categories/${category.id}`
      htmlContent += `
        <div class="qr-item">
          <h3>${category.name}</h3>
          <div id="qr-${category.id}"></div>
          <p>${formatCurrency(category.pricePerPlate)} per plate</p>
          <p style="font-size: 12px;">${category.description}</p>
        </div>
      `
    })

    // Add user QR codes
    selectedUserData.forEach((user) => {
      const category = categories.find((cat) => cat.id === user.categoryId)
      const qrData = user.qrCode || `/check-in/${user.id}`
      htmlContent += `
        <div class="qr-item">
          <h3>${user.name}</h3>
          <div id="qr-user-${user.id}"></div>
          <p>${user.phone}</p>
          <p>${user.noOfPersons} person${user.noOfPersons > 1 ? "s" : ""} • ${category?.name || "Unknown"}</p>
          <p>${formatCurrency(user.noOfPersons * (category?.pricePerPlate || 0))}</p>
        </div>
      `
    })

    htmlContent += `
          </div>
          <script src="https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js"></script>
          <script>
    `

    // Generate QR codes with JavaScript
    selectedCategoryData.forEach((category) => {
      const qrData = `/categories/${category.id}`
      htmlContent += `
        QRCode.toCanvas(document.getElementById('qr-${category.id}'), '${qrData}', { width: 150 }, function (error) {
          if (error) console.error(error)
        })
      `
    })

    selectedUserData.forEach((user) => {
      const qrData = user.qrCode || `/check-in/${user.id}`
      htmlContent += `
        QRCode.toCanvas(document.getElementById('qr-user-${user.id}'), '${qrData}', { width: 150 }, function (error) {
          if (error) console.error(error)
        })
      `
    })

    htmlContent += `
          </script>
        </body>
      </html>
    `

    printWindow.document.write(htmlContent)
    printWindow.document.close()
  }

  return (
    <div className="space-y-6">
      {/* Categories Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <QrCode className="h-5 w-5 mr-2" />
              Category QR Codes
            </CardTitle>
            <Button variant="outline" size="sm" onClick={handleSelectAllCategories}>
              {selectedCategories.length === categories.length ? "Deselect All" : "Select All"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                <Checkbox
                  checked={selectedCategories.includes(category.id)}
                  onCheckedChange={() => handleCategoryToggle(category.id)}
                />
                <div className="flex-1">
                  <p className="font-medium">{category.name}</p>
                  <p className="text-sm text-muted-foreground">{formatCurrency(category.pricePerPlate)} per plate</p>
                </div>
                <QRCodeSVG value={`/categories/${category.id}`} size={40} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Users Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              User Booking QR Codes
            </CardTitle>
            <Button variant="outline" size="sm" onClick={handleSelectAllUsers}>
              {selectedUsers.length === users.length ? "Deselect All" : "Select All"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {users.map((user) => {
              const category = categories.find((cat) => cat.id === user.categoryId)
              return (
                <div key={user.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                  <Checkbox
                    checked={selectedUsers.includes(user.id)}
                    onCheckedChange={() => handleUserToggle(user.id)}
                  />
                  <div className="flex-1">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {user.noOfPersons} person{user.noOfPersons > 1 ? "s" : ""} • {category?.name || "Unknown"}
                    </p>
                  </div>
                  <QRCodeSVG value={user.qrCode || `/check-in/${user.id}`} size={40} />
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Download Button */}
      <div className="flex justify-center">
        <Button
          onClick={downloadQRCodes}
          disabled={selectedCategories.length === 0 && selectedUsers.length === 0}
          className="bg-red-700 hover:bg-red-800"
        >
          <Download className="h-4 w-4 mr-2" />
          Download Selected QR Codes ({selectedCategories.length + selectedUsers.length})
        </Button>
      </div>
    </div>
  )
}
