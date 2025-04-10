
import React from "react";
import {
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function PaymentTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Transaction ID</TableHead>
        <TableHead>Date</TableHead>
        <TableHead>Amount</TableHead>
        <TableHead>Description</TableHead>
        <TableHead>Method</TableHead>
        <TableHead>Status</TableHead>
        <TableHead className="text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
}
