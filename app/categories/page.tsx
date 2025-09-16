"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Input from "@/components/ui/input"
import { CategoryCard } from "@/components/categories/category-card"
import { CategoryForm } from "@/components/categories/category-form"
import { EmptyState } from "@/components/ui/empty-state"
import { useCategoryStore } from "@/lib/store"
import { Plus, Search } from "lucide-react"

export default function CategoriesPage() {
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const { categories } = useCategoryStore()

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="container mx-auto p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Buffet Categories</h1>
          <p className="text-muted-foreground">Manage your buffet types and pricing</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} className="bg-red-700 hover:bg-red-800 w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Categories Grid */}
      {filteredCategories.length === 0 ? (
        <EmptyState
          icon={Plus}
          title={searchTerm ? "No categories found" : "No categories yet"}
          description={
            searchTerm ? "Try adjusting your search terms." : "Get started by creating your first buffet category."
          }
          action={
            !searchTerm
              ? {
                  label: "Add Your First Category",
                  onClick: () => setShowCreateDialog(true),
                }
              : undefined
          }
        />
      ) : (
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCategories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-[425px] mx-4">
          <DialogHeader>
            <DialogTitle>Create New Category</DialogTitle>
          </DialogHeader>
          <CategoryForm onSuccess={() => setShowCreateDialog(false)} onCancel={() => setShowCreateDialog(false)} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
