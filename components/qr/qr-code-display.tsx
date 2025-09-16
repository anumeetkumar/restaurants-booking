"use client"

import { QRCodeSVG } from "qrcode.react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Download, Share2 } from "lucide-react"

interface QRCodeDisplayProps {
  data: string
  title: string
  subtitle?: string
  size?: number
}

export function QRCodeDisplay({ data, title, subtitle, size = 200 }: QRCodeDisplayProps) {
  const handleDownload = () => {
    const svg = document.querySelector("#qr-code-svg") as SVGElement
    if (!svg) return

    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    const img = new Image()

    canvas.width = size
    canvas.height = size

    img.onload = () => {
      ctx?.drawImage(img, 0, 0)
      const pngFile = canvas.toDataURL("image/png")
      const downloadLink = document.createElement("a")
      downloadLink.download = `${title.replace(/\s+/g, "-").toLowerCase()}-qr-code.png`
      downloadLink.href = pngFile
      downloadLink.click()
    }

    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `QR Code - ${title}`,
          text: subtitle || "",
          url: data,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(data)
    }
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <Card className="p-4">
        <CardContent className="flex flex-col items-center space-y-2 p-0">
          <QRCodeSVG id="qr-code-svg" value={data} size={size} level="M" includeMargin className="border rounded-lg" />
          <div className="text-center">
            <p className="font-medium text-sm">{title}</p>
            {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
          </div>
        </CardContent>
      </Card>

      <div className="flex space-x-2">
        <Button size="sm" variant="outline" onClick={handleDownload}>
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
        <Button size="sm" variant="outline" onClick={handleShare}>
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
      </div>
    </div>
  )
}
