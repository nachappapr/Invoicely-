export const ERROR_MESSAGES = {
  NOT_AUTHORIZED: "Not Authorized 🚫",
  INVOICE_NOT_FOUND: "Invoice not found 🔍",
  INVOICE_DELETED: "Invoice deleted 🗑️",
  SOMETHING_WENT_WRONG: "Something went wrong ⚠️",
  NO_INVOICES_FOUND: "No Invoices Found 📄",
};

export const ERROR_DESCRIPTIONS = {
  [ERROR_MESSAGES.NOT_AUTHORIZED]:
    "You do not have permission to view this invoice. Please contact support if you believe this is an error.",
  [ERROR_MESSAGES.INVOICE_NOT_FOUND]:
    "The invoice you are looking for does not exist. Verify the invoice ID and try again.",
  [ERROR_MESSAGES.INVOICE_DELETED]:
    "The invoice has been successfully removed from the system.",
  [ERROR_MESSAGES.SOMETHING_WENT_WRONG]:
    "An unexpected error occurred. Please try again later ✈️ or contact support if the issue persists.",
  [ERROR_MESSAGES.NO_INVOICES_FOUND]:
    "No invoices were found for your account. Please create a new invoice or check back later.",
};
