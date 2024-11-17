import { PAYMENT_TERMS } from "~/constants";

/**
 * Throws an error if the given condition is false.
 *
 * @param condition - The condition to check.
 * @param message - The error message to throw if the condition is false. It can be a string or a function that returns a string.
 * @param responseInit - Additional options to pass to the Response constructor.
 * @throws {Response} - Throws a Response error with a status of 400 if the condition is false.
 */
export function invariantResponse(
  condition: any,
  message?: string | (() => string),
  responseInit?: ResponseInit
): asserts condition {
  if (!condition) {
    throw new Response(
      typeof message === "function"
        ? message()
        : message ||
          "An invariant failed, please provide a message to explain why.",
      { status: 400, ...responseInit }
    );
  }
}

/**
 * Adds a specified number of days to a given date and returns the resulting date as a formatted string.
 * @param date - The date to which the days will be added.
 * @param paymentTerm - The payment term, which determines the number of days to add.
 * @returns A formatted string representing the resulting date.
 */
export function addDaysToPaymentDate(
  date: string,
  paymentTerm: keyof typeof PAYMENT_TERMS
) {
  const copy = new Date(date);
  const days = PAYMENT_TERMS[paymentTerm];
  copy.setDate(new Date(date).getDate() + days);
  return copy.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/**
 * Formats a date string into a localized date format.
 * @param date - The date string to be formatted.
 * @returns The formatted date string.
 */
export function getFormattedDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function getTotals(
  items: {
    name: string;
    quantity: number;
    price: number;
    total: number | null;
  }[]
) {
  return items.reduce((acc, item) => acc + (item.total ?? 0), 0);
}

/**
 * Combine multiple header objects into one (uses append so headers are not overridden)
 */
export function combineHeaders(
  ...headers: Array<ResponseInit["headers"] | null>
) {
  const combined = new Headers();
  for (const header of headers) {
    if (!header) continue;
    for (const [key, value] of new Headers(header).entries()) {
      combined.append(key, value);
    }
  }
  return combined;
}

export const getErrorMessage = (error: unknown) => {
  if (typeof error === "string") return error;
  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof error.message === "string"
  )
    return error.message;
  console.error("Unable to get error message for error", error);
  return "Unknown Error";
};
