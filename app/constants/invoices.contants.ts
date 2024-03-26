export const STATUS_TYPES = ["draft", "pending", "paid"] as const;
export const STATUS_COLOR = {
  draft: {
    bg: "bg-gray-1050",
    text: "!text-gray-1050",
  },
  paid: {
    bg: "bg-green-1000",
    text: "!text-green-1000",
  },
  pending: {
    bg: "bg-orange-1000",
    text: "!text-orange-1000",
  },
} as const;

export const PAYMENT_TERMS = {
  "Net 1 Day": 1,
  "Net 7 Days": 7,
  "Net 14 Days": 14,
  "Net 30 Days": 30,
};
