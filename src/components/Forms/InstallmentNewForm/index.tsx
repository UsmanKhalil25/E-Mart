"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  InstallmentNewFormSchema as InstallmentNewFormSchemaType,
  InstallmentNewForm as InstallmentNewFormType,
} from "@/lib/type";
import { create as createInstallment } from "@/actions/installment/actions";
import { formatPrice, formatDate } from "@/utils/string-utils";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

const InstallmentNewForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
  } = useForm<InstallmentNewFormType>({
    resolver: zodResolver(InstallmentNewFormSchemaType),
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const saleId = searchParams.get("saleId");
  const installmentPlanId = searchParams.get("installmentPlan");

  const [formattedExpectedPayment, setFormattedExpectedPayment] =
    useState<string>("");
  const [formattedDueDate, setFormattedDueDate] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    const subscription = watch((value) => {
      const expectedPayment = value.expectedPayment ?? 0;
      setFormattedExpectedPayment(formatPrice(expectedPayment));

      if (value.dueDate) {
        setFormattedDueDate(formatDate(new Date(value.dueDate)));
      }

      return () => subscription.unsubscribe();
    });
  }, [watch]);

  const createNewInstallment = async (data: InstallmentNewFormType) => {
    if (saleId && installmentPlanId) {
      setIsSubmitting(true);
      const result = InstallmentNewFormSchemaType.safeParse(data);
      if (!result.success) {
        console.error(result.error);
        result.error.issues.forEach((issue) => {
          setError(issue.path[0] as keyof InstallmentNewFormType, {
            type: "manual",
            message: issue.message,
          });
        });
        setIsSubmitting(false);
        return;
      }
      const payload = {
        newInstallment: result.data,
        saleId: parseInt(saleId),
        installmentPlanId: parseInt(installmentPlanId),
      };
      const response = await createInstallment(payload);
      if (response.status === 201) {
        toast.success(response.message);
        router.push(`/sale/${saleId}`);
      } else {
        toast.error(response.message);
      }
      setIsSubmitting(false);
    }
  };

  const onSubmit = async (data: InstallmentNewFormType) => {
    await createNewInstallment(data);
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
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          disabled={isSubmitting}
          type="submit"
          className="rounded-md bg-neutral-900 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-neutral-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          {isSubmitting ? "Adding..." : "Add Installment"}
        </button>
      </div>
    </form>
  );
};

export default InstallmentNewForm;
