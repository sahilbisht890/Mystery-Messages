"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "../ui/button";

function Navbar() {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#060b17]/80 backdrop-blur-xl">
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 md:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold tracking-wide text-white transition hover:border-cyan-300/70 hover:text-cyan-200"
        >
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-cyan-400 shadow-[0_0_14px_2px_rgba(34,211,238,0.8)]" />
          Mystery Message
        </Link>

        <div className="flex items-center gap-2 md:gap-4">
          <Link
            className="rounded-full px-3 py-2 text-sm text-slate-200 transition hover:bg-white/10 hover:text-white"
            href="/"
          >
            Home
          </Link>
          <Link
            className="rounded-full px-3 py-2 text-sm text-slate-200 transition hover:bg-white/10 hover:text-white"
            href="/dashboard"
          >
            Dashboard
          </Link>

          {session ? (
            <>
              <span className="hidden rounded-full border border-white/15 bg-white/5 px-3 py-2 text-xs text-slate-200 lg:inline-flex">
                {user?.username || user?.email}
              </span>
              <Button
                onClick={() => signOut({ redirect: false })}
                className="rounded-full bg-white text-slate-900 hover:bg-cyan-200"
              >
                Logout
              </Button>
            </>
          ) : (
            <Link href="/sign-in">
              <Button className="rounded-full bg-cyan-400 text-slate-950 hover:bg-cyan-300">
                Login
              </Button>
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
