"use client";
import { useState, useEffect } from "react";
import TableHeader from "@/components/Tables/table-header";
import TableBody from "@/components/Tables/table-body";
import { getAll as getAllProducts } from "@/actions/product/actions";
import Link from "next/link";

const TABLE_HEADER = [
  { key: "company", label: "Company" },
  { key: "category", label: "Category" },
  { key: "model", label: "Model" },
  { key: "price", label: "Price" },
  { key: "stock", label: "Stock" },
  { key: "Purchases", label: "Purchases" },
];
interface Product {
  id: number;
  model: string;
  price: number;
  stock: number;
  description: string | null;
  companyId: number;
  categoryId: number;
  createdAt: Date;
  updatedAt: Date;
  company: string;
  category: string;
}

interface ProductResponse {
  pagination: {
    totalCount: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  };
  products: Product[];
}

export default function Product() {
  const [page, setPage] = useState<number>(1);
  const [data, setData] = useState<ProductResponse | null>(null);
  const pageSize = 10;

  const fetchData = async (page: number) => {
    const response = await getAllProducts(page, pageSize);
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

  return (
    <div>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold leading-7 text-zinc-900">
          All Products
        </h3>
        <Link
          href={"/product/new"}
          className="rounded-md bg-zinc-800 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-zinc-700"
        >
          Add New Product
        </Link>
      </div>

      <hr className="h-px my-4 bg-gray-300 border-0"></hr>
      <div className="overflow-x-auto rounded-md">
        <table className="table-auto w-full text-left whitespace-no-wrap">
          <TableHeader columns={TABLE_HEADER} />
          <TableBody columns={TABLE_HEADER} data={data.products} />
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
