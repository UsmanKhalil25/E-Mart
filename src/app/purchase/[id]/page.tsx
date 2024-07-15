import React from "react";
import DetailsNotFound from "@/components/DetailsNotFound";
import { getOne as getOnePurchase } from "@/actions/purchase/actions";
import TableHeader from "@/components/Tables/TabelHeader";
import TableBody from "@/components/Tables/TableBody";
import DetailWrapper from "@/components/Wrappers/DetailWrapper";
import RedirectButton from "@/components/Buttons/RedirectButton";
import { TABLE_HEADER_SALE_PRODUCT } from "@/constants/index";
import { Purchase as PurchaseType, PAYMENT_STATUS } from "@/lib/type";
import { formatPrice, formatPaymentStatus } from "@/utils/string-utils";

const PurchaseDetailPage = async ({ params }: { params: { id: string } }) => {
  const response = await getOnePurchase(parseInt(params.id));
  const purchase: PurchaseType | null = response.data;

  if (!purchase) {
    return <DetailsNotFound pageName="purchase" callbackUrl="/purchase" />;
  }

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

  const getPreparedDataProducts = (purchase: PurchaseType) => {
    return purchase.productPurchases.map((item, key) => {
      const quantity = item.quantity;
      const price = item.price;
      const company = item.product.company.name;
      const category = item.product.category.name;
      const model = item.product.model;
      return {
        key: key + 1,
        quantity,
        price,
        company,
        category,
        model,
      };
    });
  };

  return (
    <DetailWrapper
      title={"Purchase Record Information"}
      description={"Here is the complete information about the purchase."}
    >
      <div className="flex justify-end mt-10">
        <RedirectButton
          redirectionUrl={{
            pathname: `/purchase/edit/${purchase.id}`,
          }}
          label="Edit Purchase"
        />
      </div>
      <div className=" flex justify-between items-center mt-5 shadow rounded-md bg-white px-3 py-5">
        <div className="flex gap-2 items-end">
          <h1 className="text-5xl font-bold">
            Rs. {formatPrice(purchase.totalAmount)}{" "}
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
          Purchase date:{" "}
          <span className="font-semibold text-sm">
            {purchase.date.toDateString()}
          </span>
        </div>
      </div>
      <div className="mt-10">
        <h2 className="text-sm text-gray-600">Products Information</h2>
        <div className="mt-4 overflow-x-auto rounded-md">
          <table className="table-auto w-full text-left whitespace-no-wrap">
            <TableHeader columns={TABLE_HEADER_SALE_PRODUCT} />
            <TableBody
              columns={TABLE_HEADER_SALE_PRODUCT}
              data={getPreparedDataProducts(purchase)}
            />
          </table>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-sm text-gray-600">Payment Information</h2>
        <div className="mt-4 grid grid-cols-1 gap-x-3 gap-y-4 sm:grid-cols-2">
          <div className="bg-white shadow rounded-md p-4">
            <p className="text-sm font-medium text-gray-500">Total Amount</p>
            <p className="text-lg font-semibold text-gray-900">
              {formatPrice(purchase.totalAmount)}
            </p>
          </div>

          <div className="bg-white shadow rounded-md p-4">
            <p className="text-sm font-medium text-gray-500">Paid Amount</p>
            <p className="text-lg font-semibold text-gray-900">
              {formatPrice(purchase.paidAmount)}
            </p>
          </div>
          <div className="bg-white shadow rounded-md p-4">
            <p className="text-sm font-medium text-gray-500">
              Remaining Amount
            </p>
            <p
              className={`text-lg font-semibold ${purchase.remainingAmount > 0 ? "text-red-600" : "text-gray-900"}`}
            >
              {formatPrice(purchase.remainingAmount)}
            </p>
          </div>
        </div>
      </div>
    </DetailWrapper>
  );
};

export default PurchaseDetailPage;
