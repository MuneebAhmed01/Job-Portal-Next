import React from "react";
import Link from "next/link";
import {
  FaLinkedinIn,
  FaTwitter,
  FaGithub,
  FaInstagram,
} from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <footer className="relative bg-black text-white overflow-hidden h-[26vh] min-h-[210px] flex items-center">
      
      {/* Very Subtle Orange Glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute w-[500px] h-[500px] bg-orange-500/8 rounded-full blur-3xl bottom-[-250px] left-1/2 -translate-x-1/2" />
      </div>

      <div className="w-full max-w-7xl mx-auto px-8 flex flex-col justify-between h-full py-6">

        {/* Top Section */}
        <div className="flex justify-between items-start">

          {/* Left - 4 Headings Column */}
          <div className="flex flex-col gap-3 text-gray-400 text-sm">
            <Link href="/personalized" className="hover:text-orange-400 transition duration-300">Personalized</Link>
            <Link href="/career-guidance" className="hover:text-orange-400 transition duration-300">Career Guidance</Link>
            <Link href="/jobs" className="hover:text-orange-400 transition duration-300">Other Jobs</Link>
            <Link href="/more" className="hover:text-orange-400 transition duration-300">More</Link>
          </div>

          {/* Brand */}
          <div className="relative top-4 -left-4">
            <Link href="/" prefetch={false} className="focus:outline-none">
              <h1 className="text-4xl md:text-6xl font-semibold tracking-tight cursor-pointer">
                ✦JobForge
              </h1>
            </Link>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="flex justify-between items-center text-xs text-gray-500">
          <p>© 2026 JobForge. All rights reserved.</p>

          {/* Social Icons - Bottom Right */}
          <div className="flex gap-6 text-gray-400 text-lg">
            <FaLinkedinIn className="hover:text-white transition duration-300 cursor-pointer" />
            <FaTwitter className="hover:text-white transition duration-300 cursor-pointer" />
            <FaGithub className="hover:text-white transition duration-300 cursor-pointer" />
            <FaInstagram className="hover:text-white transition duration-300 cursor-pointer" />
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
