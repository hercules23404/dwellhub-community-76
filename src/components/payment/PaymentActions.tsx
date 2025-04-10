
import React from "react";
import { Button } from "@/components/ui/button";
import { Download, ChevronDown, XCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Payment } from "./types";

interface PaymentActionsProps {
  payment: Payment;
}

export function PaymentActions({ payment }: PaymentActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <ChevronDown className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {payment.receiptUrl && (
          <DropdownMenuItem asChild>
            <a href={payment.receiptUrl} download className="flex items-center">
              <Download className="mr-2 h-4 w-4" />
              Download Receipt
            </a>
          </DropdownMenuItem>
        )}
        {payment.status === "pending" && (
          <DropdownMenuItem className="flex items-center">
            <XCircle className="mr-2 h-4 w-4" />
            Cancel Payment
          </DropdownMenuItem>
        )}
        <DropdownMenuItem className="flex items-center">
          View Details
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
