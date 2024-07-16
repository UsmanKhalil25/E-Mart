"use server";
import prisma from "@/lib/db";
import { PAYMENT_STATUS, PurchaseForm, PurchasePaymentForm } from "@/lib/type";
import { revalidatePath } from "next/cache";

export async function create(newPurchase: PurchaseForm) {
  if (!newPurchase) {
    return { status: 400, message: "Required data is missing" };
  }

  if (
    newPurchase.paymentInfo.paidAmount > newPurchase.paymentInfo.totalAmount
  ) {
    return {
      status: 400,
      message: "Paid amount cannot be greater then total amount.",
    };
  }

  const paymentStatus =
    newPurchase.paymentInfo.paidAmount === newPurchase.paymentInfo.totalAmount
      ? PAYMENT_STATUS.COMPLETED
      : PAYMENT_STATUS.PENDING;

  try {
    const purchase = await prisma.purchase.create({
      data: {
        date: newPurchase.date,
        companyId: newPurchase.companyId,
        totalAmount: newPurchase.paymentInfo.totalAmount,
        paidAmount: newPurchase.paymentInfo.paidAmount,
        remainingAmount:
          newPurchase.paymentInfo.totalAmount -
          newPurchase.paymentInfo.paidAmount,
        paymentStatus: paymentStatus,
      },
    });

    for (const item of newPurchase.products) {
      await prisma.product.update({
        where: {
          id: item.product.id,
        },
        data: {
          stock: item.product.stock + item.quantity,
        },
      });
      await prisma.productPurchase.create({
        data: {
          productId: item.product.id,
          purchaseId: purchase.id,
          quantity: item.quantity,
          price: item.price,
        },
      });
    }

    return { status: 201, message: "Purchase created successfully" };
  } catch (error) {
    console.error(error);
    return { status: 500, message: "Something went wrong" };
  }
}

export async function getAll(page = 1, pageSize = 10) {
  const skip = (page - 1) * pageSize;

  const results = await prisma.purchase.findMany({
    skip: skip,
    take: pageSize,
    include: {
      productPurchases: true,
      company: true,
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
    purchases: results,
  };
}

export async function getOne(purchaseId: number) {
  try {
    const result = await prisma.purchase.findUnique({
      where: {
        id: purchaseId,
      },
      include: {
        company: true,
        productPurchases: {
          include: {
            product: {
              include: {
                company: true,
                category: true,
              },
            },
          },
        },
      },
    });
    return {
      status: 200,
      message: "Purchase record fetched successfully",
      data: result,
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      message: "Error fetching purchase record",
      data: null,
    };
  }
}

interface UpdateParams {
  id: number;
  updatedPurchase: PurchasePaymentForm;
}

export async function update({ id, updatedPurchase }: UpdateParams) {
  if (updatedPurchase.paidAmount > updatedPurchase.totalAmount) {
    return {
      status: 400,
      message: "Paid amount cannot be greater then total amount.",
    };
  }

  try {
    const updatedPurchaseData = await prisma.purchase.update({
      where: {
        id: id,
      },
      data: {
        totalAmount: updatedPurchase.totalAmount,
        paidAmount: updatedPurchase.paidAmount,
        remainingAmount:
          updatedPurchase.totalAmount - updatedPurchase.paidAmount,
        paymentStatus:
          updatedPurchase.totalAmount - updatedPurchase.paidAmount === 0
            ? PAYMENT_STATUS.COMPLETED
            : PAYMENT_STATUS.PENDING,
      },
    });

    revalidatePath(`/purchase/${id}`);

    return {
      status: 200,
      message: "Purchase updated successfully",
      data: updatedPurchaseData,
    };
  } catch (error) {
    console.error("Error updating purchase: ", error);
    return {
      status: 500,
      message: "An error occurred while updating purchase",
      data: null,
    };
  }
}
