import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
const inter = Inter({ subsets: ["latin"] });

import { Toaster } from "react-hot-toast";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "E-Mart",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Toaster position="top-center" reverseOrder={false} />
        <div className="flex h-screen">
          <Sidebar />
          <main className="flex-1 bg-gray-100 p-4 overflow-y-auto no-scrollbar">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
