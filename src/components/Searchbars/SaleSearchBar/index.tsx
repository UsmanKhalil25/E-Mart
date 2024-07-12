"use client";
import React, { FormEvent, useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { search as searchSale } from "@/actions/sale/actions";
import { Sale as SaleType } from "@/lib/type";
import {
  formatPaymentOption,
  formatPaymentStatus,
  formatPrice,
} from "@/utils/string-utils";

const USER_FIELDS = [
  {
    id: "firstName",
    label: "Firstname",
  },
  {
    id: "phoneNumber",
    label: "Phone Number",
  },
  {
    id: "CNIC",
    label: "CNIC",
  },
];

const SaleSearchBar = ({}) => {
  const router = useRouter();
  const [selectedField, setSelectedField] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sales, setSales] = useState<SaleType[] | undefined>(undefined);

  const handleFieldChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedField(event.target.value);
  };

  const handleSelectSale = (sale: SaleType) => {
    setSelectedField("");
    setSearchQuery("");
    setSales(undefined);
    router.push(`/sale/${sale.id}`);
  };

  const handleSearch = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedField || !searchQuery) {
      return;
    }
    try {
      const response = await searchSale({
        field: selectedField,
        query: searchQuery,
      });
      if (response.status === 200) {
        const salesData: SaleType[] = response.data;
        setSales(salesData);
      }
    } catch (error) {
      console.error("Error searching Sales:", error);
    }
  };

  return (
    <form onSubmit={handleSearch} className="w-full">
      <div className="flex items-center">
        <div className="relative w-1/3">
          <select
            value={selectedField}
            onChange={handleFieldChange}
            required
            className="block border-2 border-zinc-800 w-full py-2.5 px-4 text-sm font-semibold text-white bg-zinc-900 rounded-s-lg focus:outline-none focus:ring-2 focus:ring-inset focus:ring-zinc-950"
          >
            <option value="" disabled>
              Search Fields
            </option>
            {USER_FIELDS.map((field) => (
              <option key={field.id} value={field.id}>
                {field.label}
              </option>
            ))}
          </select>
        </div>
        <div className="relative w-2/3">
          <input
            type="search"
            className="block border-0 w-full py-3 px-4 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-zinc-950"
            placeholder="Search Sale"
            required
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            type="submit"
            className="absolute top-0 end-0 p-2.5 font-medium h-full text-white bg-zinc-900 rounded-e-lg hover:bg-neutral-900"
          >
            <svg
              className="w-4 h-4"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </button>
        </div>
      </div>

      {sales && sales.length > 0 && (
        <div className="mt-4">
          <h2 className="text-sm font-semibold mb-2">Sales Found:</h2>
          <ul className="space-y-2 max-h-40 overflow-y-auto">
            {sales.map((sale) => (
              <li
                onClick={() => handleSelectSale(sale)}
                key={sale.id}
                className="bg-white hover:bg-white/10 cursor-pointer rounded-lg shadow-md py-2 px-4 flex items-center justify-between max-h-36 overflow-y-auto"
              >
                <div>
                  <p className="text-gray-900 font-semibold text-sm">
                    Payment Option: {formatPaymentOption(sale.paymentOption)}
                  </p>
                  <p className="text-gray-900 font-semibold text-sm">
                    Payment Status: {formatPaymentStatus(sale.paymentStatus)}
                  </p>
                  <p className="text-gray-900 font-semibold text-sm">
                    Payment Amont:{" "}
                    {formatPrice(
                      sale.productSales.reduce(
                        (total, item) => total + item.price,
                        0
                      )
                    )}
                  </p>
                  {selectedField === "firstName" && (
                    <p className="text-gray-700 text-xs">
                      Name: {sale.customer.firstName}
                    </p>
                  )}
                  {selectedField === "CNIC" && (
                    <p className="text-gray-700 text-xs">
                      CNIC: {sale.customer.CNIC}
                    </p>
                  )}
                  {selectedField === "phoneNumber" && (
                    <p className="text-gray-700 text-xs">
                      Phone: {sale.customer.phoneNumber}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      {!sales ||
        (sales.length === 0 && (
          <div className="mt-4">
            {
              <p className="text-red-500 text-sm font-semibold">
                No Sales found.
              </p>
            }
          </div>
        ))}
    </form>
  );
};

export default SaleSearchBar;
