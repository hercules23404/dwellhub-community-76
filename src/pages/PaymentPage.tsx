
import React from "react";
import { PaymentDashboard } from "@/components/payment/PaymentDashboard";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";

export default function PaymentPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <main className="container mx-auto py-6 px-4 md:px-6">
          <PaymentDashboard />
        </main>
      </div>
    </div>
  );
}
