import TableHeader from "@/components/Tables/table-header";
import TableBody from "@/components/Tables/table-body";
import { getAll as getAllCustomers } from "@/actions/customer/actions";
import Link from "next/link";
const TABLE_HEADER = [
  { key: "name", label: "Name" },
  { key: "phoneNumber", label: "Phone Number" },
  { key: "CNIC", label: "CNIC" },
  { key: "city", label: "City" },
  { key: "detail", label: "Address details" },
];
const Customer = async () => {
  const customers = await getAllCustomers();

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
        <table className="table-auto w-full text-left whitespace-no-wrap ">
          <TableHeader columns={TABLE_HEADER} />
          <TableBody columns={TABLE_HEADER} data={customers} />
        </table>
      </div>
    </div>
  );
};

export default Customer;
