"use server";
import prisma from "@/lib/db";
import { InstallmentPlanForm as InstallmentPlanFormType } from "@/lib/type";

interface CreateParams {
  newInstallment: InstallmentPlanFormType;
  installmentPlanId: number;
}
export async function create({
  newInstallment,
  installmentPlanId,
}: CreateParams) {
  if (!newInstallment) {
    return { status: 400, message: "Required data is missing" };
  }

  try {
    await prisma.installment.create({
      data: {
        ...newInstallment,
        installmentPlanId: installmentPlanId,
      },
    });
    return { status: 200, message: "Sale created successfully" };
  } catch (error) {
    console.error(error);
    return { status: 500, message: "Something went wrong" };
  }
}
