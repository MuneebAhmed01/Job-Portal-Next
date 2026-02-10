"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <header className="relative w-full">
      
      {/* gradient mask */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-[#0b0f19] to-transparent" />

      <div className="relative max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 flex items-center justify-center">
            ✦
          </div>
          <span className="text-white font-semibold text-xl tracking-wide">
            Free-Lance
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-10 text-white/80 text-sm font-medium">
          <Link href="#">Home</Link>
          <Link href="#">Explore</Link>
          <Link href="#">Hire Freelance</Link>
          <Link href="#">Post a Job</Link>
          <Link href="#">About</Link>
        </nav>

        <div className="flex items-center gap-4 text-sm">
          <button className="text-white/70 hover:text-white transition">
            EN
          </button>

          <Link href="#" className="text-white/80 hover:text-white">
            Log in
          </Link>

          <Link
            href="#"
            className="px-4 py-2 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-medium transition"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </header>
  );
}
