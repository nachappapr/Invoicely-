export type InvoiceType = {
  id: string;
  clientName: string;
  status: "draft" | "pending" | "paid";
  createdAt: string;
  total: number;
};
