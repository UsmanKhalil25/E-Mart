"use client";
import { useState, useEffect } from "react";
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
import InstallmentForm from "@/components/Forms/InstallmentForm";
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
    if (selectedCustomer && bookRecord && selectedProducts.length > 0) {
      setIsSubmitting(true);
      let saleData: SaleFormType | undefined;

      if (paymentOption === PAYMENT_OPTIONS.FULL_PAYMENT && fullPayment) {
        saleData = {
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
          customerId: selectedCustomer.id,
          paymentOption: paymentOption,
          paymentInfo: installmentPlan,
          products: selectedProducts,
          bookRecord,
        };
      }

      if (saleData) {
        const response = await createSale(saleData);
        if (response.status === 200) {
          toast.success("Sale record added.");
          router.push("/sale");
        } else {
          toast.error(response.message);
        }
      }
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-10 py-10">
      <fieldset className="space-y-12">
        <legend className="text-lg font-semibold leading-7 text-gray-900 border-b border-gray-900/10 pb-4">
          Sale Information
        </legend>
        <p className="mt-1 text-sm leading-6 text-gray-600">
          Add a new Sale record here.
        </p>

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
          <div className="mt-4 w-full">
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
          <ProductSearchBar onProductSelected={handleSelectProducts} />
        )}
        {selectedProducts.length > 0 && (
          <div className="mt-4 w-full">
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

        {selectedProducts.length > 0 && (
          <div className="flex space-x-4">
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
            <InstallmentForm
              totalPayment={totalPrice}
              onInstallmentAdd={handleAddInstallment}
            />
          ))}

        {installmentPlan || fullPayment ? (
          <>
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
          </>
        ) : null}
      </fieldset>
    </div>
  );
};

export default SaleForm;
