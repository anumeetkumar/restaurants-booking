"use client";

import React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/input";
import Textarea from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useCategoryStore } from "@/lib/store";
import type { BuffetCategory } from "@/lib/types";

const categorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(50, "Name must be less than 50 characters"),

  description: z
    .string()
    .trim()
    .min(1, "Description is required")
    .max(200, "Description must be less than 200 characters"),

  pricePerPlate: z.coerce
    .number()
    .refine((val) => !isNaN(val), { message: "Price is required" }),
  // .min(0.01, "Price must be greater than 0")
  // .max(999.99, "Price must be less than $1000"),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface CategoryFormProps {
  category?: BuffetCategory;
  onSuccess: () => void;
  onCancel: () => void;
}

export function CategoryForm({
  category,
  onSuccess,
  onCancel,
}: CategoryFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { addCategory, updateCategory } = useCategoryStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: category
      ? {
          name: category.name,
          description: category.description,
          pricePerPlate: category.pricePerPlate,
        }
      : {
          name: "",
          description: "",
          pricePerPlate: 0,
        },
  });

  console.log("errors", errors);

  const onSubmit = async (data: CategoryFormData) => {
    setIsLoading(true);
    try {
      if (category) {
        updateCategory(category.id, data);
      } else {
        addCategory(data);
      }
      onSuccess();
    } catch (error) {
      console.error("Error saving category:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Category Name</Label>
        <Input
          id="name"
          {...register("name")}
          placeholder="e.g., Veg Buffet, Non-Veg Premium"
          className={errors.name ? "border-destructive" : ""}
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          {...register("description")}
          placeholder="Describe what's included in this buffet category..."
          rows={3}
          className={errors.description ? "border-destructive" : ""}
        />
        {errors.description && (
          <p className="text-sm text-destructive">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="pricePerPlate">Price per Plate ($)</Label>
        <Input
          id="pricePerPlate"
          type="number"
          step="0.01"
          {...register("pricePerPlate", { valueAsNumber: true })}
          placeholder="0.00"
          className={errors.pricePerPlate ? "border-destructive" : ""}
        />
        {errors.pricePerPlate && (
          <p className="text-sm text-destructive">
            {errors.pricePerPlate.message}
          </p>
        )}
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-red-700 hover:bg-red-800"
        >
          {isLoading
            ? "Saving..."
            : category
            ? "Update Category"
            : "Create Category"}
        </Button>
      </div>
    </form>
  );
}
