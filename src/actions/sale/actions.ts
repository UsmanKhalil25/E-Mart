"use server";
import prisma from "@/lib/db";
import {
  PAYMENT_OPTIONS,
  PAYMENT_STATUS,
  SaleForm,
  FullPaymentForm,
  InstallmentPlanForm,
} from "@/lib/type";

export async function create(newSale: SaleForm) {
  if (!newSale) {
    return { status: 400, message: "Required data is missing" };
  }
  for (const item of newSale.products) {
    if (item.product.stock < item.quantity) {
      return { status: 400, message: "Not enough stock present" };
    }
  }

  try {
    const paymentStatus =
      newSale.paymentOption === PAYMENT_OPTIONS.FULL_PAYMENT
        ? PAYMENT_STATUS.COMPLETED
        : PAYMENT_STATUS.PENDING;

    const sale = await prisma.sale.create({
      data: {
        customerId: newSale.customerId,
        paymentStatus: paymentStatus,
        paymentOption: newSale.paymentOption,
      },
    });

    if (newSale.paymentOption === PAYMENT_OPTIONS.FULL_PAYMENT) {
      const paymentInfo = newSale.paymentInfo as FullPaymentForm;
      await prisma.fullPayment.create({
        data: {
          saleId: sale.id,
          purchaseAmount: paymentInfo.purchaseAmount,
          discount: paymentInfo.discount ?? 0,
        },
      });
    } else if (newSale.paymentOption === PAYMENT_OPTIONS.INSTALLMENT) {
      const paymentInfo = newSale.paymentInfo as InstallmentPlanForm;
      const installmentPlan = await prisma.installmentPlan.create({
        data: {
          saleId: sale.id,
          totalPrice: paymentInfo.totalPrice,
          downPayment: paymentInfo.downPayment,
          installmentPeriod: paymentInfo.installmentPeriod,
          remainingPrice: paymentInfo.totalPrice - paymentInfo.downPayment,
        },
      });
      const dueDate = new Date(paymentInfo.dueDate).toISOString();
      await prisma.installment.create({
        data: {
          installmentPlanId: installmentPlan.id,
          dueDate: dueDate,
          expectedPayment: paymentInfo.expectedPayment,
        },
      });
    }

    for (const item of newSale.products) {
      await prisma.product.update({
        where: {
          id: item.product.id,
        },
        data: {
          stock: item.product.stock - item.quantity,
        },
      });
      await prisma.productSale.create({
        data: {
          productId: item.product.id,
          saleId: sale.id,
          quantity: item.quantity,
          price: item.price,
        },
      });
    }
    await prisma.bookRecord.create({
      data: {
        saleId: sale.id,
        bookName: newSale.bookRecord.bookName,
        pageNumber: newSale.bookRecord.pageNumber,
        description: newSale.bookRecord.description,
      },
    });
    return { status: 200, message: "Sale created successfully" };
  } catch (error) {
    console.error(error);
    return { status: 500, message: "Something went wrong" };
  }
}

export async function getAll(page = 1, pageSize = 10) {
  const skip = (page - 1) * pageSize;

  const results = await prisma.sale.findMany({
    skip: skip,
    take: pageSize,
    include: {
      customer: true,
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
    sales: results,
  };
}

export async function getOne(saleId: number) {
  try {
    const result = await prisma.sale.findUnique({
      where: {
        id: saleId,
      },
      include: {
        customer: {
          include: {
            address: true,
          },
        },
        fullPayment: true,
        installmentPlan: {
          include: {
            installments: true,
          },
        },
        productSales: {
          include: {
            product: {
              include: {
                company: true,
                category: true,
              },
            },
          },
        },
        bookRecord: true,
      },
    });
    return {
      status: 200,
      message: "Sale record fetched successfully",
      data: result,
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      message: "Error fetching Sale record",
      data: null,
    };
  }
}
