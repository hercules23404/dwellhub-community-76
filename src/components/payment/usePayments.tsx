
import { useState } from "react";
import { Payment } from "./types";

// Mock payments data
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

export function usePayments() {
  const getPayments = (limit?: number) => {
    // Sort by date (newest first)
    const sortedPayments = [...DUMMY_PAYMENTS].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return limit ? sortedPayments.slice(0, limit) : sortedPayments;
  };

  return { getPayments };
}
