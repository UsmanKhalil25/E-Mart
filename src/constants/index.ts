// getAll table headers
export const TABLE_HEADER_PRODUCT = [
  { key: "id", label: "#" },
  { key: "company", label: "Company" },
  { key: "category", label: "Category" },
  { key: "model", label: "Model" },
  { key: "price", label: "Price" },
  { key: "stock", label: "Stock" },
  { key: "sales", label: "Sales" },
];

// getAll Customers
export const TABLE_HEADER_CUSTOMER = [
  { key: "id", label: "#" },
  { key: "name", label: "Name" },
  { key: "phoneNumber", label: "Phone Number" },
  { key: "CNIC", label: "CNIC" },
  { key: "city", label: "City" },
  { key: "detail", label: "Address details" },
];

// getALl Sales
export const TABLE_HEADER_SALES = [
  { key: "id", label: "#" },
  { key: "customerName", label: "Customer Name" },
  { key: "customerPhoneNumber", label: "Customer Phone Number" },
  { key: "paymentOption", label: "Payment Option" },
  { key: "paymentStatus", label: "Payment Status" },
  { key: "totalAmount", label: "Total Amount" },
  { key: "numberOfProducts", label: "Number of Product" },
];

// getAll Companies
export const TABLE_HEADER_COMPANIES = [
  { key: "id", label: "#" },
  { key: "companyName", label: "Company Name" },
  { key: "numberOfProducts", label: "Number of Products" },
  { key: "totalSaleAmount", label: "Total Sale Amount" },
  { key: "totalPurchaseAmount", label: "Total Purchase Amount" },
  { key: "totalStock", label: "Total Stock" },
];
// page: /sale/[id]
export const TABLE_HEADER_SALE_PRODUCT = [
  { key: "key", label: "#" },
  { key: "company", label: "Company" },
  { key: "category", label: "Category" },
  { key: "model", label: "Model" },
  { key: "price", label: "Price" },
  { key: "quantity", label: "Quantity" },
];

export const TABLE_HEADER_INSTALLMENTS = [
  { key: "key", label: "#" },
  { key: "expectedPayment", label: "Expected Payment" },
  { key: "actualPayment", label: "Actual Payment" },
  { key: "dueDate", label: "Due Date" },
  { key: "paidAt", label: "Paid At" },
];
