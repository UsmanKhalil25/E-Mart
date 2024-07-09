"use server";
import prisma from "@/lib/db";
import {
  PAYMENT_OPTIONS,
  PAYMENT_STATUS,
  PurchaseForm,
  FullPaymentForm,
  InstallmentForm,
} from "@/lib/type";

export async function create(newPurchase: PurchaseForm) {
  if (!newPurchase) {
    return { status: 400, message: "Required data is missing" };
  }
  for (const item of newPurchase.products) {
    if (item.product.stock < item.quantity) {
      return { status: 400, message: "Not enough stock present" };
    }
  }

  try {
    const paymentStatus =
      newPurchase.paymentOption === PAYMENT_OPTIONS.FULL_PAYMENT
        ? PAYMENT_STATUS.COMPLETED
        : PAYMENT_STATUS.PENDING;

    const purchase = await prisma.purchase.create({
      data: {
        customerId: newPurchase.customerId,
        paymentStatus: paymentStatus,
        paymentOption: newPurchase.paymentOption,
      },
    });

    if (newPurchase.paymentOption === PAYMENT_OPTIONS.FULL_PAYMENT) {
      const paymentInfo = newPurchase.paymentInfo as FullPaymentForm;
      await prisma.fullPayment.create({
        data: {
          purchaseId: purchase.id,
          purchaseAmount: paymentInfo.payment,
          discount: paymentInfo.discount ?? 0,
        },
      });
    } else if (newPurchase.paymentOption === PAYMENT_OPTIONS.INSTALLMENT) {
      const paymentInfo = newPurchase.paymentInfo as InstallmentForm;
      await prisma.installment.create({
        data: {
          purchaseId: purchase.id,
          totalPrice: paymentInfo.totalPrice,
          downPayment: paymentInfo.downPayment,
          installmentPeriod: paymentInfo.installmentPeriod,
          dueDate: new Date(paymentInfo.dueDate),
          paidAt: paymentInfo.paidAt || null,
          remainingPrice: paymentInfo.totalPrice - paymentInfo.downPayment,
        },
      });
    }

    for (const item of newPurchase.products) {
      await prisma.product.update({
        where: {
          id: item.product.id,
        },
        data: {
          stock: item.product.stock - item.quantity,
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
    return { status: 200, message: "Purchase created successfully" };
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
      customer: {
        select: { firstName: true, lastName: true, phoneNumber: true },
      },

      productPurchase: true,
    },
  });

  const totalCount = await prisma.product.count();
  let response = [];
  for (const result of results) {
    const {
      customer,
      productPurchase,
      paymentOption,
      paymentStatus,
      ...purchaseData
    } = result;
    response.push({
      customerName: customer.lastName
        ? customer.firstName + " " + customer.lastName
        : customer.firstName,
      customerPhoneNumber: customer.phoneNumber,
      paymentOption: paymentOption,
      paymentStatus: paymentStatus,
      totalAmount: result.productPurchase.reduce(
        (total, item) => total + item.price,
        0
      ),
      numberOfProducts: result.productPurchase.reduce(
        (total, item) => total + item.quantity,
        0
      ),
    });
  }

  return {
    status: 200,
    message: "Purchases fetched successfully",
    data: {
      pagination: {
        totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
        currentPage: page,
        pageSize,
      },
      purchases: response,
    },
  };
}

export async function getOne(purchaseId: number) {
  try {
    const result = await prisma.purchase.findUnique({
      where: {
        id: purchaseId,
      },
      include: {
        customer: {
          include: {
            address: true,
          },
        },
        fullPayment: true,
        installments: true,
        productPurchase: {
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
