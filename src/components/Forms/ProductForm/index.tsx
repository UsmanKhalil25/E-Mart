"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import Select from "react-select";
import toast from "react-hot-toast";
import {
  ProductFormSchema,
  ProductForm as ProductFormType,
  Product as ProductType,
  Company,
  Category,
} from "@/lib/type";
import { getAll as getAllCategories } from "@/actions/category/actions";
import { getAll as getAllCompanies } from "@/actions/company/actions";
import {
  create as createProduct,
  update as updateProduct,
} from "@/actions/product/actions";
import { useRouter } from "next/navigation";

interface ProductFormProps {
  existingProduct?: ProductType;
}

const ProductForm: React.FC<ProductFormProps> = ({ existingProduct }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    setError,
    watch,
  } = useForm<ProductFormType>({
    resolver: zodResolver(ProductFormSchema),
    defaultValues: {
      model: existingProduct?.model || "",
      company: existingProduct?.company.name || "",
      category: existingProduct?.category.name || "",
      price: existingProduct?.price || 0,
      stock: existingProduct?.stock || 0,
      description: existingProduct?.description || "",
    },
  });

  const router = useRouter();
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

  const createNewProduct = async (data: ProductFormType) => {
    setLoading(true);
    const result = ProductFormSchema.safeParse(data);
    if (!result.success) {
      console.error(result.error);
      result.error.issues.forEach((issue) => {
        setError(issue.path[0] as keyof ProductFormType, {
          type: "manual",
          message: issue.message,
        });
      });
      setLoading(false);
      return;
    }
    const response = await createProduct(result.data);
    if (response.status === 201) {
      toast.success(response.message);
      router.push("/product");
    } else {
      toast.error(response.message);
    }
    setLoading(false);
  };

  const updateExistingProduct = async (data: ProductFormType) => {
    if (existingProduct) {
      setLoading(true);
      const result = ProductFormSchema.safeParse(data);
      if (!result.success) {
        console.error(result.error);
        result.error.issues.forEach((issue) => {
          setError(issue.path[0] as keyof ProductFormType, {
            type: "manual",
            message: issue.message,
          });
        });
        setLoading(false);
        return;
      }
      const payload = {
        id: existingProduct?.id,
        updatedProduct: result.data,
      };
      const response = await updateProduct(payload);
      if (response.status === 200) {
        toast.success(response.message);
        router.push(`/product/${existingProduct?.id}`);
      } else {
        toast.error(response.message);
      }
      setLoading(false);
    }
  };

  const onSubmit = async (data: ProductFormType) => {
    if (existingProduct) {
      await updateExistingProduct(data);
    } else {
      await createNewProduct(data);
    }
  };

  return (
    <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
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
              value={
                companyOptions.find(
                  (option) => option.value === existingProduct?.company.name
                ) || null
              }
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
              value={
                categoryOptions.find(
                  (option) => option.value === existingProduct?.category.name
                ) || null
              }
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
};

export default ProductForm;
