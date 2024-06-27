"use client";

import { useState } from "react";
import { UserCircleIcon } from "@heroicons/react/24/solid";

interface NavbarProps {
  isSignedIn: boolean;
  username?: string; // Optional username prop
  onAuthAction: () => void;
  onCreateRepo: () => void;
}

export default function Navbar({
  isSignedIn,
  username,
  onAuthAction,
  onCreateRepo,
}: NavbarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav className="p-4 flex justify-end items-center">
      <div className="relative">
        <UserCircleIcon
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className={`w-10 h-10 ${
            isSignedIn ? "bg-green-500" : "bg-white"
          } rounded-full flex items-center justify-center  cursor-pointer`}
        />
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg">
            {isSignedIn && (
              <div>
                <div className="block px-4 py-2 text-gray-800 w-full text-left">
                  {username}
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
