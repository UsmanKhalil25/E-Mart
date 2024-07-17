import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  InstallmentPlanFormSchema,
  InstallmentPlanForm as InstallmentPlanFormType,
} from "@/lib/type";
import { formatPrice } from "@/utils/string-utils";

interface InstallmentPlanFormProps {
  totalPayment?: number;
  onInstallmentAdd: (data: InstallmentPlanFormType) => void;
}

const InstallmentPlanForm: React.FC<InstallmentPlanFormProps> = ({
  totalPayment,
  onInstallmentAdd,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<InstallmentPlanFormType>({
    resolver: zodResolver(InstallmentPlanFormSchema),
    defaultValues: {
      totalPrice: totalPayment,
      downPayment: 0,
      expectedPayment: 10000,
    },
  });

  const [formattedTotalPrice, setFormattedTotalPrice] = useState<string>("");
  const [formattedDownPayment, setFormattedDownPayment] = useState<string>("");
  const [formattedExpectedPayment, setFormattedExpectedPayment] =
    useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    const subscription = watch((value) => {
      const totalPrice = value.totalPrice ?? 0;
      const downPayment = value.downPayment ?? 0;
      const expectedPayment = value.expectedPayment ?? 0;
      setFormattedTotalPrice(formatPrice(totalPrice));
      setFormattedDownPayment(formatPrice(downPayment));
      setFormattedExpectedPayment(formatPrice(expectedPayment));

      return () => subscription.unsubscribe();
    });
  }, [watch]);
  useEffect(() => {
    if (totalPayment !== undefined) {
      setValue("totalPrice", totalPayment);
    }
  }, [totalPayment, setValue]);

  const onSubmit = (data: InstallmentPlanFormType) => {
    setIsSubmitting(true);
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
          {formattedTotalPrice && (
            <div className="mt-1 text-sm text-gray-500">
              Rupees: {formattedTotalPrice}
            </div>
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
          {formattedDownPayment && (
            <div className="mt-1 text-sm text-gray-500">
              Rupees: {formattedDownPayment}
            </div>
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
            htmlFor="expectedPayment"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Expected payment for next installment
          </label>
          <div className="mt-2">
            <input
              type="number"
              id="expectedPayment"
              {...register("expectedPayment", { valueAsNumber: true })}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-zinc-950 sm:text-sm sm:leading-6"
            />
          </div>
          {errors.expectedPayment && (
            <span className="text-red-500 text-xs italic">
              {errors.expectedPayment.message}
            </span>
          )}
          {formattedExpectedPayment && (
            <div className="mt-1 text-sm text-gray-500">
              Rupees: {formattedExpectedPayment}
            </div>
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
      {!isSubmitting && (
        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            type="submit"
            className="rounded-md bg-neutral-900 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-neutral-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            Add Installment
          </button>
        </div>
      )}
    </form>
  );
};

export default InstallmentPlanForm;
