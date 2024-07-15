"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  Product,
  PurchasePaymentForm as PurchasePaymentFormType,
  ProductWithInfo,
} from "@/lib/type";

import { create as createPurchase } from "@/actions/purchase/actions";

import PurchasePaymentForm from "@/components/Forms/PurchasePaymentForm";
import ProductSearchBar from "@/components/Searchbars/ProductSearchBar";
import TrashIcon from "@/components/Icons/TrashIcon";
import PlusIcon from "@/components/Icons/PlusIcon";
import MinusIcon from "@/components/Icons/MinusIcon";

const PurchaseForm = () => {
  const router = useRouter();

  const [companyId, setCompanyId] = useState<number>();
  const [selectedProducts, setSelectedProducts] = useState<ProductWithInfo[]>(
    []
  );

  const [purchaseDate, setpurchaseDate] = useState<Date>();
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [payment, setPayment] = useState<PurchasePaymentFormType>();
  const [description, setDescription] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const productSectionRef = useRef<HTMLDivElement>(null);
  const paymentSectionRef = useRef<HTMLDivElement>(null);
  const descriptionSectionRef = useRef<HTMLDivElement>(null);
  const dateSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let price = 0;
    selectedProducts.forEach((product) => {
      price += product.price;
    });
    setTotalPrice(price);
  }, [selectedProducts]);

  const resetAll = () => {
    setSelectedProducts([]);
    setTotalPrice(0);
    setPayment(undefined);
    setDescription("");
    setpurchaseDate(undefined);
  };

  const handleSelectProducts = (data: ProductWithInfo) => {
    if (companyId !== data.product.company.id) {
      setCompanyId(data.product.company.id);
      resetAll();
    }

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
        p.product.id === product.id
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

  const handleAddPayment = (data: PurchasePaymentFormType) => {
    setPayment(data);
  };

  const addRecord = async () => {
    if (payment && selectedProducts.length > 0 && purchaseDate && companyId) {
      setIsSubmitting(true);
      const purchaseData = {
        companyId: companyId,
        date: purchaseDate,
        description,
        products: selectedProducts,
        paymentInfo: payment,
      };

      if (purchaseData) {
        const response = await createPurchase(purchaseData);
        if (response.status === 201) {
          toast.success(response.message);
          router.push("/purchase");
        } else {
          toast.error(response.message);
        }
      }
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (selectedProducts.length > 0) {
      productSectionRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedProducts]);

  useEffect(() => {
    if (payment) {
      paymentSectionRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [payment]);

  useEffect(() => {
    if (purchaseDate) {
      dateSectionRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [purchaseDate]);

  useEffect(() => {
    if (description) {
      descriptionSectionRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [description]);

  return (
    <div className="w-full py-10 space-y-10">
      <ProductSearchBar onProductSelected={handleSelectProducts} />
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
          <PurchasePaymentForm
            totalPayment={totalPrice}
            onAddPayment={handleAddPayment}
          />
        )}
      </div>

      {payment && (
        <div className="sm:col-span-3">
          <label
            htmlFor="dueDate"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Purchase date
          </label>
          <div className="mt-2">
            <input
              type="date"
              id="dueDate"
              onChange={(event) =>
                setpurchaseDate(new Date(event.target.value))
              }
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-zinc-950 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
      )}

      {purchaseDate && (
        <div className="sm:col-span-3">
          <label
            htmlFor="description"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Description
          </label>
          <div className="mt-2">
            <input
              type="text"
              id="description"
              placeholder="optional"
              onChange={(event) => setDescription(event.target.value)}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-zinc-950 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
      )}
      {purchaseDate && (
        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            onClick={addRecord}
            disabled={isSubmitting}
            className="rounded-md bg-neutral-900 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-neutral-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            {isSubmitting ? "Adding..." : "Add purchase"}
          </button>
        </div>
      )}
    </div>
  );
};

export default PurchaseForm;
