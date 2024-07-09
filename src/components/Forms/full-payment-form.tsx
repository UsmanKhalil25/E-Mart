import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FullPaymentFormSchema,
  FullPaymentForm as FullPaymentFormType,
} from "@/lib/type";
import { formatPrice } from "@/utils/string-utils";

interface FullPaymentFormProps {
  totalPayment?: number;
  isSubmitting: boolean;
  onFullPaymentAdd: (FullPaymentFormSchema: FullPaymentFormType) => void;
}

const FullPaymentForm: React.FC<FullPaymentFormProps> = ({
  totalPayment,
  isSubmitting,
  onFullPaymentAdd,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FullPaymentFormType>({
    resolver: zodResolver(FullPaymentFormSchema),
    defaultValues: {
      discount: 0,
      payment: totalPayment,
    },
  });

  const [formattedPayment, setFormattedPayment] = useState<string>("");
  const [formattedDiscount, setFormattedDiscount] = useState<string>("");
  const [totalAfterDiscount, setTotalAfterDiscount] = useState<string>("");

  useEffect(() => {
    const subscription = watch((value) => {
      const payment = value.payment ?? 0;
      const discount = value.discount ?? 0;
      if (payment > discount) {
        const total = payment - discount;
        setTotalAfterDiscount(formatPrice(total));
      }

      setFormattedPayment(formatPrice(payment));
      setFormattedDiscount(formatPrice(discount));
    });

    return () => subscription.unsubscribe();
  }, [watch]);

  useEffect(() => {
    if (totalPayment !== undefined) {
      setValue("payment", totalPayment);
    }
  }, [totalPayment, setValue]);

  const onSubmit = (data: FullPaymentFormType) => {
    onFullPaymentAdd(data);
  };

  return (
    <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        <div className="sm:col-span-3">
          <label
            htmlFor="payment"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Payment
          </label>
          <div className="mt-2">
            <input
              type="number"
              id="payment"
              {...register("payment", { valueAsNumber: true })}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-zinc-950 sm:text-sm sm:leading-6"
            />
          </div>
          {errors.payment && (
            <span className="text-red-500 text-xs italic ">
              {errors.payment.message}
            </span>
          )}
          {formattedPayment && (
            <div className="mt-1 text-sm text-gray-500">
              Rupees: {formattedPayment}
            </div>
          )}
        </div>

        <div className="sm:col-span-3">
          <label
            htmlFor="discount"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Discount
          </label>
          <div className="mt-2">
            <input
              type="number"
              id="discount"
              placeholder="Optional"
              {...register("discount", { valueAsNumber: true })}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-zinc-950 sm:text-sm sm:leading-6"
            />
          </div>
          {errors.discount && (
            <span className="text-red-500 text-xs italic ">
              {errors.discount.message}
            </span>
          )}
          {formattedDiscount && (
            <div className="mt-1 text-sm text-gray-500">
              Rupees: {formattedDiscount}
            </div>
          )}
        </div>
      </div>
      <div className="sm:col-span-3">
        <label
          htmlFor="totalAfterDiscount"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Total After Discount
        </label>
        <div className="mt-2">
          <input
            type="text"
            id="totalAfterDiscount"
            value={totalAfterDiscount}
            readOnly
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-zinc-950 sm:text-sm sm:leading-6"
          />
        </div>
      </div>
      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-neutral-950 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          {isSubmitting ? "Adding..." : "Add payment"}
        </button>
      </div>
    </form>
  );
};

export default FullPaymentForm;
