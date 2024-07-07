"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import Select from "react-select";
import {
  ProductFormSchema,
  ProductFrom as ProductFormType,
  Company,
  Category,
} from "@/lib/type";
import { getAll as getAllCategories } from "@/actions/category/actions";
import { getAll as getAllCompanies } from "@/actions/company/actions";
import { create as createProduct } from "@/actions/product/actions";
import { redirect } from "next/navigation";

export default function ProductForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ProductFormType>({
    resolver: zodResolver(ProductFormSchema),
  });

  const [companies, setCompanies] = useState<Company[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formattedPrice, setFormattedPrice] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    const fetchData = async () => {
      const companiesRes = await getAllCompanies();
      setCompanies(companiesRes);

      const categoriesRes = await getAllCategories();
      setCategories(categoriesRes);
    };

    fetchData();
  }, []);

  const onSubmit = async (data: ProductFormType) => {
    setLoading(true);
    const result = ProductFormSchema.safeParse(data);
    if (!result.success) {
      console.error(result.error);
      return;
    }
    await createProduct(data);
    setLoading(false);
    redirect("/products");
  };

  const companyOptions = companies.map((company) => ({
    value: company.name,
    label: company.name,
  }));

  const categoryOptions = categories.map((category) => ({
    value: category.name,
    label: category.name,
  }));

  const formatPrice = (price: number) => {
    return price.toLocaleString();
  };

  useEffect(() => {
    const subscription = watch((value) => {
      if (value.price) {
        setFormattedPrice(formatPrice(value.price));
      } else {
        setFormattedPrice("");
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  return (
    <form
      className="w-full max-w-4xl mx-auto p-10"
      onSubmit={handleSubmit(onSubmit)}
    >
      <fieldset className="space-y-12">
        <legend className="text-lg font-semibold leading-7 text-gray-900 border-b border-gray-900/10 pb-4">
          Product Information
        </legend>
        <p className="mt-1 text-sm leading-6 text-gray-600">
          Be careful while adding product information.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <label
              htmlFor="company"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Company
            </label>
            <div className="mt-2">
              <Select
                instanceId={"wsad123wqwe"}
                options={companyOptions}
                onChange={(selectedOption) => {
                  setValue("company", selectedOption?.value || "");
                }}
              />
            </div>
            {errors.company && (
              <span className="text-red-500 text-xs italic ">
                {errors.company.message}
              </span>
            )}
          </div>

          <div className="sm:col-span-3">
            <label
              htmlFor="category"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Category
            </label>
            <div className="mt-2">
              <Select
                instanceId={"wsad123wqwe"}
                options={categoryOptions}
                onChange={(selectedOption) => {
                  setValue("category", selectedOption?.value || "");
                }}
              />
            </div>
            {errors.category && (
              <span className="text-red-500 text-xs italic ">
                {errors.category.message}
              </span>
            )}
          </div>

          <div className="sm:col-span-3">
            <label
              htmlFor="price"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Price
            </label>
            <div className="mt-2">
              <input
                type="number"
                id="price"
                {...register("price", { valueAsNumber: true })}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-zinc-950 sm:text-sm sm:leading-6"
              />
            </div>
            {errors.price && (
              <span className="text-red-500 text-xs italic ">
                {errors.price.message}
              </span>
            )}
            {formattedPrice && (
              <div className="mt-1 text-sm text-gray-500">
                Rupees: {formattedPrice}
              </div>
            )}
          </div>

          <div className="sm:col-span-3">
            <label
              htmlFor="stock"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Stock
            </label>
            <div className="mt-2">
              <input
                type="number"
                id="stock"
                {...register("stock", { valueAsNumber: true })}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-zinc-950 sm:text-sm sm:leading-6"
              />
            </div>
            {errors.stock && (
              <span className="text-red-500 text-xs italic ">
                {errors.stock.message}
              </span>
            )}
          </div>

          <div className="sm:col-span-6">
            <label
              htmlFor="model"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Model
            </label>
            <div className="mt-2">
              <input
                type="text"
                id="model"
                {...register("model")}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-zinc-950 sm:text-sm sm:leading-6"
              />
            </div>
            {errors.model && (
              <span className="text-red-500 text-xs italic ">
                {errors.model.message}
              </span>
            )}
          </div>

          <div className="sm:col-span-6">
            <label
              htmlFor="description"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Description
            </label>
            <div className="mt-2">
              <textarea
                id="description"
                {...register("description")}
                rows={3}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-neutral-950 sm:text-sm sm:leading-6"
                defaultValue={""}
              />
            </div>
          </div>
        </div>
      </fieldset>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <Link
          href={"/product"}
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
}
