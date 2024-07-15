"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  PurchasePaymentFormSchema,
  PurchasePaymentForm as PurchasePaymentFormType,
} from "@/lib/type";
import { update as updatePurchase } from "@/actions/purchase/actions";
import { formatPrice } from "@/utils/string-utils";
import toast from "react-hot-toast";
interface PurchasePaymentFormProps {
  totalPayment?: number;
  paidAmount?: number;
  id?: number;
  onAddPayment?: (PurchasePaymentFormSchema: PurchasePaymentFormType) => void;
}

const PurchasePaymentForm: React.FC<PurchasePaymentFormProps> = ({
  id,
  totalPayment,
  paidAmount,
  onAddPayment,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    setError,
    watch,
  } = useForm<PurchasePaymentFormType>({
    resolver: zodResolver(PurchasePaymentFormSchema),
    defaultValues: {
      paidAmount: paidAmount ? paidAmount : 0,
      totalAmount: totalPayment,
    },
  });
  const router = useRouter();
  const [formattedTotalAmount, setFormattedTotalAmount] = useState<string>("");
  const [formattedPaidAmount, setFormattedPaidAmount] = useState<string>("");
  const [remainingAmount, setRemainingAmount] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    const subscription = watch((value) => {
      const totalAmount = value.totalAmount ?? 0;
      const paidAmount = value.paidAmount ?? 0;
      if (totalAmount >= paidAmount) {
        const remaining = totalAmount - paidAmount;
        setRemainingAmount(formatPrice(remaining));
      }

      setFormattedTotalAmount(formatPrice(totalAmount));
      setFormattedPaidAmount(formatPrice(paidAmount));
    });

    return () => subscription.unsubscribe();
  }, [watch]);

  useEffect(() => {
    if (totalPayment !== undefined) {
      setValue("totalAmount", totalPayment);
    }
  }, [totalPayment, setValue]);

  const updateExistingPayment = async (data: PurchasePaymentFormType) => {
    if (!id) {
      return;
    }

    setIsSubmitting(true);
    const result = PurchasePaymentFormSchema.safeParse(data);
    if (!result.success) {
      console.error(result.error);
      result.error.issues.forEach((issue) => {
        setError(issue.path[0] as keyof PurchasePaymentFormType, {
          type: "manual",
          message: issue.message,
        });
      });
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(true);
    const payload = {
      id,
      updatedPurchase: result.data,
    };
    const response = await updatePurchase(payload);
    if (response.status === 200) {
      toast.success(response.message);
      setIsSubmitting(false);
      router.push(`/purchase/${id}`);
    } else {
      toast.error(response.message);
    }
  };

  const onSubmit = async (data: PurchasePaymentFormType) => {
    if (onAddPayment) onAddPayment(data);
    else await updateExistingPayment(data);
  };

  return (
    <form className="w-full mt-10 space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        <div className="sm:col-span-3">
          <label
            htmlFor="totalAmount"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Total Amount
          </label>
          <div className="mt-2">
            <input
              type="number"
              id="totalAmount"
              {...register("totalAmount", { valueAsNumber: true })}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-zinc-950 sm:text-sm sm:leading-6"
            />
          </div>
          {errors.totalAmount && (
            <span className="text-red-500 text-xs italic ">
              {errors.totalAmount.message}
            </span>
          )}
          {formattedTotalAmount && (
            <div className="mt-1 text-sm text-gray-500">
              Rupees: {formattedTotalAmount}
            </div>
          )}
        </div>

        <div className="sm:col-span-3">
          <label
            htmlFor="paidAmount"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Paid Amount
          </label>
          <div className="mt-2">
            <input
              type="number"
              id="paidAmount"
              placeholder="Optional"
              {...register("paidAmount", { valueAsNumber: true })}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-zinc-950 sm:text-sm sm:leading-6"
            />
          </div>
          {errors.paidAmount && (
            <span className="text-red-500 text-xs italic ">
              {errors.paidAmount.message}
            </span>
          )}
          {formattedPaidAmount && (
            <div className="mt-1 text-sm text-gray-500">
              Rupees: {formattedPaidAmount}
            </div>
          )}
        </div>
      </div>
      <div className="sm:col-span-3">
        <label
          htmlFor="remainingAmount"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Remaining Amount
        </label>
        <div className="mt-2">
          <input
            type="text"
            id="remainingAmount"
            value={remainingAmount}
            readOnly
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-zinc-950 sm:text-sm sm:leading-6"
          />
        </div>
      </div>
      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          type="submit"
          className="rounded-md bg-neutral-900 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-neutral-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          {id
            ? isSubmitting
              ? "Edit..."
              : "Edit Payment"
            : isSubmitting
              ? "Add..."
              : "Add Payment"}
        </button>
      </div>
    </form>
  );
};

export default PurchasePaymentForm;
