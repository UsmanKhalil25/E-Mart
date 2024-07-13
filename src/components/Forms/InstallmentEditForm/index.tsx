"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  InstallmentEditFormSchema as InstallmentEditFormSchemaType,
  InstallmentEditForm as InstallmentEditFormType,
  Installment as InstallmentType,
} from "@/lib/type";
import { update as updateInstallment } from "@/actions/installment/actions";
import { formatPrice, formatDate } from "@/utils/string-utils";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
interface InstallmentEditFormProps {
  existingInstallment: InstallmentType;
}

const InstallmentEditForm: React.FC<InstallmentEditFormProps> = ({
  existingInstallment,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
  } = useForm<InstallmentEditFormType>({
    resolver: zodResolver(InstallmentEditFormSchemaType),
    defaultValues: {
      expectedPayment: existingInstallment?.expectedPayment,
      actualPayment: existingInstallment?.actualPayment
        ? existingInstallment.actualPayment
        : 0,
      dueDate: existingInstallment?.dueDate.toISOString().split("T")[0],
      paidAt: existingInstallment?.paidAt
        ? existingInstallment?.paidAt.toISOString().split("T")[0]
        : "",
    },
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const saleId = searchParams.get("saleId");

  const [formattedActualPayment, setFormattedActualPayment] =
    useState<string>("");
  const [formattedExpectedPayment, setFormattedExpectedPayment] =
    useState<string>("");
  const [formattedDueDate, setFormattedDueDate] = useState<string>("");
  const [formattedPaidAt, setFormattedPaidAt] = useState<string>("");

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    const subscription = watch((value) => {
      const actualPayment = value.actualPayment ?? 0;
      const expectedPayment = value.expectedPayment ?? 0;
      setFormattedActualPayment(formatPrice(actualPayment));
      setFormattedExpectedPayment(formatPrice(expectedPayment));

      if (value.dueDate) {
        setFormattedDueDate(formatDate(new Date(value.dueDate)));
      }
      if (value.paidAt) {
        setFormattedPaidAt(formatDate(new Date(value.paidAt)));
      }
      return () => subscription.unsubscribe();
    });
  }, [watch]);

  const updateExistingInstallment = async (data: InstallmentEditFormType) => {
    if (saleId) {
      setIsSubmitting(true);
      const result = InstallmentEditFormSchemaType.safeParse(data);
      if (!result.success) {
        console.error(result.error);
        result.error.issues.forEach((issue) => {
          setError(issue.path[0] as keyof InstallmentEditFormType, {
            type: "manual",
            message: issue.message,
          });
        });
        setIsSubmitting(false);
        return;
      }
      const payload = {
        id: existingInstallment?.id,
        updatedInstallment: result.data,
        saleId: parseInt(saleId),
      };
      const response = await updateInstallment(payload);
      if (response.status === 200) {
        toast.success(response.message);
        router.push(`/sale/${saleId}`);
      } else {
        toast.error(response.message);
      }
      setIsSubmitting(false);
    }
  };

  const onSubmit = async (data: InstallmentEditFormType) => {
    await updateExistingInstallment(data);
  };

  return (
    <form className="w-full mt-10" onSubmit={handleSubmit(onSubmit)}>
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
          {formattedDueDate && (
            <div className="mt-1 text-sm text-gray-500">
              day-month-year: {formattedDueDate}
            </div>
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
          {formattedPaidAt && (
            <div className="mt-1 text-sm text-gray-500">
              day-month-year: {formattedPaidAt}
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          disabled={isSubmitting}
          type="submit"
          className="rounded-md bg-neutral-900 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-neutral-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          {isSubmitting ? "Editing..." : "Edit Installment"}
        </button>
      </div>
    </form>
  );
};

export default InstallmentEditForm;
