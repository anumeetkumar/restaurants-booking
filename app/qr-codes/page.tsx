"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { QRScanner } from "@/components/qr/qr-scanner"
import { BulkQRGenerator } from "@/components/qr/bulk-qr-generator"
import { useUserStore, useCategoryStore } from "@/lib/store"
import { useRouter } from "next/navigation"
import { CheckCircle, AlertCircle, QrCode, Scan, Download } from "lucide-react"

export default function QRCodesPage() {
  const [scanResult, setScanResult] = useState<string | null>(null)
  const [scanError, setScanError] = useState<string | null>(null)
  const { getUserById } = useUserStore()
  const { getCategoryById } = useCategoryStore()
  const router = useRouter()

  const handleScan = (data: string) => {
    setScanError(null)
    setScanResult(data)

    // Parse the QR code data
    if (data.includes("/check-in/")) {
      const userId = data.split("/check-in/")[1]
      const user = getUserById(userId)

      if (user) {
        // Redirect to the check-in details page
        router.push(`/check-in/${userId}`)
      } else {
        setScanError("Booking not found. The QR code may be invalid or the booking has been removed.")
      }
    } else if (data.includes("/categories/")) {
      const categoryId = data.split("/categories/")[1]
      const category = getCategoryById(categoryId)

      if (category) {
        // Redirect to categories page (could be enhanced to show specific category)
        router.push("/categories")
      } else {
        setScanError("Category not found. The QR code may be invalid or the category has been removed.")
      }
    } else {
      setScanError("Invalid QR code format. Please scan a valid restaurant QR code.")
    }
  }

  const handleScanError = (error: string) => {
    setScanError(error)
    setScanResult(null)
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">QR Code Management</h1>
        <p className="text-muted-foreground">Scan QR codes and generate bulk QR codes for printing</p>
      </div>

      <Tabs defaultValue="scanner" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="scanner" className="flex items-center">
            <Scan className="h-4 w-4 mr-2" />
            Scanner
          </TabsTrigger>
          <TabsTrigger value="generator" className="flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Bulk Generator
          </TabsTrigger>
          <TabsTrigger value="overview" className="flex items-center">
            <QrCode className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="scanner" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <QRScanner onScan={handleScan} onError={handleScanError} />

            <Card>
              <CardHeader>
                <CardTitle>Scan Results</CardTitle>
              </CardHeader>
              <CardContent>
                {scanResult && !scanError && (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>QR code scanned successfully! Redirecting...</AlertDescription>
                  </Alert>
                )}

                {scanError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{scanError}</AlertDescription>
                  </Alert>
                )}

                {!scanResult && !scanError && (
                  <div className="text-center py-8 text-muted-foreground">
                    <QrCode className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Scan a QR code to see results here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="generator">
          <BulkQRGenerator />
        </TabsContent>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Category QR Codes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{useCategoryStore.getState().categories.length}</div>
                <p className="text-sm text-muted-foreground">Available for scanning</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">User QR Codes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{useUserStore.getState().users.length}</div>
                <p className="text-sm text-muted-foreground">Active bookings</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Checked In</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {useUserStore.getState().users.filter((u) => u.checkedIn).length}
                </div>
                <p className="text-sm text-muted-foreground">Via QR scan</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>QR Code Usage Instructions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">For Categories:</h4>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• Display category QR codes at buffet stations</li>
                  <li>• Customers can scan to see pricing and details</li>
                  <li>• Links directly to booking form for that category</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">For User Bookings:</h4>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• Generated automatically when booking is created</li>
                  <li>• Customers show QR code at entrance for check-in</li>
                  <li>• Staff can scan to verify booking and check in customers</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">Bulk Generation:</h4>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• Select multiple categories or bookings</li>
                  <li>• Generate printable QR code sheets</li>
                  <li>• Perfect for table tents, posters, or handouts</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
