import prisma from "@/lib/db";
import { PlaygroundForm } from "@/components/Playground/Form";
export default async function Home() {
  const tasks = await prisma.task.findMany();

  return (
    <>
      <main className="bg-zinc-200 min-h-screen w-full flex flex-col items-center pt-10">
        <h1 className="text-3xl font-medium">All tasks</h1>
        <PlaygroundForm />
        <section className="text-center">
          <h2 className="sr-only">Task List</h2>
          <ul>
            {tasks.map((task) => (
              <li key={task.id}>{task.title}</li>
            ))}
          </ul>
        </section>
      </main>
    </>
  );
}
