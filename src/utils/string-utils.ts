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
