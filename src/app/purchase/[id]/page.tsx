import React from "react";
import { getOne as getOnePurchase } from "@/actions/purchase/actions";
import TableHeader from "@/components/Tables/table-header";
import TableBody from "@/components/Tables/table-body";
import { TABLE_HEADER_PURCHASE_PRODUCT } from "@/constants/index";

import {
  Purchase as PurchaseType,
  ProductPurchase as ProductPurchaseType,
  PAYMENT_STATUS,
  PAYMENT_OPTIONS,
} from "@/lib/type";
import {
  formatPrice,
  formatPaymentStatus,
  formatPaymentOption,
} from "@/utils/string-utils";

const PurchaseDetailPage = async ({ params }: { params: { id: string } }) => {
  const response = await getOnePurchase(parseInt(params.id));
  const purchase: PurchaseType | null = response.data;

  if (!purchase) {
    return <>Purchase not found</>;
  }
  const getTotalPurchase = (productPurchase: ProductPurchaseType[]) => {
    const totalAmount = productPurchase.reduce(
      (total, item) => total + item.price,
      0
    );
    return totalAmount;
  };
  const getPaymentStatusClass = (paymentStatus: PAYMENT_STATUS) => {
    switch (paymentStatus) {
      case "COMPLETED":
        return "bg-green-300 text-green-800";
      case "PENDING":
        return "bg-yellow-300 text-yellow-800";
      case "FAILED":
        return "bg-red-300 text-red-800";
      case "REFUNDED":
        return "bg-blue-300 text-blue-800";
      default:
        return "";
    }
  };

  const getPreparedData = (purchase: PurchaseType) => {
    return purchase.productPurchase.map((item) => {
      const quantity = item.quantity;
      const price = item.price;
      const company = item.product.company.name;
      const category = item.product.category.name;
      const model = item.product.model;
      return {
        quantity,
        price,
        company,
        category,
        model,
      };
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-10 py-10">
      <fieldset className="space-y-12">
        <legend className="text-lg font-semibold leading-7 text-gray-900 border-b border-gray-900/10 pb-4">
          Purchase Record Information
        </legend>
        <p className="mt-1 text-sm leading-6 text-gray-600">
          Here is the complete information about the purchase.
        </p>
      </fieldset>

      <div className="w-100">
        <div className=" flex justify-between items-center mt-10 shadow rounded-md bg-white px-3 py-5">
          <div className="flex gap-2 items-end">
            <h1 className="text-5xl font-bold">
              Rs. {formatPrice(getTotalPurchase(purchase.productPurchase))}{" "}
            </h1>
            <span
              className={`max-h-6 text-xs font-semibold px-2 py-1 rounded-xl flex items-center ${getPaymentStatusClass(
                purchase.paymentStatus
              )}`}
            >
              {formatPaymentStatus(purchase.paymentStatus)}
            </span>
          </div>
          <div className="text-xs font-light">
            Payment Option:{" "}
            <span className="font-semibold text-sm">
              {formatPaymentOption(purchase.paymentOption)}
            </span>
          </div>
        </div>
        <div className="mt-10">
          <h2 className="text-sm text-gray-600">Customer Information</h2>
          <div className="mt-4 grid grid-cols-1 gap-x-3 gap-y-4 sm:grid-cols-2">
            <div className="bg-white shadow rounded-md p-4">
              <p className="text-sm font-medium text-gray-500">Name</p>
              <p className="text-lg font-semibold text-gray-900">
                {purchase.customer.firstName + " " + purchase.customer.lastName}
              </p>
            </div>

            <div className="bg-white shadow rounded-md p-4">
              <p className="text-sm font-medium text-gray-500">Phone Number</p>
              <p className="text-lg font-semibold text-gray-900">
                {purchase.customer.phoneNumber}
              </p>
            </div>
            <div className="bg-white shadow rounded-md p-4">
              <p className="text-sm font-medium text-gray-500">CNIC</p>
              <p className="text-lg font-semibold text-gray-900">
                {purchase.customer.CNIC}
              </p>
            </div>
            <div className="bg-white shadow rounded-md p-4">
              <p className="text-sm font-medium text-gray-500">City</p>
              <p className="text-lg font-semibold text-gray-900">
                {purchase.customer.address?.city}
              </p>
            </div>
            <div className="bg-white shadow rounded-md p-4">
              <p className="text-sm font-medium text-gray-500">Tehsil</p>
              <p className="text-lg font-semibold text-gray-900">
                {purchase.customer.address?.tehsil}
              </p>
            </div>
            <div className="bg-white shadow rounded-md p-4">
              <p className="text-sm font-medium text-gray-500">District</p>
              <p className="text-lg font-semibold text-gray-900">
                {purchase.customer.address?.district}
              </p>
            </div>
            <div className="bg-white shadow rounded-md p-4 col-span-full">
              <p className="text-sm font-medium text-gray-500">
                Address details
              </p>
              <p className="text-lg font-semibold text-gray-900">
                {purchase.customer.address?.detail}
              </p>
            </div>
          </div>
        </div>
        <div className="mt-10">
          <h2 className="text-sm text-gray-600">Products Information</h2>
          <div className="mt-4 overflow-x-auto rounded-md">
            <table className="table-auto w-full text-left whitespace-no-wrap">
              <TableHeader columns={TABLE_HEADER_PURCHASE_PRODUCT} />
              <TableBody
                columns={TABLE_HEADER_PURCHASE_PRODUCT}
                data={getPreparedData(purchase)}
              />
            </table>
          </div>
        </div>
        <div className="mt-10">
          <h2 className="text-sm text-gray-600">Payment Information</h2>
          {purchase.paymentOption === PAYMENT_OPTIONS.FULL_PAYMENT ? (
            <div className="mt-4 grid grid-cols-1 gap-x-3 gap-y-4 sm:grid-cols-2">
              <div className="bg-white shadow rounded-md p-4">
                <p className="text-sm font-medium text-gray-500">Payment</p>
                <p className="text-lg font-semibold text-gray-900">
                  {purchase.fullPayment?.purchaseAmount
                    ? formatPrice(purchase.fullPayment?.purchaseAmount)
                    : 0}
                </p>
              </div>

              <div className="bg-white shadow rounded-md p-4">
                <p className="text-sm font-medium text-gray-500">Discount</p>
                <p className="text-lg font-semibold text-gray-900">
                  {purchase.fullPayment?.discount
                    ? purchase.fullPayment?.discount
                    : 0}
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-4 overflow-x-auto rounded-md">
              <table className="table-auto w-full text-left whitespace-no-wrap">
                <TableHeader columns={TABLE_HEADER_PURCHASE_PRODUCT} />
                <TableBody
                  columns={TABLE_HEADER_PURCHASE_PRODUCT}
                  data={getPreparedData(purchase)}
                />
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PurchaseDetailPage;
