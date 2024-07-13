"use server";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import {
  InstallmentNewForm as InstallmentNewFormType,
  InstallmentNewFormSchema as InstallmentNewFormSchemaType,
  InstallmentEditForm as InstallmentEditFormType,
  PAYMENT_STATUS,
} from "@/lib/type";

interface CreateParams {
  installmentPlanId: number;
  saleId: number;
  newInstallment: InstallmentNewFormType;
}

export async function create({
  installmentPlanId,
  newInstallment,
  saleId,
}: CreateParams) {
  try {
    const dueDate = new Date(newInstallment.dueDate).toISOString();

    const result = InstallmentNewFormSchemaType.safeParse(newInstallment);
    if (!result.success) {
      let errorMessage = "Errors creating installment: ";
      result.error.issues.forEach((issue) => {
        errorMessage += issue.path[0] + ": " + issue.message + ". ";
      });
      return {
        status: 500,
        message: errorMessage,
      };
    }

    if (!installmentPlanId || !saleId) {
      return {
        status: 400,
        message: "Required data is not present",
      };
    }
    const installment = await prisma.installment.create({
      data: {
        expectedPayment: newInstallment.expectedPayment,
        dueDate: dueDate,
        installmentPlanId: installmentPlanId,
      },
    });
    revalidatePath(`/sale/${saleId}`);
    return {
      status: 201,
      message: "Installment created successfully",
      data: installment,
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      message: "There was an error creating installment",
    };
  }
}
interface UpdateParams {
  id: number;
  saleId: number;
  updatedInstallment: InstallmentEditFormType;
}

export async function update({ id, saleId, updatedInstallment }: UpdateParams) {
  try {
    const dueDate = new Date(updatedInstallment.dueDate).toISOString();
    const paidAt = new Date(updatedInstallment.paidAt).toISOString();
    const existingInstallment = await prisma.installment.findUnique({
      where: { id: id },
      include: { installmentPlan: true },
    });

    if (!existingInstallment) {
      return {
        status: 404,
        message: "Installment not found",
        data: null,
      };
    }

    if (
      existingInstallment.installmentPlan.remainingPrice <
      updatedInstallment.actualPayment
    ) {
      return {
        status: 400,
        message: "The actual payment must be less then remaining price",
        data: null,
      };
    }
    const updatedInstallmentData = await prisma.installment.update({
      where: { id: id },
      data: {
        actualPayment: updatedInstallment.actualPayment,
        expectedPayment: updatedInstallment.expectedPayment,
        paidAt: paidAt,
        dueDate: dueDate,
      },
    });

    const updatedInstallmentPlan = await prisma.installmentPlan.update({
      where: { id: existingInstallment.installmentPlanId },
      data: {
        remainingPrice:
          existingInstallment.installmentPlan.remainingPrice -
          updatedInstallment.actualPayment,
      },
    });
    if (updatedInstallmentPlan.remainingPrice === 0) {
      const updatedSale = await prisma.sale.update({
        where: {
          id: updatedInstallmentPlan.saleId,
        },
        data: {
          paymentStatus: PAYMENT_STATUS.COMPLETED,
        },
      });
    }

    revalidatePath(`/sale/${saleId}`);
    return {
      status: 200,
      message: "Installment updated successfully",
      data: updatedInstallmentData,
    };
  } catch (error) {
    console.error("Error updating installment: ", error);
    return {
      status: 500,
      message: "An error occurred while updating installment",
      data: null,
    };
  }
}

export async function getOne(installmentId: number) {
  if (!installmentId) {
    return { status: 400, message: "Required data is missing", data: null };
  }

  try {
    const intstallment = await prisma.installment.findUnique({
      where: {
        id: installmentId,
      },
    });
    return {
      status: 200,
      message: "Installment fetched successfully",
      data: intstallment,
    };
  } catch (error) {
    console.error(error);
    return { status: 500, message: "Something went wrong", data: null };
  }
}
