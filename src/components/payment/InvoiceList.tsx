
import React, { useState, useEffect } from "react";
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
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface Invoice {
  id: string;
  date: string;
  dueDate: string;
  amount: number;
  status: "paid" | "unpaid" | "overdue";
  description: string;
  invoiceUrl?: string;
}

export function InvoiceList() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchInvoices();
  }, [user]);

  const fetchInvoices = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Transform payments data to invoice format
      const transformedData: Invoice[] = data.map(payment => ({
        id: payment.payment_id,
        date: payment.created_at,
        dueDate: payment.due_date || payment.created_at,
        amount: Number(payment.amount),
        status: payment.status === 'paid' ? 'paid' : 
               payment.status === 'overdue' ? 'overdue' : 'unpaid',
        description: payment.type.charAt(0).toUpperCase() + payment.type.slice(1),
        invoiceUrl: `/invoices/${payment.payment_id}.pdf`,
      }));
      
      setInvoices(transformedData);
    } catch (error: any) {
      console.error('Error fetching invoices:', error);
      toast.error("Failed to load invoices");
    } finally {
      setLoading(false);
    }
  };

  // If no user data yet and no actual payments retrieved, use dummy data
  const displayInvoices = invoices.length > 0 ? invoices : [
    {
      id: "INV-2024-001",
      date: "2024-05-15T10:00:00Z",
      dueDate: "2024-06-01T23:59:59Z",
      amount: 1250,
      status: "unpaid" as const,
      description: "June 2024 Rent",
      invoiceUrl: "/invoices/june-2024.pdf",
    },
    {
      id: "INV-2024-003",
      date: "2024-04-15T10:00:00Z",
      dueDate: "2024-05-01T23:59:59Z",
      amount: 1250,
      status: "paid" as const,
      description: "May 2024 Rent",
      invoiceUrl: "/invoices/may-2024.pdf",
    }
  ];

  // Sort by date (newest first)
  const sortedInvoices = [...displayInvoices].sort((a, b) => 
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

  const handlePayNow = (invoiceId: string) => {
    toast.info("Payment feature coming soon", {
      description: "This feature will be available in the next update.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invoices</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading invoices...</p>
          </div>
        ) : (
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
                        <Button 
                          size="sm" 
                          variant="default"
                          onClick={() => handlePayNow(invoice.id)}
                        >
                          Pay Now
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
