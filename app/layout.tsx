"use client";

import "./globals.css";
import { Public_Sans } from "next/font/google";

import { SessionProvider } from "next-auth/react";
import Navbar from "@/components/Navbar";

const publicSans = Public_Sans({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>what to code?</title>
        <link rel="shortcut icon" href="/images/favicon.ico" />
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css"
        />
      </head>
      <body className={publicSans.className}>
        <SessionProvider>
          <Navbar />
          <div className="flex flex-col">{children}</div>
        </SessionProvider>
      </body>
    </html>
  );
}
