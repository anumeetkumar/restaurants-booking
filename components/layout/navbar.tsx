"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme/theme-toggle"
import { MobileNav } from "./mobile-nav"
import { cn } from "@/lib/utils"
import { useSettingsStore } from "@/lib/store"
import { LayoutDashboard, UtensilsCrossed, Users, QrCode, Settings, ChefHat } from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Categories", href: "/categories", icon: UtensilsCrossed },
  { name: "Users", href: "/users", icon: Users },
  // { name: "QR Codes", href: "/qr-codes", icon: QrCode },
  // { name: "Settings", href: "/settings", icon: Settings },
]

export function   Navbar() {
  const pathname = usePathname()
  const { settings } = useSettingsStore()

  return (
    <nav className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="flex flex-shrink-0 items-center">
              <ChefHat className="h-8 w-8 text-red-700" />
              <span className="ml-2 text-xl font-bold text-red-700 truncate max-w-[200px] sm:max-w-none">
                {settings.name}
              </span>
            </div>
            {/* Desktop Navigation */}
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium transition-colors",
                      pathname === item.href
                        ? "border-red-700 text-red-700"
                        : "border-transparent text-muted-foreground hover:border-gray-300 hover:text-foreground",
                    )}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    <span className="hidden lg:inline">{item.name}</span>
                  </Link>
                )
              })}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* <ThemeToggle /> */}
            <Button asChild variant="default" className="bg-red-700 hover:bg-red-800 hidden sm:flex">
              <Link href="/check-in">New Check-In</Link>
            </Button>
            <MobileNav />
          </div>
        </div>
      </div>
    </nav>
  )
}
