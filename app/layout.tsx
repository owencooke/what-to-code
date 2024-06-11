"use client";

import "./globals.css";
import { Public_Sans } from "next/font/google";

import { SessionProvider } from "next-auth/react";

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
      </head>
      <body className={publicSans.className}>
        <SessionProvider>
          <div className="flex flex-col">{children}</div>
        </SessionProvider>
      </body>
    </html>
  );
}
