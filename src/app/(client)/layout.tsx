"use client";

import "./globals.css";
import { Roboto_Mono } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Footer } from "@/components/site/Footer";
import Navbar from "@/components/site/Navbar";
import { QueryClientProvider } from "@tanstack/react-query";
import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient();
const publicSans = Roboto_Mono({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        <title>what to code?</title>
        <meta property="og:title" content="what to code?" />
        <meta
          property="og:description"
          content="An LLM-powered web app that helps developers brainstorm and kickstart new software projects using idea generation, project expansion, and GitHub template matching!"
        />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css"
        />
      </head>
      <body className={`h-full flex flex-col ${publicSans.className}`}>
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
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
