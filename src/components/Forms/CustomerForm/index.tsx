"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import {
  CustomerFormSchema,
  CustomerForm as CustomerFormType,
  Customer as CustomerType,
} from "@/lib/type";
import {
  create as createCustomer,
  update as updateCustomer,
} from "@/actions/customer/actions";

interface CustomerFormProps {
  onSubmitCustomer?: (customer: CustomerType | undefined) => void;
  existingCustomer?: CustomerType;
}

const CustomerForm: React.FC<CustomerFormProps> = ({
  onSubmitCustomer,
  existingCustomer,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    setError,
    clearErrors,
  } = useForm<CustomerFormType>({
    resolver: zodResolver(CustomerFormSchema),
    defaultValues: {
      firstName: existingCustomer?.firstName || "",
      lastName: existingCustomer?.lastName || "",
      CNIC: existingCustomer?.CNIC || "",
      phoneNumber: existingCustomer?.phoneNumber || "",
      address: {
        district: existingCustomer?.address?.district || "",
        tehsil: existingCustomer?.address?.tehsil || "",
        city: existingCustomer?.address?.city || "",
        detail: existingCustomer?.address?.detail || "",
      },
    },
  });

  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const formatCNIC = (value: string) => {
    const cnic = value.replace(/\D/g, "").slice(0, 13);
    if (cnic.length <= 5) return cnic;
    if (cnic.length <= 13) return `${cnic.slice(0, 5)}-${cnic.slice(5)}`;
    return `${cnic.slice(0, 5)}-${cnic.slice(5, 12)}${cnic.slice(12)}`;
  };

  const formatPhoneNumber = (value: string) => {
    const phone = value.replace(/\D/g, "").slice(0, 11);
    if (phone.length <= 4) return phone;
    return `${phone.slice(0, 4)}-${phone.slice(4)}`;
  };

  const handleCNICChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    const formattedCNIC = formatCNIC(value);
    setValue("CNIC", formattedCNIC);
    if (/^\d{5}-\d{8}$/.test(formattedCNIC)) {
      clearErrors("CNIC");
    }
  };

  const handlePhoneNumberChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.target;
    const formattedPhoneNumber = formatPhoneNumber(value);
    setValue("phoneNumber", formattedPhoneNumber);
    if (/^\d{4}-\d{7}$/.test(formattedPhoneNumber)) {
      clearErrors("phoneNumber");
    }
  };

  const createNewCustomer = async (data: CustomerFormType) => {
    setLoading(true);
    const result = CustomerFormSchema.safeParse(data);
    if (!result.success) {
      console.error(result.error);
      result.error.issues.forEach((issue) => {
        setError(issue.path[0] as keyof CustomerFormType, {
          type: "manual",
          message: issue.message,
        });
      });
      setLoading(false);
      return;
    }
    const response = await createCustomer(result.data);
    if (response.status === 201) {
      toast.success(response.message);
      if (onSubmitCustomer) {
        onSubmitCustomer(response?.data);
      } else {
        router.push("/customer");
      }
    } else {
      toast.error(response.message);
    }
    setLoading(false);
  };

  const updateExistingCustomer = async (data: CustomerFormType) => {
    if (existingCustomer) {
      setLoading(true);
      const result = CustomerFormSchema.safeParse(data);
      if (!result.success) {
        console.error(result.error);
        result.error.issues.forEach((issue) => {
          setError(issue.path[0] as keyof CustomerFormType, {
            type: "manual",
            message: issue.message,
          });
        });
        setLoading(false);
        return;
      }
      const payload = {
        id: existingCustomer?.id,
        updatedCustomer: result.data,
      };
      const response = await updateCustomer(payload);
      if (response.status === 200) {
        toast.success(response.message);
        setLoading(false);
        router.push(`/customer/${existingCustomer?.id}`);
      } else {
        toast.error(response.message);
      }
    }
  };
  const onSubmit = async (data: CustomerFormType) => {
    if (existingCustomer) {
      await updateExistingCustomer(data);
    } else {
      await createNewCustomer(data);
    }
  };

  return (
    <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
      <fieldset className="space-y-12">
        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <label
              htmlFor="firstName"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Firstname
            </label>
            <div className="mt-2">
              <input
                type="text"
                id="firstName"
                placeholder="Ahmad"
                {...register("firstName")}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-zinc-950 sm:text-sm sm:leading-6"
              />
            </div>
            {errors.firstName && (
              <span className="text-red-500 text-xs italic">
                {errors.firstName.message}
              </span>
            )}
          </div>
          <div className="sm:col-span-3">
            <label
              htmlFor="lastName"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Lastname
            </label>
            <div className="mt-2">
              <input
                type="text"
                id="lastName"
                {...register("lastName")}
                placeholder="Optional"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-zinc-950 sm:text-sm sm:leading-6"
              />
            </div>
            {errors.lastName && (
              <span className="text-red-500 text-xs italic">
                {errors.lastName.message}
              </span>
            )}
          </div>
          <div className="sm:col-span-3">
            <label
              htmlFor="CNIC"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              CNIC
            </label>
            <div className="mt-2">
              <input
                type="text"
                id="CNIC"
                placeholder="XXXXX-XXXXXXX"
                {...register("CNIC")}
                onChange={handleCNICChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-zinc-950 sm:text-sm sm:leading-6"
              />
            </div>
            {errors.CNIC && (
              <span className="text-red-500 text-xs italic">
                {errors.CNIC.message}
              </span>
            )}
          </div>
          <div className="sm:col-span-3">
            <label
              htmlFor="phoneNumber"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Phone Number
            </label>
            <div className="mt-2">
              <input
                type="text"
                id="phoneNumber"
                placeholder="0300-1234123"
                {...register("phoneNumber")}
                onChange={handlePhoneNumberChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-zinc-950 sm:text-sm sm:leading-6"
              />
            </div>
            {errors.phoneNumber && (
              <span className="text-red-500 text-xs italic">
                {errors.phoneNumber.message}
              </span>
            )}
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="district"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              District
            </label>
            <div className="mt-2">
              <input
                type="text"
                id="district"
                {...register("address.district")}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-zinc-950 sm:text-sm sm:leading-6"
              />
            </div>
            {errors.address?.district && (
              <span className="text-red-500 text-xs italic">
                {errors.address.district.message}
              </span>
            )}
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="tehsil"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Tehsil
            </label>
            <div className="mt-2">
              <input
                type="text"
                id="tehsil"
                {...register("address.tehsil")}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-zinc-950 sm:text-sm sm:leading-6"
              />
            </div>
            {errors.address?.tehsil && (
              <span className="text-red-500 text-xs italic">
                {errors.address.tehsil.message}
              </span>
            )}
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="city"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              City
            </label>
            <div className="mt-2">
              <input
                type="text"
                id="city"
                {...register("address.city")}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-zinc-950 sm:text-sm sm:leading-6"
              />
            </div>
            {errors.address?.city && (
              <span className="text-red-500 text-xs italic">
                {errors.address.city.message}
              </span>
            )}
          </div>
          <div className="sm:col-span-6">
            <label
              htmlFor="addressDetails"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Address details
            </label>
            <div className="mt-2">
              <input
                type="text"
                id="addressDetails"
                {...register("address.detail")}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-zinc-950 sm:text-sm sm:leading-6"
              />
            </div>
            {errors.address?.detail && (
              <span className="text-red-500 text-xs italic">
                {errors.address.detail.message}
              </span>
            )}
          </div>
        </div>
      </fieldset>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <Link
          href={"/customer"}
          className="text-sm font-semibold leading-6 text-gray-900 "
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-neutral-950 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
};

export default CustomerForm;
