import { Customer as CustomerType } from "@/lib/type";
import RedirectButton from "@/components/Buttons/RedirectButton";
interface CustomerDetailSectionProps {
  customer: CustomerType;
  showEditButton?: boolean;
}
const CustomerDetailSection: React.FC<CustomerDetailSectionProps> = ({
  customer,
  showEditButton,
}) => {
  return (
    <section className="mt-10">
      <div className="flex justify-between items-center">
        <h2 className="text-sm text-gray-600">Customer Information</h2>
        {showEditButton && (
          <RedirectButton
            redirectionUrl={`/customer/edit/${customer.id}`}
            label={"Edit Customer"}
          />
        )}
      </div>
      <div className="mt-4 grid grid-cols-1 gap-x-3 gap-y-4 sm:grid-cols-2">
        <div className="bg-white shadow rounded-md p-4">
          <p className="text-sm font-medium text-gray-500">Name</p>
          <p className="text-lg font-semibold text-gray-900">
            {customer.firstName + " " + customer.lastName}
          </p>
        </div>

        <div className="bg-white shadow rounded-md p-4">
          <p className="text-sm font-medium text-gray-500">Phone Number</p>
          <p className="text-lg font-semibold text-gray-900">
            {customer.phoneNumber}
          </p>
        </div>
        <div className="bg-white shadow rounded-md p-4">
          <p className="text-sm font-medium text-gray-500">CNIC</p>
          <p className="text-lg font-semibold text-gray-900">{customer.CNIC}</p>
        </div>
        <div className="bg-white shadow rounded-md p-4">
          <p className="text-sm font-medium text-gray-500">City</p>
          <p className="text-lg font-semibold text-gray-900">
            {customer.address?.city}
          </p>
        </div>
        <div className="bg-white shadow rounded-md p-4">
          <p className="text-sm font-medium text-gray-500">Tehsil</p>
          <p className="text-lg font-semibold text-gray-900">
            {customer.address?.tehsil}
          </p>
        </div>
        <div className="bg-white shadow rounded-md p-4">
          <p className="text-sm font-medium text-gray-500">District</p>
          <p className="text-lg font-semibold text-gray-900">
            {customer.address?.district}
          </p>
        </div>
        <div className="bg-white shadow rounded-md p-4 col-span-full">
          <p className="text-sm font-medium text-gray-500">Address details</p>
          <p className="text-lg font-semibold text-gray-900">
            {customer.address?.detail}
          </p>
        </div>
      </div>
    </section>
  );
};
export default CustomerDetailSection;
