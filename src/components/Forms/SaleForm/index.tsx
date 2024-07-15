"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  Customer,
  Address,
  Product,
  InstallmentPlanForm as InstallmentPlanFormType,
  FullPaymentForm as FullPaymentFormType,
  BookRecordForm as BookRecordFormType,
  PAYMENT_OPTIONS,
  ProductWithInfo,
  SaleForm as SaleFormType,
} from "@/lib/type";
import { create as createSale } from "@/actions/sale/actions";

import CustomerForm from "@/components/Forms/CustomerForm";
import CustomerSearchBar from "@/components/Searchbars/CustomerSearchbar";
import ProductSearchBar from "@/components/Searchbars/ProductSearchBar";
import InstallmentPlanForm from "@/components/Forms/InstallmentPlanForm";
import FullPaymentForm from "@/components/Forms/FullPaymentForm";
import BookRecordForm from "@/components/Forms/BookRecordForm";
import TrashIcon from "@/components/Icons/TrashIcon";
import PlusIcon from "@/components/Icons/PlusIcon";
import MinusIcon from "@/components/Icons/MinusIcon";

enum CUSTOMER_OPTIONS {
  NEW,
  OLD,
}

const SaleForm = () => {
  const router = useRouter();
  const [customerOption, setCustomerOption] = useState<CUSTOMER_OPTIONS>(
    CUSTOMER_OPTIONS.NEW
  );

  const [saleDate, setSaleDate] = useState<Date>();
  const [selectedCustomer, setSelectedCustomer] = useState<Customer>();
  const [selectedProducts, setSelectedProducts] = useState<ProductWithInfo[]>(
    []
  );
  const [paymentOption, setPaymentOption] = useState<PAYMENT_OPTIONS>(
    PAYMENT_OPTIONS.FULL_PAYMENT
  );
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [bookRecord, setBookRecord] = useState<BookRecordFormType>();
  const [fullPayment, setFullPayment] = useState<FullPaymentFormType>();
  const [installmentPlan, setInstallmentPlan] =
    useState<InstallmentPlanFormType>();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const customerSectionRef = useRef<HTMLDivElement>(null);
  const productSectionRef = useRef<HTMLDivElement>(null);
  const paymentSectionRef = useRef<HTMLDivElement>(null);
  const bookRecordSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let price = 0;
    selectedProducts.forEach((product) => {
      price += product.price;
    });
    setTotalPrice(price);
  }, [selectedProducts]);

  useEffect(() => {
    resetAll();
  }, [customerOption]);

  const resetAll = () => {
    setSelectedCustomer(undefined);
    setSelectedProducts([]);
    setTotalPrice(0);
    setPaymentOption(PAYMENT_OPTIONS.FULL_PAYMENT);
    setBookRecord(undefined);
    setFullPayment(undefined);
    setInstallmentPlan(undefined);
    setSaleDate(undefined);
  };

  const truncatedAddress = (address: Address) => {
    return address.detail.length > 30
      ? address.detail.slice(0, 30) + "..."
      : address.detail;
  };

  const handleCreateCustomer = (data: Customer | undefined) => {
    setSelectedCustomer(data);
  };

  const handleSelectCustomer = (data: Customer) => {
    setSelectedCustomer(data);
  };

  const handleSelectProducts = (data: ProductWithInfo) => {
    setSelectedProducts((prev) => {
      const existingProduct = prev.find(
        (item) => item.product.id === data.product.id
      );
      if (existingProduct) {
        return prev.map((product) =>
          product.product.id === data.product.id
            ? {
                ...product,
                quantity: product.quantity + 1,
                price: (product.quantity + 1) * product.product.price,
              }
            : product
        );
      } else {
        return [
          ...prev,
          { product: data.product, quantity: data.quantity, price: data.price },
        ];
      }
    });
  };

  const handleRemoveProduct = (product: Product) => {
    setSelectedProducts((prev) => {
      const index = prev.findIndex((item) => item.product.id === product.id);
      if (index !== -1) {
        return [...prev.slice(0, index), ...prev.slice(index + 1)];
      }
      return prev;
    });
  };

  const handleIncreaseQuantity = (product: Product) => {
    setSelectedProducts((prev) =>
      prev.map((p) =>
        p.product.id === product.id && p.quantity < p.product.stock
          ? {
              ...p,
              quantity: p.quantity + 1,
              price: (p.quantity + 1) * p.product.price,
            }
          : p
      )
    );
  };

  const handleDecreaseQuantity = (product: Product) => {
    setSelectedProducts((prev) =>
      prev.map((p) =>
        p.product.id === product.id && p.quantity > 1
          ? {
              ...p,
              quantity: p.quantity - 1,
              price: (p.quantity - 1) * p.product.price,
            }
          : p
      )
    );
  };

  const handleAddBookRecord = (data: BookRecordFormType) => {
    setBookRecord(data);
  };

  const handleAddFullPayment = (data: FullPaymentFormType) => {
    setFullPayment(data);
  };

  const handleAddInstallment = (data: InstallmentPlanFormType) => {
    setInstallmentPlan(data);
  };

  useEffect(() => {
    if (bookRecord) {
      addRecord();
    }
  }, [bookRecord]);

  const addRecord = async () => {
    if (
      selectedCustomer &&
      bookRecord &&
      selectedProducts.length > 0 &&
      saleDate
    ) {
      setIsSubmitting(true);
      let saleData: SaleFormType | undefined;

      if (paymentOption === PAYMENT_OPTIONS.FULL_PAYMENT && fullPayment) {
        saleData = {
          date: saleDate,
          customerId: selectedCustomer.id,
          paymentOption: paymentOption,
          paymentInfo: fullPayment,
          products: selectedProducts,
          bookRecord,
        };
      } else if (
        paymentOption === PAYMENT_OPTIONS.INSTALLMENT &&
        installmentPlan
      ) {
        saleData = {
          date: saleDate,
          customerId: selectedCustomer.id,
          paymentOption: paymentOption,
          paymentInfo: installmentPlan,
          products: selectedProducts,
          bookRecord,
        };
      }

      if (saleData) {
        const response = await createSale(saleData);
        if (response.status === 201) {
          toast.success("Sale record added.");
          router.push("/sale");
        } else {
          toast.error(response.message);
        }
      }
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (selectedCustomer) {
      customerSectionRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedCustomer]);

  useEffect(() => {
    if (selectedProducts.length > 0) {
      productSectionRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedProducts]);

  useEffect(() => {
    if (installmentPlan || fullPayment) {
      paymentSectionRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [installmentPlan, fullPayment]);

  useEffect(() => {
    if (saleDate) {
      bookRecordSectionRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [saleDate]);

  return (
    <div className="w-full py-10 space-y-10">
      <div className="flex space-x-4">
        <button
          type="button"
          onClick={() => setCustomerOption(CUSTOMER_OPTIONS.NEW)}
          className={`px-3 py-2 ${
            customerOption === CUSTOMER_OPTIONS.NEW
              ? "rounded-md bg-neutral-900 text-sm font-semibold text-white shadow-sm hover:bg-neutral-800 "
              : " text-sm font-semibold  text-gray-900"
          }`}
        >
          Add New User
        </button>
        <button
          type="button"
          onClick={() => setCustomerOption(CUSTOMER_OPTIONS.OLD)}
          className={`px-3 py-2 ${
            customerOption === CUSTOMER_OPTIONS.OLD
              ? "rounded-md bg-neutral-900 text-sm font-semibold text-white shadow-sm hover:bg-neutral-800 "
              : " text-sm font-semibold  text-gray-900"
          }`}
        >
          Search for User
        </button>
      </div>

      {customerOption === CUSTOMER_OPTIONS.OLD ? (
        <div>
          <CustomerSearchBar onCustomerSelected={handleSelectCustomer} />
        </div>
      ) : (
        <CustomerForm onSubmitCustomer={handleCreateCustomer} />
      )}
      {selectedCustomer && (
        <div className="mt-4 w-full" ref={customerSectionRef}>
          <h2 className="text-sm font-semibold mb-2">Selected Customer:</h2>
          <div className="bg-neutral-900 rounded-lg shadow-md py-2 px-4 flex items-center justify-between max-h-36 overflow-y-auto">
            <div>
              <p className="text-white font-semibold text-sm">
                CNIC: {selectedCustomer.CNIC}
              </p>
              <p className="text-white text-xs">
                Name: {selectedCustomer.firstName}
              </p>
              <p className="text-white text-xs">
                Phone: {selectedCustomer.phoneNumber}
              </p>
              {selectedCustomer.address && (
                <p className="text-white text-xs truncate">
                  Address: {selectedCustomer.address.city},{" "}
                  {truncatedAddress(selectedCustomer.address)}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
      {selectedCustomer && (
        <ProductSearchBar
          stockContraint={true}
          onProductSelected={handleSelectProducts}
        />
      )}
      {selectedProducts.length > 0 && (
        <div className="mt-4 w-full" ref={productSectionRef}>
          <h2 className="text-sm font-semibold mb-2">Selected Products:</h2>
          {selectedProducts.map((selectedProduct) => (
            <div
              key={selectedProduct.product.id}
              className="bg-neutral-900 rounded-lg shadow-md py-2 px-4 flex items-center justify-between my-2"
            >
              <div>
                <p className="text-white font-semibold text-sm">
                  Model: {selectedProduct.product.model}
                </p>
                <p className="text-white text-xs">
                  Company: {selectedProduct.product.company.name}
                </p>
                <p className="text-white text-xs">
                  Category: {selectedProduct.product.category.name}
                </p>
                <p className="text-white text-sm font-semibold">
                  Price: {selectedProduct.price}
                </p>
                <p className="text-white text-sm font-semibold">
                  Quantity: {selectedProduct.quantity}
                </p>
              </div>
              <div className="flex flex-col justify-between items-center h-14">
                <div className="flex gap-3">
                  <div
                    onClick={() =>
                      handleIncreaseQuantity(selectedProduct.product)
                    }
                    className="cursor-pointer"
                  >
                    <PlusIcon />
                  </div>
                  <div
                    onClick={() =>
                      handleDecreaseQuantity(selectedProduct.product)
                    }
                    className="cursor-pointer"
                  >
                    <MinusIcon />
                  </div>
                </div>
                <div
                  onClick={() => handleRemoveProduct(selectedProduct.product)}
                  className=" cursor-pointer"
                >
                  <TrashIcon />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-4" ref={paymentSectionRef}>
        {selectedProducts.length > 0 && (
          <div className="flex space-x-4 ">
            <button
              type="button"
              onClick={() => setPaymentOption(PAYMENT_OPTIONS.FULL_PAYMENT)}
              className={`px-3 py-2 ${
                paymentOption === PAYMENT_OPTIONS.FULL_PAYMENT
                  ? "rounded-md bg-neutral-900 text-sm font-semibold text-white shadow-sm hover:bg-neutral-800 "
                  : " text-sm font-semibold  text-gray-900"
              }`}
            >
              Full Payment
            </button>
            <button
              type="button"
              onClick={() => setPaymentOption(PAYMENT_OPTIONS.INSTALLMENT)}
              className={`px-3 py-2 ${
                paymentOption === PAYMENT_OPTIONS.INSTALLMENT
                  ? "rounded-md bg-neutral-900 text-sm font-semibold text-white shadow-sm hover:bg-neutral-800 "
                  : " text-sm font-semibold  text-gray-900"
              }`}
            >
              Installments
            </button>
          </div>
        )}
        {selectedProducts.length > 0 &&
          (paymentOption === PAYMENT_OPTIONS.FULL_PAYMENT ? (
            <FullPaymentForm
              totalPayment={totalPrice}
              onFullPaymentAdd={handleAddFullPayment}
            />
          ) : (
            <InstallmentPlanForm
              totalPayment={totalPrice}
              onInstallmentAdd={handleAddInstallment}
            />
          ))}
      </div>

      {installmentPlan || fullPayment ? (
        <div className="sm:col-span-3">
          <label
            htmlFor="dueDate"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Sale date
          </label>
          <div className="mt-2">
            <input
              type="date"
              id="dueDate"
              onChange={(event) => setSaleDate(new Date(event.target.value))}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-zinc-950 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
      ) : null}
      {saleDate && (
        <div ref={bookRecordSectionRef} className="space-y-4">
          <div
            className={
              "px-3 py-2 w-28 rounded-md bg-neutral-900 text-sm font-semibold text-white shadow-sm"
            }
          >
            Book Record
          </div>
          <BookRecordForm
            isSubmitting={isSubmitting}
            onAddBookRecord={handleAddBookRecord}
          />
        </div>
      )}
    </div>
  );
};

export default SaleForm;
