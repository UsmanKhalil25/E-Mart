"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ProductFormSchema,
  Customer,
  Address,
  Product,
  InstallmentForm as InstallmentFormType,
  FullPaymentForm as FullPaymentFormType,
  PAYMENT_OPTIONS,
  ProductWithInfo,
  Purchase,
} from "@/lib/type";
import { create as createPurchase } from "@/actions/purchase/actions";

import CustomerForm from "@/components/Forms/customer-form";
import CustomerSearchBar from "@/components/Searchbars/customer-search-bar";
import ProductSearchBar from "@/components/Searchbars/product-search-bar";
import InstallmentForm from "@/components/Forms/installment-form";
import FullPaymentForm from "@/components/Forms/full-payment-form";
import TrashIcon from "@/components/Icons/TrashIcon";
import PlusIcon from "@/components/Icons/PlusIcon";
import MinusIcon from "@/components/Icons/MinusIcon";

enum CUSTOMER_OPTIONS {
  NEW,
  OLD,
}

const PurchaseForm = () => {
  const {
    handleSubmit,
    formState: { errors },
  } = useForm<Product>({
    resolver: zodResolver(ProductFormSchema),
  });

  const [customerOption, setCustomerOption] = useState<CUSTOMER_OPTIONS>(
    CUSTOMER_OPTIONS.NEW,
  );

  const [paymentOption, setPaymentOption] = useState<PAYMENT_OPTIONS>(
    PAYMENT_OPTIONS.FULL_PAYMENT,
  );
  const [selectedCustomer, setSelectedCustomer] = useState<Customer>();
  const [selectedProducts, setSelectedProducts] = useState<ProductWithInfo[]>(
    [],
  );
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [fullPayment, setFullPayment] = useState<FullPaymentFormType>();
  const [installment, setInstallment] = useState<InstallmentFormType>();

  useEffect(() => {
    let price = 0;
    selectedProducts.forEach((product) => {
      price += product.price;
    });
    setTotalPrice(price);
  }, [selectedProducts]);

  const truncatedAddress = (address: Address) => {
    return address.detail.length > 30
      ? address.detail.slice(0, 30) + "..."
      : address.detail;
  };

  const handleSelectCustomer = (data: Customer) => {
    setSelectedCustomer(data);
  };

  const handleSelectProducts = (data: ProductWithInfo) => {
    setSelectedProducts((prev) => {
      const existingProduct = prev.find(
        (item) => item.product.id === data.product.id,
      );
      if (existingProduct) {
        return prev.map((product) =>
          product.product.id === data.product.id
            ? {
                ...product,
                quantity: product.quantity + 1,
                price: (product.quantity + 1) * product.product.price,
              }
            : product,
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
        p.product.id === product.id
          ? {
              ...p,
              quantity: p.quantity + 1,
              price: (p.quantity + 1) * p.product.price,
            }
          : p,
      ),
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
          : p,
      ),
    );
  };

  const handleAddFullPayment = async (data: FullPaymentFormType) => {
    setFullPayment(data);
    await addRecord();
  };
  const handleAddInstallment = async (data: InstallmentFormType) => {
    setInstallment(data);
    await addRecord();
  };

  const addRecord = async () => {
    if (selectedCustomer && selectedProducts.length > 0) {
      let purchaseData: Purchase | undefined;

      if (paymentOption === PAYMENT_OPTIONS.FULL_PAYMENT && fullPayment) {
        purchaseData = {
          customerId: selectedCustomer.id,
          paymentOption: paymentOption,
          paymentInfo: fullPayment,
          products: selectedProducts,
        };
      } else if (
        paymentOption === PAYMENT_OPTIONS.INSTALLMENTS &&
        installment
      ) {
        purchaseData = {
          customerId: selectedCustomer.id,
          paymentOption: paymentOption,
          paymentInfo: installment,
          products: selectedProducts,
        };
      }

      if (purchaseData) {
        await createPurchase(purchaseData);
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-10 py-10">
      <fieldset className="space-y-12">
        <legend className="text-lg font-semibold leading-7 text-gray-900 border-b border-gray-900/10 pb-4">
          Purchase Information
        </legend>
        <p className="mt-1 text-sm leading-6 text-gray-600">
          Add a new purchase record here.
        </p>

        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => setCustomerOption(CUSTOMER_OPTIONS.NEW)}
            className={`px-3 py-2 ${
              customerOption === CUSTOMER_OPTIONS.NEW
                ? "rounded-md bg-neutral-950 text-sm font-semibold text-white shadow-sm hover:bg-neutral-900 "
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
                ? "rounded-md bg-neutral-950 text-sm font-semibold text-white shadow-sm hover:bg-neutral-900 "
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
          <CustomerForm />
        )}
        {selectedCustomer && (
          <div className="mt-4 max-w-xl mr-auto">
            <h2 className="text-sm font-semibold mb-2">Selected Customer:</h2>
            <div className="bg-neutral-950 rounded-lg shadow-md py-2 px-4 flex items-center justify-between max-h-36 overflow-y-auto">
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
          <div className="mt-4 max-w-xl mr-auto">
            <h2 className="text-sm font-semibold mb-2">Selected Products:</h2>
            {selectedProducts.map((selectedProduct) => (
              <div
                key={selectedProduct.product.id}
                className="bg-neutral-950 rounded-lg shadow-md py-2 px-4 flex items-center justify-between my-2"
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
                  ? "rounded-md bg-neutral-950 text-sm font-semibold text-white shadow-sm hover:bg-neutral-900 "
                  : " text-sm font-semibold  text-gray-900"
              }`}
            >
              Full Payment
            </button>
            <button
              type="button"
              onClick={() => setPaymentOption(PAYMENT_OPTIONS.INSTALLMENTS)}
              className={`px-3 py-2 ${
                paymentOption === PAYMENT_OPTIONS.INSTALLMENTS
                  ? "rounded-md bg-neutral-950 text-sm font-semibold text-white shadow-sm hover:bg-neutral-900 "
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
      </fieldset>
    </div>
  );
};

export default PurchaseForm;
