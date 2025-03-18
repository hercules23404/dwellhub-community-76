
import React from "react";
import { formatDistanceToNow } from "date-fns";
import { Download, FileText, Eye } from "lucide-react";
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

export interface Invoice {
  id: string;
  date: string;
  dueDate: string;
  amount: number;
  status: "paid" | "unpaid" | "overdue";
  description: string;
  invoiceUrl?: string;
}

const DUMMY_INVOICES: Invoice[] = [
  {
    id: "INV-2024-001",
    date: "2024-05-15T10:00:00Z",
    dueDate: "2024-06-01T23:59:59Z",
    amount: 1250,
    status: "unpaid",
    description: "June 2024 Rent",
    invoiceUrl: "/invoices/june-2024.pdf",
  },
  {
    id: "INV-2024-002",
    date: "2024-05-15T10:00:00Z",
    dueDate: "2024-05-25T23:59:59Z",
    amount: 75,
    status: "unpaid",
    description: "Parking Fee - June 2024",
    invoiceUrl: "/invoices/parking-june-2024.pdf",
  },
  {
    id: "INV-2024-003",
    date: "2024-04-15T10:00:00Z",
    dueDate: "2024-05-01T23:59:59Z",
    amount: 1250,
    status: "paid",
    description: "May 2024 Rent",
    invoiceUrl: "/invoices/may-2024.pdf",
  },
  {
    id: "INV-2024-004",
    date: "2024-04-15T10:00:00Z",
    dueDate: "2024-04-25T23:59:59Z",
    amount: 75,
    status: "paid",
    description: "Parking Fee - May 2024",
    invoiceUrl: "/invoices/parking-may-2024.pdf",
  },
  {
    id: "INV-2024-005",
    date: "2024-03-15T10:00:00Z",
    dueDate: "2024-04-01T23:59:59Z",
    amount: 1250,
    status: "paid",
    description: "April 2024 Rent",
    invoiceUrl: "/invoices/april-2024.pdf",
  },
  {
    id: "INV-2024-006",
    date: "2024-03-15T10:00:00Z",
    dueDate: "2024-03-25T23:59:59Z",
    amount: 75,
    status: "paid",
    description: "Parking Fee - April 2024",
    invoiceUrl: "/invoices/parking-april-2024.pdf",
  },
  {
    id: "INV-2024-007",
    date: "2024-03-01T10:00:00Z",
    dueDate: "2024-03-10T23:59:59Z",
    amount: 150,
    status: "paid",
    description: "Maintenance Fee - Plumbing Repair",
    invoiceUrl: "/invoices/maintenance-march-2024.pdf",
  },
];

export function InvoiceList() {
  // Sort by date (newest first)
  const sortedInvoices = [...DUMMY_INVOICES].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const getStatusBadge = (status: Invoice["status"]) => {
    switch (status) {
      case "paid":
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Paid</Badge>;
      case "unpaid":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Unpaid</Badge>;
      case "overdue":
        return <Badge variant="secondary" className="bg-red-100 text-red-800">Overdue</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invoices</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice ID</TableHead>
              <TableHead>Issue Date</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedInvoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-medium">{invoice.id}</TableCell>
                <TableCell>
                  {new Date(invoice.date).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span>{new Date(invoice.dueDate).toLocaleDateString()}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(invoice.dueDate), { addSuffix: true })}
                    </span>
                  </div>
                </TableCell>
                <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                <TableCell>{invoice.description}</TableCell>
                <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View</span>
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Download className="h-4 w-4" />
                      <span className="sr-only">Download</span>
                    </Button>
                    {invoice.status === "unpaid" && (
                      <Button size="sm" variant="default">Pay Now</Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
