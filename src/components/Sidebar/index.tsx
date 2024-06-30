"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
const mainRoutes = [
  { name: "Home", path: "/" },
  { name: "Dashboard", path: "/dashboard" },
];
export default function Sidebar() {
  const pathname = usePathname();
  return (
    <>
      <div className="min-h-screen bg-neutral-950 w-2/12 flex flex-col justify-between items-center px-2 py-4">
        <header className="flex flex-col min-w-full ">
          {mainRoutes.map((route) => {
            return (
              <Link
                key={route.path}
                className="text-center text-white py-2 bg-neutral-900  rounded my-1"
                href={route.path}
              >
                {route.name}
              </Link>
            );
          })}
        </header>
        <footer></footer>
      </div>
    </>
  );
}
