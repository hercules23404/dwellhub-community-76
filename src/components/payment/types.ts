
export interface Payment {
  id: string;
  date: string;
  amount: number;
  status: "completed" | "pending" | "failed";
  method: string;
  description: string;
  receiptUrl?: string;
}
