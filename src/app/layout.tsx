'use client';

import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/AHeader";
import ASidebar from "@/components/Asidebar";
import { useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex min-h-screen flex-col">
          <Header />
          <div className="flex flex-1">
            <ASidebar 
              isSidebarOpen={isSidebarOpen} 
              setIsSidebarOpen={setIsSidebarOpen} 
            />
            <main className="flex-1">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
