"use client";
import React, { FormEvent, useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { search as searchCustomer } from "@/actions/customer/actions";
import { Customer } from "@/lib/type";

const USER_FIELDS = [
  {
    id: "firstName",
    label: "Firstname",
  },
  {
    id: "phoneNumber",
    label: "Phone Number",
  },
];

interface CustomerSearchBarProps {
  onCustomerSelected?: (customer: Customer) => void;
}

const CustomerSearchBar: React.FC<CustomerSearchBarProps> = ({
  onCustomerSelected,
}) => {
  const router = useRouter();
  const [selectedField, setSelectedField] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [customers, setCustomers] = useState<Customer[] | undefined>(undefined);

  const formatPhoneNumber = (value: string) => {
    const phone = value.replace(/\D/g, "").slice(0, 11);
    if (phone.length <= 4) return phone;
    return `${phone.slice(0, 4)}-${phone.slice(4)}`;
  };

  const handleFieldChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedField(event.target.value);
    setSearchQuery("");
    setCustomers(undefined);
  };

  const handleSearchQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value;

    if (selectedField === "phoneNumber") {
      setSearchQuery(formatPhoneNumber(value));
    } else if (selectedField === "firstName") {
      setSearchQuery(value);
    }
  };

  const handleSelectCustomer = (customer: Customer) => {
    setSelectedField("");
    setSearchQuery("");
    setCustomers(undefined);
    onCustomerSelected
      ? onCustomerSelected(customer)
      : router.push(`/customer/${customer.id}`);
  };

  const handleSearch = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedField || !searchQuery) {
      return;
    }

    try {
      const response = await searchCustomer({
        field: selectedField,
        query: searchQuery,
      });
      if (response.status === 200) {
        const customerData: Customer[] = response.data;
        setCustomers(customerData);
      }
    } catch (error) {
      console.error("Error searching customers:", error);
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
            placeholder="Search customer"
            required
            value={searchQuery}
            onChange={handleSearchQueryChange}
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

      {customers && customers.length > 0 && (
        <div className="mt-4">
          <h2 className="text-sm font-semibold mb-2">Customers Found:</h2>
          <ul className="space-y-2 max-h-40 overflow-y-auto">
            {customers.map((customer) => (
              <li
                onClick={() => handleSelectCustomer(customer)}
                key={customer.id}
                className="bg-white hover:bg-white/10 cursor-pointer rounded-lg shadow-md py-2 px-4 flex items-center justify-between max-h-36 overflow-y-auto"
              >
                <div>
                  <p className="text-gray-900 font-semibold text-sm">
                    Name: {customer.firstName}
                  </p>
                  <p className="text-gray-700 text-xs">
                    Phone: {customer.phoneNumber}
                  </p>
                  <p className="text-gray-700 text-xs">CNIC: {customer.CNIC}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      {!customers ||
        (customers.length === 0 && (
          <div className="mt-4">
            {
              <p className="text-red-500 text-sm font-semibold">
                No customers found.
              </p>
            }
          </div>
        ))}
    </form>
  );
};

export default CustomerSearchBar;
