"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import TableHeader from "@/components/Tables/table-header";
import TableBody from "@/components/Tables/table-body";
import { getAll as getAllPurchases } from "@/actions/purchase/actions";
import { PAYMENT_OPTIONS, PAYMENT_STATUS } from "@/lib/type";
import Link from "next/link";

const TABLE_HEADER = [
  { key: "customerName", label: "Customer Name" },
  { key: "customerPhoneNumber", label: "Customer Phone Number" },
  { key: "paymentOption", label: "Payment Option" },
  { key: "paymentStatus", label: "Payment Status" },
  { key: "totalAmount", label: "Total Amount" },
  { key: "numberOfProducts", label: "Number of Product" },
];
interface PurchaseAllType {
  customerName: string;
  customerPhoneNumber: string;
  paymentOption: PAYMENT_OPTIONS;
  paymentStatus: PAYMENT_STATUS;
  totalAmount: number;
  numberOfProducts: number;
}

interface PurchaseResponse {
  pagination: {
    totalCount: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  };
  purchases: PurchaseAllType[];
}

export default function Purchase() {
  const [page, setPage] = useState<number>(1);
  const [data, setData] = useState<PurchaseResponse | null>(null);
  const pageSize = 10;

  const fetchData = async (page: number) => {
    const response = await getAllPurchases(page, pageSize);
    if (response.status === 200) {
      setData(response.data);
    } else {
      toast.error(response.message);
    }
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

  return (
    <div>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold leading-7 text-zinc-900">
          All purchases
        </h3>
        <Link
          href={"/purchase/new"}
          className="rounded-md bg-zinc-800 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-zinc-700"
        >
          Add New Purchase
        </Link>
      </div>

      <hr className="h-px my-4 bg-gray-300 border-0"></hr>
      <div className="overflow-x-auto rounded-md">
        <table className="table-auto w-full text-left whitespace-no-wrap">
          <TableHeader columns={TABLE_HEADER} />
          <TableBody columns={TABLE_HEADER} data={data.purchases} />
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
            className="rounded-md bg-zinc-800 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-zinc-700 disabled:bg-zinc-500"
          >
            Previous
          </button>
          <button
            onClick={handleNextPage}
            disabled={page === data.pagination.totalPages}
            className="rounded-md bg-zinc-800 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-zinc-700 disabled:bg-zinc-500"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
