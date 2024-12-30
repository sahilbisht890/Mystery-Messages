"use client";

import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "../ui/button";

function Navbar() {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <nav className="p-4 md:p-6 shadow-md bg-gray-900 text-white">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        {/* Left: Brand */}
        <a href="#" className="text-xl font-bold mb-4 md:mb-0">
          True Feedback
        </a>

        {/* Center: Welcome Message */}
        {session && (
          <span className="text-center md:absolute md:inset-x-1/2 transform md:-translate-x-1/2 text-nowrap">
            Welcome, {user?.username || user?.email}
          </span>
        )}

        {/* Right: Navigation and Auth Buttons */}
        <div className="flex items-center gap-4">
          <Link className="text-sm font-medium hover:underline" href="/">
            Home
          </Link>
          {session ? (
            <>
              <Link
                className="text-sm font-medium hover:underline"
                href="/dashboard"
              >
                Dashboard
              </Link>
              <Button
                onClick={() => signOut()}
                className="w-full md:w-auto bg-slate-100 text-black"
                variant="outline"
              >
                Logout
              </Button>
            </>
          ) : (
            <Link href="/sign-in">
              <Button
                className="w-full md:w-auto bg-slate-100 text-black"
                variant="outline"
              >
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
