import { PAYMENT_OPTIONS } from "@/lib/type";
export function formatPrice(price: number) {
  return price.toLocaleString();
}

export function formatPaymentStatus(status: string) {
  const formatted = status.toLowerCase();
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

export function formatPaymentOption(option: PAYMENT_OPTIONS) {
  switch (option) {
    case "FULL_PAYMENT":
      return "Full payment";
    case "INSTALLMENT":
      return "Installments";
    default:
      return "";
  }
}

export function formatDate(dateStr: Date) {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
  const day = String(date.getDate()).padStart(2, "0");
  return `${day}-${month}-${year}`;
}
