import { z } from "zod";

/*
 * Address schema
 */
export const AddressFormSchema = z.object({
  district: z
    .string()
    .trim()
    .min(4, { message: "District name must be 4 character long." })
    .max(255, {
      message: "Category name cannot be longer then 255 characters",
    }),
  tehsil: z
    .string()
    .trim()
    .min(4, { message: "Tehsil name must be 4 character long." })
    .max(255, {
      message: "Tehsil name cannot be longer then 255 characters",
    }),
  city: z
    .string()
    .trim()
    .min(4, { message: "City name must be 4 character long." })
    .max(255, {
      message: "City name cannot be longer then 255 characters",
    }),
  detail: z
    .string()
    .trim()
    .min(4, { message: "Provide more address details." }),
});
export type AddressForm = z.infer<typeof AddressFormSchema>;

export type Address = {
  id: number;
  district: string;
  tehsil: string;
  city: string;
  detail: string;
};

/*
 * Customer schema
 */
export const CustomerFormSchema = z.object({
  id: z.number().int().optional(),
  firstName: z
    .string()
    .trim()
    .min(4, { message: "FirstName must be 4 characters long" })
    .max(255, { message: "Firstname cannot be longer than 255 characters" }),
  lastName: z.string().optional(),
  phoneNumber: z
    .string()
    .regex(
      /^\d{4}-\d{7}$/,
      "Please provide a valid phone number format (e.g., 0331-2340021)"
    ),
  CNIC: z
    .string()
    .regex(
      /^\d{5}-\d{8}$/,
      "Please provide a valid CNIC format (e.g., 34202-00827441)"
    ),
  address: AddressFormSchema.optional(),
});
export type CustomerForm = z.infer<typeof CustomerFormSchema>;

export type Customer = {
  id: number;
  firstName: string;
  lastName: string | null;
  phoneNumber: string;
  CNIC: string;
  address: Address | null;
};

/*
 * Company schema
 */
export const CompanyFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Company name must be 1 character long." })
    .max(255, { message: "Company name cannot be longer then 255 characters" }),
});
export type CompanyForm = z.infer<typeof CompanyFormSchema>;

export type Company = {
  id: number;
  name: string;
};

/*
 * Category schema
 */
export const CategoryFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Category name must be 1 character long." })
    .max(255, {
      message: "Category name cannot be longer then 255 characters",
    }),
});
export type CategoryForm = z.infer<typeof CategoryFormSchema>;

export type Category = {
  id: number;
  name: string;
};

/*
 * Product schema
 */
export const ProductFormSchema = z.object({
  company: z.string({
    required_error: "Company is required",
  }),
  category: z.string({
    required_error: "Category is required",
  }),
  model: z
    .string()
    .trim()
    .min(1, { message: "Model must be 1 character long." })
    .max(255, { message: "Model cannot be longer then 255 characters" }),
  price: z
    .number()
    .gte(1, { message: "Price cannot be less then 1" })
    .nonnegative({ message: "Price cannot be negative" }),
  stock: z
    .number()
    .gte(1, { message: "Stock cannot be less then 1" })
    .nonnegative({ message: "Stock cannot be negative" }),
  description: z.string().optional(),
});
export type ProductForm = z.infer<typeof ProductFormSchema>;

export type Product = {
  id: number;
  model: string;
  price: number;
  stock: number;
  description: string | null;
  productSales: {
    id: number;
    productId: number;
    saleId: number;
    quantity: number;
    price: number;
  }[];
  company: Company;
  category: Category;
};

export type ProductWithInfo = {
  product: Product;
  price: number;
  quantity: number;
};

/*
 * enums schema
 */

export const PAYMENT_OPTIONS: {
  FULL_PAYMENT: "FULL_PAYMENT";
  INSTALLMENT: "INSTALLMENT";
} = {
  FULL_PAYMENT: "FULL_PAYMENT",
  INSTALLMENT: "INSTALLMENT",
};
export type PAYMENT_OPTIONS =
  (typeof PAYMENT_OPTIONS)[keyof typeof PAYMENT_OPTIONS];

export const PAYMENT_STATUS: {
  COMPLETED: "COMPLETED";
  PENDING: "PENDING";
  FAILED: "FAILED";
  REFUNDED: "REFUNDED";
} = {
  COMPLETED: "COMPLETED",
  PENDING: "PENDING",
  FAILED: "FAILED",
  REFUNDED: "REFUNDED",
};
export type PAYMENT_STATUS =
  (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS];

