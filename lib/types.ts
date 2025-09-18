export interface BuffetCategory {
  id: string
  name: string
  description: string
  pricePerPlate: number
  createdAt: Date
  updatedAt: Date
}

export interface User {
  id: string
  name: string
  phone: string
  noOfPersons: number
  categoryId: string
  category?: BuffetCategory
  qrCode?: string
  checkedIn: boolean
  createdAt: Date
  updatedAt: Date
}

export interface RestaurantSettings {
  name: string
  contactInfo: string
  logo?: string
  theme: "light" | "dark"
}

export interface DashboardStats {
  totalCategories: number
  totalUsers: number
  todayBookings: number
  bookingsByCategory: { categoryName: string; count: number }[]
}

export interface Organization{
  id : string
  name : string
  email : string
  phone : string
}
