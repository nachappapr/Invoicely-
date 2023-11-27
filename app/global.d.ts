export type InvoiceType = {
  id: string;
  date: string;
  to: string;
  amount: string;
  status: "paid" | "pending" | "draft";
};
