import React from "react";
import DetailsNotFound from "@/components/DetailsNotFound";
import { getOne as getOneSale } from "@/actions/sale/actions";
import TableHeader from "@/components/Tables/TabelHeader";
import TableBody from "@/components/Tables/TableBody";
import DetailWrapper from "@/components/Wrappers/DetailWrapper";
import CustomerDetailSection from "@/containers/customer-page/CustomerDetailSection";
import InstallmentTable from "@/containers/sale-page/InstallmentTable";
import { TABLE_HEADER_SALE_PRODUCT } from "@/constants/index";
import {
  Sale as SaleType,
  ProductSale as ProductSaleType,
  PAYMENT_STATUS,
  PAYMENT_OPTIONS,
} from "@/lib/type";
import {
  formatPrice,
  formatPaymentStatus,
  formatPaymentOption,
} from "@/utils/string-utils";

const SaleDetailPage = async ({ params }: { params: { id: string } }) => {
  const response = await getOneSale(parseInt(params.id));
  const sale: SaleType | null = response.data;

  if (!sale) {
    return <DetailsNotFound pageName="sale" callbackUrl="/sale" />;
  }

  const getTotalSale = (productSale: ProductSaleType[]) => {
    const totalAmount = productSale.reduce(
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

  const getPreparedDataProducts = (sale: SaleType) => {
    return sale.productSales.map((item, key) => {
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
      title={"Sale Record Information"}
      description={"Here is the complete information about the Sale."}
    >
      <div className=" flex justify-between items-center mt-10 shadow rounded-md bg-white px-3 py-5">
        <div className="flex gap-2 items-end">
          <h1 className="text-5xl font-bold">
            Rs. {formatPrice(getTotalSale(sale.productSales))}{" "}
          </h1>
          <span
            className={`max-h-6 text-xs font-semibold px-2 py-1 rounded-xl flex items-center ${getPaymentStatusClass(
              sale.paymentStatus
            )}`}
          >
            {formatPaymentStatus(sale.paymentStatus)}
          </span>
        </div>
        <div className="text-xs font-light">
          Payment Option:{" "}
          <span className="font-semibold text-sm">
            {formatPaymentOption(sale.paymentOption)}
          </span>
        </div>
      </div>
      <CustomerDetailSection customer={sale.customer} />
      <div className="mt-10">
        <h2 className="text-sm text-gray-600">Products Information</h2>
        <div className="mt-4 overflow-x-auto rounded-md">
          <table className="table-auto w-full text-left whitespace-no-wrap">
            <TableHeader columns={TABLE_HEADER_SALE_PRODUCT} />
            <TableBody
              columns={TABLE_HEADER_SALE_PRODUCT}
              data={getPreparedDataProducts(sale)}
            />
          </table>
        </div>
      </div>
      <div className="mt-10">
        <h2 className="text-sm text-gray-600">Book Record</h2>
        <div className="mt-4 grid grid-cols-1 gap-x-3 gap-y-4 sm:grid-cols-2">
          <div className="bg-white shadow rounded-md p-4">
            <p className="text-sm font-medium text-gray-500">Book Name</p>
            <p className="text-lg font-semibold text-gray-900">
              {sale.bookRecord?.bookName}
            </p>
          </div>
          <div className="bg-white shadow rounded-md p-4">
            <p className="text-sm font-medium text-gray-500">Page Number</p>
            <p className="text-lg font-semibold text-gray-900">
              {sale.bookRecord?.pageNumber}
            </p>
          </div>
          <div className="bg-white shadow rounded-md p-4 col-span-full">
            <p className="text-sm font-medium text-gray-500">Description</p>
            <p className="text-lg font-semibold text-gray-900">
              {sale.bookRecord?.description
                ? sale.bookRecord?.description
                : "No description added"}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-10">
        <h2 className="text-sm text-gray-600">Payment Information</h2>
        {sale.paymentOption === PAYMENT_OPTIONS.FULL_PAYMENT ? (
          <div className="mt-4 grid grid-cols-1 gap-x-3 gap-y-4 sm:grid-cols-2">
            <div className="bg-white shadow rounded-md p-4">
              <p className="text-sm font-medium text-gray-500">Payment</p>
              <p className="text-lg font-semibold text-gray-900">
                {sale.fullPayment?.purchaseAmount
                  ? formatPrice(sale.fullPayment?.purchaseAmount)
                  : 0}
              </p>
            </div>

            <div className="bg-white shadow rounded-md p-4">
              <p className="text-sm font-medium text-gray-500">Discount</p>
              <p className="text-lg font-semibold text-gray-900">
                {sale.fullPayment?.discount ? sale.fullPayment?.discount : 0}
              </p>
            </div>
          </div>
        ) : (
          <div className="w-100">
            <div className="mt-4 grid grid-cols-1 gap-x-3 gap-y-4 sm:grid-cols-2">
              <div className="bg-white shadow rounded-md p-4">
                <p className="text-sm font-medium text-gray-500">Total Price</p>
                <p className="text-lg font-semibold text-gray-900">
                  {sale.installmentPlan?.totalPrice
                    ? formatPrice(sale.installmentPlan?.totalPrice)
                    : 0}
                </p>
              </div>

              <div className="bg-white shadow rounded-md p-4">
                <p className="text-sm font-medium text-gray-500">
                  Remaining Amount
                </p>
                <p className="text-lg font-semibold text-gray-900">
                  {sale.installmentPlan?.remainingPrice
                    ? formatPrice(sale.installmentPlan?.remainingPrice)
                    : 0}
                </p>
              </div>
              <div className="bg-white shadow rounded-md p-4">
                <p className="text-sm font-medium text-gray-500">
                  Down payment
                </p>
                <p className="text-lg font-semibold text-gray-900">
                  {sale.installmentPlan?.downPayment
                    ? formatPrice(sale.installmentPlan?.downPayment)
                    : 0}
                </p>
              </div>
              <div className="bg-white shadow rounded-md p-4">
                <p className="text-sm font-medium text-gray-500">
                  Installment Period
                </p>
                <p className="text-lg font-semibold text-gray-900">
                  {sale.installmentPlan?.installmentPeriod
                    ? sale.installmentPlan?.installmentPeriod
                    : 0}{" "}
                  <span className="text-xs font-light">months</span>
                </p>
              </div>
            </div>
            <InstallmentTable sale={sale} />
          </div>
        )}
      </div>
    </DetailWrapper>
  );
};

export default SaleDetailPage;
