import type { Metadata } from "next";
import "./globals.css";

import { Reddit_Mono } from "next/font/google";

const roboto = Reddit_Mono({
  weight: ["200", "400", "700"],
  subsets: ["latin"],
  display: "swap",
});

import { Toaster } from "react-hot-toast";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "E-Mart",
  description: "All your electronics under one roof.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={roboto.className}>
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
