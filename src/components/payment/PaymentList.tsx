
import React from "react";
import { formatDistanceToNow } from "date-fns";
import { Download, ChevronDown, CheckCircle, XCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface Payment {
  id: string;
  date: string;
  amount: number;
  status: "completed" | "pending" | "failed";
  method: string;
  description: string;
  receiptUrl?: string;
}

const DUMMY_PAYMENTS: Payment[] = [
  {
    id: "PAY-1234",
    date: "2023-06-01T10:30:00Z",
    amount: 1200,
    status: "completed",
    method: "Credit Card",
    description: "June 2023 Rent",
    receiptUrl: "/receipts/june-2023.pdf",
  },
  {
    id: "PAY-1235",
    date: "2023-07-01T09:15:00Z",
    amount: 1200,
    status: "completed",
    method: "Bank Transfer",
    description: "July 2023 Rent",
    receiptUrl: "/receipts/july-2023.pdf",
  },
  {
    id: "PAY-1236",
    date: "2023-08-02T14:45:00Z",
    amount: 1200,
    status: "completed",
    method: "Credit Card",
    description: "August 2023 Rent",
    receiptUrl: "/receipts/august-2023.pdf",
  },
  {
    id: "PAY-1237",
    date: "2023-09-01T11:20:00Z",
    amount: 1245,
    status: "completed",
    method: "PayPal",
    description: "September 2023 Rent + Late Fee",
    receiptUrl: "/receipts/september-2023.pdf",
  },
  {
    id: "PAY-1238",
    date: "2023-10-01T10:00:00Z",
    amount: 1200,
    status: "completed",
    method: "Credit Card",
    description: "October 2023 Rent",
    receiptUrl: "/receipts/october-2023.pdf",
  },
  {
    id: "PAY-1239",
    date: "2023-11-01T08:30:00Z",
    amount: 1200,
    status: "completed",
    method: "Bank Transfer",
    description: "November 2023 Rent",
    receiptUrl: "/receipts/november-2023.pdf",
  },
  {
    id: "PAY-1240",
    date: "2023-12-01T09:45:00Z",
    amount: 1200,
    status: "completed",
    method: "Credit Card",
    description: "December 2023 Rent",
    receiptUrl: "/receipts/december-2023.pdf",
  },
  {
    id: "PAY-1241",
    date: "2024-01-01T10:15:00Z",
    amount: 1250,
    status: "completed",
    method: "PayPal",
    description: "January 2024 Rent",
    receiptUrl: "/receipts/january-2024.pdf",
  },
  {
    id: "PAY-1242",
    date: "2024-02-01T11:00:00Z",
    amount: 1250,
    status: "completed",
    method: "Credit Card",
    description: "February 2024 Rent",
    receiptUrl: "/receipts/february-2024.pdf",
  },
  {
    id: "PAY-1243",
    date: "2024-03-01T09:30:00Z",
    amount: 1250,
    status: "completed",
    method: "Bank Transfer",
    description: "March 2024 Rent",
    receiptUrl: "/receipts/march-2024.pdf",
  },
  {
    id: "PAY-1244",
    date: "2024-04-01T10:45:00Z",
    amount: 1250,
    status: "completed",
    method: "Credit Card",
    description: "April 2024 Rent",
    receiptUrl: "/receipts/april-2024.pdf",
  },
  {
    id: "PAY-1245",
    date: "2024-05-01T08:15:00Z",
    amount: 1250,
    status: "completed",
    method: "PayPal",
    description: "May 2024 Rent",
    receiptUrl: "/receipts/may-2024.pdf",
  },
  {
    id: "PAY-1246",
    date: "2024-06-01T10:30:00Z",
    amount: 1250,
    status: "pending",
    method: "Credit Card",
    description: "June 2024 Rent",
  },
];

interface PaymentListProps {
  limit?: number;
}

export function PaymentList({ limit }: PaymentListProps) {
  // Sort by date (newest first)
  const sortedPayments = [...DUMMY_PAYMENTS].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const payments = limit ? sortedPayments.slice(0, limit) : sortedPayments;

  const getStatusBadge = (status: Payment["status"]) => {
    switch (status) {
      case "completed":
        return <Badge variant="secondary" className="bg-green-100 text-green-800">
          <CheckCircle className="h-3 w-3 mr-1" /> Completed
        </Badge>;
      case "pending":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
          <Clock className="h-3 w-3 mr-1" /> Pending
        </Badge>;
      case "failed":
        return <Badge variant="secondary" className="bg-red-100 text-red-800">
          <XCircle className="h-3 w-3 mr-1" /> Failed
        </Badge>;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Payment History</CardTitle>
        {limit && (
          <Button variant="outline" size="sm" asChild>
            <a href="/payments">View All</a>
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <Table>
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
          <TableBody>
            {payments.map((payment) => (
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
                <TableCell>{getStatusBadge(payment.status)}</TableCell>
                <TableCell className="text-right">
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
