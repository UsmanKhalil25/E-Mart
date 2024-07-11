// app/not-found.tsx

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="absolute top-0 left-0 h-screen w-screen flex flex-col justify-center items-center bg-zinc-900 text-white/50">
      <h1 className="text-4xl mb-4">404 - Page Not Found</h1>
      <p className="mb-8">
        Sorry, the page you are looking for does not exist.
      </p>
      <div className="flex space-x-4">
        <Link
          href={"/"}
          className="py-3 px-5 text-center bg-zinc-800 hover:bg-zinc-700 rounded-md transition inline-block"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
}
