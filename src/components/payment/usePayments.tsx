
// Static dummy data for payments only.
import { Payment } from "./types";

const DUMMY_PAYMENTS: Payment[] = [
  {
    id: "PAY-1234",
    date: "2023-06-01T10:30:00Z",
    amount: 1200,
    status: "completed",
    method: "Credit Card",
    description: "June 2023 Rent",
    receiptUrl: "/receipts/june-2023.pdf",
  }
];

export function usePayments() {
  const getPayments = (limit?: number) => {
    return limit ? DUMMY_PAYMENTS.slice(0, limit) : DUMMY_PAYMENTS;
  };

  return { getPayments };
}
