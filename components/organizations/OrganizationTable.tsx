"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { organizationStore } from "@/lib/store";
import { Button } from "../ui/button";
import { Edit, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { OrganizationForm } from "./OrganizationForm";
import { Organization } from "@/lib/types";

const OrganizationTable = () => {
  const organization = organizationStore((state) => state.organization);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editOrganization, setEditOrganization] =
    useState<Organization | null>();

  const handleEdit = (org: Organization) => {
    setEditOrganization(org);
    setShowEditModal(true);
  };

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {organization.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  No data found
                </TableCell>
              </TableRow>
            ) : (
              organization.map((org) => (
                <TableRow key={org.id}>
                  <TableCell>{org.name}</TableCell>
                  <TableCell>{org.email}</TableCell>
                  <TableCell>{org.phone}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(org)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      // onClick={() => handleDelete(user)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    
      {/* Edit organization */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="sm:max-w-[500px] mx-4">
          <DialogHeader>
            <DialogTitle>Add New Organuzation</DialogTitle>
          </DialogHeader>
          <OrganizationForm
            {...(editOrganization ? { organization: editOrganization } : {})}
            onSuccess={() => setShowEditModal(false)}
            onCancel={() => setShowEditModal(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrganizationTable;
