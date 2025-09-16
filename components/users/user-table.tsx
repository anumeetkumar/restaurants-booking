"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { UserForm } from "./user-form"
import { QRCodeDisplay } from "../qr/qr-code-display"
import { useUserStore, useCategoryStore } from "@/lib/store"
import { formatDate, formatCurrency } from "@/lib/utils"
import type { User } from "@/lib/types"
import { Edit, Trash2, QrCode, CheckCircle, Clock } from "lucide-react"

interface UserTableProps {
  users: User[]
}

export function UserTable({ users }: UserTableProps) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showQRDialog, setShowQRDialog] = useState(false)
  const { updateUser, deleteUser, checkInUser } = useUserStore()
  const { categories } = useCategoryStore()

  const handleEdit = (user: User) => {
    setSelectedUser(user)
    setShowEditDialog(true)
  }

  const handleDelete = (user: User) => {
    setSelectedUser(user)
    setShowDeleteDialog(true)
  }

  const handleShowQR = (user: User) => {
    setSelectedUser(user)
    setShowQRDialog(true)
  }

  const confirmDelete = () => {
    if (selectedUser) {
      deleteUser(selectedUser.id)
      setShowDeleteDialog(false)
      setSelectedUser(null)
    }
  }

  const handleCheckIn = (userId: string) => {
    checkInUser(userId)
  }

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId)
    return category?.name || "Unknown"
  }

  const getCategoryPrice = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId)
    return category?.pricePerPlate || 0
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Persons</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Total Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Booked At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No bookings found
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>{user.noOfPersons}</TableCell>
                  <TableCell>{getCategoryName(user.categoryId)}</TableCell>
                  <TableCell>{formatCurrency(user.noOfPersons * getCategoryPrice(user.categoryId))}</TableCell>
                  <TableCell>
                    <Badge variant={user.checkedIn ? "default" : "secondary"} className="flex items-center w-fit">
                      {user.checkedIn ? (
                        <>
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Checked In
                        </>
                      ) : (
                        <>
                          <Clock className="h-3 w-3 mr-1" />
                          Pending
                        </>
                      )}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(user.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-1">
                      {!user.checkedIn && (
                        <Button size="sm" variant="outline" onClick={() => handleCheckIn(user.id)} className="h-8 px-2">
                          Check In
                        </Button>
                      )}
                      <Button size="sm" variant="ghost" onClick={() => handleShowQR(user)} className="h-8 w-8 p-0">
                        <QrCode className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleEdit(user)} className="h-8 w-8 p-0">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(user)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Booking</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <UserForm
              user={selectedUser}
              onSuccess={() => {
                setShowEditDialog(false)
                setSelectedUser(null)
              }}
              onCancel={() => {
                setShowEditDialog(false)
                setSelectedUser(null)
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Booking</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the booking for "{selectedUser?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* QR Code Dialog */}
      <Dialog open={showQRDialog} onOpenChange={setShowQRDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Booking QR Code</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <QRCodeDisplay
              data={selectedUser.qrCode || `/check-in/${selectedUser.id}`}
              title={`${selectedUser.name} - ${getCategoryName(selectedUser.categoryId)}`}
              subtitle={`${selectedUser.noOfPersons} person${selectedUser.noOfPersons > 1 ? "s" : ""} • ${formatCurrency(selectedUser.noOfPersons * getCategoryPrice(selectedUser.categoryId))}`}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
