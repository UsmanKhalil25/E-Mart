"use client";

import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import Link from "next/link";
import { usePathname } from "next/navigation";
const mainRoutes = [
  { name: "Home", path: "/", requiresAuth: false },
  { name: "Dashboard", path: "/dashboard", requiresAuth: true },
  { name: "Products", path: "/product", requiresAuth: true },
  { name: "Customers", path: "/customer", requiresAuth: true },
  { name: "Sales", path: "/sale", requiresAuth: true },
  { name: "Purchases", path: "/purchase", requiresAuth: true },
  { name: "Companies", path: "/company", requiresAuth: true },
];
export default function Sidebar() {
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading } = useKindeBrowserClient();
  return (
    <>
      <aside className="h-screen bg-zinc-900 flex-none w-2/12 flex flex-col justify-between items-center px-2 py-4 text-white/50 sticky top-0">
        <header className="flex flex-col min-w-full ">
          {mainRoutes.map((route) => {
            if (route.requiresAuth && !isAuthenticated) {
              return null;
            }
            return (
              <Link
                key={route.path}
                className={`${
                  pathname === route.path ? "bg-zinc-800" : ""
                } py-3 px-5 text-center hover:bg-zinc-800 rounded-md transition inline-block w-full my-1`}
                href={route.path}
              >
                {route.name}
              </Link>
            );
          })}
        </header>
        <footer className="flex w-full flex-col items-center justify-center">
          {isLoading && (
            <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-white/50  my-2"></div>
          )}
          {user && (
            <div className="h-7 w-7 rounded-full  my-2 text-zinc-800 bg-zinc-100 font-semibold text-xs flex justify-center items-center">
              {user.given_name?.at(0)}
            </div>
          )}
          {user?.email && (
            <p className="text-center text-xs mb-3">
              Logged in as: {user.email}
            </p>
          )}
          {isAuthenticated && (
            <LogoutLink className="py-3 px-5 text-center hover:bg-zinc-800 rounded-md transition inline-block w-full">
              Log out
            </LogoutLink>
          )}
        </footer>
      </aside>
    </>
  );
}
