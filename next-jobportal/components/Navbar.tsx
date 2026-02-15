"use client";

import Link from "next/link";
import { Menu, X, User } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import ProfileOverlay from "./ProfileOverlay";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/jobs", label: "Jobs" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const { user, isProfileIncomplete } = useAuth();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <>
      <header className="relative w-full">
        {/* gradient mask */}
        <div className="absolute inset-0 bg-linear-to-b from-[#020617] via-[#0b0f19] to-transparent" />
        
        <div className="relative max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          
          <Link href="/" className="flex items-center focus:outline-none" prefetch={false}>
            <div className="w-9 h-9 text-xl flex items-center justify-center cursor-pointer">
              ✦
            </div>
            <span className="text-white font-semibold text-xl tracking-wide cursor-pointer">
              JobForge
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-10 text-white/80 text-sm font-medium">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} 
                className={`transition ${
                  pathname === link.href 
                    ? 'text-orange-500 font-semibold' 
                    : 'hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4 text-sm">
            {user ? (
              <>
                <div className="px-6 py-3 rounded-full" style={{ backgroundColor: '#F54900' }}>
                  <Link 
                    href="/dashboard" 
                    className="text-white hover:text-gray-200 transition font-medium"
                  >
                    Dashboard
                  </Link>
                </div>
                <button 
                  onClick={() => setIsProfileOpen(true)} 
                  className="relative text-white/70 hover:text-white transition"
                >
                  Profile
                  {isProfileIncomplete && (
                    <span className="absolute -top-1 -right-2 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
                  )}
                </button>
              </>
            ) : (
              <>
                <Link href="/signin" className="text-white/70 hover:text-white transition">
                  Log in
                </Link>
                <Link href="/signup" className="px-4 py-2 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-medium transition">
                  Sign Up
                </Link>
              </>
            )}

            {/* mobile button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-10 h-10 flex items-center justify-center bg-white/10 rounded-lg"
            >
              {mobileOpen ? <X size={18}/> : <Menu size={18}/>}
            </button>
          </div>
        </div>

        {/* mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-white/10 bg-[#0b0f19] backdrop-blur">
            <div className="px-6 py-6 flex flex-col gap-4">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`transition ${
                    pathname === link.href 
                      ? 'text-orange-500 font-semibold' 
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              
              {user ? (
                <>
                  <div className="px-6 py-3 rounded-full" style={{ backgroundColor: '#F54900' }}>
                    <Link
                      href="/dashboard"
                      onClick={() => setMobileOpen(false)}
                      className="text-white hover:text-gray-200 font-medium"
                    >
                      Dashboard
                    </Link>
                  </div>
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      setIsProfileOpen(true);
                    }}
                    className="relative text-white/80 hover:text-white"
                  >
                    Profile
                    {isProfileIncomplete && (
                      <span className="absolute -top-1 -right-2 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
                    )}
                  </button>
                </>
              ) : (
                <>
                  <Link href="/signin" className="text-white/80 hover:text-white">
                    Log in
                  </Link>
                  <Link href="/signup" className="px-4 py-2 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-medium transition">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>
      
      {/* Profile Overlay */}
      <ProfileOverlay isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </>
  );
}
