"use client";

import "./globals.css";
import { Public_Sans } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/toaster";
import Footer from "@/components/Footer";

const publicSans = Public_Sans({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <title>what to code?</title>
        <link rel="shortcut icon" href="/images/favicon.ico" />
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css"
        />
      </head>
      <body className={`h-full flex flex-col ${publicSans.className}`}>
        <SessionProvider>
          <Navbar />
          <div className="flex-grow m-4 md:m-8 lg:m-12">{children}</div>
          <Footer />
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  );
}
