"use server";
import prisma from "@/lib/db";
import { CompanySchema } from "@/lib/type";
export async function getAll() {
  const result = await prisma.company.findMany();
  return result;
}
