"use client";

import { useState } from "react";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import { DefaultSession } from "next-auth";
import Image from "next/image";

interface NavbarProps {
  isSignedIn: boolean;
  user?: DefaultSession["user"]; // Optional username prop
  onAuthAction: () => void;
  onCreateRepo: () => void;
}

export default function Navbar({
  isSignedIn,
  user,
  onAuthAction,
  onCreateRepo,
}: NavbarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav className="p-4 flex justify-end items-center">
      <div className="relative">
        {isSignedIn && user?.image ? (
          <Image
            src={user.image}
            alt="User Profile Picture"
            width={40}
            height={40}
            className="rounded-full cursor-pointer"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          />
        ) : (
          <UserCircleIcon
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer`}
          />
        )}
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg">
            {isSignedIn && (
              <div>
                <div className="block px-4 py-2 text-gray-800 w-full text-left">
                  {user?.name}
                </div>
                <button
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left"
                  onClick={() => {
                    onCreateRepo();
                    setDropdownOpen(false);
                  }}
                >
                  Create Repository
                </button>
              </div>
            )}
            <button
              className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left"
              onClick={() => {
                onAuthAction();
                setDropdownOpen(false); // Close the dropdown after action
              }}
            >
              {isSignedIn ? "Sign Out" : "Sign In"}
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
