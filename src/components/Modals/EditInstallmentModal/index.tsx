import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  InstallmentFormSchema as InstallmentFormSchemaType,
  InstallmentForm as InstallmentFormType,
  Installment as InstallmentType,
} from "@/lib/type";
import { formatPrice, formatDate } from "@/utils/string-utils";

interface EditInstallmentModalProps {
  existingInstallment: InstallmentType;
}

const EditInstallmentModal: React.FC<EditInstallmentModalProps> = ({
  existingInstallment,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<InstallmentFormType>({
    resolver: zodResolver(InstallmentFormSchemaType),
    defaultValues: {
      expectedPayment: existingInstallment.expectedPayment,
      actualPayment: existingInstallment.actualPayment ?? 0,
      dueDate: formatDate(existingInstallment.dueDate),
      paidAt: existingInstallment.paidAt
        ? formatDate(existingInstallment.paidAt)
        : "",
    },
  });

  const [formattedActualPayment, setFormattedActualPayment] =
    useState<string>("");
  const [formattedExpectedPayment, setFormattedExpectedPayment] =
    useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  useEffect(() => {
    const subscription = watch((value) => {
      const actualPayment = value.actualPayment ?? 0;
      const expectedPayment = value.expectedPayment ?? 0;
      setFormattedActualPayment(formatPrice(actualPayment));
      setFormattedExpectedPayment(formatPrice(expectedPayment));

      return () => subscription.unsubscribe();
    });
  }, [watch]);

  const onSubmit = (data: InstallmentFormType) => {
    setIsSubmitting(true);
  };

  return (
    <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        <div className="sm:col-span-3">
          <label
            htmlFor="expectedPayment"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Expected Payment
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
            htmlFor="actualPayment"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Actual Payment
          </label>
          <div className="mt-2">
            <input
              type="number"
              id="actualPayment"
              {...register("actualPayment", { valueAsNumber: true })}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-zinc-950 sm:text-sm sm:leading-6"
            />
          </div>
          {errors.actualPayment && (
            <span className="text-red-500 text-xs italic">
              {errors.actualPayment.message}
            </span>
          )}
          {formattedActualPayment && (
            <div className="mt-1 text-sm text-gray-500">
              Rupees: {formattedActualPayment}
            </div>
          )}
        </div>
        <div className="sm:col-span-3">
          <label
            htmlFor="dueDate"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Due Date
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
            htmlFor="paidAt"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Paid at
          </label>
          <div className="mt-2">
            <input
              type="date"
              id="paidAt"
              {...register("paidAt")}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-zinc-950 sm:text-sm sm:leading-6"
            />
          </div>
          {errors.paidAt && (
            <span className="text-red-500 text-xs italic">
              {errors.paidAt.message}
            </span>
          )}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          disabled={isSubmitting}
          type="submit"
          className="rounded-md bg-neutral-900 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-neutral-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          Edit Installment
        </button>
      </div>
    </form>
  );
};

export default EditInstallmentModal;
