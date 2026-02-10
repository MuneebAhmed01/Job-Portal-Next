import Link from "next/link";
import { Search } from "lucide-react";

const companies = [
  { name: "Adobe", src: "https://cdn.simpleicons.org/adobe" },
  { name: "Microsoft", src: "https://cdn.simpleicons.org/microsoft" },
  { name: "Spotify", src: "https://cdn.simpleicons.org/spotify" },
  { name: "Netflix", src: "https://cdn.simpleicons.org/netflix" },
  { name: "YouTube", src: "https://cdn.simpleicons.org/youtube" },
  { name: "GitHub", src: "https://cdn.simpleicons.org/github" },
];

export default function HeroSection() {
  return (
    <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden text-white">
      
      {/* unified global gradient */}
      <div className="absolute inset-0 bg-linear-to-br from-[#020617] via-[#0b0f19] to-[#0f172a]" />

      {/* bottom fade into features */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-linear-to-b from-transparent to-[#020617]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        
        {/* heading */}
        <h1 className="mt-3 font-black leading-[0.95] tracking-tight uppercase">
          <div className="flex items-center justify-center gap-2">
            <span className="text-4xl md:text-6xl lg:text-[90px]">
              ✦ Find the Job
            </span>
          </div>
          <div className="flex items-center justify-center gap-2 mt-4">
            <span className="text-4xl md:text-6xl lg:text-[90px]">
              That Fits Your
            </span>
          </div>
          <div className="flex items-center justify-center gap-2 mt-4">
            <span className="text-4xl md:text-6xl lg:text-[90px]">
              Lifestyle
            </span>
          </div>
        </h1>

        {/* description */}
        <p className="mt-8 text-gray-300 max-w-2xl mx-auto text-lg">
          Discover the best remote and flexible jobs from top companies
          around the world. Build your future on your own terms.
        </p>

        {/* buttons */}
        <div className="mt-10 flex justify-center gap-4 flex-wrap">
          <Link
            href="/jobs"
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 transition px-7 py-3 rounded-full font-semibold"
          >
            <Search size={18} />
            Browse Jobs
          </Link>

          <Link
            href="/about"
            className="border border-white/20 hover:border-white/40 transition px-7 py-3 rounded-full font-semibold"
          >
            Learn More
          </Link>
        </div>

        {/* logos */}
        <div className="mt-20 flex flex-wrap justify-center items-center gap-14 opacity-80">
          {companies.map(c => (
            <img
              key={c.name}
              src={c.src}
              alt={c.name}
              className="h-10 md:h-12 w-auto object-contain grayscale hover:grayscale-0 transition"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
