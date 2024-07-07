"use server";
import prisma from "@/lib/db";
import {
  PAYMENT_OPTIONS,
  PAYMENT_STATUS,
  Purchase,
  FullPaymentForm,
  InstallmentForm,
} from "@/lib/type";

export async function create(newPurchase: Purchase) {
  if (!newPurchase) {
    return { status: 400, message: "Required data is missing" };
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
