"use client"

import { OrganizationForm } from "@/components/organizations/OrganizationForm";
import OrganizationTable from "@/components/organizations/OrganizationTable";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { UserForm } from "@/components/users/user-form";
import Link from "next/link";
import React, { useState } from "react";

const Organizations = () => {
    const [showCreateDialog, setShowCreateDialog] = useState(false)
  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          Organizations
        </h1>
        <Button
          asChild
          className="w-content bg-red-700 hover:bg-red-800"
          onClick={() => setShowCreateDialog(true)} 
        >
          <Link href={"#"}> Add Organization</Link>
        </Button>
      </div>

      <div className="mt-6">
        <OrganizationTable />
      </div>

      {/* Create Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-[500px] mx-4">
          <DialogHeader>
            <DialogTitle>Add New Organization</DialogTitle>
          </DialogHeader>
          <OrganizationForm
            onSuccess={() => setShowCreateDialog(false)}
            onCancel={() => setShowCreateDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Organizations;
