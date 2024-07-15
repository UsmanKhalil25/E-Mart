"use client";
import { useState, useEffect } from "react";
import TableHeader from "@/components/Tables/TabelHeader";
import TableBody from "@/components/Tables/TableBody";
import { getAll as getAllPurchases } from "@/actions/purchase/actions";
import { Purchase as PurchaseType } from "@/lib/type";
import { TABLE_HEADER_PURCHASES as TABLE_HEADER } from "@/constants/index";
import { formatPaymentStatus } from "@/utils/string-utils";
interface PurchaseResponse {
  pagination: {
    totalCount: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  };
  purchases: PurchaseType[];
}

const PurchaseTable = () => {
  const [page, setPage] = useState<number>(1);
  const [data, setData] = useState<PurchaseResponse | null>(null);
  const pageSize = 10;

  const fetchData = async (page: number) => {
    const response = await getAllPurchases(page, pageSize);
    setData(response);
  };
  useEffect(() => {
    fetchData(page);
  }, [page]);

  if (!data) {
    return <div>Loading...</div>;
  }

  const handleNextPage = () => {
    if (page < data.pagination.totalPages) {
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };
  const getPreparedDataPurchases = (purchases: PurchaseType[]) => {
    return purchases.map((purchase) => {
      return {
        id: purchase.id,
        companyName: purchase.company.name,
        paymentStatus: formatPaymentStatus(purchase.paymentStatus),
        totalAmount: purchase.totalAmount,
        paidAmount: purchase.paidAmount,
        numberOfProducts: purchase.productPurchases.reduce(
          (total, item) => total + item.quantity,
          0
        ),
      };
    });
  };
  return (
    <div>
      <div className="overflow-x-auto rounded-md">
        <table className="table-auto w-full text-left whitespace-no-wrap">
          <TableHeader columns={TABLE_HEADER} />
          <TableBody
            columns={TABLE_HEADER}
            data={getPreparedDataPurchases(data.purchases)}
            redirectionUrl={{ pathname: "/purchase" }}
          />
        </table>
      </div>

      <div className="flex justify-between items-center mt-4">
        <span className="text-xs font-semibold">
          Page {page} of {data.pagination.totalPages}
        </span>
        <div className="flex gap-2 items-center">
          <button
            onClick={handlePrevPage}
            disabled={page === 1}
            className="rounded-md bg-zinc-900 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-zinc-700 disabled:bg-zinc-500"
          >
            Previous
          </button>
          <button
            onClick={handleNextPage}
            disabled={page === data.pagination.totalPages}
            className="rounded-md bg-zinc-900 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-zinc-700 disabled:bg-zinc-500"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default PurchaseTable;
