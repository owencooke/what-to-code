"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

export default function Login() {
  const { data: session, status } = useSession();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      {status === "authenticated" ? (
        <div className="text-center">
          <p className="mb-4 text-lg">Signed in as {session.user?.email}</p>
          <Link href="../api/auth/signout/github" passHref>
            <button className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700 transition">
              Log out
            </button>
          </Link>
        </div>
      ) : (
        <div className="text-center">
          <Link href="../api/auth/signin/github" passHref>
            <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition">
              Login with GitHub
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}