/*
 * Sale schema
 */

export type Sale = {
  id: number;
  customerId: number;
  customer: Customer;
  paymentStatus: PAYMENT_STATUS;
  paymentOption: PAYMENT_OPTIONS;
  productSales: ProductSale[];
  fullPayment: FullPayment | null;
  installmentPlan: InstallmentPlan | null;
  bookRecord: BookRecord | null;
  createdAt: Date;
  updatedAt: Date;
};

export type SaleForm = {
  customerId: number;
  paymentOption: PAYMENT_OPTIONS;
  paymentInfo: FullPaymentForm | InstallmentPlanForm;
  products: ProductWithInfo[];
  bookRecord: BookRecordForm;
};

export type SaleAllType = {
  id: number;
  customerId: number;
  customer: {
    id: number;
    firstName: string;
    lastName: string | null;
    phoneNumber: string;
    CNIC: string;
  };
  paymentStatus: PAYMENT_STATUS;
  paymentOption: PAYMENT_OPTIONS;
  productSales: {
    id: number;
    productId: number;
    saleId: number;
    quantity: number;
    price: number;
  }[];
  createdAt: Date;
  updatedAt: Date;
};
/*
 * ProductPurchase schema
 */
export type ProductSale = {
  id: number;
  productId: number;
  product: {
    id: number;
    model: string;
    price: number;
    stock: number;
    description: string | null;
    company: Company;
    category: Category;
  };
  saleId: number;
  quantity: number;
  price: number;
};

/*
 * FullPayment schema
 */

export const FullPaymentFormSchema = z.object({
  purchaseAmount: z
    .number({
      required_error: "Please enter payment amount",
    })
    .int()
    .nonnegative({
      message: "Payment cannot be negative",
    }),
  discount: z
    .number()
    .int()
    .nonnegative({ message: "Discount cannot be negative" })
    .optional(),
});
export type FullPaymentForm = z.infer<typeof FullPaymentFormSchema>;

export type FullPayment = {
  id: number;
  saleId: number;
  discount: number | null;
  purchaseAmount: number;
};

/*
 * InstallmentPlan schema
 */

export const InstallmentPlanFormSchema = z.object({
  totalPrice: z
    .number({
      required_error: "Please enter total amount",
    })
    .int()
    .nonnegative({
      message: "Total price cannot be negative",
    }),
  downPayment: z
    .number({
      required_error: "Please enter down payment",
    })
    .int()
    .nonnegative({
      message: "Down payment cannot be negative",
    }),
  installmentPeriod: z
    .number({
      required_error: "Please enter installment period in months",
    })
    .int()
    .nonnegative({
      message: "Installment period cannot be negative",
    }),
  dueDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date",
  }),
  expectedPayment: z
    .number({
      required_error: "Please provide the expected installment amount",
    })
    .int()
    .nonnegative({
      message: "Expected payment cannot be negative",
    }),
});

export type InstallmentPlanForm = z.infer<typeof InstallmentPlanFormSchema>;

export type InstallmentPlan = {
  id: number;
  saleId: number;
  totalPrice: number;
  remainingPrice: number;
  downPayment: number;
  installmentPeriod: number;
  installments: Installment[];
};

/*
 * Installment schema
 */
export const InstallmentFormSchema = z.object({
  actualPayment: z
    .number({
      required_error: "Please provide the actual installment payment",
    })
    .int()
    .nonnegative({
      message: "Expected payment cannot be negative",
    }),
  dueDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date",
  }),
  paidAt: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date",
  }),
  expectedPayment: z
    .number({
      required_error: "Please provide the expected installment amount",
    })
    .int()
    .nonnegative({
      message: "Expected payment cannot be negative",
    }),
});
export type InstallmentForm = z.infer<typeof InstallmentFormSchema>;

export type Installment = {
  id: number;
  expectedPayment: number;
  actualPayment: number | null;
  dueDate: Date;
  paidAt: Date | null;
};

/*
 * BookRecord schema
 */
export const BookRecordFormSchema = z.object({
  bookName: z.string({
    required_error: "Please enter book name",
  }),
  pageNumber: z
    .number({
      required_error: "Please enter page number",
    })
    .int()
    .nonnegative({
      message: "Page number cannot be negative",
    }),
  description: z.string().optional(),
});

export type BookRecordForm = z.infer<typeof BookRecordFormSchema>;

export type BookRecord = {
  id: number;
  saleId: number;
  bookName: string;
  pageNumber: number;
  description: string | null;
};
