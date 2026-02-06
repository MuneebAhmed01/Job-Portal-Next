'use client';

import Link from 'next/link';
import { Home, Briefcase, Info, Sun, Moon, Menu, X, User } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleTheme } from '@/store/slices/themeSlice';
import { useState, useEffect } from 'react';

const navLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/jobs', label: 'Jobs', icon: Briefcase },
  { href: '/about', label: 'About', icon: Info },
];

export default function Navbar() {
  const dispatch = useAppDispatch();
  const isDark = useAppSelector((state) => state.theme.isDark);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      
      // Keep navbar fixed for first 100vh (hero section), then enable hide/show behavior
      if (currentScrollY > windowHeight) {
        // Hide navbar when scrolling down, show when scrolling up (after hero section)
        if (currentScrollY > lastScrollY) {
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }
      } else {
        // Always show navbar when within first 100vh
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 glass-dark border-b border-white/10 transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-white font-black text-xl">H</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black text-gradient-primary">Hire</span>
                <span className="text-xl font-black text-gradient-accent -mt-1">Heaven</span>
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="group flex items-center gap-3 text-gray-600 dark:text-gray-300 hover:text-white transition-all duration-300 relative"
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center group-hover:bg-white/10 transition-all duration-300">
                    <Icon size={20} className="group-hover:scale-110 transition-transform" />
                  </div>
                  <span className="font-medium group-hover:text-white">{label}</span>
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 group-hover:w-full transition-all duration-300"></div>
                </Link>
              ))}
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4">
              {/* Profile Avatar */}
              <div className="hidden sm:block">
                <div className="relative group">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-black cursor-pointer hover-lift">
                    <User size={20} />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-900 animate-pulse"></div>
                </div>
              </div>

              {/* Theme Toggle */}
              <button
                onClick={() => dispatch(toggleTheme())}
                className="group w-12 h-12 rounded-xl glass hover-lift flex items-center justify-center transition-all duration-300"
                aria-label="Toggle theme"
              >
                <div className="relative">
                  {isDark ? (
                    <Sun size={20} className="text-yellow-500 group-hover:rotate-180 transition-transform duration-500" />
                  ) : (
                    <Moon size={20} className="text-gray-700 group-hover:rotate-12 transition-transform" />
                  )}
                </div>
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden w-12 h-12 rounded-xl glass hover-lift flex items-center justify-center transition-all duration-300"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X size={20} className="text-gray-700 dark:text-gray-300" />
                ) : (
                  <Menu size={20} className="text-gray-700 dark:text-gray-300" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden transition-all duration-300 ${isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
          <div className="glass-dark border-t border-white/10">
            <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-4">
              {navLinks.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-4 text-gray-600 dark:text-gray-300 hover:text-white transition-all duration-300 p-3 rounded-xl hover:bg-white/10"
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center">
                    <Icon size={20} />
                  </div>
                  <span className="font-medium text-lg">{label}</span>
                </Link>
              ))}
              
              {/* Mobile Profile */}
              <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/10 transition-all duration-300">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-black">
                    <User size={18} />
                  </div>
                  <div className="absolute -bottom-0 -right-0 w-3 h-3 bg-green-500 rounded-full border border-white dark:border-gray-900"></div>
                </div>
                <span className="font-medium text-gray-600 dark:text-gray-300">Profile</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
