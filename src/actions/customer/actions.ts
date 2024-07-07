"use server";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";
import { CustomerFormSchema, CustomerForm, Customer } from "@/lib/type";

export async function create(newCustomer: CustomerForm) {
  const result = CustomerFormSchema.safeParse(newCustomer);
  if (!result.success) {
    let errorMessage = "Errors creating Customer: ";
    result.error.issues.forEach((issue) => {
      errorMessage += issue.path[0] + ": " + issue.message + ". ";
    });
    return {
      error: errorMessage,
    };
  }

  const { address, ...customerData } = result.data;
  await prisma.customer.create({
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
  });
  redirect("/customer");
}

export async function getAll() {
  const results = await prisma.customer.findMany({
    include: {
      address: true,
    },
  });
  let response = [];
  for (const result of results) {
    const { address, ...customerData } = result;
    response.push({
      district: address?.district,
      tehsil: address?.tehsil,
      city: address?.city,
      detail: address?.detail,
      name: result.firstName + " " + result?.lastName,
      ...customerData,
    });
  }
  return response;
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
