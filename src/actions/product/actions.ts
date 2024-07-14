"use server";
import prisma from "@/lib/db";
import { ProductFormSchema, ProductForm } from "@/lib/type";
import { revalidatePath } from "next/cache";
export async function create(newProduct: ProductForm) {
  try {
    const result = ProductFormSchema.safeParse(newProduct);
    if (!result.success) {
      let errorMessage = "Errors creating product: ";
      result.error.issues.forEach((issue) => {
        errorMessage += issue.path[0] + ": " + issue.message + ". ";
      });
      return {
        status: 500,
        message: errorMessage,
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
        status: 500,
        message: "Invalid company or category name",
      };
    }
    const product = await prisma.product.create({
      data: {
        ...productData,
        companyId: companyRecord.id,
        categoryId: categoryRecord.id,
      },
    });
    return {
      status: 201,
      message: "Product created successfully",
      data: product,
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      message: "There was an error creating product",
    };
  }
}

export async function getAllNoStock() {
  const results = await prisma.product.findMany({
    where: {
      stock: 0,
    },
    include: {
      company: true,
      category: true,
      productSales: true,
    },
  });
  return {
    status: 200,
    message: "Products with no stock fetched successfully",
    data: results,
  };
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

export async function getOne(productId: number) {
  try {
    const result = await prisma.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        company: true,
        category: true,
        productSales: true,
      },
    });
    return {
      status: 200,
      message: "Product information fetched successfully",
      data: result,
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      message: "Error fetching Product information",
      data: null,
    };
  }
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

interface UpdateParams {
  id: number;
  updatedProduct: ProductForm;
}

export async function update({ id, updatedProduct }: UpdateParams) {
  try {
    const { company, category, ...productData } = updatedProduct;

    const companyRecord = await prisma.company.findUnique({
      where: { name: company },
    });
    const categoryRecord = await prisma.category.findUnique({
      where: { name: category },
    });

    if (!companyRecord || !categoryRecord) {
      return {
        status: 500,
        message: "Invalid company or category name.",
        data: null,
      };
    }
    const updatedProductData = await prisma.product.update({
      where: {
        id: id,
      },
      data: {
        ...productData,
        companyId: companyRecord.id,
        categoryId: categoryRecord.id,
      },
    });

    revalidatePath(`/product/${id}`);
    return {
      status: 200,
      message: "Product updated successfully",
      data: updatedProductData,
    };
  } catch (error) {
    console.error("Error updating product: ", error);
    return {
      status: 500,
      message: "An error occurred while updating product",
      data: null,
    };
  }
}
