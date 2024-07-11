"use client";
import { useState, useEffect } from "react";
import TableHeader from "@/components/Tables/TabelHeader";
import TableBody from "@/components/Tables/TableBody";
import { getAll as getAllProducts } from "@/actions/product/actions";
import { Product as ProductType } from "@/lib/type";
import { TABLE_HEADER_PRODUCT as TABLE_HEADER } from "@/constants/index";

interface ProductResponse {
  pagination: {
    totalCount: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  };
  products: ProductType[];
}

const ProductTable = () => {
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
  const getPreparedDataProducts = (products: ProductType[]) => {
    return products.map((product) => {
      return {
        ...product,
        company: product.company.name,
        category: product.category.name,
        sales: product.productSales.reduce(
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
            data={getPreparedDataProducts(data.products)}
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

export default ProductTable;
