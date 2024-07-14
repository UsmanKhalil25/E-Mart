"use server";
import prisma from "@/lib/db";
import {
  CompanyFormSchema as CompanyFormSchemaType,
  CompanyForm as CompanyFormType,
} from "@/lib/type";
import { revalidatePath } from "next/cache";

export async function create(newCompany: CompanyFormType) {
  try {
    const result = CompanyFormSchemaType.safeParse(newCompany);
    if (!result.success) {
      let errorMessage = "Errors creating company: ";
      result.error.issues.forEach((issue) => {
        errorMessage += issue.path[0] + ": " + issue.message + ". ";
      });
      return {
        status: 400,
        message: errorMessage,
      };
    }

    const company = await prisma.company.create({
      data: {
        ...newCompany,
      },
    });

    revalidatePath("/company");
    return {
      status: 201,
      message: "Company created successfully",
      data: company,
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      message: "There was an error creating company",
    };
  }
}

export async function getAll() {
  const result = await prisma.company.findMany();
  return result;
}

export async function getAllWithInfo() {
  const companies = await prisma.company.findMany({
    include: {
      products: {
        include: {
          productSales: {
            include: {
              sale: {
                include: {
                  fullPayment: true,
                  installmentPlan: true,
                },
              },
            },
          },
        },
      },
    },
  });

  const companiesInfo = companies.map((company) => {
    const numberOfProducts = company.products.length;
    let totalSaleAmount = 0;
    let totalPurchaseAmount = 0;
    let totalStock = 0;

    company.products.forEach((product) => {
      totalStock += product.stock;
      product.productSales.forEach((productSale) => {
        const sale = productSale.sale;
        if (sale.paymentStatus === "COMPLETED") {
          if (sale.paymentOption === "FULL_PAYMENT" && sale.fullPayment) {
            totalSaleAmount += sale.fullPayment.purchaseAmount;
          } else if (
            sale.paymentOption === "INSTALLMENT" &&
            sale.installmentPlan
          ) {
            totalSaleAmount += sale.installmentPlan.totalPrice;
          }
        }
        totalPurchaseAmount += productSale.price * productSale.quantity;
      });
    });

    return {
      id: company.id,
      companyName: company.name,
      numberOfProducts,
      totalSaleAmount,
      totalPurchaseAmount,
      totalStock,
    };
  });

  return {
    status: 200,
    message: "Companies data fetched successfully",
    data: companiesInfo,
  };
}
