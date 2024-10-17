"use client";

import "./globals.css";
import { Roboto_Mono } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Footer } from "@/components/site/Footer";
import { Navbar } from "@/components/site/Navbar";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/query";

const publicSans = Roboto_Mono({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <title>what to code?</title>
        <link rel="shortcut icon" href="favicon.ico" />
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css"
        />
      </head>
      <body className={`h-full flex flex-col ${publicSans.className}`}>
        <SessionProvider>
          <ThemeProvider>
            <QueryClientProvider client={queryClient}>
              <Navbar />
              <div className="flex-grow m-4 md:m-8 lg:m-12">{children}</div>
              <Footer />
              <Toaster />
              <Analytics />
            </QueryClientProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
