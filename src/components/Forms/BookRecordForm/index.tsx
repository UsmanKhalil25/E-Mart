import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  BookRecordFormSchema,
  BookRecordForm as BookRecordFormType,
} from "@/lib/type";

interface BookRecordFormProps {
  onAddBookRecord: (bookRecord: BookRecordFormType) => void;
  isSubmitting: boolean;
}

const BookRecordForm: React.FC<BookRecordFormProps> = ({
  onAddBookRecord,
  isSubmitting,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookRecordFormType>({
    resolver: zodResolver(BookRecordFormSchema),
  });

  const onSubmit = (data: BookRecordFormType) => {
    console.log("Form Submitted with data: ", data);
    onAddBookRecord(data);
  };

  return (
    <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        <div className="sm:col-span-3">
          <label
            htmlFor="bookName"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Book name
          </label>
          <div className="mt-2">
            <input
              type="text"
              id="bookName"
              {...register("bookName")}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-zinc-950 sm:text-sm sm:leading-6"
            />
          </div>
          {errors.bookName && (
            <span className="text-red-500 text-xs italic ">
              {errors.bookName.message}
            </span>
          )}
        </div>

        <div className="sm:col-span-3">
          <label
            htmlFor="pageNumber"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Page Number
          </label>
          <div className="mt-2">
            <input
              type="number"
              id="pageNumber"
              {...register("pageNumber", { valueAsNumber: true })}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-zinc-950 sm:text-sm sm:leading-6"
            />
          </div>
          {errors.pageNumber && (
            <span className="text-red-500 text-xs italic ">
              {errors.pageNumber.message}
            </span>
          )}
        </div>
      </div>
      <div className="sm:col-span-3">
        <label
          htmlFor="description"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Description
        </label>
        <div className="mt-2">
          <input
            type="text"
            placeholder="Optional"
            id="description"
            {...register("description")}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-zinc-950 sm:text-sm sm:leading-6"
          />
        </div>
      </div>
      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-neutral-900 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-neutral-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          {isSubmitting ? "Adding..." : "Add Record"}
        </button>
      </div>
    </form>
  );
};

export default BookRecordForm;
