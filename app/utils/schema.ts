import { z } from "zod";

export const itemSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  quantity: z.number({ required_error: "can't be empty" }),
  price: z.number({ required_error: "can't be empty" }),
});

export const InvoiceSchema = z.object({
  fromAddress: z.string({ required_error: "can't be empty" }).min(3).max(1000),
  fromCity: z.string({ required_error: "can't be empty" }).min(3).max(100),
  fromPostalCode: z.string({ required_error: "can't be empty" }).min(1),
  fromCountry: z.string({ required_error: "can't be empty" }).min(3).max(100),
  clientName: z.string({ required_error: "can't be empty" }).min(3).max(100),
  clientEmail: z
    .string({ required_error: "can't be empty" })
    .email("Invalid email"),
  clientAddress: z
    .string({ required_error: "can't be empty" })
    .min(3)
    .max(1000),
  clientCity: z.string({ required_error: "can't be empty" }).min(3).max(100),
  clientPostalCode: z.string({ required_error: "can't be empty" }).min(1),
  clientCountry: z.string({ required_error: "can't be empty" }).min(3).max(100),
  invoiceDate: z.string({ required_error: "can't be empty" }),
  paymentTerms: z.string({ required_error: "can't be empty" }).min(3).max(100),
  status: z.string({ required_error: "can't be empty" }).optional(),
  projectDescription: z
    .string({ required_error: "can't be empty" })
    .min(3)
    .max(100),
  itemList: z.array(itemSchema).min(1),
});
