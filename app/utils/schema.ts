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
  invoiceDate: z.date({ required_error: "can't be empty" }),
  paymentTerms: z.string({ required_error: "can't be empty" }),
  status: z.string({ required_error: "can't be empty" }).optional(),
  projectDescription: z
    .string({ required_error: "can't be empty" })
    .min(3)
    .max(100),
  itemList: z.array(itemSchema).min(1),
});

export const ThemeSwitcherSchema = z.object({
  theme: z.enum(["light", "dark"]),
});

const EmailSchema = z
  .string({ required_error: "Can't be empty" })
  .email("Invalid email")
  .min(3, "Email is too short")
  .max(100, "Email is too long")
  .transform((value) => value.toLowerCase());

const PasswordSchema = z
  .string({ required_error: "Can't be empty" })
  .min(8, "Password is too short")
  .max(100, "Password is too long");

const UsernameSchema = z
  .string({ required_error: "Can't be empty" })
  .min(3, "Username is too short")
  .max(100, "Username is too long")
  .regex(/^[a-zA-Z0-9_]+$/, {
    message: "Username can only include letters, numbers, and underscores",
  })
  .transform((value) => value.toLowerCase());

const NameSchema = z
  .string({ required_error: "Can't be empty" })
  .min(3, "Name is too short")
  .max(100, "Name is too long")
  .regex(/^[a-zA-Z\s]+$/, {
    message: "Name can only include letters and spaces",
  })
  .transform((value) => value.toLowerCase());

export const SignInSchema = z.object({
  email: EmailSchema,
  password: PasswordSchema,
  remember: z.boolean().optional(),
});

export const SignUpSchema = z
  .object({
    username: UsernameSchema,
    name: NameSchema,
    email: EmailSchema,
    password: PasswordSchema,
    confirmPassword: PasswordSchema,
    agreeToTermsOfServiceAndPrivacyPolicy: z.boolean({
      required_error:
        "You must agree to the terms of service and privacy policy",
    }),
    remember: z.boolean().optional(),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      return ctx.addIssue({
        code: z.ZodIssueCode["custom"],
        path: ["confirmPassword"],
        message: "Password must match",
      });
    }
  });
