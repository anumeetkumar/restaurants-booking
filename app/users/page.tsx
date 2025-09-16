"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { UserTable } from "@/components/users/user-table"
import { UserForm } from "@/components/users/user-form"
import { EmptyState } from "@/components/ui/empty-state"
import { useUserStore, useCategoryStore } from "@/lib/store"
import { isToday } from "@/lib/utils"
import { Plus, Search, Filter, Users } from "lucide-react"

export default function UsersPage() {
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
  const { users } = useUserStore()
  const { categories } = useCategoryStore()

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.phone.includes(searchTerm)

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "checked-in" && user.checkedIn) ||
      (statusFilter === "pending" && !user.checkedIn)

    const matchesDate = dateFilter === "all" || (dateFilter === "today" && isToday(user.createdAt))

    return matchesSearch && matchesStatus && matchesDate
  })

  return (
    <div className="container mx-auto p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">User Bookings</h1>
          <p className="text-muted-foreground">Manage customer bookings and check-ins</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} className="bg-red-700 hover:bg-red-800 w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          New Booking
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px] sm:w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="checked-in">Checked In</SelectItem>
            </SelectContent>
          </Select>

          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-[120px] sm:w-[180px]">
              <SelectValue placeholder="Date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        <div className="bg-card p-4 rounded-lg border">
          <div className="text-xl sm:text-2xl font-bold">{users.length}</div>
          <div className="text-xs sm:text-sm text-muted-foreground">Total Bookings</div>
        </div>
        <div className="bg-card p-4 rounded-lg border">
          <div className="text-xl sm:text-2xl font-bold">{users.filter((u) => !u.checkedIn).length}</div>
          <div className="text-xs sm:text-sm text-muted-foreground">Pending Check-ins</div>
        </div>
        <div className="bg-card p-4 rounded-lg border">
          <div className="text-xl sm:text-2xl font-bold">{users.filter((u) => u.checkedIn).length}</div>
          <div className="text-xs sm:text-sm text-muted-foreground">Checked In</div>
        </div>
        <div className="bg-card p-4 rounded-lg border">
          <div className="text-xl sm:text-2xl font-bold">{users.filter((u) => isToday(u.createdAt)).length}</div>
          <div className="text-xs sm:text-sm text-muted-foreground">Today's Bookings</div>
        </div>
      </div>

      {/* Users Table or Empty State */}
      {filteredUsers.length === 0 && users.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No bookings yet"
          description="Get started by creating your first customer booking."
          action={{
            label: "Create First Booking",
            onClick: () => setShowCreateDialog(true),
          }}
        />
      ) : (
        <div className="overflow-hidden">
          <UserTable users={filteredUsers} />
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-[500px] mx-4">
          <DialogHeader>
            <DialogTitle>Create New Booking</DialogTitle>
          </DialogHeader>
          <UserForm onSuccess={() => setShowCreateDialog(false)} onCancel={() => setShowCreateDialog(false)} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
