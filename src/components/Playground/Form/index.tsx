"use client";
import { addTask } from "@/actions/actions";
import { TaskSchema } from "@/lib/type";

export function PlaygroundForm() {
  const clientAction = async (formData: FormData) => {
    // client side validation
    const newTask = {
      id: "done",
      title: formData.get("title"),
    };
    const result = TaskSchema.safeParse(newTask);
    if (!result.success) {
      let errorMessages = "";
      result.error.issues.forEach((issue) => {
        errorMessages += issue.path[0] + ": " + issue.message + ". ";
      });
      console.error("Error: ", errorMessages);
      return;
    }
    // output any error from server side
    await addTask(result.data);
  };
  return (
    <form action={clientAction} className="my-5">
      <input
        className="px-3 py-1 outline-blue-500 rounded"
        type="text"
        name="title"
        placeholder="Task title"
      />
      <button className="bg-blue-500 px-3 py-1 rounded ml-3" type="submit">
        Add
      </button>
    </form>
  );
}
