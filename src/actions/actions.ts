"use server";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { TaskSchema } from "@/lib/type";
export async function addTask(newTask: unknown) {
  const result = TaskSchema.safeParse(newTask);
  if (!result.success) {
    let errorMessage = "";
    result.error.issues.forEach((issue) => {
      errorMessage += issue.path[0] + ": " + issue.message + ". ";
    });
    return {
      error: errorMessage,
    };
  }

  await prisma.task.create({
    data: result.data,
  });
  revalidatePath("/");
}
