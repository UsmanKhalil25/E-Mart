import React, { FormEvent, useState, ChangeEvent } from "react";
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
  {
    id: "CNIC",
    label: "CNIC",
  },
];

interface CustomerSearchBarProps {
  onCustomerSelected: (customer: Customer) => void;
}

const CustomerSearchBar: React.FC<CustomerSearchBarProps> = ({
  onCustomerSelected,
}) => {
  const [selectedField, setSelectedField] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [customers, setCustomers] = useState<Customer[] | undefined>(undefined);

  const handleFieldChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedField(event.target.value);
  };

  const handleSelectCustomer = (customer: Customer) => {
    setSelectedField("");
    setSearchQuery("");
    setCustomers(undefined);
    onCustomerSelected(customer);
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
    <form onSubmit={handleSearch} className="max-w-xl mr-auto">
      <div className="flex items-center">
        <div className="relative w-1/3">
          <select
            value={selectedField}
            onChange={handleFieldChange}
            required
            className="block border-2 border-zinc-950 w-full py-2.5 px-4 text-sm font-semibold text-white bg-neutral-950 rounded-s-lg focus:outline-none focus:ring-2 focus:ring-inset focus:ring-zinc-950"
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
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            type="submit"
            className="absolute top-0 end-0 p-2.5 font-medium h-full text-white bg-neutral-950 rounded-e-lg hover:bg-neutral-900"
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
          <ul className="space-y-2">
            {customers.map((customer) => (
              <li
                onClick={() => handleSelectCustomer(customer)}
                key={customer.id}
                className="bg-white hover:bg-white/10 cursor-pointer rounded-lg shadow-md py-2 px-4 flex items-center justify-between max-h-36 overflow-y-auto"
              >
                <div>
                  <p className="text-gray-900 font-semibold text-sm">
                    CNIC: {customer.CNIC}
                  </p>
                  <p className="text-gray-700 text-xs">
                    Name: {customer.firstName}
                  </p>
                  <p className="text-gray-700 text-xs">
                    Phone: {customer.phoneNumber}
                  </p>
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
