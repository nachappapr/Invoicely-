import { z } from "zod";

export const itemSchema = z.object({
  item: z.string().min(1),
  qty: z.number({ required_error: "can't be empty" }),
  price: z.number({ required_error: "can't be empty" }),
});

export const InvoiceSchema = z.object({
  address: z.string({ required_error: "can't be empty" }).min(3).max(1000),
  city: z.string({ required_error: "can't be empty" }).min(3).max(100),
  postalCode: z.number({ required_error: "can't be empty" }),
  country: z.string({ required_error: "can't be empty" }).min(3).max(100),
  clientName: z.string({ required_error: "can't be empty" }).min(3).max(100),
  clientEmail: z
    .string({ required_error: "can't be empty" })
    .email("Invalid email"),
  clientAddress: z
    .string({ required_error: "can't be empty" })
    .min(3)
    .max(1000),
  clientCity: z.string({ required_error: "can't be empty" }).min(3).max(100),
  clientPostCode: z.number({ required_error: "can't be empty" }),
  clientCountry: z.string({ required_error: "can't be empty" }).min(3).max(100),
  eventDate: z.string({ required_error: "can't be empty" }),
  payment: z.string({ required_error: "can't be empty" }).min(3).max(100),
  description: z.string({ required_error: "can't be empty" }).min(3).max(100),
  itemList: z.array(itemSchema).min(1),
});
