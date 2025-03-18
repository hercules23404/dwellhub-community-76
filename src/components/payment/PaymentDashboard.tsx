
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PaymentList } from "./PaymentList";
import { PaymentForm } from "./PaymentForm";
import { PaymentSummary } from "./PaymentSummary";
import { InvoiceList } from "./InvoiceList";

export function PaymentDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="space-y-4">
      <div className="flex flex-col">
        <h2 className="text-3xl font-bold tracking-tight">Rent & Payments</h2>
        <p className="text-muted-foreground">
          Manage your rent payments, view history, and download receipts
        </p>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-4 md:w-[400px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="make-payment">Make Payment</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <PaymentSummary />
          <PaymentList limit={5} />
        </TabsContent>
        
        <TabsContent value="make-payment">
          <Card>
            <CardHeader>
              <CardTitle>Make a Payment</CardTitle>
              <CardDescription>Pay your rent or other fees online</CardDescription>
            </CardHeader>
            <CardContent>
              <PaymentForm />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history" className="space-y-4">
          <PaymentList />
        </TabsContent>
        
        <TabsContent value="invoices" className="space-y-4">
          <InvoiceList />
        </TabsContent>
      </Tabs>
    </div>
  );
}
