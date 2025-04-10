
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
} from "@/components/ui/table";
import { PaymentTableHeader } from "./PaymentTableHeader";
import { PaymentTableRow } from "./PaymentTableRow";
import { usePayments } from "./usePayments";

interface PaymentListProps {
  limit?: number;
}

export function PaymentList({ limit }: PaymentListProps) {
  const { getPayments } = usePayments();
  const payments = getPayments(limit);

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
          <PaymentTableHeader />
          <TableBody>
            {payments.map((payment) => (
              <PaymentTableRow key={payment.id} payment={payment} />
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
