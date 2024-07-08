import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  InstallmentFormSchema,
  InstallmentForm as InstallmentFormType,
} from "@/lib/type";
import React, { useEffect } from "react";

interface InstallmentFormProps {
  totalPayment?: number;
  isSubmitting: boolean;
  onInstallmentAdd: (data: InstallmentFormType) => void;
}

const InstallmentForm: React.FC<InstallmentFormProps> = ({
  totalPayment,
  isSubmitting,
  onInstallmentAdd,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<InstallmentFormType>({
    resolver: zodResolver(InstallmentFormSchema),
    defaultValues: {
      totalPrice: totalPayment,
    },
  });

  useEffect(() => {
    if (totalPayment !== undefined) {
      setValue("totalPrice", totalPayment);
    }
  }, [totalPayment, setValue]);

  const onSubmit = (data: InstallmentFormType) => {
    onInstallmentAdd(data);
  };

  return (
    <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        <div className="sm:col-span-3">
          <label
            htmlFor="totalPrice"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Total Price
          </label>
          <div className="mt-2">
            <input
              type="number"
              id="totalPrice"
              {...register("totalPrice", { valueAsNumber: true })}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-zinc-950 sm:text-sm sm:leading-6"
            />
          </div>
          {errors.totalPrice && (
            <span className="text-red-500 text-xs italic">
              {errors.totalPrice.message}
            </span>
          )}
        </div>
        <div className="sm:col-span-3">
          <label
            htmlFor="downPayment"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Down Payment
          </label>
          <div className="mt-2">
            <input
              type="number"
              id="downPayment"
              {...register("downPayment", { valueAsNumber: true })}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-zinc-950 sm:text-sm sm:leading-6"
            />
          </div>
          {errors.downPayment && (
            <span className="text-red-500 text-xs italic">
              {errors.downPayment.message}
            </span>
          )}
        </div>
        <div className="sm:col-span-3">
          <label
            htmlFor="dueDate"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Next Installment Due Date
          </label>
          <div className="mt-2">
            <input
              type="date"
              id="dueDate"
              {...register("dueDate")}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-zinc-950 sm:text-sm sm:leading-6"
            />
          </div>
          {errors.dueDate && (
            <span className="text-red-500 text-xs italic">
              {errors.dueDate.message}
            </span>
          )}
        </div>
        <div className="sm:col-span-3">
          <label
            htmlFor="installmentPeriod"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Installment Period
          </label>
          <div className="mt-2">
            <input
              type="number"
              id="installmentPeriod"
              placeholder="In months"
              {...register("installmentPeriod", { valueAsNumber: true })}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-zinc-950 sm:text-sm sm:leading-6"
            />
          </div>
          {errors.installmentPeriod && (
            <span className="text-red-500 text-xs italic">
              {errors.installmentPeriod.message}
            </span>
          )}
        </div>
      </div>
      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-neutral-950 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          {isSubmitting ? "Adding..." : "Add Installment"}
        </button>
      </div>
    </form>
  );
};

export default InstallmentForm;
