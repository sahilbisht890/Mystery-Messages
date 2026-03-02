import Link from "next/link";
import { Github, Linkedin } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-[#050913]/90 px-4 py-10 text-slate-300 backdrop-blur-xl md:px-8">
      <div className="mx-auto grid w-full max-w-7xl gap-8 md:grid-cols-3">
        <div>
          <h3 className="mb-3 text-lg font-semibold text-white">Mystery Message</h3>
          <p className="max-w-sm text-sm leading-6 text-slate-400">
            Anonymous conversations, thoughtful prompts, and safe interactions in
            one clean experience.
          </p>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-200">
            Quick Links
          </h4>
          <div className="flex flex-col gap-2 text-sm">
            <Link href="/" className="transition hover:text-cyan-300">
              Home
            </Link>
            <Link href="/sign-in" className="transition hover:text-cyan-300">
              Sign In
            </Link>
            <Link href="/sign-up" className="transition hover:text-cyan-300">
              Create Account
            </Link>
          </div>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-200">
            Connect
          </h4>
          <div className="flex flex-wrap gap-2">
            <a
              href="https://github.com/sahilbisht890"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-sm transition hover:border-cyan-300/60 hover:text-cyan-200"
            >
              <Github className="h-4 w-4" />
            </a>
            <a
              href="https://www.linkedin.com/in/sahil-bisht-234b92226/"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-sm transition hover:border-cyan-300/60 hover:text-cyan-200"
            >
              <Linkedin className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-8 w-full max-w-7xl border-t border-white/10 pt-5 text-xs text-slate-500">
        Copyright {year} Mystery Message. All rights reserved.
      </div>
    </footer>
  );
}
