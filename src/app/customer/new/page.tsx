import CustomerForm from "@/components/Forms/customer-form";
const CustomerNew = () => {
  return (
    <div className="max-w-4xl mx-auto px-10 py-10">
      <fieldset className="space-y-12">
        <legend className="text-lg font-semibold leading-7 text-gray-900 border-b border-gray-900/10 pb-4">
          Customer Information
        </legend>
        <p className="mt-1 text-sm leading-6 text-gray-600">
          Let's add a new customer.
        </p>
      </fieldset>
      <CustomerForm />
    </div>
  );
};
export default CustomerNew;
