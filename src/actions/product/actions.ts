"use server";
import prisma from "@/lib/db";
import { ProductFormSchema, ProductFrom } from "@/lib/type";

export async function create(newProduct: ProductFrom) {
  const result = ProductFormSchema.safeParse(newProduct);
  if (!result.success) {
    let errorMessage = "Errors creating product: ";
    result.error.issues.forEach((issue) => {
      errorMessage += issue.path[0] + ": " + issue.message + ". ";
    });
    return {
      error: errorMessage,
    };
  }

  const { company, category, ...productData } = result.data;

  const companyRecord = await prisma.company.findUnique({
    where: { name: company },
  });
  const categoryRecord = await prisma.category.findUnique({
    where: { name: category },
  });

  if (!companyRecord || !categoryRecord) {
    return {
      error: "Invalid company or category name.",
    };
  }
  await prisma.product.create({
    data: {
      ...productData,
      companyId: companyRecord.id,
      categoryId: categoryRecord.id,
    },
  });
}

export async function getAll(page = 1, pageSize = 10) {
  const skip = (page - 1) * pageSize;

  const results = await prisma.product.findMany({
    skip: skip,
    take: pageSize,
    include: {
      company: true,
      category: true,
      productSales: true,
    },
  });

  const totalCount = await prisma.product.count();

  return {
    pagination: {
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
      currentPage: page,
      pageSize,
    },
    products: results,
  };
}

interface SearchParams {
  company: number;
  category: number;
  query: string;
}
export async function search({ company, category, query }: SearchParams) {
  if (!company || !category || !query) {
    return { status: 400, message: "Field or query is missing", data: [] };
  }
  try {
    const products = await prisma.product.findMany({
      where: {
        categoryId: category,
        companyId: company,
        model: { contains: query as string, mode: "insensitive" },
      },
      include: {
        company: true,
        category: true,
        productSales: true,
      },
    });

    return {
      status: 200,
      message: "Products fetched successfully",
      data: products,
    };
  } catch (error) {
    console.error("Error fetching products: ", error);
    return {
      status: 500,
      message: "An error occurred while fetching products",
      data: [],
    };
  }
}
