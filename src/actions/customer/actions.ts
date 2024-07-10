"use server";
import prisma from "@/lib/db";
import { CustomerFormSchema, CustomerForm, Customer } from "@/lib/type";

export async function create(newCustomer: CustomerForm) {
  try {
    const result = CustomerFormSchema.safeParse(newCustomer);
    if (!result.success) {
      let errorMessage = "Errors creating Customer: ";
      result.error.issues.forEach((issue) => {
        errorMessage += issue.path[0] + ": " + issue.message + ". ";
      });
      return {
        status: 400,
        message: errorMessage,
      };
    }

    const { address, ...customerData } = result.data;
    const customer = await prisma.customer.create({
      data: {
        ...customerData,
        address: address
          ? {
              create: {
                district: address.district,
                tehsil: address.tehsil,
                city: address.city,
                detail: address.detail,
              },
            }
          : undefined,
      },
      include: {
        address: true,
      },
    });

    return {
      status: 201,
      message: "Customer created successfully",
      data: customer,
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      message: "There was an error creating customer",
    };
  }
}

export async function getAll(page = 1, pageSize = 10) {
  const skip = (page - 1) * pageSize;

  const results = await prisma.customer.findMany({
    skip: skip,
    take: pageSize,
    include: {
      address: true,
    },
  });

  const totalCount = await prisma.customer.count();

  return {
    pagination: {
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
      currentPage: page,
      pageSize,
    },
    customers: results,
  };
}

interface SearchParams {
  field: string;
  query: string;
}
export async function search({ field, query }: SearchParams) {
  if (!field || !query) {
    return { status: 400, message: "Field or query is missing", data: [] };
  }
  try {
    let customers: Customer[] = [];
    switch (field) {
      case "firstName":
        customers = await prisma.customer.findMany({
          where: {
            firstName: { contains: query as string, mode: "insensitive" },
          },
          include: { address: true },
        });
        break;
      case "phoneNumber":
        customers = await prisma.customer.findMany({
          where: { phoneNumber: { contains: query as string } },
          include: { address: true },
        });
        break;
      case "CNIC":
        customers = await prisma.customer.findMany({
          where: { CNIC: { contains: query as string } },
          include: { address: true },
        });
        break;
    }
    return {
      status: 200,
      message: "Customers fetched successfully",
      data: customers,
    };
  } catch (error) {
    console.error("Error fetching customers: ", error);
    return {
      status: 500,
      message: "An error occurred while fetching customers",
      data: [],
    };
  }
}
