
import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";
import { Payment } from "./types";
import { PaymentStatusBadge } from "./PaymentStatusBadge";
import { PaymentActions } from "./PaymentActions";

interface PaymentTableRowProps {
  payment: Payment;
}

export function PaymentTableRow({ payment }: PaymentTableRowProps) {
  return (
    <TableRow key={payment.id}>
      <TableCell className="font-medium">{payment.id}</TableCell>
      <TableCell>
        <div className="flex flex-col">
          <span>{new Date(payment.date).toLocaleDateString()}</span>
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(payment.date), { addSuffix: true })}
          </span>
        </div>
      </TableCell>
      <TableCell>${payment.amount.toFixed(2)}</TableCell>
      <TableCell>{payment.description}</TableCell>
      <TableCell>{payment.method}</TableCell>
      <TableCell>
        <PaymentStatusBadge status={payment.status} />
      </TableCell>
      <TableCell className="text-right">
        <PaymentActions payment={payment} />
      </TableCell>
    </TableRow>
  );
}
