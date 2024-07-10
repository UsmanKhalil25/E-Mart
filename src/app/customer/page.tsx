"use client";
import { useState, useEffect } from "react";
import TableHeader from "@/components/Tables/table-header";
import TableBody from "@/components/Tables/table-body";
import { getAll as getAllCustomers } from "@/actions/customer/actions";
import Link from "next/link";
import { Customer as CustomerType } from "@/lib/type";
import { TABLE_HEADER_CUSTOMER as TABLE_HEADER } from "@/constants/index";

interface CustomerResponse {
  pagination: {
    totalCount: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  };
  customers: CustomerType[];
}

export default function CustomerPage() {
  const [page, setPage] = useState<number>(1);
  const [data, setData] = useState<CustomerResponse | null>(null);
  const pageSize = 10;

  const fetchData = async (page: number) => {
    const response = await getAllCustomers(page, pageSize);
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

  const getPreparedDataCustomers = (customers: CustomerType[]) => {
    return customers.map((customer) => {
      return {
        ...customer,
        name: customer.firstName + " " + customer.lastName,
        city: customer.address?.city,
        detail: customer.address?.detail,
      };
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold leading-7 text-zinc-900">
          All Customers
        </h3>
        <Link
          href={"/customer/new"}
          className="rounded-md bg-zinc-800 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-zinc-700"
        >
          Add New Customer
        </Link>
      </div>

      <hr className="h-px my-4 bg-gray-300 border-0"></hr>
      <div className="overflow-x-auto rounded-md">
        <table className="table-auto w-full text-left whitespace-no-wrap">
          <TableHeader columns={TABLE_HEADER} />
          <TableBody
            columns={TABLE_HEADER}
            data={getPreparedDataCustomers(data.customers)}
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
