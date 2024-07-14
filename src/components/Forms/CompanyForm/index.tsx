"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { create as createCompany } from "@/actions/company/actions";
import toast from "react-hot-toast";
import { CompanyFormSchema, CompanyForm as CompanyFormType } from "@/lib/type";

const CompanyForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<CompanyFormType>({
    resolver: zodResolver(CompanyFormSchema),
  });

  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const createNewCompany = async (data: CompanyFormType) => {
    setLoading(true);
    const result = CompanyFormSchema.safeParse(data);
    if (!result.success) {
      console.error(result.error);
      result.error.issues.forEach((issue) => {
        setError(issue.path[0] as keyof CompanyFormType, {
          type: "manual",
          message: issue.message,
        });
      });
      setLoading(false);
      return;
    }
    const response = await createCompany(result.data);
    if (response.status === 201) {
      toast.success(response.message);
      router.push("/company");
    } else {
      toast.error(response.message);
    }
    setLoading(false);
  };

  const onSubmit = async (data: CompanyFormType) => {
    await createNewCompany(data);
  };

  return (
    <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
      <fieldset className="space-y-12">
        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <label
              htmlFor="name"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Company Name
            </label>
            <div className="mt-2">
              <input
                type="text"
                id="name"
                {...register("name")}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-zinc-950 sm:text-sm sm:leading-6"
              />
            </div>
            {errors.name && (
              <span className="text-red-500 text-xs italic">
                {errors.name.message}
              </span>
            )}
          </div>
        </div>
      </fieldset>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <Link
          href={"/company"}
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

export default CompanyForm;
