"use server";
import prisma from "@/lib/db";

export async function getAll() {
  const result = await prisma.category.findMany();
  return result;
}
